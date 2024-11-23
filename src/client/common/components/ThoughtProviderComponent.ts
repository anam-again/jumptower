import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/constants";

import { PlayerTriggerAreaExtension } from "./extensions/PlayerTriggerAreaExtension";
import { Workspace } from "@rbxts/services";
import { FocusThoughtProviderGUI, unfocusThoughtProviderGUI } from "../ui/ThoughtProvidorGUIApp";

interface ThoughtProvidor extends Folder {
	Source: BasePart;
	PlayerTriggerArea: BasePart;
	Thought: StringValue;
}

@Component({ tag: TAGS.ThoughtProvidor })
export class ThoughtProviderComponent extends BaseComponent<{}, ThoughtProvidor> implements OnStart {
	onStart() {
		this.instance.Source.Transparency = 1;
		this.instance.PlayerTriggerArea.Transparency = 1;
		const trigger = new PlayerTriggerAreaExtension(this.instance.PlayerTriggerArea);
		trigger.onEnter.Connect(() => {
			if (!Workspace.CurrentCamera) return;
			const [position] = Workspace.CurrentCamera.WorldToScreenPoint(this.instance.Source.Position);
			FocusThoughtProviderGUI.Fire({
				message: this.instance.Thought.Value,
				position,
			});
		});
		trigger.onExit.Connect(() => {
			unfocusThoughtProviderGUI.Fire();
		});
	}
}
