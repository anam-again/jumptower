import motion from "@rbxts/react-motion";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";

import { Events } from "client/common/network";

import TextLabel from "../../components/textLabel";

export default function TeleportLoadingScreen() {
	const [screenTransparency, setScreenTransparency] = useState(1);
	const [message, setMessage] = useState("");

	useEventListener(Events.playerIsTeleporting, (message) => {
		setMessage(message);
		setScreenTransparency(0);
	});

	const screengui = (
		<screengui Enabled={true} IgnoreGuiInset={true}>
			<motion.frame
				animate={{ BackgroundTransparency: screenTransparency }}
				transition={{
					duration: 1,
				}}
				Size={new UDim2(1, 0, 1, 0)}
				BackgroundColor3={new Color3(0, 0, 0)}
				BackgroundTransparency={1}
			>
				<motion.frame
					animate={{ BackgroundTransparency: screenTransparency }}
					transition={{
						duration: 1,
					}}
					Size={new UDim2(0.4, 0, 0.3, 0)}
					Position={new UDim2(0.3, 0, 0.35, 0)}
					BorderColor3={new Color3(1, 1, 1)}
					BackgroundTransparency={1}
					BackgroundColor3={new Color3(0, 0, 0)}
					BorderSizePixel={1}
				>
					<TextLabel
						Size={new UDim2(0.3, 0, 0.5, 0)}
						Position={new UDim2(0.35, 0, 0.25, 0)}
						Text={`Loading...<br/>${message}`}
						RichText={true}
						TextColor3={new Color3(1, 1, 1)}
						Visible={screenTransparency === 0}
						BackgroundTransparency={1}
						FontSize={"Size8"}
						TextXAlignment={"Center"}
						TextYAlignment={"Center"}
					/>
				</motion.frame>
			</motion.frame>
		</screengui>
	);

	return screengui;
}
