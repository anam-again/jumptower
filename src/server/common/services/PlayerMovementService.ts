import { OnStart, Service } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";
import { Make } from "@rbxts/altmake";

import { Events } from "../network";
import { AnimationService } from "./AnimationService";
import { PlayerSoundService } from "./PlayerSoundService";

interface InputState {
	Up: boolean;
	Left: boolean;
	Down: boolean;
	Right: boolean;
	Jump: boolean;
}
enum Facing {
	Up,
	Down,
	Left,
	Right,
}

interface PlayerState {
	player: Player;
	inputState: InputState;
	facing: Facing;
	hitbox: Part;
	model: Model;
	dy: number;
	dx: number;
	isGrounded: boolean;
	isBounced: boolean;
	chargingJump: boolean;
	startedChargingJumpAt: number;
	floorFallen: boolean;
	floorFallenDt: number;
	isWalking: boolean;
}

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

/**
 * TODO learn how cframe work so i can writhe this not stupid
 */
@Service({})
export class PlayerMovementService implements OnStart {
	constructor(
		private AnimationService: AnimationService,
		private PlayerSoundService: PlayerSoundService,
	) {}

	private playerMovementState = new Map<number, PlayerState>();
	private raycastParams = new RaycastParams();

	private getPlayerMovementState(player: Player): PlayerState | undefined {
		const movementState = this.playerMovementState.get(player.UserId);
		if (!movementState) return;
		return movementState;
	}

	onStart(): void {
		this.raycastParams.CollisionGroup = "hitbox";

		RunService.Heartbeat.Connect((dt) => {
			this.heartbeat(dt);
		});

		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((character) => {
				if (!character.PrimaryPart) throw error("character doesn't have a primary part");
				const model = Make("Model", {
					Name: `Hitbox-${player.Name}`,
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
				this.playerMovementState.set(player.UserId, {
					inputState: {
						Down: false,
						Jump: false,
						Left: false,
						Right: false,
						Up: false,
					},
					facing: Facing.Down,
					player: player,
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
				});
			});
		});
		Players.PlayerRemoving.Connect((player) => {
			this.playerMovementState.delete(player.UserId);
			// todo
		});
		Events.action_down.connect((player, inputState) => {
			this.action_down(player, inputState);
		});
		Events.action_jump.connect((player, inputState) => {
			this.action_jump(player, inputState);
		});
		Events.action_left.connect((player, inputState) => {
			this.action_left(player, inputState);
		});
		Events.action_right.connect((player, inputState) => {
			this.action_right(player, inputState);
		});
		Events.action_up.connect((player, inputState) => {
			this.action_up(player, inputState);
		});
	}

	action_up(player: Player, inputState: Enum.UserInputState) {
		const movementState = this.getPlayerMovementState(player);
		if (!movementState) return;
		movementState.inputState.Up = inputState === Enum.UserInputState.Begin;
	}
	action_down(player: Player, inputState: Enum.UserInputState) {
		const movementState = this.getPlayerMovementState(player);
		if (!movementState) return;
		movementState.inputState.Down = inputState === Enum.UserInputState.Begin;
	}
	action_left(player: Player, inputState: Enum.UserInputState) {
		const movementState = this.getPlayerMovementState(player);
		if (!movementState) return;
		movementState.inputState.Left = inputState === Enum.UserInputState.Begin;
	}
	action_right(player: Player, inputState: Enum.UserInputState) {
		const movementState = this.getPlayerMovementState(player);
		if (!movementState) return;
		movementState.inputState.Right = inputState === Enum.UserInputState.Begin;
	}
	action_jump(player: Player, inputState: Enum.UserInputState) {
		const movementState = this.getPlayerMovementState(player);
		if (!movementState) return;
		movementState.inputState.Jump = inputState === Enum.UserInputState.Begin;
	}

