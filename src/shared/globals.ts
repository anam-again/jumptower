import { Place } from "./readEnv";

export enum Places {
	Lobby = 0,
	Sandy = 1,
	SpaceTest = 2,
}

export const FloodsporePlaces: Array<Places> = [Places.Sandy, Places.SpaceTest];

interface GlobalVariables {
	Place: Places;
}

export const Globals: GlobalVariables = {
	Place: tonumber(Place) as Places,
};
