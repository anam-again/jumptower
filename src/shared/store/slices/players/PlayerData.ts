import { createProducer } from "@rbxts/reflex";

export interface Settings {
	eventLogOpen: boolean;
	theoreticalSetting: boolean;
}

export interface PlayerData {
	settings: Settings;
}

export const initialPlayerData: PlayerData = {
	settings: {
		eventLogOpen: true,
		theoreticalSetting: false,
	},
};

type PlayerDataRecords = Record<number, PlayerData | undefined>;

const initialPlayerDataRecords: PlayerDataRecords = {};

export const PlayerDataSlice = createProducer(initialPlayerDataRecords, {
	deletePlayerData: (state, playerId: number) => {
		return {
			...state,
			[playerId]: undefined,
		};
	},

	putSettings: (state, playerId: number, settings: Settings) => {
		return {
			...state,
			[playerId]: {
				settings: settings,
			},
		};
	},
});
