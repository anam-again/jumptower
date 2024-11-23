import { OnStart, Service } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Players } from "@rbxts/services";

import { SOUNDS } from "shared/constants";

interface PlayerSounds {
	bounceSound: Sound;
	glassSplat: Sound;
	jumpSound: Sound;
	landSound: Sound;
	jumpChargeStartSound: Sound;
}

interface PlayerToggleableSounds {
	defaultStepSound: Sound;
}

@Service({})
export class PlayerSoundService implements OnStart {
	private playerSoundMap = new Map<number, PlayerSounds>();
	private playerToggleableSoundsMap = new Map<number, PlayerToggleableSounds>();

	onStart(): void {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAdded.Connect((character) => {
				const bounceSound = Make("Sound", {
					Parent: character,
					SoundId: SOUNDS.ErrorSound,
				});
				const glassSplat = Make("Sound", {
					Parent: character,
					SoundId: SOUNDS.GlassSplat,
				});
				const jumpSound = Make("Sound", {
					Parent: character,
					SoundId: SOUNDS.RobloxCuteGoodbye,
				});
				const landSound = Make("Sound", {
					Parent: character,
					SoundId: SOUNDS.UITapVariant,
				});
				const jumpChargeStartSound = Make("Sound", {
					Parent: character,
					SoundId: SOUNDS.hl2UIRollover,
				});

				const defaultStepSound = Make("Sound", {
					Parent: character,
					SoundId: SOUNDS.doinkyStep,
					Looped: true,
				});
				const playerSounds: PlayerSounds = {
					bounceSound,
					glassSplat,
					jumpSound,
					landSound,
					jumpChargeStartSound,
				};
				const playerToggleableSounds: PlayerToggleableSounds = {
					defaultStepSound,
				};
				this.playerSoundMap.set(player.UserId, playerSounds);
				this.playerToggleableSoundsMap.set(player.UserId, playerToggleableSounds);
			});
		});
	}

	playSound(player: Player, sound: keyof PlayerSounds) {
		const playerSoundMap = this.playerSoundMap.get(player.UserId);
		if (!playerSoundMap) return;
		playerSoundMap[sound].Play();
	}

	toggleSound(player: Player, sound: keyof PlayerToggleableSounds, active: boolean) {
		const playerToggleableSoundsMap = this.playerToggleableSoundsMap.get(player.UserId);
		if (!playerToggleableSoundsMap) return;
		const toggleableSound = playerToggleableSoundsMap[sound];
		if (active) {
			if (!toggleableSound.IsPlaying) {
				toggleableSound.Play();
			}
		} else {
			toggleableSound.Stop();
		}
	}
}
