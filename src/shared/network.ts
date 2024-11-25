import { Networking } from "@flamework/networking";
import { MirroredState, PlayerSounds, PlayerState } from "./types";

// Client->Server
interface ServerEvents {
	updatePlayerState: (playerState: PlayerState) => void;
	mirrorPlayerState: (mirrorState: MirroredState) => void;

	playPlayerSound: (playerSound: PlayerSounds) => void;
	togglePlayerSound: (playerSound: PlayerSounds, active: boolean) => void;
}

interface ServerFunctions {}

// Server->Client
interface ClientEvents {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
