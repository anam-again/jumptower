import { Controller, OnStart } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Players, RunService, TextChatService } from "@rbxts/services";

import { getObjectSubInstance } from "shared/utils/object";

import { CommonCameraController } from "./CommonCameraController";
import { TextChatController } from "./TextChatController";
import { getOrWaitForLocalCharacter } from "../utils";

const SCREEN_HEIGHT = 40;
const HALF_SCREEN_HEIGHT = 20;

const SCREEN_WIDTH = 80;
const HALF_SCREEN_WIDTH = 40;

@Controller({})
export class ThirdPersonCameraController implements OnStart {
	constructor(
		private CommonCameraController: CommonCameraController,
		private TextChatController: TextChatController,
	) {}

	onStart() {
		this.setupCamera();
	}

	setupCamera() {
		const character = getOrWaitForLocalCharacter();
		if (!character) {
			this.TextChatController.writeToGeneral("ThirdPersonCameraController couldn't find the character");
			throw error("ThirdPersonCameraController couldn't find the character");
		}

		const camera = Make("Camera", {
			Name: "2DCamera",
			Parent: character,
			FieldOfView: 15,
			CameraType: Enum.CameraType.Scriptable,
		});

		const rootPart = getObjectSubInstance(character, ["HumanoidRootPart"], "Part");

		const hb = RunService.Heartbeat.Connect(() => {
			const focus = new Vector3(
				math.floor(rootPart.Position.X / SCREEN_WIDTH) * SCREEN_WIDTH + HALF_SCREEN_WIDTH,
				math.floor(rootPart.Position.Y / SCREEN_HEIGHT) * SCREEN_HEIGHT + HALF_SCREEN_HEIGHT,
				0,
			);
			camera.CFrame = new CFrame(focus.add(new Vector3(0, 0, 200)), focus);
		});

		this.CommonCameraController.insertCamera(camera, 0);

		Players.LocalPlayer.CharacterRemoving.Once(() => {
			this.CommonCameraController.removeCamera(camera);
			hb.Disconnect();
			camera.Destroy();
		});
	}
}
