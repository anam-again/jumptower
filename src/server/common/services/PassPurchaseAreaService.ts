import { OnStart, Service } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { PASSES, TAGS } from "shared/constants";
import { StaticNPCDialogue } from "shared/types";
import { getWorkspaceInstance } from "shared/utils/workspace";

@Service({})
export class PassPurchaseAreaService implements OnStart {
	private makePassPurchaseArea(source: BasePart, passId: number) {
		const sourceFolder = Make("Folder", { Name: "PassPurchaseAreaService", Parent: source });
		Make("NumberValue", {
			Parent: sourceFolder,
			Name: "PassId",
			Value: passId,
		});
		source.AddTag(TAGS.PassPurchaseArea);
	}

	onStart(): void {
		this.makePassPurchaseArea(
			getWorkspaceInstance(["Triggers", "DonateTrigger"], "BasePart"),
			PASSES.MINISupporter,
		);
	}
}
