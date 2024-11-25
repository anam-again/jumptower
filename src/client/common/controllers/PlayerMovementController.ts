import { Controller, OnStart, Service } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";
import { Make } from "@rbxts/altmake";

import { Events } from "../network";
import { getOrWaitForLocalCharacter } from "../utils";
import { Facing, PlayerAnimations, PlayerSounds, PlayerState } from "shared/types";
import { PlayerAnimationController } from "./PlayerAnimationController";
import { PlayerSoundController } from "./PlayerSoundController";

const WALKMOVEMENT_CONSTANT = 10;
const GRAVITY = 0.8;
const RAYCAST_COLLISION_DIST = 10;
const JUMP_CHARGE_SPEED = 0.35;
const JUMP_MAX_HEIGHT_POWER = 0.7;
const JUMP_MAX_HORIZO_POWER = 0.6;
const JUMP_HEIGHT_CONSTANT = 2.5;
const JUMP_HORIZO_CONSTANT = 0.55;
const MIN_JUMP_POWER = 0.1;

const FLOORFALLEN_DY_LIM = 51;
const FLOOR_FALLEN_TIME_C = 0.01;

@Controller({})
export class PlayerMovementController implements OnStart {
	constructor(
		private PlayerAnimationController: PlayerAnimationController,
		private PlayerSoundController: PlayerSoundController,
	) {}

	private playerState!: PlayerState;
	private raycastParams = new RaycastParams();

	onStart(): void {
		this.raycastParams.CollisionGroup = "hitbox";

		const character = getOrWaitForLocalCharacter();

		if (!character.PrimaryPart) throw error("character doesn't have a primary part");
		const model = Make("Model", {
			Name: `Hitbox-${Players.LocalPlayer.Name}`,
			Parent: Workspace,
		});
		const hitbox = Make("Part", {
			Name: "Hitbox",
			Parent: model,
			Anchored: true,
			Transparency: 0.5,
			Size: new Vector3(2, 5, 2),
			Position: character.PrimaryPart.Position,
		});
		hitbox.CollisionGroup = "hitbox";
		const weld = Make("Weld", {
			Parent: hitbox,
		});
		weld.Part0 = hitbox;
		weld.Part1 = character.PrimaryPart;
		weld.C0 = new CFrame(0, 0.5, 0);
		model.PrimaryPart = hitbox;
		character.Parent = model;
		this.playerState = {
			inputState: {
				Down: false,
				Jump: false,
				Left: false,
				Right: false,
				Up: false,
			},
			facing: Facing.Down,
			player: Players.LocalPlayer,
			hitbox: hitbox,
			model: model,
			dx: 0,
			dy: 0,
			isGrounded: false,
			chargingJump: false,
			startedChargingJumpAt: 0,
			isBounced: false,
			floorFallen: false,
			floorFallenDt: 0,
			isWalking: false,
		};

		RunService.Heartbeat.Connect((dt) => {
			this.heartbeat(dt);
		});
	}

	action_up(inputState: Enum.UserInputState) {
		this.playerState.inputState.Up = inputState === Enum.UserInputState.Begin;
	}
	action_down(inputState: Enum.UserInputState) {
		this.playerState.inputState.Down = inputState === Enum.UserInputState.Begin;
	}
	action_left(inputState: Enum.UserInputState) {
		this.playerState.inputState.Left = inputState === Enum.UserInputState.Begin;
	}
	action_right(inputState: Enum.UserInputState) {
		this.playerState.inputState.Right = inputState === Enum.UserInputState.Begin;
	}
	action_jump(inputState: Enum.UserInputState) {
		this.playerState.inputState.Jump = inputState === Enum.UserInputState.Begin;
	}

