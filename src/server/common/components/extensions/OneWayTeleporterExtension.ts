import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { teleportPlayerToPart } from "server/common/utils/commands";

interface OneWayTeleporterExtensionProps {
	targetPart?: BasePart;
}

export class OneWayTeleporterExtension {
	public parent: BasePart | undefined;
	private targetPart?: BasePart;

	public onTargetPartChanged = new Signal<(part: BasePart | undefined) => void>();
	public onPlayerTeleported = new Signal<(player: Player) => void>();

	constructor(parent: BasePart, props: OneWayTeleporterExtensionProps) {
		this.parent = parent;
		this.targetPart = props.targetPart;
		task.spawn(() => {
			this.mainLoop();
		});
	}

	private mainLoop() {
		while (this.parent) {
			const touched = this.parent.Touched.Connect((part) => {
				const player = Players.GetPlayerFromCharacter(part.Parent);
				if (player) {
					this.teleportPlayer(player);
				}
			});
			const newTarget = this.onTargetPartChanged.Wait()[0];
			touched.Disconnect();
			this.targetPart = newTarget;
		}
	}

	private teleportPlayer(player: Player) {
		if (!this.targetPart) return;
		if (player.Character?.PrimaryPart) {
			teleportPlayerToPart(player, this.targetPart);
			this.onPlayerTeleported.Fire(player);
		}
	}

	public setTargetPart(part: BasePart | undefined): void {
		this.onTargetPartChanged.Fire(part);
	}
}
