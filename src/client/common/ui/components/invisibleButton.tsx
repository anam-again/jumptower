import React from "@rbxts/react";

interface Props extends React.InstanceProps<TextButton> {
	//
}

export default function InvisibleButton(props: Props) {
	return (
		<textbutton
			{...props}
			BackgroundTransparency={props.BackgroundTransparency ?? 1}
			BackgroundColor3={props.BackgroundColor3 ?? new Color3(1, 0, 1)}
			BorderSizePixel={props.BorderSizePixel ?? 0}
			Text={""}
			Selectable={false}
			Interactable={true}
			AutoButtonColor={false}
		/>
	);
}
