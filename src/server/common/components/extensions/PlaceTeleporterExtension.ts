import { Players, TeleportService } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { DoubletapService } from "server/common/services/DoubletapService";
import { teleportPlayerToPart } from "server/common/utils/commands";
import { createGUID } from "shared/utils/guid";

interface PlaceTeleporterExtensionProps {
	targetPlaceId: number;
}

export class PlaceTeleporterExtension {
	public parent: BasePart | undefined;
	private targetPlaceId: number;
	private id = createGUID();

	constructor(parent: BasePart, props: PlaceTeleporterExtensionProps) {
		this.parent = parent;
		this.targetPlaceId = props.targetPlaceId;

		this.parent.Touched.Connect((part) => {
			const player = Players.GetPlayerFromCharacter(part.Parent);
			if (player) {
				if (DoubletapService.isDoubletapped(`${player.UserId}`, 5000)) {
					TeleportService.TeleportAsync(this.targetPlaceId, [player]);
				}
			}
		});
	}
}
