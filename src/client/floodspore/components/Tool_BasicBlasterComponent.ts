import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { Debris, Players, RunService, Workspace } from "@rbxts/services";
import { Make } from "@rbxts/altmake";
import { Events } from "client/common/network";
import { FadeDestroyExtension } from "./Extensions/FadeDestroyExtension";
import { ComponentTags } from "shared/tags";

const BEAM_DURATION_S = 0.5;
const BLASTER_FIRE_SPEED_S = 0.01;

const PLAYER_TURN_POLL_S = 0.01;
const ALIGN_ORIENTATION_LERP_DISTANCE = 0.2;
const ALIGN_ORIENTATION_MAX_TORQUE = 100000;
const ALIGN_ORIENTATION_RESPONSIVENESS = 1000;

const DESTROYED_SPORE_GLOW_EFFECT_SIZE = 2;

interface Tool_BasicBlaster_Mod extends Omit<Tool_BasicBlaster, "Handle"> {}

@Component({
	tag: "Tool_BasicBlaster",
})
export class Tool_BasicBlasterComponent extends BaseComponent<{}, Tool_BasicBlaster_Mod> implements OnStart {
	private playerParent: Player | undefined;
	private isEquipped!: boolean;
	/**
	 * The gun can be toggled on and off
	 */
	private isActivated = false;

	onStart() {
		this.instance.ToolTip = "Get to blastin'";
		this.instance.AncestryChanged.Connect((_, parent) => {
			const player = Players.GetPlayerFromCharacter(parent);
			if (player !== undefined) {
				this.playerParent = player;
				this.onEquipped();
			} else {
				this.onUnequipped();
			}
		});
		this.instance.Activated.Connect(() => {
			this.onActivated();
		});
	}

	/**
	 * After the major while loop, this function also handles the 'unequip' teardown behaviour
	 */
	onEquipped() {
		if (!this.playerParent) return;

		const humanoid = this.playerParent.Character?.FindFirstChildOfClass("Humanoid");
		if (!humanoid) return;

		const upperTorso = this.playerParent.Character?.FindFirstChild("UpperTorso");
		if (!upperTorso || !upperTorso.IsA("MeshPart")) return;
		const upperTorsoMotor = upperTorso.FindFirstChild("Waist");
		if (!upperTorsoMotor?.IsA("Motor6D")) return;

		const rightUpperArm = this.playerParent.Character?.FindFirstChild("RightUpperArm");
		if (!rightUpperArm || !rightUpperArm.IsA("MeshPart")) return;
		const rightUpperArmMotor = rightUpperArm.FindFirstChild("RightShoulder");
		if (!rightUpperArmMotor?.IsA("Motor6D")) return;

		const humanoidAlignOrientation = Make("AlignOrientation", {
			Mode: Enum.OrientationAlignmentMode.OneAttachment,
			Attachment0: humanoid.RootPart?.FindFirstChildOfClass("Attachment"),
			Parent: humanoid.RootPart,
			MaxTorque: ALIGN_ORIENTATION_MAX_TORQUE,
			Responsiveness: ALIGN_ORIENTATION_RESPONSIVENESS,
			CFrame: humanoid.RootPart?.CFrame,
		});

		humanoid.AutoRotate = false;
		this.isEquipped = true;
		const defaultUpperTorsoMotorC0 = upperTorsoMotor.C0;
		const defaultUpperArmMotorC0 = rightUpperArmMotor.C0;
		// TODO: Remove collisions for body while it is equipped;

		while (this.isEquipped && this.playerParent && humanoid.RootPart) {
			const relativeMousePos = this.playerParent.GetMouse().Hit.Position.sub(humanoid.RootPart.Position);
			humanoidAlignOrientation.CFrame = humanoidAlignOrientation.CFrame.Lerp(
				new CFrame(new Vector3(0, 0, 0), new Vector3(relativeMousePos.X, 0, relativeMousePos.Z)),
				ALIGN_ORIENTATION_LERP_DISTANCE,
			);
			// This took so long to write
			const dist = math.sqrt(math.pow(relativeMousePos.X, 2) + math.pow(relativeMousePos.Z, 2));
			const angl = math.atan(relativeMousePos.Y / dist);
			upperTorsoMotor.C0 = new CFrame(upperTorsoMotor.C0.Position, new Vector3(0, 45 * angl, -90));
			rightUpperArmMotor.C0 = new CFrame(rightUpperArmMotor.C0.Position, new Vector3(0, 45 * angl, -90));
			task.wait(PLAYER_TURN_POLL_S);
		}
		// Is unequipped:
		upperTorsoMotor.C0 = defaultUpperTorsoMotorC0;
		rightUpperArmMotor.C0 = defaultUpperArmMotorC0;
		humanoidAlignOrientation.Destroy();
		humanoid.AutoRotate = true;
	}

