import { Controller, OnStart } from "@flamework/core";
import { TextChatService } from "@rbxts/services";

@Controller({})
export class TextChatController implements OnStart {
	private GeneralTextChannel!: TextChannel;
	onStart(): void {
		const generalChat = TextChatService.WaitForChild("TextChannels").WaitForChild("RBXGeneral");
		if (!generalChat || !generalChat.IsA("TextChannel"))
			throw error("Could not create system chat TextChannels/RBXSystem");
		this.GeneralTextChannel = generalChat;
	}

	writeToGeneral(message: string) {
		this.GeneralTextChannel.DisplaySystemMessage(message);
	}
}
