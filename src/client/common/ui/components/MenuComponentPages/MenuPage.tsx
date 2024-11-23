import React, { useState } from "@rbxts/react";
import { COLOURS } from "shared/constants";

interface Props {}

export default function MenuPage(props: Props) {
	function bodyText(text: string) {
		return (
			<textlabel
				Text={text}
				Font={"RobotoMono"}
				FontSize={"Size14"}
				Size={new UDim2(1, 0, 0, 0)}
				AutomaticSize={"Y"}
				TextWrap={true}
				BackgroundTransparency={1}
				TextXAlignment={"Left"}
			/>
		);
	}

	return (
		<frame
			Size={new UDim2(1, -20, 1, -20)}
			Position={new UDim2(0, 10, 0, 10)}
			BackgroundColor3={COLOURS.White}
			BackgroundTransparency={1}
		>
			<uilistlayout FillDirection={"Vertical"} />
			{bodyText("Hey, there isn't actually anything on this Menu page yet, ")}
		</frame>
	);
}
