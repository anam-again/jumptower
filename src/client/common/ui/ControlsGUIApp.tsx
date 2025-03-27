import React, { useState } from "@rbxts/react";
import { UserInputService } from "@rbxts/services";
import { COLOURS } from "shared/constants";
import { PlayerMovementController } from "../controllers/PlayerMovementController";

interface Props {
	PlayerMovementController: PlayerMovementController;
}

export default function ControlsGUIApp(props: Props) {
	const [isMobile, setIsMobile] = useState(false);
	UserInputService.LastInputTypeChanged.Connect((lastInputType) => {
		switch (lastInputType) {
			case Enum.UserInputType.Touch:
			case Enum.UserInputType.Gyro:
				setIsMobile(true);
				break;
			default:
				setIsMobile(false);
		}
	});

	const pressedLeft = () => {};

	const pressedRight = () => {};

	const pressedJump = () => {};

	const WIDTH = 70;
	const HEIGHT = 50;
	const OFFSET = 10;
	const BOTTOM_OFFSET = 25;
	const LARGE_OFFSET = 50;

	return (
		<screengui ClipToDeviceSafeArea={false} IgnoreGuiInset={true}>
			<textbutton
				Visible={isMobile}
				Text={"<"}
				Size={new UDim2(0, WIDTH, 0, HEIGHT)}
				Position={new UDim2(0, LARGE_OFFSET, 1, -BOTTOM_OFFSET - HEIGHT)}
				BackgroundTransparency={0.8}
				BackgroundColor3={COLOURS.UIBase}
				AutomaticSize={"XY"}
				Event={{
					InputBegan: () => {
						props.PlayerMovementController.action_left(Enum.UserInputState.Begin);
					},
					InputEnded: () => {
						props.PlayerMovementController.action_left(Enum.UserInputState.End);
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<uistroke Color={COLOURS.Black} />
			</textbutton>
			<textbutton
				Visible={isMobile}
				Text={">"}
				Size={new UDim2(0, WIDTH, 0, HEIGHT)}
				Position={new UDim2(0, WIDTH * 2 + OFFSET * 2, 1, -BOTTOM_OFFSET - HEIGHT)}
				BackgroundTransparency={0.8}
				BackgroundColor3={COLOURS.UIBase}
				AutomaticSize={"XY"}
				Event={{
					InputBegan: () => {
						props.PlayerMovementController.action_right(Enum.UserInputState.Begin);
					},
					InputEnded: () => {
						props.PlayerMovementController.action_right(Enum.UserInputState.End);
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<uistroke Color={COLOURS.Black} />
			</textbutton>
			<textbutton
				Visible={isMobile}
				Text={"^"}
				Size={new UDim2(0, WIDTH * 2, 0, HEIGHT)}
				Position={new UDim2(1, -WIDTH * 2 - LARGE_OFFSET, 1, -BOTTOM_OFFSET - HEIGHT)}
				BackgroundTransparency={0.8}
				BackgroundColor3={COLOURS.UIBase}
				AutomaticSize={"XY"}
				Event={{
					InputBegan: () => {
						props.PlayerMovementController.action_jump(Enum.UserInputState.Begin);
					},
					InputEnded: () => {
						props.PlayerMovementController.action_jump(Enum.UserInputState.End);
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0.5, 0)} />
				<uistroke Color={COLOURS.Black} />
			</textbutton>
		</screengui>
	);
}
