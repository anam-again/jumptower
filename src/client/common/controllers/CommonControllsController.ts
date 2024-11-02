import { Controller, OnStart } from "@flamework/core";
import { ContextActionService, UserInputService } from "@rbxts/services";

import { ThirdPersonCameraController } from "./ThirdPersonCameraController";
import { CommonAnimationController } from "./CommonAnimationController";

enum ACTIONS {
	ChangeCamera = "ChangeCamera",
	ToggleFreeMouse = "ToggleFreeMouse",
	Dab = "Dab",
}

@Controller({})
export class CommonControllsController implements OnStart {
	constructor(
		private ThirdPersonCameraController: ThirdPersonCameraController,
		private CommonAnimationController: CommonAnimationController,
	) {}

	onStart(): void {
		ContextActionService.BindAction(
			ACTIONS.ChangeCamera,
			() => {
				if (!UserInputService.IsKeyDown("C")) return;
				this.ThirdPersonCameraController.action_ChangeCamera();
			},
			false,
			Enum.KeyCode.C,
		);

		ContextActionService.BindAction(
			ACTIONS.ToggleFreeMouse,
			() => {
				if (!UserInputService.IsKeyDown("LeftAlt")) return;
				this.ThirdPersonCameraController.action_ToggleFreeMouse();
			},
			false,
			Enum.KeyCode.LeftAlt,
		);

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
