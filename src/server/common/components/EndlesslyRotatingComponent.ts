import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/constants";
import { TweenService } from "@rbxts/services";

interface EndlesslyRotatingComponentType extends BasePart {}

@Component({ tag: TAGS.EndlesslyRotating })
export class EndlesslyRotatingComponent extends BaseComponent<{}, EndlesslyRotatingComponentType> implements OnStart {
	onStart(): void {
		TweenService.Create(
			this.instance,
			new TweenInfo(24, Enum.EasingStyle.Linear, Enum.EasingDirection.In, math.huge),
			{
				Rotation: new Vector3(360, 360, 0),
			},
		).Play();
	}
}
