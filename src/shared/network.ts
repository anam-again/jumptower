/* eslint-disable no-unused-vars */
import { Networking } from "@flamework/networking";
import { BroadcastAction } from "@rbxts/reflex";
import { PlayerData } from "./store/slices/players/types";
import { Setting } from "./configs/Settings";

// Client->Server
interface ServerEvents {
	reflex: {
		start: () => void;
	};

	toggleSetting: (setting: Setting) => void;
	/**
	 * Fired by a client when they hit a spore
	 * @param position The assumed position of the spore shot. This needs to be validated by server
	 */
	clientKillSpore: (position: Vector3) => void;
}

interface ServerFunctions {}

// Server->Client
interface ClientEvents {
	reflex: {
		dispatch: (actions: Array<BroadcastAction>) => void;
		hydrate: (actions: PlayerData) => void;
		start: () => void;
	};
}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
