import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { Make } from "@rbxts/altmake";

import CommonGUIApp from "../ui/app/CommonGUIApp";

@Controller({})
export class CommonGUIController implements OnStart {
	private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

	onStart() {
		const folder = Make("Folder", {
			Parent: this.playerGui,
			Name: "CommonPlayerGui",
		});
		const root = createRoot(folder);
		root.render(createPortal(<CommonGUIApp />, folder, "CommonPlayerGUI"));
	}
}
