import { Controller, OnInit, OnStart } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Players, RunService, UserInputService } from "@rbxts/services";

import { getObjectSubInstance } from "shared/utils/object";

import { CommonCameraController } from "./CommonCameraController";

enum CAMERATYPE {
	ThirdPerson,
	Overhead,
}

@Controller({})
export class ThirdPersonCameraController implements OnStart {
	private currentCamera: CAMERATYPE = CAMERATYPE.ThirdPerson;
	constructor(private CommonCameraController: CommonCameraController) {}

	onStart() {
		if (Players.LocalPlayer.Character) {
			this.setupCamera();
		}
		Players.LocalPlayer.CharacterAdded.Connect(() => {
			this.setupCamera();
		});
	}

	setupCamera() {
		// https://devforum.roblox.com/t/camera-coding-setting-the-offset/111529/4

		const character = Players.LocalPlayer.Character;
		if (!character) throw error();

		const camera = Make("Camera", {
			Name: "ThirdPersonCamera",
			Parent: character,
			FieldOfView: 60,
			CameraType: Enum.CameraType.Scriptable,
		});

		const cCSubj = camera.GetPropertyChangedSignal("CameraSubject").Connect(() => {
			if (camera && camera.CameraSubject?.IsA("Humanoid")) {
				camera.CameraType = Enum.CameraType.Scriptable;
			}
		});

		UserInputService.MouseIconEnabled = false;
		UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;

		let xAngle = 180;
		let yAngle = 0;
		let delta;

		const uisInputC = UserInputService.InputChanged.Connect((input) => {
			switch (input.UserInputType) {
				case Enum.UserInputType.MouseMovement:
				case Enum.UserInputType.Touch:
					delta = input.Delta;
					break;
				default:
					return;
			}
			xAngle = xAngle - input.Delta.X * 0.5;
			yAngle = math.clamp(yAngle - input.Delta.Y * 0.2, -80, 80);
		});

		const rootPart = getObjectSubInstance(character, ["HumanoidRootPart"], "Part");

		let targetCameraPos;
		const hb = RunService.Heartbeat.Connect(() => {
			const startCFrame = new CFrame(rootPart.CFrame.Position.add(new Vector3(0, 2, 0)))
				.mul(CFrame.Angles(0, math.rad(xAngle), 0))
				.mul(CFrame.Angles(math.rad(yAngle), 0, 0));
			switch (this.currentCamera) {
				case CAMERATYPE.Overhead:
					targetCameraPos = new Vector3(0, 1.5, 7.5);
					break;
				case CAMERATYPE.ThirdPerson:
					targetCameraPos = new Vector3(3.5, 0, 7.5);
					break;
				default:
					throw error("Unknown camera type supplied to commonCamera");
			}
			const cameraCFrame = startCFrame.add(
				startCFrame.VectorToWorldSpace(new Vector3(targetCameraPos.X, targetCameraPos.Y, targetCameraPos.Z)),
			);
			const cameraFocus = startCFrame.add(
				startCFrame.VectorToWorldSpace(new Vector3(targetCameraPos.X, targetCameraPos.Y, -50000)),
			);
			camera.CFrame = new CFrame(cameraCFrame.Position, cameraFocus.Position);
		});

		this.CommonCameraController.insertCamera(camera, 0);

		Players.LocalPlayer.CharacterRemoving.Once(() => {
			this.CommonCameraController.removeCamera(camera);
			camera.Destroy();
			hb.Disconnect();
			cCSubj.Disconnect();
			uisInputC.Disconnect();
		});
	}

	public action_ToggleFreeMouse() {
		if (UserInputService.MouseBehavior === Enum.MouseBehavior.LockCenter) {
			UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
			UserInputService.MouseIconEnabled = true;
		} else {
			UserInputService.MouseIconEnabled = false;
			UserInputService.MouseBehavior = Enum.MouseBehavior.LockCenter;
		}
	}

	public action_ChangeCamera() {
		if (this.currentCamera === CAMERATYPE.ThirdPerson) {
			this.currentCamera = CAMERATYPE.Overhead;
		} else {
			this.currentCamera = CAMERATYPE.ThirdPerson;
		}
	}
}
