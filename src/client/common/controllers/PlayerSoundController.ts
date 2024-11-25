import { Controller, OnStart } from "@flamework/core";
import { PlayerSounds } from "shared/types";
import { Events } from "../network";

@Controller({})
export class PlayerSoundController {
	public playSound(sound: PlayerSounds) {
		Events.playPlayerSound(sound);
	}

	public toggleSound(sound: PlayerSounds, active: boolean) {
		Events.togglePlayerSound(sound, active);
	}
}
