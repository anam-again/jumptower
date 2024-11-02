import { Controller, OnStart } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";

import { store } from "client/common/store";
import FloodsporeGuiApp from "client/floodspore/ui/FloodsporeGUIApp";

@Controller({})
export class FloodsporeGUIController implements OnStart {
	private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

	onStart() {
		const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;
		const folder = Make("Folder", {
			Parent: playerGui,
			Name: "FloodsporeGUIController",
		});
		const root = createRoot(folder);
		root.render(
			createPortal(
				<ReflexProvider producer={store}>
					<FloodsporeGuiApp />
				</ReflexProvider>,
				this.playerGui,
			),
		);
	}
}
