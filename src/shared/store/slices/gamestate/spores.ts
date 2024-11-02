import { createProducer } from "@rbxts/reflex";
import { SporeState } from "./types";
const initialState: SporeState = {
	coolBool: true,
	sporeCount: 0,
};

export const sporeSlice = createProducer(initialState, {
	getSporeState: (state) => {
		return {
			...state,
		};
	},

	setSporeCount: (state, count: number) => {
		return {
			...state,
			sporeCount: count,
		};
	},
	addSporeCount: (state, amount: number) => {
		return {
			...state,
			sporeCount: state.sporeCount + amount,
		};
	},
	incrementSporeCount: (state) => {
		return {
			...state,
			sporeCount: state.sporeCount + 1,
		};
	},
	decrementSporeCount: (state) => {
		return {
			...state,
			sporeCount: state.sporeCount - 1,
		};
	},
});
