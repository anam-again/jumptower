import Signal from "@rbxts/signal";

interface TrackedObject {
	part: BasePart;
	isInField: boolean;
}

export class TriggerAreaExtension {
	private readonly parent!: BasePart;
	private trackedObjects: Array<TrackedObject> = [];

	public onEnter = new Signal<(_: BasePart) => void>();
	public onExit = new Signal<(_: BasePart) => void>();

	constructor(parent: BasePart) {
		this.parent = parent;
		task.spawn(() => {
			this.cleanTrackedObjectList();
		});
		task.spawn(() => {
			this.checkCollisions();
		});
	}

	private isInField(part: BasePart) {
		return (
			part.Position.X > this.parent.Position.X - this.parent.Size.X / 2 &&
			part.Position.X < this.parent.Position.X + this.parent.Size.X / 2 &&
			part.Position.Y > this.parent.Position.Y - this.parent.Size.Y / 2 &&
			part.Position.Y < this.parent.Position.Y + this.parent.Size.Y / 2 &&
			part.Position.Z > this.parent.Position.Z - this.parent.Size.Z / 2 &&
			part.Position.Z < this.parent.Position.Z + this.parent.Size.Z / 2
		);
	}

	private checkCollisions() {
		while (true) {
			task.wait(0.2);
			this.trackedObjects.forEach((object) => {
				if (object.isInField === false && this.isInField(object.part)) {
					object.isInField = true;
					this.onEnter.Fire(object.part);
				} else if (object.isInField === true && !this.isInField(object.part)) {
					object.isInField = false;
					this.onExit.Fire(object.part);
				}
			});
		}
	}

	addTrackedObject(part: BasePart) {
		this.trackedObjects.push({
			part,
			isInField: false,
		});
	}

	cleanTrackedObjectList() {
		while (true) {
			task.wait(20);
			this.trackedObjects = this.trackedObjects.filter((object) => {
				return object.part.Parent !== undefined;
			});
		}
	}
}
