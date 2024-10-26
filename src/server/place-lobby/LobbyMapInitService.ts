import { OnStart, Service } from "@flamework/core";
import { PlaceTeleporterExtension } from "server/common/components/extensions/PlaceTeleporterExtension";
import { PlaceIds } from "shared/constants";
import { getWorkspaceInstance } from "shared/utils/workspace";

@Service({})
export class LobbyMapInitService implements OnStart {
	onStart(): void {
		getWorkspaceInstance(["Map", "Baseplate"], "BasePart").Destroy();

		new PlaceTeleporterExtension(getWorkspaceInstance(["Map", "Lobby", "SandyTeleporter"], "Part"), {
			targetPlaceId: PlaceIds.Sandy,
		});

		new PlaceTeleporterExtension(getWorkspaceInstance(["Map", "Lobby", "SpaceTestTeleporter"], "Part"), {
			targetPlaceId: PlaceIds.SpaceTest,
		});
	}
}
