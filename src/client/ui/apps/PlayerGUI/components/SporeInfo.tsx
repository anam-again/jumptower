import React from "@rbxts/react";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Frame from "client/ui/components/frame";
import TextLabel from "client/ui/components/textLabel";
import { selectSporeCount } from "shared/store/selectors/gamestate";

export default function SporeInfo() {
	const sporeCount: number = useSelectorCreator(selectSporeCount);

	const sporeText = `Spores Remaining:<br/>${sporeCount}`;
	return (
		<Frame
			Position={new UDim2(0, 20, 0.5, 0)}
			Size={new UDim2(0, 180, 0, 60)}
			BackgroundTransparency={0.2}
			BackgroundColor3={new Color3(0, 0.32, 0.33)}
			BorderMode={"Outline"}
			BorderColor3={new Color3(1, 1, 1)}
		>
			<TextLabel
				Font={"SciFi"}
				TextWrap={true}
				Position={new UDim2(0, 5, 0, 5)}
				Size={new UDim2(0, 160, 0, 20)}
				TextColor3={new Color3(1, 1, 1)}
				TextSize={20}
				RichText={true}
				Text={sporeText}
			/>
		</Frame>
	);
}
