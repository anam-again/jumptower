import { OnStart, Service } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { DoubletapService } from "./DoubletapService";
import { createGUID } from "shared/utils/guid";
import Signal from "@rbxts/signal";
import { Events } from "server/common/network";
import { OneWayTeleporterExtension } from "server/floodspore/components/Extensions/OneWayTeleporterExtension";
import { FloodsporeGameControllerService, GAME_CONFIG } from "./FloodsporeGameControllerService";

enum GameState {
	Lobby,
	// LobbyVoting,
	LobbyMapSelected,
	LobbyCountdown,
	FinalGameSetup,
	InGame,
}

@Service({})
export class GamestateService implements OnStart {
	private id = createGUID();
	private gamestate: GameState = GameState.Lobby;

	private lobbyTeleporter!: OneWayTeleporterExtension;

	public onLobbyMapSelected = new Signal<() => void>();

	constructor(private floodsporeGameControllerService: FloodsporeGameControllerService) {}

	onStart(): void {
		this.lobbyTeleporter = new OneWayTeleporterExtension(Workspace.Map.Lobby.Teleporter, { targetPart: undefined });
		this.mainStateLoop();
	}

	mainStateLoop() {
		while (true) {
			this.lobbySelectMap();
			this.lobbyCountdown();
			this.finalGameSetup();
			this.floodsporeGameControllerService.startGame(GAME_CONFIG.Normal, {
				lobbyTeleporter: this.lobbyTeleporter,
			});
		}
	}

	lobbySelectMap() {
		Events.writeToEventLog(Players.GetPlayers(), "Please vote for a map");
		const selector = Workspace.Map.Lobby.Teleporter.Touched.Connect((part) => {
			if ((DoubletapService.isDoubletapped(`teleporter.${this.id}`), 10)) {
				this.onLobbyMapSelected.Fire();
			}
		});
		this.onLobbyMapSelected.Wait();
		selector.Disconnect();
	}

	lobbyCountdown() {
		task.spawn(() => {
			// game setup here
		});
		for (let i = 5; i > 0; i--) {
			Events.writeToEventLog(Players.GetPlayers(), `Game starting in ${i}...`);
			task.wait(1);
		}
		Events.writeToEventLog(Players.GetPlayers(), "Get to the teleporter!");
	}

	finalGameSetup() {
		//
	}
}
