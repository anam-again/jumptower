import { useEventListener } from "@rbxts/pretty-react-hooks";
import React, { useState } from "@rbxts/react";
import { Events } from "client/network";
import ScrollingFrame from "client/ui/components/scrollingFrame";
import TextLabel from "client/ui/components/textLabel";

export default function EventLog() {
	const initialMessage = "<font color='#AAAAAA'><i>Welcome to Sporeflood</i><b>...</b></font>";

	const [messages, setMessages] = useState<Array<string>>([initialMessage]);

	useEventListener(Events.writeToEventLog, (message) => {
		const messagesToUse = messages;
		if (messagesToUse.size() > 128) {
			messagesToUse.shift();
		}
		if (message.size() > 128) {
			message = message.sub(0, 128) + "...";
		}
		setMessages([...messagesToUse, message.sub(0, 128)]);
	});

	return (
		<ScrollingFrame
			Position={new UDim2(0, 0, 0.8, 0)}
			Size={new UDim2(0, 300, 0.2, 0)}
			BackgroundTransparency={0.2}
			BackgroundColor3={new Color3(0.05, 0.47, 0.47)}
			BorderColor3={new Color3(1, 1, 1)}
			AutomaticCanvasSize={"Y"}
			ScrollingDirection={"Y"}
			CanvasSize={new UDim2(0, 0, 0, 0)}
			Event={{
				ChildAdded: (e) => {
					e.CanvasPosition = new Vector2(0, 999999);
				},
			}}
		>
			<uilistlayout SortOrder={"LayoutOrder"} />
			{messages.map((message) => {
				return (
					<TextLabel
						Size={new UDim2(0.85, 5, 0, 10)}
						Font={"SciFi"}
						TextWrap={true}
						AutomaticSize={"Y"}
						TextColor3={new Color3(1, 1, 1)}
						TextSize={16}
						RichText={true}
						Text={message}
					/>
				);
			})}
		</ScrollingFrame>
	);
}