	onUnequipped() {
		this.isActivated = false;
		this.isEquipped = false;
	}

	onActivated() {
		this.isActivated = !this.isActivated;
		while (this.isActivated) {
			this.fireBlasterOnce();
			task.wait(BLASTER_FIRE_SPEED_S);
		}
	}

	fireBlasterOnce() {
		const mouse = this.playerParent?.GetMouse();
		if (mouse === undefined) return;
		const beamOrigin = Make("Part", {
			Parent: Workspace.SpawnedEffects,
			Position: this.instance.BeamOrigin.Position,
			Size: new Vector3(1, 1, 1),
			Anchored: true,
			Transparency: 0.8,
			CanCollide: false,
			CanTouch: false,
			CanQuery: false,
		});
		const sourceAttachment = Make("Attachment", {
			Parent: beamOrigin,
		});
		const targetAttachment = Make("Attachment", {
			Parent: beamOrigin,
			Position: mouse.Hit.Position.sub(beamOrigin.Position),
		});
		const beamEffect = Make("Beam", {
			Parent: beamOrigin,
			Attachment0: sourceAttachment,
			Attachment1: targetAttachment,
			Segments: 2,
			Color: new ColorSequence(new Color3(1, 0, 0)),
			Transparency: new NumberSequence(0),
		});
		task.spawn(() => {
			let totalTime = 0;
			const hb = RunService.Heartbeat.Connect((dt) => {
				totalTime += dt;
				beamEffect.Transparency = new NumberSequence(math.min(1, (totalTime + 0.5) / BEAM_DURATION_S - 0.5));
			});
			task.wait(BEAM_DURATION_S);
			hb.Disconnect();
		});
		// https://create.roblox.com/docs/reference/engine/classes/WorldRoot#Raycast
		// add cool laser
		Debris.AddItem(beamOrigin, BEAM_DURATION_S);

		if (mouse.Target?.HasTag(ComponentTags.SporeUnitComponent)) {
			Events.clientKillSpore.fire(mouse.Target.Position);
			const rubble = Make("Part", {
				Parent: Workspace.SpawnedEffects,
				Size: new Vector3(1, 1, 1),
				Transparency: 0.0,
				Position: mouse.Target.Position,
				Rotation: new Vector3(math.random()),
				CanTouch: false,
				CanQuery: false,
				CanCollide: false,
			});
			new FadeDestroyExtension(rubble, { secondsUntilFadeAway: 1 });
			rubble.ApplyImpulse(new Vector3(math.random() * 100, math.random() * 100, math.random() * 100));

			const glowPart = Make("Part", {
				Parent: Workspace.SpawnedEffects,
				Size: new Vector3(
					DESTROYED_SPORE_GLOW_EFFECT_SIZE,
					DESTROYED_SPORE_GLOW_EFFECT_SIZE,
					DESTROYED_SPORE_GLOW_EFFECT_SIZE,
				),
				Transparency: 0.0,
				Position: mouse.Target.Position,
				CanTouch: false,
				CanQuery: false,
				CanCollide: false,
				Anchored: true,
				Color: new Color3(1, 1, 1),
			});
			new FadeDestroyExtension(glowPart, { secondsUntilFadeAway: 0.06 });
		}
	}
}
