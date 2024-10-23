import { Service } from "@flamework/core";

@Service({})
export class CommandsService {
	teleportPlayerToPart(player: Player, part: BasePart) {
		if (player.Character?.PrimaryPart) {
			player.Character.PrimaryPart.Position = part.Position.add(
				new Vector3(0, part.Size.Y / 2 + player.Character.GetBoundingBox()[1].Y / 2, 0),
			);
		}
	}
}
