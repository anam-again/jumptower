import { OnStart } from "@flamework/core";
import { BaseComponent, Component } from "@flamework/components";

import { TAGS } from "shared/constants";
import { MarketplaceService, Players } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { raceAndTerminateTasks } from "shared/utils/task";
import { getOrWaitForLocalCharacter } from "../utils";

interface PassPurchaseArea extends BasePart {
	PassPurchaseAreaService: Folder & {
		PassId: NumberValue;
	};
}

const TRIGGER_AREA_ENTER_WAIT_TIME = 1;

@Component({ tag: TAGS.PassPurchaseArea })
export class PassPurchaseAreaComponent extends BaseComponent<{}, PassPurchaseArea> implements OnStart {
	private onExit = new Signal<() => void>();
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
			this.playerRoot.Position.X > this.instance.Position.X - this.instance.Size.X / 2 &&
			this.playerRoot.Position.X < this.instance.Position.X + this.instance.Size.X / 2 &&
			this.playerRoot.Position.Y > this.instance.Position.Y - this.instance.Size.Y / 2 &&
			this.playerRoot.Position.Y < this.instance.Position.Y + this.instance.Size.Y / 2 &&
			this.playerRoot.Position.Z > this.instance.Position.Z - this.instance.Size.Z / 2 &&
			this.playerRoot.Position.Z < this.instance.Position.Z + this.instance.Size.Z / 2
		);
	}

	private checkCollisions() {
		while (true) {
			task.wait(0.2);
			if (this.playerIsInField === false && this.isPlayerInField()) {
				this.playerIsInField = true;
				this.onPlayerEntered();
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
		const passInfo = MarketplaceService.GetProductInfo(
			this.instance.PassPurchaseAreaService.PassId.Value,
			Enum.InfoType.GamePass,
		);
		if (passInfo.IsForSale) {
			const hasPass = MarketplaceService.UserOwnsGamePassAsync(
				Players.LocalPlayer.UserId,
				this.instance.PassPurchaseAreaService.PassId.Value,
			);
			if (!hasPass) {
				MarketplaceService.PromptGamePassPurchase(
					Players.LocalPlayer,
					this.instance.PassPurchaseAreaService.PassId.Value,
				);
			}
		}
	}
}
