import React from "@rbxts/react";
import Frame from "../../components/frame";
import SporeInfo from "./components/SporeInfo";
import EventLog from "./components/EventLog";
import ScreenGui from "client/ui/components/screenGui";

export default function PlayerGUIApp() {
	return (
		<ScreenGui>
			<Frame BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
				<EventLog />
				<SporeInfo />
			</Frame>
		</ScreenGui>
	);
}
