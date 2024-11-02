import React from "@rbxts/react";

import ScreenGui from "client/common/ui/components/screenGui";

import Frame from "../../common/ui/components/frame";
import SporeInfo from "./components/SporeInfo";
import EventLog from "../../common/ui/app/components/EventLog";

export default function FloodsporeGUIApp() {
	return (
		<ScreenGui>
			<Frame BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
				<SporeInfo />
			</Frame>
		</ScreenGui>
	);
}
