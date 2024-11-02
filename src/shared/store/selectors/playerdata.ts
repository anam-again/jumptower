import { SharedState } from "..";

export const selectPlayerDataSettings = (playerId: number) => {
	return (state: SharedState) => {
		return state.players.playerData[playerId]?.settings;
	};
};
