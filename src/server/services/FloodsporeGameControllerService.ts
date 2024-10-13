import { Service, OnStart } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { Players, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { GiveToolToPlayerPartExtension } from "shared/components/Extensions/GiveToolToPlayerPartExtension";
import { createGUID } from "shared/utils/guid";
import { DoubletapService } from "./DoubletapService";
import { ComponentTags } from "shared/tags";
import { store } from "server/store";

const SPORE_SIZE = 4;
const SPORE_SHUFFLE_INTERVAL_S = 5;

class SimpleVector {
	private x!: number;
	private y!: number;
	private z!: number;

	constructor(input: Vector3);
	constructor(input: string);
	constructor(x?: number, y?: number, z?: number);
	constructor(...args: Array<unknown>) {
		if (args.size() < 1) {
			throw error();
		} else if (
			args.size() === 3 &&
			typeIs(args[0], "number") &&
			typeIs(args[1], "number") &&
			typeIs(args[2], "number")
		) {
			this.x = math.floor(args[0]);
			this.y = math.floor(args[1]);
			this.z = math.floor(args[2]);
		} else if (typeIs(args[0], "string")) {
			const v = this.fromString(args[0]);
			this.x = v.x;
			this.y = v.y;
			this.z = v.z;
		} else if (typeIs(args[0], "Vector3")) {
			this.x = math.floor(args[0].X);
			this.y = math.floor(args[0].Y);
			this.z = math.floor(args[0].Z);
		}
	}

	toString(): string {
		return `${this.x},${this.y},${this.z}`;
	}

	toVector3(): Vector3 {
		return new Vector3(this.x, this.y, this.z);
	}

	fromString(input: string): SimpleVector {
		const split = input.split(",");
		if (split.size() !== 3) throw error(`Malformed input to create SimpleVector from string: ${input}`);
		return new SimpleVector(tonumber(split[0]), tonumber(split[1]), tonumber(split[2]));
	}

	add(input: SimpleVector): SimpleVector {
		return new SimpleVector(this.x + input.x, this.y + input.y, this.z + input.z);
	}
	addN(x: number, y: number, z: number): SimpleVector {
		return new SimpleVector(this.x + x, this.y + y, this.z + z);
	}
}

@Service({})
export class FloodsporeGameControllerService implements OnStart {
	private id = createGUID();
	private sporeMap: Map<string, Part> = new Map<string, Part>();
	/**
	 * Please only pop/push this. Rbxts doesn't give me a queue/stack
	 **/
	private activeSporeList: Array<string> = [];

	onStart() {
		task.spawn(() => {
			this.handleSporeHitEvent();
		});
		// temp
		Workspace.Map.temp.button.Touched.Connect((part) => {
			if (DoubletapService.isDoubletapped(this.id, 1000 * 10)) {
				this.sporeMap.forEach((s) => {
					s.Destroy();
				});
				this.sporeMap.clear();
				this.activeSporeList.clear();
				Workspace.Map.Spawners.GetChildren().forEach((child) => {
					if (!child.IsA("BasePart")) return;
					const pos = new SimpleVector(child.Position);
					const poss = pos.toString();
					const fSpore = this.makeSporeHere(pos);
					if (fSpore === undefined) return;
					this.sporeMap.set(poss, fSpore);
					this.activeSporeList.push(poss);
					store.setSporeCount(this.sporeMap.size());
				});
				this.startGame();
			}
		});

		new GiveToolToPlayerPartExtension(Workspace.Map.temp.GiveGunButton, {
			tool: Workspace.Objects.Tool_BasicBlaster.Clone(),
		});
	}

	startGame() {
		task.spawn(() => {
			Events.writeToEventLog.fire(Players.GetPlayers(), "Spores have been spawned!");
			while (this.activeSporeList.size() > 0) {
				task.wait(SPORE_SHUFFLE_INTERVAL_S);
				this.shuffle(this.activeSporeList);
			}
			Events.writeToEventLog.fire(Players.GetPlayers(), "All spores defeated.");
		});
		while (this.activeSporeList.size() > 0) {
			this.growNextQueuedSpore();
			const w = this.waitTimeUntilNextQueuedSporeSpawn();
			task.wait(w);
		}
	}

	/**
	 * Wait a calculated amount of time;
	 * TODO Tweak
	 */
	waitTimeUntilNextQueuedSporeSpawn(): number {
		// https://www.desmos.com/calculator/3i5jogkblw
		const x = this.sporeMap.size();
		if (x < 20) {
			return 0.05 * x;
		} else if (x > 2000) {
			return 0.001;
		}
		return math.max(0.1, 0.5 - x / 4000);
	}

	handleSporeHitEvent() {
		Events.clientKillSpore.connect((_, position) => {
			this.removeSpore(new SimpleVector(position));
		});
	}

	getPotentialNeighborsOfSpore(position: SimpleVector): Array<SimpleVector> {
		return [
			position.addN(SPORE_SIZE, 0, 0),
			position.addN(-SPORE_SIZE, 0, 0),
			position.addN(0, SPORE_SIZE, 0),
			position.addN(0, -SPORE_SIZE, 0),
			position.addN(0, 0, SPORE_SIZE),
			position.addN(0, 0, -SPORE_SIZE),
		];
	}

	growNextQueuedSpore() {
		let nextSpore = this.activeSporeList.pop();
		while (nextSpore !== undefined && !this.sporeMap.has(nextSpore)) {
			nextSpore = this.activeSporeList.pop();
		}
		if (nextSpore !== undefined) {
			this.growSpore(new SimpleVector(nextSpore));
		}
	}

	growSpore(position: SimpleVector) {
		const spores = this.getPotentialNeighborsOfSpore(position)
			.map((ppos) => {
				return {
					spore: this.makeSporeHere(ppos),
					ppos,
				};
			})
			.filter((spore) => {
				return spore.spore !== undefined;
			});
		this.shuffle(spores);
		spores.forEach((spore) => {
			if (spore.spore !== undefined) {
				const pposKey = spore.ppos.toString();
				this.sporeMap.set(pposKey, spore.spore);
				this.activeSporeList.push(pposKey);
			}
		});
		if (spores.size() > 0) {
			store.addSporeCount(spores.size());
		}
	}

	removeSpore(position: SimpleVector) {
		const sPos = position.toString();
		const spore = this.sporeMap.get(sPos);
		if (spore === undefined) return;
		spore.Destroy();
		this.sporeMap.delete(sPos);
		store.decrementSporeCount();
		this.getPotentialNeighborsOfSpore(position).forEach((ppos) => {
			const pposKey = ppos.toString();
			if (this.sporeMap.has(pposKey)) {
				this.activeSporeList.push(pposKey);
			}
		});
	}

	// https://decipher.dev/30-seconds-of-typescript/docs/shuffle/
	/**
	 * This changes the values in the array
	 */
	private shuffle(arr: Array<unknown>) {
		let m = arr.size();
		while (m > 0) {
			const i = math.floor(math.random() * m--);
			[arr[m], arr[i]] = [arr[i], arr[m]];
		}
		return arr;
	}

	/**
	 * This function does not handle the store.sporeCount variable, instead, calling functions can batch together this operation
	 */
	makeSporeHere(position: SimpleVector): Part | undefined {
		const part = Make("Part", {
			Position: position.toVector3(),
			Size: new Vector3(SPORE_SIZE, SPORE_SIZE, SPORE_SIZE),
			Parent: Workspace.SpawnedSpores,
			Anchored: true,
		});
		if (part.GetTouchingParts().size() > 0) {
			part.Destroy();
			return undefined;
		} else {
			part.AddTag(ComponentTags.SporeUnitComponent);
			return part;
		}
	}
}
