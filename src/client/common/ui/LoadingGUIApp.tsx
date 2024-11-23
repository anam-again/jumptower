import React, { createRef, useEffect } from "@rbxts/react";
import { ReplicatedFirst, RunService, TweenService, UserInputService } from "@rbxts/services";
import { COLOURS } from "shared/constants";
import { getOrWaitForLocalCharacter } from "../utils";

interface Props {}

export default function LoadingGUIApp(props: Props) {
	const parentFrameRef = createRef<Frame>();
	const spinningSquareRef = createRef<Frame>();
	const textRef = createRef<TextLabel>();
	ReplicatedFirst.RemoveDefaultLoadingScreen();
	useEffect(() => {
		if (spinningSquareRef.current) {
			TweenService.Create(
				spinningSquareRef.current,
				new TweenInfo(8, Enum.EasingStyle.Linear, Enum.EasingDirection.In, math.huge),
				{ Rotation: 360 },
			).Play();
		}
		if (!RunService.IsStudio()) task.wait(3);
		getOrWaitForLocalCharacter().WaitForChild("HumanoidRootPart");
		if (textRef.current) {
			textRef.current.Text = "Please Press Any Button to Continue";
		}
		UserInputService.InputBegan.Wait();
		if (parentFrameRef.current) {
			TweenService.Create(parentFrameRef.current, new TweenInfo(1), { BackgroundTransparency: 1 }).Play();
		}
		if (spinningSquareRef.current) {
			TweenService.Create(spinningSquareRef.current, new TweenInfo(1), { BackgroundTransparency: 1 }).Play();
		}
		if (textRef.current) {
			TweenService.Create(textRef.current, new TweenInfo(1), { TextTransparency: 1 }).Play();
		}
	}, []);
	return (
		<screengui ClipToDeviceSafeArea={false} IgnoreGuiInset={true}>
			<frame
				ref={parentFrameRef}
				Size={new UDim2(1, 0, 1, 0)}
				BackgroundColor3={COLOURS.Black}
				Position={new UDim2(0, 0, 0, 0)}
			>
				<frame
					ref={spinningSquareRef}
					Size={new UDim2(0, 50, 0, 50)}
					BackgroundColor3={COLOURS.White}
					Position={new UDim2(0.5, -25, 0.5, -25)}
				/>
				<textlabel
					ref={textRef}
					Text={"Loading"}
					Position={new UDim2(0.5, -50, 0.5, 50)}
					Size={new UDim2(0, 100, 0, 30)}
					BackgroundTransparency={1}
					TextXAlignment={"Center"}
					TextColor3={COLOURS.White}
					Font={"RobotoMono"}
					FontSize={"Size24"}
				/>
			</frame>
		</screengui>
	);
}
