import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { createRef, useEffect, useState } from "@rbxts/react";
import { TweenService } from "@rbxts/services";
import Signal from "@rbxts/signal";
import { COLOURS } from "shared/constants";
import { raceAndTerminateTasks } from "shared/utils/task";

interface Thought {
	position: Vector3;
	message: string;
}

interface Props {}

const TYPESPEED = 0.02;
const DELAY_UNTIL_FADE = 4;

export const FocusThoughtProviderGUI = new Signal<(thought: Thought) => void>();
export const unfocusThoughtProviderGUI = new Signal<() => void>();

export default function ThoughtProviderGUIApp(props: Props) {
	const [thought, setThought] = useState<Thought>({
		message: "",
		position: new Vector3(0, 0, 0),
	});
	const [focusButtonIsActive, setfocusButtonIsActive] = useState<boolean>(false);
	const [ThoughtFadeOutTween, setThoughtFadeOutTween] = useState<Tween>();

	const ButtonRef = createRef<TextButton>();
	const FocusSquareRef = createRef<Frame>();
	const UIStrokeRef = createRef<UIStroke>();
	const ThoughtTextRef = createRef<TextLabel>();

	useEventListener(FocusThoughtProviderGUI, (thought) => {
		if (!UIStrokeRef.current || !ButtonRef.current) return;
		TweenService.Create(UIStrokeRef.current, new TweenInfo(1, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), {
			Transparency: 0,
		}).Play();
		TweenService.Create(ButtonRef.current, new TweenInfo(1, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), {
			Position: new UDim2(0, thought.position.X - 25, 0, thought.position.Y + 25),
		}).Play();
		setThought(thought);
		setfocusButtonIsActive(true);
	});
	useEventListener(unfocusThoughtProviderGUI, () => {
		if (!UIStrokeRef.current || !ButtonRef.current) return;
		TweenService.Create(UIStrokeRef.current, new TweenInfo(1, Enum.EasingStyle.Cubic, Enum.EasingDirection.InOut), {
			Transparency: 1,
		}).Play();
		setfocusButtonIsActive(false);
	});

	useEffect(() => {
		if (!FocusSquareRef.current) return;
		TweenService.Create(
			FocusSquareRef.current,
			new TweenInfo(6, Enum.EasingStyle.Linear, Enum.EasingDirection.In, math.huge),
			{
				Rotation: 360,
			},
		).Play();
	}, [FocusSquareRef.current]);

	useEffect(() => {
		if (!ThoughtTextRef.current) return;
		const tween = TweenService.Create(ThoughtTextRef.current, new TweenInfo(1), { TextTransparency: 1 });
		setThoughtFadeOutTween(tween);
	}, [ThoughtTextRef.current]);

	const cancelWriteThought = new Signal();
	function writeThought() {
		cancelWriteThought.Fire();
		raceAndTerminateTasks([
			() => {
				if (!ThoughtTextRef.current) return;
				if (ThoughtFadeOutTween && ThoughtFadeOutTween.PlaybackState === Enum.PlaybackState.Playing) {
					ThoughtFadeOutTween.Cancel();
				}
				ThoughtTextRef.current.TextTransparency = 0;
				ThoughtTextRef.current.Text = thought.message;
				const grapheme = utf8.graphemes(ThoughtTextRef.current.Text);
				const ttr = ThoughtTextRef.current; // if you don't put this in a variable it explodes on stateChange
				let i = 0;
				for (const char of grapheme) {
					i++;
					ttr.MaxVisibleGraphemes = i;
					task.wait(TYPESPEED);
				}
				task.wait(DELAY_UNTIL_FADE);
				ThoughtFadeOutTween?.Play();
			},
			() => {
				cancelWriteThought.Wait();
			},
		]);
	}

	return (
		<screengui ClipToDeviceSafeArea={false} IgnoreGuiInset={true}>
			<textbutton
				Active={focusButtonIsActive}
				Selectable={focusButtonIsActive}
				ref={ButtonRef}
				Size={new UDim2(0, 50, 0, 50)}
				Text={""}
				BackgroundTransparency={1}
				Event={{
					MouseButton1Click: () => {
						if (focusButtonIsActive) {
							writeThought();
						}
					},
				}}
			>
				<frame ref={FocusSquareRef} Size={new UDim2(1, 0, 1, 0)} BackgroundTransparency={1}>
					<uistroke
						ref={UIStrokeRef}
						Color={COLOURS.White}
						Thickness={2}
						LineJoinMode={"Miter"}
						Transparency={1}
					/>
				</frame>
			</textbutton>
			<frame Size={new UDim2(0.8, 0, 0, 100)} Position={new UDim2(0.1, 0, 1, -100)} BackgroundTransparency={1}>
				<textlabel
					Text={""}
					BackgroundTransparency={1}
					TextTransparency={1}
					ref={ThoughtTextRef}
					Size={new UDim2(1, 0, 1, 0)}
					TextXAlignment={"Center"}
					TextYAlignment={"Center"}
					Font={"RobotoMono"}
					FontSize={"Size28"}
					TextColor3={COLOURS.White}
					TextStrokeColor3={COLOURS.Black}
					TextStrokeTransparency={0}
					Transparency={1}
					TextWrap={true}
				/>
			</frame>
		</screengui>
	);
}
