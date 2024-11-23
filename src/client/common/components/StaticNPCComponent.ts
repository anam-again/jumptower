import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/constants";
import { Players, TextChatService } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { raceAndTerminateTasks } from "shared/utils/task";
import { readObjectFromFolder } from "shared/utils/workspace";
import { StaticNPCDialogue } from "shared/types";
import { getOrWaitForLocalCharacter } from "../utils";

interface StaticNPC extends Instance {
	PlayerTriggerArea: BasePart;
	TextSource: BasePart;
	StaticNPCsService: Folder;
}

const DEFAULT_DELAY_UNTIL_NEXT = 8;
const TRIGGER_AREA_ENTER_WAIT_TIME = 1;

@Component({ tag: TAGS.StaticNPC })
export class StaticNPCComponent extends BaseComponent<{}, StaticNPC> implements OnStart {
	private onExit = new Signal<() => void>();
	private dialogueIndex = 0;
	private playerIsInField = false;

	private playerRoot!: BasePart;

	onStart() {
		const character = getOrWaitForLocalCharacter();

		const playerRoot = character.WaitForChild("HumanoidRootPart") as BasePart;
		if (!playerRoot) throw error("Unable to get HumanoidRootPart in StaticNPCComponent");
		this.playerRoot = playerRoot;
		task.spawn(() => {
			this.checkCollisions();
		});
	}

	private isPlayerInField() {
		return (
			this.playerRoot.Position.X >
				this.instance.PlayerTriggerArea.Position.X - this.instance.PlayerTriggerArea.Size.X / 2 &&
			this.playerRoot.Position.X <
				this.instance.PlayerTriggerArea.Position.X + this.instance.PlayerTriggerArea.Size.X / 2 &&
			this.playerRoot.Position.Y >
				this.instance.PlayerTriggerArea.Position.Y - this.instance.PlayerTriggerArea.Size.Y / 2 &&
			this.playerRoot.Position.Y <
				this.instance.PlayerTriggerArea.Position.Y + this.instance.PlayerTriggerArea.Size.Y / 2 &&
			this.playerRoot.Position.Z >
				this.instance.PlayerTriggerArea.Position.Z - this.instance.PlayerTriggerArea.Size.Z / 2 &&
			this.playerRoot.Position.Z <
				this.instance.PlayerTriggerArea.Position.Z + this.instance.PlayerTriggerArea.Size.Z / 2
		);
	}

	private checkCollisions() {
		while (true) {
			task.wait(0.5);
			if (this.playerIsInField === false && this.isPlayerInField()) {
				this.playerIsInField = true;
				task.spawn(() => {
					this.onPlayerEntered();
				});
			} else if (this.playerIsInField === true && !this.isPlayerInField()) {
				this.playerIsInField = false;
				this.onExit.Fire();
			}
		}
	}

	onPlayerEntered() {
		const taskList = raceAndTerminateTasks([
			() => {
				task.wait(TRIGGER_AREA_ENTER_WAIT_TIME);
			},
			() => {
				this.onExit.Wait();
			},
		]);
		if (taskList === 1) return; // Player exited trigger too fast
		raceAndTerminateTasks([
			() => {
				while (true) {
					const dialogueCount = this.instance.StaticNPCsService.WaitForChild("DialogueCount") as NumberValue;
					if (!dialogueCount) break;
					if (this.dialogueIndex >= dialogueCount.Value) break;
					const folder = this.instance.StaticNPCsService.WaitForChild(
						`dialogue_${this.dialogueIndex}`,
					) as Folder;
					if (!folder) break;
					const dialogue = readObjectFromFolder<StaticNPCDialogue>(folder);
					if (!dialogue) break;
					TextChatService.DisplayBubble(this.instance.TextSource, dialogue.text);
					task.wait(dialogue.delayUntilNext ?? DEFAULT_DELAY_UNTIL_NEXT);
					this.dialogueIndex++;
				}
			},
			() => {
				this.onExit.Wait();
			},
		]);
	}
}
