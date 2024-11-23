import Signal from "@rbxts/signal";
import { getOrWaitForLocalCharacter } from "client/common/utils";

export class PlayerTriggerAreaExtension {
	public onEnter = new Signal<() => void>();
	public onExit = new Signal<() => void>();

	private triggerArea!: BasePart;
	private playerRoot!: BasePart;

	private playerIsInField = false;

	constructor(triggerArea: BasePart) {
		this.playerRoot = getOrWaitForLocalCharacter().WaitForChild("HumanoidRootPart") as BasePart;
		this.triggerArea = triggerArea;
		task.spawn(() => {
			this.checkCollisions();
		});
	}

	private isPlayerInField() {
		return (
			this.playerRoot.Position.X > this.triggerArea.Position.X - this.triggerArea.Size.X / 2 &&
			this.playerRoot.Position.X < this.triggerArea.Position.X + this.triggerArea.Size.X / 2 &&
			this.playerRoot.Position.Y > this.triggerArea.Position.Y - this.triggerArea.Size.Y / 2 &&
			this.playerRoot.Position.Y < this.triggerArea.Position.Y + this.triggerArea.Size.Y / 2 &&
			this.playerRoot.Position.Z > this.triggerArea.Position.Z - this.triggerArea.Size.Z / 2 &&
			this.playerRoot.Position.Z < this.triggerArea.Position.Z + this.triggerArea.Size.Z / 2
		);
	}

	private checkCollisions() {
		while (true) {
			task.wait(0.5);
			if (this.playerIsInField === false && this.isPlayerInField()) {
				this.playerIsInField = true;
				this.onEnter.Fire();
			} else if (this.playerIsInField === true && !this.isPlayerInField()) {
				this.playerIsInField = false;
				this.onExit.Fire();
			}
		}
	}
}
