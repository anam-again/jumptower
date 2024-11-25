import { OnStart, Service } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Players } from "@rbxts/services";

import { ANIMATION } from "shared/constants";
import { getOrWaitForServerCharacter } from "../utils";
import { PlayerAnimations } from "shared/types";

@Service({})
export class PlayerAnimationService implements OnStart {
	onStart(): void {
		Players.PlayerAdded.Connect((player) => {
			const character = getOrWaitForServerCharacter(player);
			const folder = Make("Folder", {
				Name: "PlayerAnimationService",
				Parent: character,
			});

			const defaultAnimator = character.FindFirstChild("Animate");
			if (!defaultAnimator) throw error("Couldn't find defaultAnimator for character");
			defaultAnimator.Parent = undefined;

			Make("Animation", {
				Name: PlayerAnimations.dab,
				Parent: folder,
				AnimationId: ANIMATION.Dab,
			});

			Make("Animation", {
				Name: PlayerAnimations.jumpCharge,
				Parent: folder,
				AnimationId: ANIMATION.JumpCharge,
			});

			Make("Animation", {
				Name: PlayerAnimations.jumpChargePose,
				Parent: folder,
				AnimationId: ANIMATION.JumpChargePose,
			});

			Make("Animation", {
				Name: PlayerAnimations.idlePose1,
				Parent: folder,
				AnimationId: ANIMATION.IdlePose1,
			});

			Make("Animation", {
				Name: PlayerAnimations.walkPose1,
				Parent: folder,
				AnimationId: ANIMATION.WalkPose1,
			});

			Make("Animation", {
				Name: PlayerAnimations.airbornPose,
				Parent: folder,
				AnimationId: ANIMATION.AirbornPose,
			});

			Make("Animation", {
				Name: PlayerAnimations.fallingPose,
				Parent: folder,
				AnimationId: ANIMATION.FallingPose,
			});

			Make("Animation", {
				Name: PlayerAnimations.bouncedAirbornPose,
				Parent: folder,
				AnimationId: ANIMATION.BouncedAirbornPose,
			});

			Make("Animation", {
				Name: PlayerAnimations.floorFallenPose,
				Parent: folder,
				AnimationId: ANIMATION.FloorFallenPose,
			});
		});
	}
}
