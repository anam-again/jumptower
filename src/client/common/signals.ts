import Signal from "@rbxts/signal";

import { ControlledCamera } from "./controllers/CommonCameraController";

export const ClientSignals = {
	writeToEventLog: new Signal<(message: string) => void>(),
	CamerasEvaluated: new Signal<(cameras: Array<ControlledCamera>) => void>(),
	ForceCamera: new Signal<(camera: Camera | undefined) => void>(),
};
