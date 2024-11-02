import React from "@rbxts/react";

import { COLOURS, FONTS } from "shared/constants";
import { Events } from "client/common/network";
import { Settings } from "shared/store/slices/players/PlayerData";

import CheckBox from "../../components/checkbox";
import Frame from "../../components/frame";
import TextLabel from "../../components/textLabel";
import ScrollingFrame from "../../components/scrollingFrame";

interface Props {
	playerDataSettings?: Settings;
}

export default function SettingsPage(props: Props) {
	const horizontalLine = () => {
		return (
			<Frame Size={new UDim2(1, 0, 0, 60)}>
				<Frame Position={new UDim2(0, 0, 0, 30)} Size={new UDim2(1, 0, 0, 0)}>
					<uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
				</Frame>
			</Frame>
		);
	};

	const bodyText = (text: string) => {
		return (
			<TextLabel
				AutomaticSize={"Y"}
				Size={new UDim2(1, 0, 0, 0)}
				TextWrap={true}
				Text={text}
				TextSize={14}
				TextColor3={COLOURS.White}
				Font={FONTS.Main}
			/>
		);
	};

	return (
		<ScrollingFrame Size={new UDim2(1, 0, 1, 0)} ScrollBarThickness={5} AutomaticCanvasSize={"Y"}>
			<Frame Position={new UDim2(0, 10, 0, 10)} Size={new UDim2(1, -20, 1, -20)}>
				<uilistlayout FillDirection={"Vertical"} />
				{bodyText("There isn't actually any settings yet but IF THERE WERE I would put them here")}
				{horizontalLine()}
				<Frame Size={new UDim2(1, 0, 0, 30)}>
					<uilistlayout FillDirection={"Horizontal"} VerticalAlignment={"Center"} />
					<CheckBox
						isChecked={props.playerDataSettings?.theoreticalSetting ?? false}
						onChecked={(value) => {
							if (props.playerDataSettings) {
								Events.setPlayerSettings({
									...props.playerDataSettings,
									theoreticalSetting: value,
								});
							}
						}}
					/>
					<TextLabel
						AutomaticSize={"Y"}
						Size={new UDim2(1, 0, 0, 30)}
						TextYAlignment={"Center"}
						TextWrap={true}
						Text={"Theoretical config"}
						TextSize={14}
						TextColor3={COLOURS.White}
						Font={FONTS.Main}
					/>
				</Frame>
				{bodyText(props.playerDataSettings?.theoreticalSetting ? "true" : "false")}
				{horizontalLine()}
				{bodyText(
					"Consider leaving a like and favorite! It will help with development, and bring you more FLOODSPORE to play",
				)}
			</Frame>
		</ScrollingFrame>
	);
}
