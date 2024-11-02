import { Controller, OnStart } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Players } from "@rbxts/services";

import { ANIMATION } from "shared/constants";

@Controller({})
export class CommonAnimationController implements OnStart {
	private dabAnimation: AnimationTrack | undefined;

	onStart(): void {
		const player = Players.LocalPlayer;
		player.CharacterAdded.Connect((character) => {
			const humanoid = character.WaitForChild("Humanoid");
			if (!humanoid.IsA("Humanoid")) throw error();
			const animator = humanoid.WaitForChild("Animator");
			if (!animator.IsA("Animator")) throw error();

			const dabAnimation = Make("Animation", {
				AnimationId: ANIMATION.Dab,
			});

			this.dabAnimation = animator.LoadAnimation(dabAnimation);
		});
	}

	public action_dab() {
		if (this.dabAnimation !== undefined) {
			this.dabAnimation.Play();
		}
	}
}
