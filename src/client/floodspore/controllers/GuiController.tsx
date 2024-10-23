import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { store } from "client/common/store";
import PlayerGUIApp from "client/floodspore/ui/apps/PlayerGUI/App";

@Controller({})
export class GuiController implements OnStart {
	private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

	onStart() {
		const root = createRoot(new Instance("Folder"));
		root.render(
			createPortal(
				<ReflexProvider producer={store}>
					<PlayerGUIApp />
				</ReflexProvider>,
				this.playerGui,
			),
		);
	}
}
