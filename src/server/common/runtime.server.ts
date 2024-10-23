import { Flamework } from "@flamework/core";
import { FloodsporePlaces, Globals } from "shared/globals";

if (Globals.Place in FloodsporePlaces) {
	Flamework.addPaths("src/server/floodspore/components");
	Flamework.addPaths("src/server/floodspore/services");
}

Flamework.addPaths("src/shared/components");
Flamework.ignite();
