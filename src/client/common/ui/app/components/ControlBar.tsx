import React, { useState } from "@rbxts/react";

import { COLOURS, IMAGES } from "shared/constants";

import Frame from "../../components/frame";
import ImageButton from "../../components/imageButton";

interface Props {
	onSettingsClick: () => void;
	onCamerasClick: () => void;
	onOpenChatClick: () => void;
	eventLogIsOpen: boolean;
	camerasIsOpen: boolean;
	settingsIsOpen: boolean;
}

export default function ControlBar(props: Props) {
	const [settingsBackgroundTransparency, setSettingsBackgroundTransparency] = useState(1);
	const [camerasBackgroundTransparency, setCamerasBackgroundTransparency] = useState(1);
	const [chatOpenBackgroundTransparency, setchatOpenBackgroundTransparency] = useState(1);
	return (
		<Frame
			Size={new UDim2(1, 0, 0.2, 0)}
			Position={new UDim2()}
			BackgroundColor3={COLOURS.UIBaseAlt}
			BackgroundTransparency={0.4}
		>
			<Frame Size={new UDim2(0.2, 0, 1, 0)} Position={new UDim2(0, 0, 0, 0)}>
				<ImageButton
					Size={new UDim2(0, 30, 1, 0)}
					BackgroundColor3={COLOURS.UILighter}
					Image={IMAGES.Icon_Karet}
					Rotation={props.eventLogIsOpen ? -90 : 90}
					BackgroundTransparency={chatOpenBackgroundTransparency}
					Event={{
						MouseEnter: () => {
							setchatOpenBackgroundTransparency(0);
						},
						MouseLeave: () => {
							setchatOpenBackgroundTransparency(1);
						},
						MouseButton1Click: () => {
							props.onOpenChatClick();
						},
						TouchTap: () => {
							props.onOpenChatClick();
						},
					}}
				>
					<uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
				</ImageButton>
			</Frame>
			<Frame Size={new UDim2(0.8, 0, 1, 0)} Position={new UDim2(0.2, 0, 0, 0)}>
				<uilistlayout
					FillDirection={"Horizontal"}
					HorizontalAlignment={"Right"}
					HorizontalFlex={"None"}
					SortOrder={"LayoutOrder"}
				/>
				<ImageButton
					Size={new UDim2(0, 30, 1, 0)}
					BackgroundColor3={COLOURS.UILighter}
					Image={IMAGES.ICON_Camera}
					BackgroundTransparency={camerasBackgroundTransparency === 0 || props.camerasIsOpen ? 0 : 1}
					Event={{
						MouseEnter: () => {
							setCamerasBackgroundTransparency(0);
						},
						MouseLeave: () => {
							setCamerasBackgroundTransparency(1);
						},
						MouseButton1Click: () => {
							props.onCamerasClick();
						},
						TouchTap: () => {
							props.onCamerasClick();
						},
					}}
				>
					<uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
				</ImageButton>
				<ImageButton
					Size={new UDim2(0, 30, 1, 0)}
					BackgroundColor3={COLOURS.UILighter}
					Image={IMAGES.Icon_Settings}
					BackgroundTransparency={settingsBackgroundTransparency === 0 || props.settingsIsOpen ? 0 : 1}
					Event={{
						MouseEnter: () => {
							setSettingsBackgroundTransparency(0);
						},
						MouseLeave: () => {
							setSettingsBackgroundTransparency(1);
						},
						MouseButton1Click: () => {
							props.onSettingsClick();
						},
						TouchTap: () => {
							props.onSettingsClick();
						},
					}}
				>
					<uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
				</ImageButton>
			</Frame>
			<uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
		</Frame>
	);
}
