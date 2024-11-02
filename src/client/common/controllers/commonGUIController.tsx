import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";

import { store } from "client/common/store";

import CommonGUIApp from "../ui/app/CommonGUIApp";

@Controller({})
export class CommonGUIController implements OnStart {
	private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

	onStart() {
		const root = createRoot(new Instance("Folder"));
		root.render(
			createPortal(
				<ReflexProvider producer={store}>
					<CommonGUIApp />
				</ReflexProvider>,
				this.playerGui,
				"CommonPlayerGUI",
			),
		);
	}
}
