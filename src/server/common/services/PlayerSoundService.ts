import { OnStart, Service } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Players } from "@rbxts/services";

import { SOUNDS } from "shared/constants";
import { getOrWaitForServerCharacter } from "../utils";
import { PlayerSounds } from "shared/types";
import { Events } from "../network";

@Service({})
export class PlayerSoundService implements OnStart {
	onStart(): void {
		Players.PlayerAdded.Connect((player) => {
			const character = getOrWaitForServerCharacter(player);
			const folder = Make("Folder", {
				Parent: character,
				Name: "PlayerSoundService",
			});

			Make("Sound", {
				Name: PlayerSounds.bounceSound,
				Parent: folder,
				SoundId: SOUNDS.ErrorSound,
			});
			Make("Sound", {
				Name: PlayerSounds.glassSplat,
				Parent: folder,
				SoundId: SOUNDS.GlassSplat,
			});
			Make("Sound", {
				Name: PlayerSounds.jumpSound,
				Parent: folder,
				SoundId: SOUNDS.RobloxCuteGoodbye,
			});
			Make("Sound", {
				Name: PlayerSounds.landSound,
				Parent: folder,
				SoundId: SOUNDS.UITapVariant,
			});
			Make("Sound", {
				Name: PlayerSounds.jumpChargeStartSound,
				Parent: folder,
				SoundId: SOUNDS.hl2UIRollover,
			});
			Make("Sound", {
				Name: PlayerSounds.doinkyStep,
				Parent: folder,
				SoundId: SOUNDS.doinkyStep,
				Looped: true,
			});

			Events.playPlayerSound.connect((p, playerSound) => {
				const sound = getOrWaitForServerCharacter(p)
					.WaitForChild("PlayerSoundService")
					.WaitForChild(playerSound) as Sound;
				if (!sound) return;
				sound.Play();
			});
			Events.togglePlayerSound.connect((p, playerSound, active) => {
				const sound = getOrWaitForServerCharacter(p)
					.WaitForChild("PlayerSoundService")
					.WaitForChild(playerSound) as Sound;
				if (!sound) return;
				if (active) {
					if (!sound.IsPlaying) {
						sound.Play();
					}
				} else {
					sound.Stop();
				}
			});
		});
	}
}
