import React from "@rbxts/react";

interface Props extends React.InstanceProps<Frame> {
	//
}

export default function Frame(
	props: Props = {
		BackgroundTransparency: 1,
		BackgroundColor3: new Color3(1, 0, 1),
	},
) {
	return (
		<frame
			{...props}
			BackgroundTransparency={props.BackgroundTransparency ?? 1}
			BackgroundColor3={props.BackgroundColor3 ?? new Color3(1, 0, 1)}
			BorderSizePixel={props.BorderSizePixel ?? 0}
		/>
	);
}
