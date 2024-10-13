import { SharedState } from "..";

export const selectSporeCount = () => {
	return (state: SharedState) => {
		return state.gamestate.spores.sporeCount;
	};
};
