import { Networking } from "@flamework/networking";

// Client->Server
interface ServerEvents {
	action_right: (inputState: Enum.UserInputState) => void;
	action_left: (inputState: Enum.UserInputState) => void;
	action_down: (inputState: Enum.UserInputState) => void;
	action_up: (inputState: Enum.UserInputState) => void;
	action_jump: (inputState: Enum.UserInputState) => void;
}

interface ServerFunctions {}

// Server->Client
interface ClientEvents {}

interface ClientFunctions {}

export const GlobalEvents = Networking.createEvent<ServerEvents, ClientEvents>();
export const GlobalFunctions = Networking.createFunction<ServerFunctions, ClientFunctions>();
