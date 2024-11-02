import React from "@rbxts/react";
import { Controller, OnStart } from "@flamework/core";

import { TextLogExtension } from "client/common/controllers/extensions/TextLogExtension";
import { getWorkspaceInstance } from "shared/utils/workspace";
import Frame from "client/common/ui/components/frame";
import TextLabel from "client/common/ui/components/textLabel";
import { COLOURS, FONTS } from "shared/constants";
import { DoubletapController } from "client/common/controllers/DoubletapController";

@Controller({})
export class TextLogsController implements OnStart {
	constructor(private DoubletapController: DoubletapController) {}

	private textLog(body: Array<JSX.Element>) {
		return (
			<Frame Size={new UDim2(1, 0, 1, 0)}>
				<Frame Position={new UDim2(0, 15, 0, 15)} Size={new UDim2(0, 270, 0, 270)}>
					<uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 8)} />
					{body}
				</Frame>
			</Frame>
		);
	}

	onStart(): void {
		new TextLogExtension(getWorkspaceInstance(["Map", "NewLobby", "TextLogs", "Meshes/TextLog"], "MeshPart"), {
			DoubletapController: this.DoubletapController,
			title: "The tutorial 🤷‍♀️👍",
			body: this.textLog(
				[
					"Welcome to SPOREFLOOD",
					"On the right is the old lobby",
					"Everywhere else is the mess",
					"Jump on a red spawner and go battle that dubious flood",
					"Like and favorite the game so I can afford to continue making the game. 😎",
				].map((text) => {
					return (
						<TextLabel
							Text={text}
							TextColor3={COLOURS.White}
							TextSize={14}
							Font={FONTS.Main}
							AutomaticSize={"XY"}
							TextWrap={true}
						/>
					);
				}),
			),
		});

		new TextLogExtension(getWorkspaceInstance(["Map", "NewLobby", "TextLogs", "Log2"], "MeshPart"), {
			DoubletapController: this.DoubletapController,
			title: "Mr. White Yo",
			body: this.textLog([
				<TextLabel
					Text={"I need 2 save da world."}
					TextColor3={COLOURS.White}
					TextSize={14}
					Font={FONTS.Main}
					AutomaticSize={"Y"}
				/>,
			]),
		});
	}
}
