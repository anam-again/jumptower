// import { RunService, TextChatService } from "@rbxts/services";
// import { TriggerAreaExtension } from "client/common/controllers/extensions/TriggerAreaExtension";
// import { raceAndTerminateTasks } from "shared/utils/task";

// const DEFAULT_DELAY_UNTIL_NEXT = 8;

// interface Dialogue {
// 	text: string;
// 	delayUntilNext?: number;
// }
// interface Props {
// 	dialogue: Array<Dialogue>;
// }

// const TRIGGER_AREA_ENTER_WAIT_TIME = 1;

// export class StaticNPCExtension {
// 	private readonly trigger!: BasePart;
// 	private readonly triggerArea!: TriggerAreaExtension;
// 	private readonly textSource!: BasePart;
// 	private readonly props!: Props;

// 	private dialogueIndex = 0;

// 	constructor(trigger: BasePart, triggerArea: BasePart, textSource: BasePart, props: Props) {
// 		this.trigger = trigger;
// 		this.triggerArea = new TriggerAreaExtension(triggerArea);
// 		this.textSource = textSource;
// 		this.props = props;

// 		this.triggerArea.addTrackedObject(trigger);
// 		this.triggerArea.onEnter.Connect(() => {
// 			this.onPlayerEntered();
// 		});
// 	}

// 	onPlayerEntered() {
// 		const taskList = raceAndTerminateTasks([
// 			() => {
// 				task.wait(TRIGGER_AREA_ENTER_WAIT_TIME);
// 			},
// 			() => {
// 				this.triggerArea.onExit.Wait();
// 			},
// 		]);
// 		if (taskList === 1) return; // Player exited trigger too fast
// 		raceAndTerminateTasks([
// 			() => {
// 				while (this.dialogueIndex < this.props.dialogue.size()) {
// 					const dialogue = this.props.dialogue[this.dialogueIndex];
// 					TextChatService.DisplayBubble(this.textSource, dialogue.text);
// 					task.wait(dialogue.delayUntilNext ?? DEFAULT_DELAY_UNTIL_NEXT);
// 					this.dialogueIndex++;
// 				}
// 			},
// 			() => {
// 				this.triggerArea.onExit.Wait();
// 			},
// 		]);
// 	}
// }
