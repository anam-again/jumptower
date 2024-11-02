import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
import { PlayerData, Settings } from "./store/slices/players/PlayerData";

// Client->Server
interface ServerEvents {
	reflex: {
		start: () => void;
	};

	/**
	 * Fired by a client when they hit a spore
	 * @param position The assumed position of the spore shot. This needs to be validated by server
	 */
	clientKillSpore: (position: Vector3) => void;
	deployDropship: (dropPod: Model) => void;

	setPlayerSettings: (settings: Settings) => void;
}

interface ServerFunctions {}

// Server->Client
interface ClientEvents {
	reflex: {
		dispatch: (actions: Array<BroadcastAction>) => void;
		hydrate: (actions: PlayerData) => void;
		start: () => void;
	};
	writeToEventLog: (message: string) => void;
	playerIsTeleporting: (message: string) => void;
	playerFinishedTeleporting: () => void;
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
