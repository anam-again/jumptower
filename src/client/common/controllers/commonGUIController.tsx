import { Controller, OnStart } from "@flamework/core";
import React from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import { Make } from "@rbxts/altmake";

import CommonGUIApp from "../ui/CommonGUIApp";
import LoadingGUIApp from "../ui/LoadingGUIApp";
import ThoughtProviderGUIApp from "../ui/ThoughtProvidorGUIApp";
import ControlsGUIApp from "../ui/ControlsGUIApp";
import { PlayerMovementController } from "./PlayerMovementController";

@Controller({})
export class CommonGUIController implements OnStart {
	constructor(private PlayerMovementController: PlayerMovementController) {}

	private playerGui = Players.LocalPlayer.WaitForChild("PlayerGui");

	onStart() {
		const loadingFolder = Make("Folder", {
			Parent: this.playerGui,
			Name: "LoadingGUIApp",
		});
		const loadingRoot = createRoot(loadingFolder);
		loadingRoot.render(createPortal(<LoadingGUIApp />, loadingFolder, "LoadingGUIApp"));

		const controlsFolder = Make("Folder", {
			Parent: this.playerGui,
			Name: "ControlsGUIApp",
		});
		const controlsRoot = createRoot(controlsFolder);
		controlsRoot.render(
			createPortal(
				<ControlsGUIApp PlayerMovementController={this.PlayerMovementController} />,
				controlsFolder,
				"ControlsGUIApp",
			),
		);

		const thoughtProviderFolder = Make("Folder", {
			Parent: this.playerGui,
			Name: "ThoughtProviderGUIApp",
		});
		const thoughtProviderRoot = createRoot(thoughtProviderFolder);
		thoughtProviderRoot.render(
			createPortal(<ThoughtProviderGUIApp />, thoughtProviderFolder, "ThoughtProviderGUIApp"),
		);

		const commonFolder = Make("Folder", {
			Parent: this.playerGui,
			Name: "CommonGUIApp",
		});
		const commonRoot = createRoot(commonFolder);
		commonRoot.render(createPortal(<CommonGUIApp />, commonFolder, "CommonGUIApp"));
	}
}
