import React from "@rbxts/react";

interface Props extends React.InstanceProps<ScrollingFrame> {
	//
}

export default function ScrollingFrame(
	props: Props = {
		BackgroundTransparency: 1,
		BackgroundColor3: new Color3(1, 0, 1),
	},
) {
	return (
		<scrollingframe
			{...props}
			BackgroundTransparency={props.BackgroundTransparency ?? 1}
			BackgroundColor3={props.BackgroundColor3 ?? new Color3(1, 0, 1)}
			BorderSizePixel={props.BorderSizePixel ?? 0}
		/>
	);
}
