import React from "@rbxts/react";
import { Make } from "@rbxts/altmake";
import MovableWindow from "client/common/ui/components/movableWindow";
import { createGUID } from "shared/utils/guid";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import ScreenGui from "client/common/ui/components/screenGui";
import { COLOURS, SOUNDS } from "shared/constants";
import { Workspace } from "@rbxts/services";
import { DoubletapController } from "client/common/controllers/DoubletapController";

interface TextLogExtensionProps {
	title?: string;
	body?: JSX.Element;
	DoubletapController: DoubletapController;
}

export class TextLogExtension {
	private readonly parent!: BasePart;
	private readonly id = createGUID();

	private isOpened = false;
	private highlight: undefined | Highlight;

	private click1!: Sound;
	private click2!: Sound;

	constructor(parent: BasePart, props: TextLogExtensionProps) {
		this.parent = parent;
		const clickDetector = Make("ClickDetector", {
			Parent: this.parent,
		});
		clickDetector.MouseClick.Connect((player) => {
			// TODO
			if (props.DoubletapController.isDoubletapped(this.id, 2000)) {
				this.click1.Play();
				this.addWindow(player, props);
			}
		});
		clickDetector.MouseHoverEnter.Connect(() => {
			this.highlight = Make("Highlight", {
				Parent: this.parent,
				Adornee: this.parent,
				FillColor: COLOURS.UIBorderContrast,
				FillTransparency: 0.1,
				DepthMode: Enum.HighlightDepthMode.Occluded,
			});
		});
		clickDetector.MouseHoverLeave.Connect(() => {
			if (this.highlight) {
				this.highlight.Destroy();
			}
		});

		this.click1 = Make("Sound", {
			Parent: Workspace,
			SoundId: SOUNDS.Click1,
		});
		this.click2 = Make("Sound", {
			Parent: Workspace,
			SoundId: SOUNDS.Click2,
		});
	}

	private addWindow(player: Player, props: TextLogExtensionProps) {
		if (this.isOpened) return;
		this.isOpened = true;
		const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
		const folder = Make("Folder", {
			Parent: playerGui,
			Name: "TextLogWindow",
		});
		const root = createRoot(folder);

		root.render(
			createPortal(
				<ScreenGui>
					<MovableWindow
						isOpen={true}
						onCloseClicked={() => {
							this.click2.Play();
							this.isOpened = false;
							folder.Destroy();
						}}
						title={props.title}
					>
						{props.body}
					</MovableWindow>
				</ScreenGui>,
				folder,
			),
		);
		return;
	}
}
