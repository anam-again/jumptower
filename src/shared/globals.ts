import { Place } from "./readEnv";

export enum Places {
	Tower = 0,
}

interface GlobalVariables {
	Place: Places;
}

export const Globals: GlobalVariables = {
	Place: tonumber(Place) as Places,
};
