import { Controller, OnStart } from "@flamework/core";
import { RunService, StarterGui } from "@rbxts/services";
import { getOrWaitForLocalCharacter } from "../utils";

@Controller({})
export class PlayerInitController implements OnStart {
	onStart(): void {
		getOrWaitForLocalCharacter();
		if (RunService.IsStudio()) {
			StarterGui.SetCoreGuiEnabled("Chat", false);
			StarterGui.SetCoreGuiEnabled("PlayerList", false);
		}
	}
}
