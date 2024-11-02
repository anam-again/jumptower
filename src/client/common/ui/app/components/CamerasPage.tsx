import React, { useState } from "@rbxts/react";
import { useEventListener } from "@rbxts/pretty-react-hooks";

import { ControlledCamera } from "client/common/controllers/CommonCameraController";
import { ClientSignals } from "client/common/signals";
import { COLOURS } from "shared/constants";

import Frame from "../../components/frame";
import ScrollingFrame from "../../components/scrollingFrame";
import TextLabel from "../../components/textLabel";

interface Props {}

export default function CamerasPage(props: Props) {
	const [cameras, setCameras] = useState<Array<ControlledCamera>>([]);

	useEventListener(ClientSignals.CamerasEvaluated, (cameras) => {
		setCameras(cameras);
	});

	return (
		<ScrollingFrame Size={new UDim2(1, 0, 1, 0)} ScrollBarThickness={5} AutomaticCanvasSize={"Y"}>
			<Frame Position={new UDim2(0, 10, 0, 10)} Size={new UDim2(1, -20, 1, -20)}>
				<uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 20)} SortOrder={"LayoutOrder"} />
				<TextLabel
					Text={"Cameras"}
					Size={new UDim2(1, 0, 0, 0)}
					AutomaticSize={"Y"}
					TextXAlignment={"Center"}
					TextColor3={COLOURS.White}
					TextSize={14}
				/>
				{cameras.map((camera) => {
					return (
						<Frame Size={new UDim2(1, 0, 0, 40)}>
							<uistroke Color={COLOURS.White} />
							<textbutton
								Size={new UDim2(1, 0, 1, 0)}
								Text={camera.camera.Name}
								TextXAlignment={"Center"}
								TextYAlignment={"Center"}
								TextColor3={COLOURS.White}
								TextSize={12}
								Event={{
									MouseButton1Click: () => {
										ClientSignals.ForceCamera.Fire(camera.camera);
									},
								}}
							/>
						</Frame>
					);
				})}
			</Frame>
		</ScrollingFrame>
	);
}