	/**
	 *
	 * @param playerState
	 * @param hb_dt
	 * @param direction should be += right, -= left
	 */
	handle_walk(playerState: PlayerState, direction: boolean, dt: number) {
		playerState.isWalking = true;
		this.PlayerSoundController.toggleSound(PlayerSounds.doinkyStep, true);
		const direction_n = direction ? 1 : -1;
		if (direction) {
			playerState.facing = Facing.Right;
		} else {
			playerState.facing = Facing.Left;
		}
		this.PlayerAnimationController.playLoop(PlayerAnimations.walkPose1);
		const dx = direction_n * WALKMOVEMENT_CONSTANT * dt;
		playerState.dx = dx;
		const rotation = CFrame.Angles(0, math.pi * direction_n * -0.5, 0);
		const newCFrame = new CFrame(playerState.hitbox.GetPivot().Position).mul(rotation);
		playerState.hitbox.PivotTo(newCFrame);
		if (direction) {
			//moving right
			const ray = this.raycast_right(playerState.hitbox);
			if (ray !== undefined && ray.Distance < dx && ray.Instance.CanCollide === true) {
				// snap to wall
			} else {
				// move normally
				playerState.hitbox.PivotTo(playerState.hitbox.GetPivot().add(new Vector3(dx, 0, 0)));
			}
		} else {
			// moving left
			const ray = this.raycast_left(playerState.hitbox);
			if (ray !== undefined && ray.Distance < -dx && ray.Instance.CanCollide === true) {
				// snap to wall
			} else {
				// move normally
				playerState.hitbox.PivotTo(playerState.hitbox.GetPivot().add(new Vector3(dx, 0, 0)));
			}
		}
	}

	private reflectedNormal(playerState: PlayerState, ray: RaycastResult) {
		// https://medium.com/@sleitnick/roblox-reflecting-rays-548ae88841d5
		const rayNormal = new Vector3(playerState.dx, playerState.dy);
		const double = new Vector3(2, 2, 2);
		const reflectedNormal = rayNormal.sub(ray.Normal.mul(rayNormal.Dot(ray.Normal)).mul(double));
		return reflectedNormal;
	}

