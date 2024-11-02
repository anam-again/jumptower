import { Players, TeleportService } from "@rbxts/services";

import { Events } from "server/common/network";
import { DoubletapService } from "server/common/services/DoubletapService";

interface PlaceTeleporterExtensionProps {
	targetPlaceId: number;
	eventLogMessage?: string;
	DoubletapService: DoubletapService;
}

export class PlaceTeleporterExtension {
	public parent: BasePart | undefined;
	private targetPlaceId: number;

	constructor(parent: BasePart, props: PlaceTeleporterExtensionProps) {
		this.parent = parent;
		this.targetPlaceId = props.targetPlaceId;

		this.parent.Touched.Connect((part) => {
			const player = Players.GetPlayerFromCharacter(part.Parent);
			if (player) {
				if (props.DoubletapService.isDoubletapped(`${player.UserId}`, 5000)) {
					const message = props.eventLogMessage ?? "Teleporting you somewhere new...";
					Events.playerIsTeleporting(player, message);
					Events.writeToEventLog(player, message);
					TeleportService.TeleportAsync(this.targetPlaceId, [player]);
				}
			}
		});
	}
}
