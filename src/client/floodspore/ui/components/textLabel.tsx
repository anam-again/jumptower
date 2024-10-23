import React from "@rbxts/react";

interface Props extends React.InstanceProps<TextLabel> {}

export default function TextLabel(props: Props) {
	return (
		<textlabel
			{...props}
			BackgroundTransparency={props.BackgroundTransparency ?? 1}
			TextXAlignment={props.TextXAlignment ?? "Left"}
			TextYAlignment={props.TextYAlignment ?? "Top"}
			BorderSizePixel={props.BorderSizePixel ?? 0}
		/>
	);
}