	handleAirborn(playerState: PlayerState, dt: number) {
		if (playerState.chargingJump) return; // we MUST be grounded
		playerState.dy -= GRAVITY * dt;

		if (playerState.dy > 0) {
			const ray = this.raycast_up(playerState.hitbox);
			if (ray === undefined || ray.Distance > playerState.dy || ray.Instance.CanCollide === false) {
				playerState.hitbox.PivotTo(playerState.hitbox.GetPivot().add(new Vector3(0, playerState.dy, 0)));
			} else {
				this.PlayerSoundController.playSound(PlayerSounds.bounceSound);
				playerState.dy = -playerState.dy;
			}
		} else if (playerState.dy < 0) {
			const ray = this.raycast_down(playerState.hitbox);
			if (ray?.Distance === undefined || ray.Distance > -playerState.dy || ray.Instance.CanCollide === false) {
				if (!playerState.isBounced) {
					this.PlayerAnimationController.playPose(PlayerAnimations.fallingPose);
				}
				playerState.isGrounded = false;
				this.PlayerSoundController.toggleSound(PlayerSounds.doinkyStep, false);
				playerState.hitbox.PivotTo(playerState.hitbox.GetPivot().add(new Vector3(0, playerState.dy, 0)));
			} else {
				if (ray.Instance.Rotation.Z !== 0) {
					// is an angled surface, bounce him
					this.PlayerSoundController.playSound(PlayerSounds.bounceSound);
					playerState.isBounced = true;
					const reflectedNormal = this.reflectedNormal(playerState, ray);
					playerState.dy = reflectedNormal.Y;
					playerState.dx = reflectedNormal.X;
					playerState.hitbox.PivotTo(
						playerState.hitbox.GetPivot().add(new Vector3(playerState.dx, playerState.dy, 0)),
					);
					playerState.isBounced = true;
					return;
				}
				const fullDy = -playerState.dy / dt;
				if (fullDy > FLOORFALLEN_DY_LIM) {
					playerState.floorFallen = true;
					playerState.floorFallenDt = math.clamp(fullDy * FLOOR_FALLEN_TIME_C, 0.1, 0.6);
					this.PlayerSoundController.playSound(PlayerSounds.glassSplat);
					this.PlayerAnimationController.playPose(PlayerAnimations.floorFallenPose);
				}
				if (!playerState.isGrounded) {
					//.001 floats us slightly above the obj
					this.PlayerSoundController.playSound(PlayerSounds.landSound);
					playerState.hitbox.PivotTo(
						playerState.hitbox.GetPivot().add(new Vector3(0, -ray.Distance + 0.001, 0)),
					);
				}
				playerState.isBounced = false;
				playerState.isGrounded = true;
				playerState.dy = 0;
				return;
			}
		}
		if (playerState.dx > 0) {
			// moving right
			const ray = this.raycast_right(playerState.hitbox);
			if (ray === undefined || ray.Distance > playerState.dx || ray.Instance.CanCollide === false) {
				playerState.hitbox.PivotTo(playerState.hitbox.GetPivot().add(new Vector3(playerState.dx, 0, 0)));
			} else {
				if (ray.Instance.Rotation.Z !== 0) {
					// is an angled surface, bounce him
					const reflectedNormal = this.reflectedNormal(playerState, ray);
					playerState.dy = reflectedNormal.Y;
					playerState.dx = reflectedNormal.X;
					playerState.hitbox.PivotTo(
						playerState.hitbox.GetPivot().add(new Vector3(playerState.dx, playerState.dy, 0)),
					);
				} else {
					playerState.dx = -playerState.dx;
					const newCFrame = new CFrame(playerState.hitbox.CFrame.Position).mul(
						CFrame.Angles(0, math.pi * 1.5, 0),
					);
					playerState.hitbox.PivotTo(newCFrame);
				}
				this.PlayerSoundController.playSound(PlayerSounds.bounceSound);
				playerState.isBounced = true;
				this.PlayerAnimationController.playPose(PlayerAnimations.bouncedAirbornPose);
				playerState.facing = Facing.Right;
			}
		} else if (playerState.dx < 0) {
			// moving left
			const ray = this.raycast_left(playerState.hitbox);
			if (ray === undefined || ray.Distance > -playerState.dx || ray.Instance.CanCollide === false) {
				playerState.hitbox.PivotTo(playerState.hitbox.GetPivot().add(new Vector3(playerState.dx, 0, 0)));
			} else {
				if (ray.Instance.Rotation.Z !== 0) {
					// is an angled surface, bounce him
					const reflectedNormal = this.reflectedNormal(playerState, ray);
					playerState.dy = reflectedNormal.Y;
					playerState.dx = reflectedNormal.X;
					playerState.hitbox.PivotTo(
						playerState.hitbox.GetPivot().add(new Vector3(playerState.dx, playerState.dy, 0)),
					);
				} else {
					const newCFrame = new CFrame(playerState.hitbox.CFrame.Position).mul(
						CFrame.Angles(0, math.pi * 0.5, 0),
					);
					playerState.hitbox.PivotTo(newCFrame);
					playerState.dx = -playerState.dx;
				}
				this.PlayerSoundController.playSound(PlayerSounds.bounceSound);
				playerState.isBounced = true;
				this.PlayerAnimationController.playPose(PlayerAnimations.bouncedAirbornPose);
				playerState.facing = Facing.Left;
			}
		}
	}

