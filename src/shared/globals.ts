import { Place } from "./readEnv";

export enum Places {
	Lobby = 0,
	Sandy = 1,
}

export const FloodsporePlaces: Array<Places> = [Places.Sandy];

interface GlobalVariables {
	Place: Places;
}

export const Globals: GlobalVariables = {
	Place: tonumber(Place) as Places,
};
