import { combineProducers } from "@rbxts/reflex";
import { sporeSlice } from "./spores";

export const gamestateSlice = combineProducers({
	spores: sporeSlice,
});
