import { Players, RunService } from "@rbxts/services";
interface FadeDestroyExtensionProps {
	secondsUntilFadeAway: number;
}
export class FadeDestroyExtension {
	constructor(parent: BasePart, props: FadeDestroyExtensionProps = { secondsUntilFadeAway: 1 }) {
		task.spawn(() => {
			let totalTime = 0;
			const hb = RunService.Heartbeat.Connect((dt) => {
				totalTime += dt;
				parent.Transparency = totalTime / props.secondsUntilFadeAway;
			});
			task.wait(props.secondsUntilFadeAway);
			hb.Disconnect();
			parent.Destroy();
		});
	}
}
