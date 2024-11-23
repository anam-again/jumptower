import { Controller, OnStart } from "@flamework/core";
import { StarterGui } from "@rbxts/services";
import { getOrWaitForLocalCharacter } from "../utils";

@Controller({})
export class PlayerInitController implements OnStart {
	onStart(): void {
		getOrWaitForLocalCharacter();
		StarterGui.SetCore("ChatActive", false);
		StarterGui.SetCoreGuiEnabled("PlayerList", false);
	}
}
