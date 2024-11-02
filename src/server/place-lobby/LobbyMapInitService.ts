import { OnStart, Service } from "@flamework/core";

import { PlaceTeleporterExtension } from "server/common/components/extensions/PlaceTeleporterExtension";
import { DoubletapService } from "server/common/services/DoubletapService";
import { PlaceIds } from "shared/constants";
import { getWorkspaceInstance } from "shared/utils/workspace";

@Service({})
export class LobbyMapInitService implements OnStart {
	constructor(private DoubletapService: DoubletapService) {}
	onStart(): void {
		getWorkspaceInstance(["Map", "Baseplate"], "BasePart").Destroy();

		new PlaceTeleporterExtension(getWorkspaceInstance(["Map", "Lobby", "SandyTeleporter"], "Part"), {
			targetPlaceId: PlaceIds.Sandy,
			eventLogMessage: "Teleporting you to [floodspore.sandy]",
			DoubletapService: this.DoubletapService,
		});

		new PlaceTeleporterExtension(getWorkspaceInstance(["Map", "Lobby", "SpaceTestTeleporter"], "Part"), {
			targetPlaceId: PlaceIds.SpaceTest,
			eventLogMessage: "Teleporting you to [floodspore.spacetest]",
			DoubletapService: this.DoubletapService,
		});
	}
}
