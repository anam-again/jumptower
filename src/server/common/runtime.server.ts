import { Flamework } from "@flamework/core";
import { FloodsporePlaces, Globals, Places } from "shared/globals";

if (Globals.Place in FloodsporePlaces) {
	Flamework.addPaths("src/server/floodspore/components");
	Flamework.addPaths("src/server/floodspore/services");
}

switch (Globals.Place) {
	case Places.Lobby:
		Flamework.addPaths("src/server/place-lobby");
		break;
	case Places.Sandy:
		Flamework.addPaths("src/server/place-sandy");
		break;
	case Places.SpaceTest:
		Flamework.addPaths("src/server/place-spacetest");
		break;
	default:
		throw error();
}

Flamework.addPaths("src/shared/components");
Flamework.addPaths("src/server/common/services");
Flamework.ignite();
