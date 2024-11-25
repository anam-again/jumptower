import { OnStart, Service } from "@flamework/core";
import { Events } from "../network";
import { Facing, MirroredState, PlayerState } from "shared/types";
import { Players } from "@rbxts/services";
import { Make } from "@rbxts/altmake";
import { getOrWaitForServerCharacter } from "../utils";

@Service({})
export class PlayerMovementStateService implements OnStart {
	onStart(): void {
		Players.PlayerAdded.Connect((player) => {
			const character = getOrWaitForServerCharacter(player);
			Make("Folder", {
				Name: "PlayerMovementStateService",
				Parent: character,
			});
			this.makeHimIntangible(character);
		});
		Events.mirrorPlayerState.connect((player, mirrorState) => {
			this.mirrorPlayerState(player, mirrorState);
		});
	}

	private Y_OFFSET = 0.5;
	private Z_OFFSET = -7;

	mirrorPlayerState(player: Player, playerState: MirroredState) {
		const character = player.Character;
		if (!character) return;
		switch (playerState.facing) {
			case Facing.Up:
				player.Character?.PivotTo(
					new CFrame(playerState.position[0], playerState.position[1] + this.Y_OFFSET, this.Z_OFFSET).mul(
						CFrame.Angles(0, 0, 0),
					),
				);
				break;
			case Facing.Down:
				player.Character?.PivotTo(
					new CFrame(playerState.position[0], playerState.position[1] + this.Y_OFFSET, this.Z_OFFSET).mul(
						CFrame.Angles(0, math.pi, 0),
					),
				);
				break;
			case Facing.Left:
				player.Character?.PivotTo(
					new CFrame(playerState.position[0], playerState.position[1] + this.Y_OFFSET, this.Z_OFFSET).mul(
						CFrame.Angles(0, math.pi / 2, 0),
					),
				);
				break;
			case Facing.Right:
				player.Character?.PivotTo(
					new CFrame(playerState.position[0], playerState.position[1] + this.Y_OFFSET, this.Z_OFFSET).mul(
						CFrame.Angles(0, math.pi * 1.5, 0),
					),
				);
				break;
		}
	}

	makeHimIntangible(character: Instance) {
		if (character.IsA("BasePart")) {
			character.CanCollide = false;
			character.CanTouch = false;
			character.CanQuery = false;
			character.CollisionGroup = "intangible";
		}
		character.GetChildren().forEach((child) => {
			this.makeHimIntangible(child);
		});
	}
}
