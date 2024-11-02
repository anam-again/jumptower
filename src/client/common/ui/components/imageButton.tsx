import React from "@rbxts/react";

interface Props extends React.InstanceProps<ImageButton> {
	//
}

export default function ImageButton(props: Props) {
	return (
		<imagebutton
			{...props}
			BackgroundTransparency={props.BackgroundTransparency ?? 1}
			BackgroundColor3={props.BackgroundColor3 ?? new Color3(1, 0, 1)}
			BorderSizePixel={props.BorderSizePixel ?? 0}
		/>
	);
}
