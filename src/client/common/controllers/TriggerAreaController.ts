// import { Controller, OnStart } from "@flamework/core";
// import { TriggerAreaExtension } from "./extensions/TriggerAreaExtension";
// import { MarketplaceService, Players, Workspace } from "@rbxts/services";
// import { getWorkspaceInstance } from "shared/utils/workspace";
// import { PASSS } from "shared/constants";

// @Controller({})
// export class TriggerAreaController implements OnStart {
// 	onStart(): void {
// 		Players.LocalPlayer.CharacterAdded.Connect((character) => {
// 			const humanoidRootPart = character.WaitForChild("HumanoidRootPart") as BasePart;
// 			const donateTrigger = new TriggerAreaExtension(
// 				getWorkspaceInstance(["Triggers", "DonateTrigger"], "BasePart"),
// 			);
// 			donateTrigger.addTrackedObject(humanoidRootPart);
// 			donateTrigger.onEnter.Connect(() => {
// 				const passInfo = MarketplaceService.GetProductInfo(PASSES.MINISupporter, Enum.InfoType.GamePass);
// 				print(passInfo);
// 				if (passInfo.IsForSale) {
// 					const hasPass = MarketplaceService.UserOwnsGamePassAsync(
// 						Players.LocalPlayer.UserId,
// 						PASSES.MINISupporter,
// 					);
// 					if (!hasPass) {
// 						MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, PASSES.MINISupporter);
// 					}
// 				}
// 			});
// 		});
// 	}
// }
