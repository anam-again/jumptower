import { Players } from "@rbxts/services";

interface GiveToolToPlayerPartExtensionProps {
	tool: Tool;
	playerAllowlist?: Array<Player>;
	tagOnGive?: string;
}

export class GiveToolToPlayerPartExtension {
	private readonly parent!: BasePart;
	private tool!: Tool;
	private tagOnGive?: string;
	private playerAllowlist!: Array<Player>;

	constructor(parent: BasePart, props: GiveToolToPlayerPartExtensionProps) {
		this.parent = parent;
		this.tool = props.tool;
		this.tagOnGive = props.tagOnGive;
		this.playerAllowlist = [];
		if (props.playerAllowlist) this.playerAllowlist = props.playerAllowlist;
		this.parent.Touched.Connect((part) => {
			const player = Players.GetPlayerFromCharacter(part.Parent);
			if (player) {
				const giveTool = this.tool.Clone();
				const backpack = player.FindFirstChildOfClass("Backpack");
				if (
					backpack &&
					!backpack.FindFirstChild(giveTool.Name) &&
					player.Character &&
					!player.Character.FindFirstChild(giveTool.Name)
				) {
					giveTool.Parent = backpack;
				}
				if (this.tagOnGive !== undefined) {
					giveTool.AddTag(this.tagOnGive);
				}
			}
		});
		task.spawn(() => {
			this.cleanEmptyEntriesInAllowlist();
		});
	}

	public addPlayerToAllowlist(player: Player | undefined) {
		player && this.playerAllowlist.push(player);
	}
	public emptyAllowlist() {
		this.playerAllowlist = [];
	}

	private cleanEmptyEntriesInAllowlist() {
		while (true) {
			wait(180);
			this.playerAllowlist = this.playerAllowlist.filter((player) => {
				return player !== undefined;
			});
		}
	}
}
