import React from "@rbxts/react";

import { IMAGES } from "shared/constants";

import ImageButton from "./imageButton";
import Frame from "./frame";

interface Props {
	isChecked: boolean;
	onChecked: (checked: boolean) => void;
}

export default function CheckBox(props: Props) {
	return (
		<Frame Size={new UDim2(0, 30, 0, 30)}>
			<ImageButton
				Size={new UDim2(1, 0, 1, 0)}
				Event={{
					MouseButton1Click: () => {
						props.onChecked(!props.isChecked);
					},
				}}
				Image={props.isChecked ? IMAGES.Icon_CheckFull : IMAGES.Icon_CheckEmpty}
			/>
		</Frame>
	);
}
