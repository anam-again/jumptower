import { CombineStates } from "@rbxts/reflex";
import { playersSlice } from "./slices/players";
import { clientSlice } from "./slices/client";
import { gamestateSlice } from "./slices/gamestate";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	players: playersSlice,
	client: clientSlice,
	gamestate: gamestateSlice,
};
