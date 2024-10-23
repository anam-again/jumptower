import { Flamework } from "@flamework/core";
import { FloodsporePlaces, Globals } from "shared/globals";

if (Globals.Place in FloodsporePlaces) {
	Flamework.addPaths("src/client/floodspore/components");
	Flamework.addPaths("src/client/floodspore/controllers");
}

Flamework.addPaths("src/shared/components");
Flamework.ignite();
