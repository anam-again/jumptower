import { OnStart, Service } from "@flamework/core";
import { Modify } from "@rbxts/altmake";
import { PlaceTeleporterExtension } from "server/common/components/extensions/PlaceTeleporterExtension";
import { GiveToolToPlayerPartExtension } from "shared/components/Extensions/GiveToolToPlayerPartExtension";
import { PlaceIds } from "shared/constants";
import { getWorkspaceInstance } from "shared/utils/workspace";

@Service({})
export class SandyMapInitService implements OnStart {
	onStart(): void {
		getWorkspaceInstance(["Map", "InvisibleWalls"], "Folder")
			.GetChildren()
			.forEach((part) => {
				if (!part.IsA("BasePart")) return;
				Modify(part, {
					Transparency: 1,
				});
			});

		new GiveToolToPlayerPartExtension(
			getWorkspaceInstance(["Map", "ActiveObjects", "GiveLaserBlaster", "Part"], "Part"),
			{
				tool: getWorkspaceInstance(["Objects", "Tool_BasicBlaster"], "Tool").Clone(),
			},
		);

		new PlaceTeleporterExtension(getWorkspaceInstance(["Map", "ActiveObjects", "ReturnToSpawn"], "Part"), {
			targetPlaceId: PlaceIds.Lobby,
		});
	}
}
