import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";

import { Events } from "client/common/network";
import ScrollingFrame from "client/common/ui/components/scrollingFrame";
import TextLabel from "client/common/ui/components/textLabel";
import { COLOURS, FONT_SIZE, FONTS } from "shared/constants";
import { ClientSignals } from "client/common/signals";

import Frame from "../../components/frame";

interface Props {
	isOpen: boolean;
}

export default function EventLog(props: Props) {
	const initialMessage = "<font color='#AAAAAA'><i>Welcome to Sporeflood</i><b>...</b></font>";

	const [messages, setMessages] = useState<Array<string>>([initialMessage]);

	function handleWriteToEventLog(message: string) {
		const messagesToUse = messages;
		if (messagesToUse.size() > 128) {
			messagesToUse.shift();
		}
		if (message.size() > 128) {
			message = message.sub(0, 128) + "...";
		}
		setMessages([...messagesToUse, message.sub(0, 128)]);
	}

	useEventListener(ClientSignals.writeToEventLog, (message) => {
		handleWriteToEventLog(message);
	});
	useEventListener(Events.writeToEventLog, (message) => {
		handleWriteToEventLog(message);
	});

	return (
		<Frame
			Visible={props.isOpen}
			Size={new UDim2(1, 0, 0.8, 0)}
			BackgroundTransparency={0.5}
			BackgroundColor3={COLOURS.UIBase}
		>
			<uistroke Color={COLOURS.UIBorderContrast} Thickness={1} />
			<ScrollingFrame
				Position={new UDim2(0.025, 0, 0, 0)}
				Size={new UDim2(0.95, 0, 1, 0)}
				AutomaticCanvasSize={"Y"}
				ScrollingDirection={"Y"}
				CanvasSize={new UDim2(0, 0, 0, 0)}
				Event={{
					ChildAdded: (e) => {
						e.CanvasPosition = new Vector2(0, 999999);
					},
				}}
			>
				<uilistlayout SortOrder={"LayoutOrder"} Padding={new UDim(0, 4)} />
				{messages.map((message) => {
					return (
						<TextLabel
							Size={new UDim2(0.85, 16, 0, -16)}
							Font={FONTS.Mono}
							TextWrap={true}
							AutomaticSize={"Y"}
							TextColor3={COLOURS.White}
							TextSize={FONT_SIZE.Common}
							RichText={true}
							Text={message}
						/>
					);
				})}
			</ScrollingFrame>
		</Frame>
	);
}