	/**
	 *
	 * @param playerState
	 * @param hb_dt
	 * @param direction should be += right, -= left
	 */
	handle_walk(playerState: PlayerState, direction: boolean, dt: number) {
		playerState.isWalking = true;
		this.PlayerSoundService.toggleSound(playerState.player, "defaultStepSound", true);
		const direction_n = direction ? 1 : -1;
		if (direction) {
			playerState.facing = Facing.Right;
		} else {
			playerState.facing = Facing.Left;
		}
		this.AnimationService.playLoop(playerState.player, "walkPose1");
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
				this.PlayerSoundService.playSound(playerState.player, "bounceSound");
				playerState.dy = -playerState.dy;
			}
		} else if (playerState.dy < 0) {
			const ray = this.raycast_down(playerState.hitbox);
			if (ray?.Distance === undefined || ray.Distance > -playerState.dy || ray.Instance.CanCollide === false) {
				if (!playerState.isBounced) {
					this.AnimationService.playPose(playerState.player, "fallingPose");
				}
				playerState.isGrounded = false;
				this.PlayerSoundService.toggleSound(playerState.player, "defaultStepSound", false);
				playerState.hitbox.PivotTo(playerState.hitbox.GetPivot().add(new Vector3(0, playerState.dy, 0)));
			} else {
				if (ray.Instance.Rotation.Z !== 0) {
					// is an angled surface, bounce him
					this.PlayerSoundService.playSound(playerState.player, "bounceSound");
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
					this.PlayerSoundService.playSound(playerState.player, "glassSplat");
					this.AnimationService.playPose(playerState.player, "floorFallenPose");
				}
				if (!playerState.isGrounded) {
					//.001 floats us slightly above the obj
					this.PlayerSoundService.playSound(playerState.player, "landSound");
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
				this.PlayerSoundService.playSound(playerState.player, "bounceSound");
				playerState.isBounced = true;
				this.AnimationService.playPose(playerState.player, "bouncedAirbornPose");
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
				this.PlayerSoundService.playSound(playerState.player, "bounceSound");
				playerState.isBounced = true;
				this.AnimationService.playPose(playerState.player, "bouncedAirbornPose");
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
		this.PlayerSoundService.toggleSound(playerState.player, "defaultStepSound", false);
		if (initJump) {
			this.PlayerSoundService.playSound(playerState.player, "jumpChargeStartSound");
			this.AnimationService.playPose(playerState.player, "jumpChargePose");
			playerState.chargingJump = true;
			playerState.startedChargingJumpAt = time();
			// styart on  the next loop idc
		} else if (!playerState.inputState.Jump) {
			// finished charging
			this.PlayerSoundService.playSound(playerState.player, "jumpSound");
			this.AnimationService.playPose(playerState.player, "airbornPose");
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
		this.PlayerSoundService.toggleSound(playerState.player, "defaultStepSound", false);
		playerState.floorFallen = false;
		playerState.dx = 0;
		playerState.dy = 0;
		if (playerState.floorFallen) {
			this.AnimationService.playPose(playerState.player, "floorFallenPose");
		} else {
			this.AnimationService.playPose(playerState.player, "idlePose1");
		}
	}

	/**
	 * Collisions are built into subprocesses because they use getTouchingParts and move the stuff back
	 * Otherwise, the roblox system may overtake the thread, and forcibly move tyhe object
	 * @param dt
	 */
	heartbeat(dt: number) {
		this.playerMovementState.forEach((playerState) => {
			if (playerState.floorFallen && playerState.floorFallenDt > 0) {
				playerState.floorFallenDt -= dt;
				return;
			}
			if (playerState.isGrounded) {
				if (playerState.chargingJump) {
					playerState.floorFallen = false;
					this.handleJump(playerState, false);
				} else if (playerState.inputState.Jump) {
					playerState.floorFallen = false;
					this.handleJump(playerState, true);
				} else if (playerState.inputState.Down) {
					const newCFrame = new CFrame(playerState.hitbox.CFrame.Position).mul(CFrame.Angles(0, math.pi, 0));
					playerState.facing = Facing.Down;
					playerState.hitbox.PivotTo(newCFrame);
					this.handleIdle(playerState);
				} else if (playerState.inputState.Up) {
					const newCFrame = new CFrame(playerState.hitbox.CFrame.Position).mul(CFrame.Angles(0, 0, 0));
					playerState.facing = Facing.Up;
					playerState.hitbox.PivotTo(newCFrame);
					this.handleIdle(playerState);
				} else if (playerState.inputState.Right && !playerState.inputState.Left) {
					playerState.floorFallen = false;
					this.handle_walk(playerState, true, dt);
				} else if (playerState.inputState.Left && !playerState.inputState.Right) {
					playerState.floorFallen = false;
					this.handle_walk(playerState, false, dt);
				} else {
					// grounded and doing nothing
					this.handleIdle(playerState);
				}
			}
			// may have been activated above
			this.handleAirborn(playerState, dt);
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
