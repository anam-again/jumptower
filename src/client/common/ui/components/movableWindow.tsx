import React, { useEffect, useState } from "@rbxts/react";
import Signal from "@rbxts/signal";
import { RunService, UserInputService } from "@rbxts/services";

import { COLOURS, FONTS, IMAGES } from "shared/constants";

import TextLabel from "./textLabel";
import ImageLabel from "./imageLabel";
import Frame from "./frame";
import ImageButton from "./imageButton";
import InvisibleButton from "./invisibleButton";

interface Props extends React.InstanceProps<Frame> {
	title?: string;
	icon?: string;
	isOpen: boolean;
	onCloseClicked: () => void;
}

export default function MovableWindow(props: Props) {
	const [closeButtonBackgroundTransparency, setCloseButtonBackgroundTransparency] = useState(1);

	const [isBeingDragged, setIsBeingDragged] = useState(false);
	const [windowPosition, setWindowPosition] = useState(new UDim2(0, 200, 0, 200));

	const moveWindowToCenter = () => {
		setWindowPosition(new UDim2(0.5, -150, 0.5, -150));
	};

	const handleDragAsync = () => {
		if (!UserInputService.MouseEnabled) {
			return;
		}
		if (isBeingDragged) return;
		setIsBeingDragged(true);
		let ignoreThisInput = true;
		const hb = RunService.Heartbeat.Connect(() => {
			const currMousePos = UserInputService.GetMouseLocation();
			setWindowPosition(new UDim2(0, currMousePos.X - 20, 0, currMousePos.Y - 10));
		});
		const mysignal = new Signal();
		const uis = UserInputService.InputBegan.Connect((input) => {
			if (ignoreThisInput) {
				ignoreThisInput = false;
			} else if (input.UserInputType === Enum.UserInputType.MouseButton1) {
				mysignal.Fire();
			}
		});
		mysignal.Wait();
		uis.Disconnect();
		hb.Disconnect();
		setIsBeingDragged(false);
	};

	useEffect(() => {
		moveWindowToCenter();
	}, [props.isOpen]);

	return (
		<Frame
			Position={windowPosition}
			Visible={props.isOpen}
			Size={new UDim2(0, 300, 0, 300)}
			BackgroundColor3={COLOURS.UIDarker}
			BackgroundTransparency={0}
		>
			<uilistlayout FillDirection={"Vertical"} />
			<uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
			<Frame Size={new UDim2(1, 0, 0, 30)}>
				<uilistlayout FillDirection={"Horizontal"} HorizontalFlex={"SpaceBetween"} />
				<uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
				<Frame Size={new UDim2(1, 0, 0, 30)}>
					<InvisibleButton
						Size={new UDim2(1, 0, 0, 30)}
						Event={{
							MouseButton1Down: () => {
								handleDragAsync();
							},
						}}
					/>
					<Frame Size={new UDim2(1, 0, 0, 30)}>
						{props.icon !== undefined && <ImageLabel Image={props.icon} Size={new UDim2(0, 30, 0, 30)} />}
						<TextLabel
							Position={new UDim2(0, 35, 0, 0)}
							Size={new UDim2(1, 0, 1, 0)}
							TextSize={20}
							TextYAlignment={"Center"}
							TextColor3={COLOURS.White}
							Text={props.title ?? ""}
							Font={FONTS.Title}
						/>
					</Frame>
				</Frame>
				<Frame>
					<uilistlayout FillDirection={"Horizontal"} HorizontalAlignment={"Right"} />
					<Frame>
						<uilistlayout FillDirection={"Horizontal"} HorizontalAlignment={"Right"} />
						<ImageButton
							Event={{
								MouseEnter: () => {
									setCloseButtonBackgroundTransparency(0);
								},
								MouseLeave: () => {
									setCloseButtonBackgroundTransparency(1);
								},
								MouseButton1Click: () => {
									props.onCloseClicked();
								},
								TouchTap: () => {
									props.onCloseClicked();
								},
							}}
							BackgroundColor3={COLOURS.UIBaseAlt}
							BackgroundTransparency={closeButtonBackgroundTransparency}
							Image={IMAGES.Icon_X}
							Size={new UDim2(0, 30, 0, 30)}
						>
							<uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
						</ImageButton>
					</Frame>
				</Frame>
			</Frame>
			<Frame Size={new UDim2(1, 0, 0, 270)}>{props.children}</Frame>
		</Frame>
	);
}
