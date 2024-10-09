import Signal from "@rbxts/signal";

export const ServerBindableEvent = {
	addToTriggerArea: new Signal<(part: BasePart) => void>(),
};
