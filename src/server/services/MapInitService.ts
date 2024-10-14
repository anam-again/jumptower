import { OnStart, Service } from "@flamework/core";
import { Workspace } from "@rbxts/services";

@Service({})
export class MapInitService implements OnStart {
	onStart(): void {
		Workspace.Map.Baseplate.Destroy();
	}
}
