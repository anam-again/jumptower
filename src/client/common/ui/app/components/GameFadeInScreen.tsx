import motion from "@rbxts/react-motion";
import React from "@rbxts/react";

export default function GameFadeInScreen() {
	return (
		<screengui Enabled={true} IgnoreGuiInset={true}>
			<motion.frame
				animate={{ BackgroundTransparency: 1 }}
				transition={{
					duration: 1.2,
				}}
				Size={new UDim2(1, 0, 1, 0)}
				BackgroundColor3={new Color3(0, 0, 0)}
				BackgroundTransparency={0}
			/>
		</screengui>
	);
}