	/**
	 * Only set movement in this function, let
	 * the rest get handled in carryMovement
	 * @param playerState
	 * @param initJump Is this the first loop c haring jujpm lmao BAD
	 */
	handleJump(playerState: PlayerState, initJump: boolean) {
		this.PlayerSoundController.toggleSound(PlayerSounds.doinkyStep, false);
		if (initJump) {
			this.PlayerSoundController.playSound(PlayerSounds.jumpChargeStartSound);
			this.PlayerAnimationController.playPose(PlayerAnimations.jumpChargePose);
			playerState.chargingJump = true;
			playerState.startedChargingJumpAt = time();
			// styart on  the next loop idc
		} else if (!playerState.inputState.Jump) {
			// finished charging
			this.PlayerSoundController.playSound(PlayerSounds.jumpSound);
			this.PlayerAnimationController.playPose(PlayerAnimations.airbornPose);
			playerState.chargingJump = false;
			const facing = playerState.facing === Facing.Left ? -1 : playerState.facing === Facing.Right ? 1 : 0;
			const dx =
				(MIN_JUMP_POWER +
					math.min(
						(time() - playerState.startedChargingJumpAt) * JUMP_CHARGE_SPEED,
						JUMP_MAX_HORIZO_POWER * JUMP_HORIZO_CONSTANT,
					)) *
				facing;
			const dy =
				MIN_JUMP_POWER +
				math.min(
					(time() - playerState.startedChargingJumpAt) * JUMP_CHARGE_SPEED * JUMP_HEIGHT_CONSTANT,
					JUMP_MAX_HEIGHT_POWER,
				);
			playerState.dx = dx;
			playerState.dy = dy;
			playerState.isGrounded = false;
		}
	}

	private handleIdle(playerState: PlayerState) {
		this.PlayerSoundController.toggleSound(PlayerSounds.doinkyStep, false);
		playerState.floorFallen = false;
		playerState.dx = 0;
		playerState.dy = 0;
		if (playerState.floorFallen) {
			this.PlayerAnimationController.playPose(PlayerAnimations.floorFallenPose);
		} else {
			this.PlayerAnimationController.playPose(PlayerAnimations.idlePose1);
		}
	}

	/**
	 * Collisions are built into subprocesses because they use getTouchingParts and move the stuff back
	 * Otherwise, the roblox system may overtake the thread, and forcibly move tyhe object
	 * @param dt
	 */
	heartbeat(dt: number) {
		if (this.playerState.floorFallen && this.playerState.floorFallenDt > 0) {
			this.playerState.floorFallenDt -= dt;
			return;
		}
		if (this.playerState.isGrounded) {
			if (this.playerState.chargingJump) {
				this.playerState.floorFallen = false;
				this.handleJump(this.playerState, false);
			} else if (this.playerState.inputState.Jump) {
				this.playerState.floorFallen = false;
				this.handleJump(this.playerState, true);
			} else if (this.playerState.inputState.Down) {
				const newCFrame = new CFrame(this.playerState.hitbox.CFrame.Position).mul(CFrame.Angles(0, math.pi, 0));
				this.playerState.facing = Facing.Down;
				this.playerState.hitbox.PivotTo(newCFrame);
				this.handleIdle(this.playerState);
			} else if (this.playerState.inputState.Up) {
				const newCFrame = new CFrame(this.playerState.hitbox.CFrame.Position).mul(CFrame.Angles(0, 0, 0));
				this.playerState.facing = Facing.Up;
				this.playerState.hitbox.PivotTo(newCFrame);
				this.handleIdle(this.playerState);
			} else if (this.playerState.inputState.Right && !this.playerState.inputState.Left) {
				this.playerState.floorFallen = false;
				this.handle_walk(this.playerState, true, dt);
			} else if (this.playerState.inputState.Left && !this.playerState.inputState.Right) {
				this.playerState.floorFallen = false;
				this.handle_walk(this.playerState, false, dt);
			} else {
				// grounded and doing nothing
				this.handleIdle(this.playerState);
			}
		}
		// may have been activated above
		this.handleAirborn(this.playerState, dt);
		Events.mirrorPlayerState({
			facing: this.playerState.facing,
			position: [this.playerState.hitbox.CFrame.X, this.playerState.hitbox.CFrame.Y],
		});
	}

