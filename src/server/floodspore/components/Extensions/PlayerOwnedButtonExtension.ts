import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { DoubletapService } from "server/floodspore/services/DoubletapService";
import { createGUID } from "shared/utils/guid";

export class PlayerOwnedButtonExtension {
	private readonly parent!: BasePart;
	private readonly id = createGUID();

	public owner: Player | undefined;
	public onOwnerPressed = new Signal<(_: BasePart) => void>();
	public otherPlayerPressed = new Signal<(_: Player) => void>();

	constructor(parent: BasePart) {
		this.parent = parent;
		this.setCollisions();
	}

	setCollisions() {
		this.parent.Touched.Connect((part) => {
			if (DoubletapService.isDoubletapped(this.id)) {
				const player = Players.GetPlayerFromCharacter(part.Parent);
				if (player) {
					if (player === this.owner) {
						this.onOwnerPressed.Fire(this.parent);
					} else {
						this.otherPlayerPressed.Fire(player);
					}
				}
			}
		});
	}

	setOwner(part: Player | BasePart) {
		if (part.IsA("BasePart")) {
			const player = Players.GetPlayerFromCharacter(part.Parent);
			this.owner = player;
		} else if (part.IsA("Player")) {
			this.owner = part;
		}
	}
}
