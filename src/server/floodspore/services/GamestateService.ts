import { OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";

import { Events } from "server/common/network";

import { FloodsporeGameControllerService, GAME_CONFIG, GameResult } from "./FloodsporeGameControllerService";

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
	public onLobbyMapSelected = new Signal<() => void>();

	constructor(private floodsporeGameControllerService: FloodsporeGameControllerService) {}

	onStart(): void {
		this.mainStateLoop();
	}

	mainStateLoop() {
		while (true) {
			this.lobbyCountdown();
			this.finalGameSetup();
			this.runGame();
			this.waitTimeBetweenRounds();
		}
	}

	runGame() {
		const result = this.floodsporeGameControllerService.startGame(GAME_CONFIG.Normal);
		switch (result) {
			case GameResult.Critical:
			case GameResult.Timeout:
				Events.writeToEventLog.fire(Players.GetPlayers(), "Wasn't able to defeat spores, mission failed...");
				task.wait(3);
				break;
			case GameResult.Victory:
				Events.writeToEventLog.fire(Players.GetPlayers(), "All spores defeated, great work!");
				task.wait(1);
				break;
			default:
				throw error();
		}
	}

	lobbyCountdown() {
		task.spawn(() => {
			// game setup here
		});
		for (let i = 5; i > 0; i--) {
			Events.writeToEventLog(Players.GetPlayers(), `Game starting in ${i}...`);
			task.wait(1);
		}
		Events.writeToEventLog(Players.GetPlayers(), "Spores are spawning!");
	}

	finalGameSetup() {
		//
	}

	waitTimeBetweenRounds() {
		Events.writeToEventLog.fire(Players.GetPlayers(), "Starting next round in 15 seconds");
		task.wait(15);
	}
}
