// import { Controller, OnStart } from "@flamework/core";
// import { StaticNPCExtension } from "./extensions/StaticNPCExtension";
// import { getWorkspaceInstance } from "shared/utils/workspace";
// import { Players } from "@rbxts/services";

// @Controller({})
// export class StaticNPCsController implements OnStart {
// 	onStart(): void {
// 		Players.LocalPlayer.CharacterAdded.Connect((character) => {
// 			task.wait(7); // idk lol
// 			const HumanoidRootPart = character.WaitForChild("HumanoidRootPart") as BasePart;
// 			if (!HumanoidRootPart) throw error("No humanoid root part in StaticNPCsController for player");
// 			new StaticNPCExtension(
// 				HumanoidRootPart,
// 				getWorkspaceInstance(["NPCs", "PitGuyTrigger"], "BasePart"),
// 				getWorkspaceInstance(["NPCs", "PitGuy", "Head"], "BasePart"),
// 				{
// 					dialogue: [
// 						{
// 							text: "Welcome to my sweet little pit",
// 						},
// 						{
// 							text: "My name is PitGuy but I like to think of myself as more of a Pit-Appreciator, or enjoyer.",
// 						},
// 						{
// 							text: "It's not easy keeping the pit safe.",
// 							delayUntilNext: 15,
// 						},
// 						{
// 							text: "Have you heard of hobby tunneling?.",
// 							delayUntilNext: 2,
// 						},
// 						{
// 							text: "It's a little bit like having a pit, except you also have to dig it too.",
// 							delayUntilNext: 5,
// 						},
// 						{
// 							text: "It's also a more horizontal than vertical activity usually.",
// 							delayUntilNext: 7,
// 						},
// 						{
// 							text: "I'm not a fan really.",
// 							delayUntilNext: 10,
// 						},
// 						{
// 							text: "I love my pit.",
// 							delayUntilNext: 25,
// 						},
// 						{
// 							text: "Do you think it loves me back?",
// 						},
// 					],
// 				},
// 			);
// 			new StaticNPCExtension(
// 				HumanoidRootPart,
// 				getWorkspaceInstance(["NPCs", "TutorialRadioTrigger"], "BasePart"),
// 				getWorkspaceInstance(["NPCs", "TutorialRadio", "Hitbox"], "BasePart"),
// 				{

// 				},
// 			);
// 			new StaticNPCExtension(
// 				HumanoidRootPart,
// 				getWorkspaceInstance(["NPCs", "HelpfulTrigger1"], "BasePart"),
// 				getWorkspaceInstance(["NPCs", "Helpful", "Head"], "BasePart"),
// 				{
// 					dialogue: [
// 						{
// 							text: "Hey",
// 							delayUntilNext: 3,
// 						},
// 						{
// 							text: "Hold the jump button to jump higher.",
// 							delayUntilNext: 10,
// 						},
// 					],
// 				},
// 			);
// 			new StaticNPCExtension(
// 				HumanoidRootPart,
// 				getWorkspaceInstance(["NPCs", "HelpfulTrigger2"], "BasePart"),
// 				getWorkspaceInstance(["NPCs", "Helpful", "Head"], "BasePart"),
// 				{
// 					dialogue: [
// 						{
// 							text: "Good Luck out there.",
// 							delayUntilNext: 2,
// 						},
// 						{
// 							text: "You'll need it...",
// 							delayUntilNext: 4,
// 						},
// 					],
// 				},
// 			);
// 			new StaticNPCExtension(
// 				HumanoidRootPart,
// 				getWorkspaceInstance(["NPCs", "CoolMomTrigger"], "BasePart"),
// 				getWorkspaceInstance(["NPCs", "CoolMom", "Head"], "BasePart"),
// 				{
// 					dialogue: [
// 						{
// 							text: "Hello dear. It's me, your mom.",
// 							delayUntilNext: 4,
// 						},
// 						{
// 							text: "Welcome home. I missed you and I love you",
// 							delayUntilNext: 4,
// 						},
// 						{
// 							text: "Could you please go grab the frying-pan from the basement, the stairs are on the left",
// 							delayUntilNext: 10,
// 						},
// 						{
// 							text: "Of course, you already know where the stairs are.",
// 							delayUntilNext: 10,
// 						},
// 						{
// 							text: "I'm making you nyan-cakes for dinner tonight",
// 							delayUntilNext: 12,
// 						},
// 						{
// 							text: "Nyan-nyan",
// 							delayUntilNext: 3,
// 						},
// 						{
// 							text: "nyan",
// 						},
// 					],
// 				},
// 			);
// 			new StaticNPCExtension(
// 				HumanoidRootPart,
// 				getWorkspaceInstance(["NPCs", "EndRadioTrigger"], "BasePart"),
// 				getWorkspaceInstance(["NPCs", "EndRadio", "Hitbox"], "BasePart"),
// 				{
// 					dialogue: [
// 						{
// 							text: "kshh<static>[INCOMING MESSAGE].",
// 							delayUntilNext: 2,
// 						},
// 						{
// 							text: "Hey you're above ground again.",
// 							delayUntilNext: 3,
// 						},
// 						{
// 							text: "But the game isn't done yet... And the next area isn't created",
// 							delayUntilNext: 6,
// 						},
// 						{
// 							text: "So..",
// 							delayUntilNext: 2,
// 						},
// 						{
// 							text: "I guess you win!",
// 							delayUntilNext: 2,
// 						},
// 						{
// 							text: "Step into the red field to donate to the game",
// 							delayUntilNext: 5,
// 						},
// 						{
// 							text: "There is a full release coming, but it needs your help to get created!",
// 							delayUntilNext: 8,
// 						},
// 						{
// 							text: "Thank you for playing!",
// 							delayUntilNext: 10,
// 						},
// 						{
// 							text: "And great job :) You win!",
// 							delayUntilNext: 3,
// 						},
// 					],
// 				},
// 			);
// 		});
// 	}
// }
