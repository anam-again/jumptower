import { combineProducers } from "@rbxts/reflex";
import { PlayerDataSlice } from "./PlayerData";

export const playersSlice = combineProducers({
	playerData: PlayerDataSlice,
});
