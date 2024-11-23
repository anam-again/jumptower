import { Controller, OnStart } from "@flamework/core";
import { ContextActionService, Players, UserInputService, Workspace } from "@rbxts/services";
import { Events } from "../network";

enum ACTIONS {
	Left = "Left",
	Right = "Right",
	Up = "Up",
	Down = "Down",
	Jump = "Jump",
	Dab = "Dab",
}

interface MappedTouchInputObject {
	input: InputObject;
	action: ACTIONS;
}
@Controller({})
export class CommonControllsController implements OnStart {
	onStart(): void {
		ContextActionService.UnbindAllActions();

		const touchInputObjects: Array<MappedTouchInputObject> = [];
		UserInputService.TouchStarted.Connect((input) => {
			const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
			if (!playerGui) return;
			const screenGui = playerGui.WaitForChild("TouchGui") as ScreenGui;
			if (!screenGui) return;
			const guiObj = playerGui.GetGuiObjectsAtPosition(input.Position.X, input.Position.Y);
			const mismatch = guiObj.find((obj) => {
				if (!["LoadingGUIApp", "TouchControlFrame"].includes(obj.Name)) return true; // TODO put a test on this teehee
			});
			if (mismatch) return;
			if (input.Position.X < screenGui.AbsoluteSize.X / 4) {
				touchInputObjects.push({
					input,
					action: ACTIONS.Left,
				});
				Events.action_left.fire(Enum.UserInputState.Begin);
			} else if (input.Position.X < screenGui.AbsoluteSize.X / 2) {
				touchInputObjects.push({
					input,
					action: ACTIONS.Right,
				});
				Events.action_right.fire(Enum.UserInputState.Begin);
			} else {
				touchInputObjects.push({
					input,
					action: ACTIONS.Jump,
				});
				Events.action_jump.fire(Enum.UserInputState.Begin);
			}
		});

		UserInputService.TouchEnded.Connect((input) => {
			const i = touchInputObjects.findIndex((mappedInput) => {
				return mappedInput.input === input;
			});
			if (i < 0) return;
			switch (touchInputObjects[i].action) {
				case ACTIONS.Left:
					Events.action_left.fire(Enum.UserInputState.End);
					break;
				case ACTIONS.Right:
					Events.action_right.fire(Enum.UserInputState.End);
					break;
				case ACTIONS.Jump:
					Events.action_jump.fire(Enum.UserInputState.End);
					break;
			}
			touchInputObjects.unorderedRemove(i);
		});

		ContextActionService.BindAction(
			ACTIONS.Up,
			(_, inputState) => {
				Events.action_up.fire(inputState);
			},
			false,
			Enum.KeyCode.W,
		);

		ContextActionService.BindAction(
			ACTIONS.Left,
			(_, inputState) => {
				Events.action_left.fire(inputState);
			},
			false,
			Enum.KeyCode.A,
		);

		ContextActionService.BindAction(
			ACTIONS.Down,
			(_, inputState) => {
				Events.action_down.fire(inputState);
			},
			false,
			Enum.KeyCode.S,
		);

		ContextActionService.BindAction(
			ACTIONS.Right,
			(_, inputState) => {
				Events.action_right.fire(inputState);
			},
			false,
			Enum.KeyCode.D,
		);

		ContextActionService.BindAction(
			ACTIONS.Jump,
			(_, inputState) => {
				Events.action_jump.fire(inputState);
			},
			false,
			Enum.KeyCode.Space,
		);
	}
}
