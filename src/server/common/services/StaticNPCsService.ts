import { OnStart, Service } from "@flamework/core";
import { Make } from "@rbxts/altmake";

import { TAGS } from "shared/constants";
import { StaticNPCDialogue } from "shared/types";
import { getWorkspaceInstance, writeObjectToFolder } from "shared/utils/workspace";

@Service({})
export class StaticNPCsService implements OnStart {
	private makeStaticNPC(source: Instance, dialogue: Array<StaticNPCDialogue>) {
		const sourceFolder = Make("Folder", { Name: "StaticNPCsService", Parent: source });
		dialogue.forEach((d, i) => {
			const folder = writeObjectToFolder(`dialogue_${tostring(i)}`, d);
			folder.Parent = sourceFolder;
		});
		Make("NumberValue", {
			Parent: sourceFolder,
			Name: "DialogueCount",
			Value: dialogue.size(),
		});
		source.AddTag(TAGS.StaticNPC);
	}

	onStart(): void {
		this.makeStaticNPC(getWorkspaceInstance(["NPCs", "TutorialRadio"], "Instance"), [
			{
				text: "<static>.. [INCOMING MESSAGE] ././..>",
				delayUntilNext: 5,
			},
			{
				text: "Hello? Are you there?",
				delayUntilNext: 2,
			},
			{
				text: "This is Agrippa",
				delayUntilNext: 6,
			},
			{
				text: "kkssh<static>//...b>>..",
				delayUntilNext: 1,
			},
			{
				text: "Can you hurry back to the lab? I got results about the Upper Barrier I need to show you.",
				delayUntilNext: 8,
			},
			{
				text: "I suppose we can discuss more when you're here.",
				delayUntilNext: 10,
			},
			{
				text: "Going down is easy, I have no doubt the way back up will take longer.",
				delayUntilNext: 9,
			},
			{
				text: "You got it. You're smart",
				delayUntilNext: 8,
			},
			{
				text: "I'll monitor your progress when you get further up, I'll see how we can contact eachother.",
				delayUntilNext: 11,
			},
			{
				text: "See you soon.",
				delayUntilNext: 3,
			},
			{
				text: "Oh, I aimed the SAT at your 'mom' in that last village. I don't think I would trust her...",
				delayUntilNext: 3,
			},
			{
				text: "[MESSAGE TERMINATED]",
				delayUntilNext: 3,
			},
		]);

		this.makeStaticNPC(getWorkspaceInstance(["NPCs", "CoolMom"], "Instance"), [
			{
				text: "Hello dear. It's me, your mom.",
				delayUntilNext: 4,
			},
			{
				text: "Welcome home. I missed you and I love you",
				delayUntilNext: 4,
			},
			{
				text: "Could you please go grab the frying-pan from the basement, the stairs are on the left",
				delayUntilNext: 10,
			},
			{
				text: "Of course, you already know where the stairs are.",
				delayUntilNext: 10,
			},
			{
				text: "I'm making you nyan-cakes for dinner tonight",
				delayUntilNext: 12,
			},
			{
				text: "Nyan-nyan",
				delayUntilNext: 3,
			},
			{
				text: "nyan",
				delayUntilNext: 5,
			},
		]);
		this.makeStaticNPC(getWorkspaceInstance(["NPCs", "PitGuy"], "Instance"), [
			{
				text: "Welcome to my sweet little pit",
				delayUntilNext: 8,
			},
			{
				text: "My name is PitGuy but I like to think of myself as more of a Pit-Appreciator, or enjoyer.",
				delayUntilNext: 8,
			},
			{
				text: "It's not easy keeping the pit safe.",
				delayUntilNext: 15,
			},
			{
				text: "Have you heard of hobby tunneling?.",
				delayUntilNext: 2,
			},
			{
				text: "It's a little bit like having a pit, except you also have to dig it too.",
				delayUntilNext: 5,
			},
			{
				text: "It's also a more horizontal than vertical activity usually.",
				delayUntilNext: 7,
			},
			{
				text: "I'm not a fan really.",
				delayUntilNext: 10,
			},
			{
				text: "I love my pit.",
				delayUntilNext: 25,
			},
			{
				text: "Do you think it loves me back?",
				delayUntilNext: 1,
			},
		]);
		this.makeStaticNPC(getWorkspaceInstance(["NPCs", "EndRadio"], "Instance"), [
			{
				text: "kshh<static>[INCOMING MESSAGE].",
				delayUntilNext: 2,
			},
			{
				text: "Hey you're above ground again.",
				delayUntilNext: 3,
			},
			{
				text: "But the game isn't done yet... And the next area isn't created",
				delayUntilNext: 6,
			},
			{
				text: "So..",
				delayUntilNext: 2,
			},
			{
				text: "I guess you win!",
				delayUntilNext: 2,
			},
			{
				text: "Step into the red field to donate to the game",
				delayUntilNext: 5,
			},
			{
				text: "There is a full release coming, but it needs your help to get created!",
				delayUntilNext: 8,
			},
			{
				text: "Thank you for playing!",
				delayUntilNext: 10,
			},
			{
				text: "And great job :) You win!",
				delayUntilNext: 3,
			},
		]);
	}
}
