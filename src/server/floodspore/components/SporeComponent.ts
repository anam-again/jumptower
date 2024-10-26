import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { ComponentTags } from "shared/constants";

@Component({
	tag: ComponentTags.SporeUnitComponent,
})
export class SporeComponent extends BaseComponent<{}, Part> implements OnStart {
	onStart(): void {
		this.instance.Touched.Connect((otherPart) => {
			const humanoid = otherPart.Parent?.FindFirstChildOfClass("Humanoid");
			if (humanoid !== undefined) {
				humanoid.TakeDamage(10);
			}
		});
	}
}
