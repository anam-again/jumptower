import { OnStart, Service } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import Object from "@rbxts/object-utils";
import { Players } from "@rbxts/services";

import { ANIMATION } from "shared/constants";

interface PlayerAnimations {
	dab: AnimationTrack;
	jumpCharge: AnimationTrack;
	jumpChargePose: AnimationTrack;
	idlePose1: AnimationTrack;
	walkPose1: AnimationTrack;
	airbornPose: AnimationTrack;
	fallingPose: AnimationTrack;
	bouncedAirbornPose: AnimationTrack;
	floorFallenPose: AnimationTrack;
}

@Service({})
export class AnimationService implements OnStart {
	private animationMap = new Map<number, PlayerAnimations>();

	onStart(): void {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((character) => {
				const humanoid = character.WaitForChild("Humanoid");
				if (!humanoid.IsA("Humanoid")) throw error();
				const animator = humanoid.WaitForChild("Animator");
				if (!animator.IsA("Animator")) throw error();

				const defaultAnimator = character.FindFirstChild("Animate");
				if (!defaultAnimator) throw error("Couldn't find defaultAnimator for character");
				defaultAnimator.Parent = undefined;

				const dab_a = Make("Animation", {
					AnimationId: ANIMATION.Dab,
				});
				const dab = animator.LoadAnimation(dab_a);

				const jumpCharge_a = Make("Animation", {
					AnimationId: ANIMATION.JumpCharge,
				});
				const jumpCharge = animator.LoadAnimation(jumpCharge_a);

				const jumpChargePose_a = Make("Animation", {
					AnimationId: ANIMATION.JumpChargePose,
				});
				const jumpChargePose = animator.LoadAnimation(jumpChargePose_a);

				const idlePose1_a = Make("Animation", {
					AnimationId: ANIMATION.IdlePose1,
				});
				const idlePose1 = animator.LoadAnimation(idlePose1_a);

				const walkPose1_a = Make("Animation", {
					AnimationId: ANIMATION.WalkPose1,
				});
				const walkPose1 = animator.LoadAnimation(walkPose1_a);

				const airbornPose_a = Make("Animation", {
					AnimationId: ANIMATION.AirbornPose,
				});
				const airbornPose = animator.LoadAnimation(airbornPose_a);

				const fallingPose_a = Make("Animation", {
					AnimationId: ANIMATION.FallingPose,
				});
				const fallingPose = animator.LoadAnimation(fallingPose_a);

				const bouncedAirbornPose_a = Make("Animation", {
					AnimationId: ANIMATION.BouncedAirbornPose,
				});
				const bouncedAirbornPose = animator.LoadAnimation(bouncedAirbornPose_a);

				const floorFallenPose_a = Make("Animation", {
					AnimationId: ANIMATION.FloorFallenPose,
				});
				const floorFallenPose = animator.LoadAnimation(floorFallenPose_a);

				const playerAnimations: PlayerAnimations = {
					dab,
					jumpCharge,
					jumpChargePose,
					idlePose1,
					walkPose1,
					airbornPose,
					fallingPose,
					bouncedAirbornPose,
					floorFallenPose,
				};

				this.animationMap.set(player.UserId, playerAnimations);
			});
		});
	}

	private pauseAllPoses(playerAnimations: PlayerAnimations) {
		Object.keys(playerAnimations).forEach((key) => {
			playerAnimations[key].Stop();
		});
	}

	private pauseAllButThisPose(playerAnimations: PlayerAnimations, animation: keyof PlayerAnimations) {
		Object.keys(playerAnimations).forEach((key) => {
			if (key !== animation) {
				playerAnimations[key].Stop();
			}
		});
	}

	public playAnimation(player: Player, animation: keyof PlayerAnimations) {
		const animations = this.animationMap.get(player.UserId);
		if (!animations) return;
		animations[animation].Play();
	}

	public playLoop(player: Player, animation: keyof PlayerAnimations) {
		const animations = this.animationMap.get(player.UserId);
		if (!animations) return;
		this.pauseAllButThisPose(animations, animation);
		const anim = animations[animation];
		if (!anim.IsPlaying) {
			anim.Looped = true;
			anim.Play(0, 1, 1);
		}
	}

	public playPose(player: Player, animation: keyof PlayerAnimations) {
		const animations = this.animationMap.get(player.UserId);
		if (!animations) return;
		this.pauseAllPoses(animations);
		const anim = animations[animation];
		anim.Looped = true;
		anim.Play(0, 1, 0);
	}
}
