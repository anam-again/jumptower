import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { RunService } from "@rbxts/services";

import { ComponentTags } from "shared/constants";

const COLOR_CHANGE_TIME_S = 15;

const colorRange: ColorSequence = new ColorSequence([
	new ColorSequenceKeypoint(0, new Color3(1, 1, 1)),
	new ColorSequenceKeypoint(0.02, new Color3(0, 0, 0)),
	new ColorSequenceKeypoint(0.1, new Color3(0.06, 0.31, 0)),
	new ColorSequenceKeypoint(0.9, new Color3(0.14, 0.78, 0)),
	new ColorSequenceKeypoint(1, new Color3(0.78, 0.03, 0)),
]);

@Component({
	tag: ComponentTags.SporeUnitComponent,
})
export class SporeUnitComponent extends BaseComponent<{}, Part> implements OnStart {
	onStart() {
		this.changeColor();
	}

	changeColor() {
		let totalMs = 0.0;
		const hb = RunService.Heartbeat.Connect((dt) => {
			totalMs += dt;
			this.instance.Color = this.evalColorSequence(colorRange, math.min(totalMs / COLOR_CHANGE_TIME_S));
		});
		task.wait(COLOR_CHANGE_TIME_S);
		hb.Disconnect();
	}

	// https://create.roblox.com/docs/reference/engine/datatypes/ColorSequence
	evalColorSequence(sequence: ColorSequence, time: number): Color3 {
		if (time <= 0) return sequence.Keypoints[0].Value;
		if (time >= 1) return sequence.Keypoints[sequence.Keypoints.size() - 1].Value;
		for (let i = 0; i < sequence.Keypoints.size() - 1; i++) {
			const thisKeypoint = sequence.Keypoints[i];
			const nextKeypoint = sequence.Keypoints[i + 1];
			if (time >= thisKeypoint.Time && time < nextKeypoint.Time) {
				const alpha = (time - thisKeypoint.Time) / (nextKeypoint.Time - thisKeypoint.Time);
				return new Color3(
					(nextKeypoint.Value.R - thisKeypoint.Value.R) * alpha + thisKeypoint.Value.R,
					(nextKeypoint.Value.G - thisKeypoint.Value.G) * alpha + thisKeypoint.Value.G,
					(nextKeypoint.Value.B - thisKeypoint.Value.B) * alpha + thisKeypoint.Value.B,
				);
			}
		}
		return sequence.Keypoints[sequence.Keypoints.size() - 1].Value;
	}
}
