import { OnStart, Service } from "@flamework/core";
import { BaseComponent } from "@flamework/components";
import { Make } from "@rbxts/altmake";
import { Debris } from "@rbxts/services";

import { TAGS } from "shared/constants";
import { Events } from "server/common/network";
import { getWorkspaceInstance } from "shared/utils/workspace";
import { DoubletapService } from "server/common/services/DoubletapService";
import { getObjectSubInstance } from "shared/utils/object";

// TODO: https://create.roblox.com/docs/tutorials/use-case-tutorials/input-and-camera/detecting-user-input

@Service({})
export class DropPodService extends BaseComponent<{}> implements OnStart {
	constructor(private DoubletapService: DoubletapService) {
		super();
	}

	private dropshipReady = new Map<number, boolean>();
	private droppod = getWorkspaceInstance(["Objects", "DropPod"], "Model");
	private droppodFolder = getWorkspaceInstance(["Map", "Dropship", "Droppods"], "Folder");

	onStart(): void {
		const spawners = getWorkspaceInstance(["Map", "Dropship", "DroppodSpawners"], "Folder")
			.GetChildren()
			.filter((instance) => {
				return instance.IsA("BasePart");
			});
		let droppodCount = 0;
		spawners.forEach((spawner) => {
			if (!spawner.IsA("BasePart")) return;
			Make("NumberValue", {
				Parent: spawner,
				Name: "SpawnerIndex",
				Value: droppodCount,
			});
			this.addDropPod(spawner, droppodCount);
			droppodCount++;
		});
		Events.deployDropship.connect((player, droppod) => {
			const id = droppod.FindFirstChild("DroppodIndex");
			if (!id?.IsA("NumberValue")) return;
			if (this.DoubletapService.isDoubletapped(`droppod_${id.Value}`, 1000)) {
				if (this.dropshipReady.get(id.Value)) {
					this.dropshipReady.set(id.Value, false);
					droppod.RemoveTag(TAGS.DropPod);
					getObjectSubInstance(droppod, ["Base"], "BasePart").Anchored = false;
					[
						getObjectSubInstance(droppod, ["Seat1"], "VehicleSeat"),
						getObjectSubInstance(droppod, ["Seat2"], "VehicleSeat"),
						getObjectSubInstance(droppod, ["Seat3"], "VehicleSeat"),
						getObjectSubInstance(droppod, ["Seat4"], "VehicleSeat"),
					].forEach((seat) => {
						task.spawn(() => {
							if (seat.Occupant === undefined) return;
							this.freezePlayer(seat.Occupant);
						});
					});
					task.wait(2);
					droppod.GetChildren().forEach((child) => {
						child.GetChildren().forEach((child) => {
							if (child.IsA("WeldConstraint")) {
								child.Destroy();
							}
						});
					});
					const spawnerIndex = droppod.FindFirstChild("DroppodIndex");
					if (!spawnerIndex?.IsA("NumberValue")) return;
					const spawner = spawners.find((spawner) => {
						const s = spawner.FindFirstChild("SpawnerIndex");
						if (!s?.IsA("NumberValue")) return false;
						return s.Value === id.Value;
					});
					if (!spawner) return;
					if (!spawner.IsA("BasePart")) return;
					this.addDropPod(spawner, id.Value);
					Debris.AddItem(droppod, 5);
				}
			}
		});
	}

	private addDropPod(spawner: BasePart, spawnerId: number) {
		if (!spawner.IsA("BasePart")) return;
		const newDroppod = this.droppod.Clone();
		if (newDroppod.PrimaryPart === undefined) return;
		newDroppod.PrimaryPart.Position = spawner.Position;
		newDroppod.Parent = this.droppodFolder;
		const id = Make("NumberValue", {
			Parent: newDroppod,
			Name: "DroppodIndex",
			Value: spawnerId,
		});
		this.dropshipReady.set(id.Value, true);
	}

	private freezePlayer(humanoid: Humanoid, time_s = 3) {
		const orig = humanoid.JumpHeight;
		humanoid.JumpHeight = 0;
		task.wait(time_s);
		humanoid.JumpHeight = orig;
	}
}
