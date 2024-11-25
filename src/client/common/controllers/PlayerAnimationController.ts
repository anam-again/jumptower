import { Controller, OnStart } from "@flamework/core";
import { getOrWaitForLocalCharacter } from "../utils";
import Object from "@rbxts/object-utils";
import { PlayerAnimations } from "shared/types";

@Controller({})
export class PlayerAnimationController implements OnStart {
	private tracks = new Map<PlayerAnimations, AnimationTrack>();
	onStart(): void {
		const character = getOrWaitForLocalCharacter();
		const animationFolder = character.WaitForChild("PlayerAnimationService");
		if (!animationFolder.IsA("Folder")) throw error();
		const animator = character.WaitForChild("Humanoid").WaitForChild("Animator");
		if (!animator.IsA("Animator")) throw error();
		Object.values(PlayerAnimations).forEach((v) => {
			const animation = animationFolder.WaitForChild(v) as Animation;
			if (!animation) return;
			const track = animator.LoadAnimation(animation);
			if (!track) return;
			this.tracks.set(v, track);
		});
	}

	public playAnimation(animation: PlayerAnimations) {
		const track = this.tracks.get(animation);
		if (!track) return;
		track.Play();
	}

	public playLoop(animation: PlayerAnimations) {
		const track = this.tracks.get(animation);
		if (!track) return;
		this.stopAllButThisAnimation(animation);
		if (!track.IsPlaying) {
			track.Looped = true;
			track.Play(0, 1, 1);
		}
	}

	public playPose(animation: PlayerAnimations) {
		const track = this.tracks.get(animation);
		if (!track) return;
		this.stopAllButThisAnimation(animation);
		if (!track.IsPlaying) {
			track.Looped = true;
			track.Play(0, 1, 0);
		}
	}

	private stopAllButThisAnimation(animation: PlayerAnimations) {
		Object.entries(this.tracks).forEach(([k, v]) => {
			if (k !== animation) {
				v.Stop();
			}
		});
	}
}
