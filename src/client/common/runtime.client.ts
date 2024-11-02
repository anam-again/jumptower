import { Flamework } from "@flamework/core";

import { FloodsporePlaces, Globals, Places } from "shared/globals";

if (Globals.Place in FloodsporePlaces) {
	Flamework.addPaths("src/client/floodspore/components");
	Flamework.addPaths("src/client/floodspore/controllers");
}

switch (Globals.Place) {
	case Places.Lobby:
		Flamework.addPaths("src/client/lobby/controllers");
		break;
	default:
		break;
}

Flamework.addPaths("src/shared/components");
Flamework.addPaths("src/client/common/controllers");

Flamework.ignite();
