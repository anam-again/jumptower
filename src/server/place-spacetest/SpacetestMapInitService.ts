import { OnStart, Service } from "@flamework/core";
import { PlaceTeleporterExtension } from "server/common/components/extensions/PlaceTeleporterExtension";
import { GiveToolToPlayerPartExtension } from "shared/components/Extensions/GiveToolToPlayerPartExtension";
import { PlaceIds } from "shared/constants";
import { getWorkspaceInstance } from "shared/utils/workspace";

@Service({})
export class SandyMapInitService implements OnStart {
	onStart(): void {
		new GiveToolToPlayerPartExtension(
			getWorkspaceInstance(["Map", "Map_Testing", "temp", "GiveLaserButton"], "Part"),
			{
				tool: getWorkspaceInstance(["Objects", "Tool_BasicBlaster"], "Tool").Clone(),
			},
		);

		new PlaceTeleporterExtension(getWorkspaceInstance(["Map", "Map_Testing", "ReturnToSpawn"], "Part"), {
			targetPlaceId: PlaceIds.Lobby,
		});

		getWorkspaceInstance(["Map", "Baseplate"], "Part").Destroy();
	}
}