	raycast_up(hitbox: Part): RaycastResult | undefined {
		const p0 = hitbox.Position.add(new Vector3(-hitbox.Size.X / 2, hitbox.Size.Y / 2)); // top left
		const p1 = hitbox.Position.add(new Vector3(hitbox.Size.X / 2, hitbox.Size.Y / 2)); // top right
		const r0 = Workspace.Raycast(p0, new Vector3(0, RAYCAST_COLLISION_DIST, 0), this.raycastParams);
		const r1 = Workspace.Raycast(p1, new Vector3(0, RAYCAST_COLLISION_DIST, 0), this.raycastParams);
		let res: undefined | RaycastResult = undefined;
		[r0!, r1!].forEach((r) => {
			if (res === undefined) res = r;
			if (res.Distance > r.Distance) res = r;
		});
		return res;
	}

	raycast_down(hitbox: Part): RaycastResult | undefined {
		const p0 = hitbox.Position.add(new Vector3(hitbox.Size.X / 2, -hitbox.Size.Y / 2)); // bot right
		const p1 = hitbox.Position.add(new Vector3(-hitbox.Size.X / 2, -hitbox.Size.Y / 2)); // bot left
		const r0 = Workspace.Raycast(p0, new Vector3(0, -RAYCAST_COLLISION_DIST, 0), this.raycastParams);
		const r1 = Workspace.Raycast(p1, new Vector3(0, -RAYCAST_COLLISION_DIST, 0), this.raycastParams);
		let res: undefined | RaycastResult = undefined;
		[r0!, r1!].forEach((r) => {
			if (res === undefined) res = r;
			if (res.Distance > r.Distance) res = r;
		});
		return res;
	}

	raycast_right(hitbox: Part): RaycastResult | undefined {
		const p0 = hitbox.Position.add(new Vector3(hitbox.Size.X / 2, hitbox.Size.Y / 2)); // top right
		const p1 = hitbox.Position.add(new Vector3(hitbox.Size.X / 2, -hitbox.Size.Y / 2)); // bot right
		const p2 = hitbox.Position.add(new Vector3(hitbox.Size.X / 2)); // right
		const r0 = Workspace.Raycast(p0, new Vector3(RAYCAST_COLLISION_DIST, 0, 0), this.raycastParams);
		const r1 = Workspace.Raycast(p1, new Vector3(RAYCAST_COLLISION_DIST, 0, 0), this.raycastParams);
		const r2 = Workspace.Raycast(p2, new Vector3(RAYCAST_COLLISION_DIST, 0, 0), this.raycastParams);
		let res: undefined | RaycastResult = undefined;
		[r0!, r1!, r2!].forEach((r) => {
			if (res === undefined) res = r;
			if (res.Distance > r.Distance) res = r;
		});
		return res;
	}

	raycast_left(hitbox: Part): RaycastResult | undefined {
		const p0 = hitbox.Position.add(new Vector3(-hitbox.Size.X / 2, -hitbox.Size.Y / 2)); // bot left
		const p1 = hitbox.Position.add(new Vector3(-hitbox.Size.X / 2, hitbox.Size.Y / 2)); // top left
		const p2 = hitbox.Position.add(new Vector3(-hitbox.Size.X / 2)); // left
		const r0 = Workspace.Raycast(p0, new Vector3(-RAYCAST_COLLISION_DIST, 0, 0), this.raycastParams);
		const r1 = Workspace.Raycast(p1, new Vector3(-RAYCAST_COLLISION_DIST, 0, 0), this.raycastParams);
		const r2 = Workspace.Raycast(p2, new Vector3(-RAYCAST_COLLISION_DIST, 0, 0), this.raycastParams);
		let res: undefined | RaycastResult = undefined;
		[r0!, r1!, r2!].forEach((r) => {
			if (res === undefined) res = r;
			if (res.Distance > r.Distance) res = r;
		});
		return res;
	}
}
