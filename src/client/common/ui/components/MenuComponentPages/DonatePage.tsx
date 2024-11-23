import React, { useState } from "@rbxts/react";
import { MarketplaceService, Players } from "@rbxts/services";
import { COLOURS, PASSES } from "shared/constants";

interface Props {}

export default function DonatePage(props: Props) {
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
			<uilistlayout FillDirection={"Vertical"} Padding={new UDim(0, 5)} />
			{bodyText(
				"Please donate if you're able to! It helps keep small Roblox Creators alive and continuing to make games! If you are enjoying the experience, please drop a like+favorite and donate!",
			)}
			{bodyText(
				"You'll get a unique PERMANENT reward for each donation type, and you can support your community.",
			)}
			<frame Size={new UDim2(1, -20, 0, 80)} AutomaticSize={"Y"} BackgroundTransparency={1}>
				<uistroke Color={COLOURS.Black} />
				<uilistlayout FillDirection={"Vertical"} />
				{bodyText("MINI-Supporter")}
				{bodyText("Thank you so much for your support! You are helping Roblox!")}
				<textbutton
					Text={"MINI-Supporter"}
					Size={new UDim2(0, 100, 0, 50)}
					BackgroundColor3={COLOURS.SuccessGreen}
					Event={{
						MouseButton1Click: () => {
							MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, PASSES.MINISupporter);
						},
					}}
				/>
			</frame>
			<frame Size={new UDim2(1, -20, 0, 80)} AutomaticSize={"Y"} BackgroundTransparency={1}>
				<uistroke Color={COLOURS.Black} />
				<uilistlayout FillDirection={"Vertical"} />
				{bodyText("SUPER-Supporter")}
				{bodyText("You are my hero if you get this Pass! It means more than you can imagine. Thank you.")}
				<textbutton
					Text={"SUPER-Supporter"}
					Size={new UDim2(0, 100, 0, 50)}
					BackgroundColor3={COLOURS.SuccessGreen}
					Event={{
						MouseButton1Click: () => {
							MarketplaceService.PromptGamePassPurchase(Players.LocalPlayer, PASSES.SUPERSupporter);
						},
					}}
				/>
			</frame>
		</frame>
	);
}
