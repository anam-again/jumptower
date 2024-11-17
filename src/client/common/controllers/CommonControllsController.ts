import { Controller, OnStart } from "@flamework/core";
import { ContextActionService, UserInputService } from "@rbxts/services";

import { CommonAnimationController } from "./CommonAnimationController";

enum ACTIONS {
	Dab = "Dab",
}

@Controller({})
export class CommonControllsController implements OnStart {
	constructor(private CommonAnimationController: CommonAnimationController) {}

	onStart(): void {
		ContextActionService.BindAction(
			ACTIONS.Dab,
			() => {
				if (!UserInputService.IsKeyDown("F")) return;
				this.CommonAnimationController.action_dab();
			},
			false,
			Enum.KeyCode.F,
		);
	}
}
