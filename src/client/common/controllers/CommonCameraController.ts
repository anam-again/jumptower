import { Controller, OnStart } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Workspace } from "@rbxts/services";

import { getWorkspaceInstance } from "shared/utils/workspace";

export interface ControlledCamera {
	camera: Camera;
	zIndex: number;
}

/**
 * You'll probably want:
 * constructor(private _commonCameraController: CommonCameraController) {}
 * in your consuming Controller
 */
@Controller({})
export class CommonCameraController implements OnStart {
	public cameras: Array<ControlledCamera> = [];
	private forcedCamera: Camera | undefined;

	onStart(): void {
		const cameraFolder = Make("Folder", {
			Name: "Cameras",
			Parent: Workspace,
		});
		const defaultCamera = getWorkspaceInstance(["Camera"], "Camera").Clone();
		defaultCamera.Name = "RobloxDefaultOrbital";
		defaultCamera.Parent = cameraFolder;
		this.insertCamera(defaultCamera, -1000);

		Workspace.GetPropertyChangedSignal("CurrentCamera").Connect(() => {
			this.evaluateAndSetCurrentCamera();
		});
	}

	private evaluateAndSetCurrentCamera() {
		if (this.forcedCamera) {
			if (Workspace.CurrentCamera === this.forcedCamera) return;
			Workspace.CurrentCamera = this.forcedCamera;
			return;
		}
		this.sortCameras();
		const highestCamera = this.cameras[this.cameras.size() - 1];
		if (Workspace.CurrentCamera?.Name !== highestCamera.camera.Name) {
			Workspace.CurrentCamera = highestCamera.camera;
		}
	}

	private sortCameras() {
		this.cameras.sort((a, b) => {
			return a.zIndex < b.zIndex;
		});
	}

	public forceCamera(camera: Camera | undefined) {
		this.forcedCamera = camera;
		this.evaluateAndSetCurrentCamera();
	}
	public releaseForcedCamera() {
		this.forcedCamera = undefined;
	}

	public removeCamera(camera: Camera) {
		const index = this.cameras.findIndex((cam) => {
			return cam.camera.Name === camera.Name;
		});
		if (index <= -1) return;
		this.cameras.remove(index);
	}

	public insertCamera(camera: Camera, zIndex: number) {
		this.cameras.forEach((tCamera) => {
			if (tCamera.camera.Name === camera.Name)
				throw error(`Please provide a unique name for your camera, received: ${camera.Name}`);
		});
		this.cameras.push({ camera, zIndex });
		this.evaluateAndSetCurrentCamera();
	}
}
