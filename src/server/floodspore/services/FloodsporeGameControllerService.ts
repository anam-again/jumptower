import { Service, OnStart, Dependency } from "@flamework/core";
import { Make, Modify } from "@rbxts/altmake";
import { Players, Workspace } from "@rbxts/services";
import { Events } from "server/common/network";
import { GiveToolToPlayerPartExtension } from "shared/components/Extensions/GiveToolToPlayerPartExtension";
import { createGUID } from "shared/utils/guid";
import { DoubletapService } from "../../common/services/DoubletapService";
import { ComponentTags } from "shared/constants";
import { store } from "server/common/store";
import Signal from "@rbxts/signal";
import { OneWayTeleporterExtension } from "server/common/components/extensions/OneWayTeleporterExtension";
import { Components } from "@flamework/components";
import { teleportPlayerToPart } from "../../common/utils/commands";
import { raceAndTerminateTasks } from "shared/utils/task";
import { getWorkspaceInstance } from "shared/utils/workspace";

const SPORE_SIZE = 4;
const SPORE_SIZE_I = 1 / SPORE_SIZE; // todo remove

interface SporeConfig {
	shuffleInterval_s: number;

	finalPhaseCapSize: number;
	finalPhaseGrowth_s: number;
	finalPhaseMinBound: number;

	overgrowthPhaseCapSize: number;
	regularPhaseUpperBound: number;
	regularPhaseLinearConstant: number;
	regularPhaseMinBound: number;
}
interface GameConfig {
	startingSporeGrowthLoops: number;
	maxStartingSpawnersUsed: number;
	timeLimit: number;
}
interface GameConfigValues {
	spore: SporeConfig;
	game: GameConfig;
}

export const GAME_CONFIG = {
	Normal: {
		spore: {
			finalPhaseCapSize: 80 * (SPORE_SIZE_I / 2),
			finalPhaseGrowth_s: 0.05 * SPORE_SIZE_I,
			finalPhaseMinBound: 0.3,
			overgrowthPhaseCapSize: 8000 * SPORE_SIZE_I,
			regularPhaseLinearConstant: 16000 * SPORE_SIZE_I,
			regularPhaseMinBound: 0.05,
			regularPhaseUpperBound: 0.8 - SPORE_SIZE_I * 0.25,
			shuffleInterval_s: 0.2,
		},
		game: {
			maxStartingSpawnersUsed: 2,
			startingSporeGrowthLoops: 200,
			timeLimit: 240,
		},
	},
	Dev: {
		spore: {
			finalPhaseCapSize: 100,
			finalPhaseGrowth_s: 0,
			finalPhaseMinBound: 5,
			overgrowthPhaseCapSize: 8000 * SPORE_SIZE_I,
			regularPhaseLinearConstant: 16000 * SPORE_SIZE_I,
			regularPhaseMinBound: 0.05,
			regularPhaseUpperBound: 0.5 - SPORE_SIZE_I * 0.25,
			shuffleInterval_s: 0.2,
		},
		game: {
			maxStartingSpawnersUsed: 1,
			startingSporeGrowthLoops: 0,
			timeLimit: 1028,
		},
	},
} satisfies Record<string, GameConfigValues>;

interface GameStartProps {}

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

export enum GameResult {
	Victory,
	Timeout,
	Critical,
}

@Service({})
export class FloodsporeGameControllerService implements OnStart {
	private sporeMap: Map<string, Part> = new Map<string, Part>();
	/**
	 * Please only pop/push this. Rbxts doesn't give me a queue/stack
	 **/
	private activeSporeList: Array<string> = [];
	private gameConfig!: GameConfigValues;

	private SpawnedSporesFolder = getWorkspaceInstance(["floodspore", "SpawnedSpores"], "Folder");

	onStart() {
		task.spawn(() => {
			this.handleSporeHitEvent();
		});
		getWorkspaceInstance(["floodspore", "Spawners"], "Folder")
			.GetChildren()
			.forEach((part) => {
				if (!part.IsA("BasePart")) return;
				Modify(part, {
					Transparency: 1,
				});
			});
	}

	spawnSpawnerSpores(maxSpawnersToUse: number) {
		let spawners = getWorkspaceInstance(["floodspore", "Spawners"], "Folder").GetChildren();
		this.shuffle(spawners);
		spawners = spawners.filter((_, i) => {
			// there is no array.slice, which would be preffered here
			return i < maxSpawnersToUse;
		});
		spawners.forEach((child) => {
			if (!child.IsA("BasePart")) return;
			const pos = new SimpleVector(child.Position);
			const poss = pos.toString();
			const fSpore = this.makeSporeHere(pos);
			if (fSpore === undefined) return;
			this.sporeMap.set(poss, fSpore);
			this.activeSporeList.push(poss);
			store.setSporeCount(this.sporeMap.size());
		});
	}

	deleteAllSpores() {
		this.sporeMap.forEach((s) => {
			s.Destroy();
		});
		this.sporeMap.clear();
		this.activeSporeList.clear();
	}

	startGame(gameConfig: GameConfigValues): GameResult {
		this.gameConfig = gameConfig;
		this.deleteAllSpores();
		this.spawnSpawnerSpores(gameConfig.game.maxStartingSpawnersUsed);
		for (let i = 0; i < this.gameConfig.game.startingSporeGrowthLoops; i++) {
			this.shuffleSwapRandomActiveSpore();
			this.growNextQueuedSpore();
			task.wait(0.01);
		}
		Events.writeToEventLog.fire(Players.GetPlayers(), "Spores have been spawned!");
		const gameEndTask = raceAndTerminateTasks([
			() => {
				task.wait(110);
				Events.writeToEventLog(Players.GetPlayers(), "Only ten seconds left to defeat the flood!");
				for (let i = 10; i > 0; i--) {
					Events.writeToEventLog(Players.GetPlayers(), `${i} seconds remaining...`);
					task.wait(1);
				}
			},
			() => {
				while (this.sporeMap.size() < 5000) {
					task.wait(5);
				}
				Events.writeToEventLog(Players.GetPlayers(), "The Flood is too large! They've gone critical!");
				task.wait(1);
			},
			() => {
				while (this.activeSporeList.size() > 0) {
					this.shuffleSwapRandomActiveSpore();
					task.wait(this.gameConfig.spore.shuffleInterval_s);
				}
			},
			() => {
				while (this.activeSporeList.size() > 0) {
					this.growNextQueuedSpore();
					const w = this.waitTimeUntilNextQueuedSporeSpawn();
					task.wait(w);
				}
			},
		]);

		switch (gameEndTask) {
			case 0:
				return GameResult.Timeout;
			case 1:
				return GameResult.Critical;
			default:
				return GameResult.Victory;
		}
	}

	/**
	 * Wait a calculated amount of time;
	 */
	waitTimeUntilNextQueuedSporeSpawn(): number {
		const x = this.sporeMap.size();
		if (x < this.gameConfig.spore.finalPhaseCapSize) {
			return math.max(this.gameConfig.spore.finalPhaseMinBound, this.gameConfig.spore.finalPhaseGrowth_s * x);
		} else if (x > this.gameConfig.spore.overgrowthPhaseCapSize) {
			return 0.001;
		}
		return math.max(
			this.gameConfig.spore.regularPhaseMinBound,
			this.gameConfig.spore.regularPhaseUpperBound - x / this.gameConfig.spore.regularPhaseLinearConstant,
		);
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

	private shuffleSwapRandomActiveSpore() {
		const activeSporeListSize = this.activeSporeList.size();
		const randomIndex = math.floor(math.random() * activeSporeListSize);
		const headValue = this.activeSporeList[activeSporeListSize - 1];
		this.activeSporeList[activeSporeListSize - 1] = this.activeSporeList[randomIndex];
		this.activeSporeList[randomIndex] = headValue;
	}

	/**
	 * This function does not handle the store.sporeCount variable, instead, calling functions can batch together this operation
	 */
	makeSporeHere(position: SimpleVector): Part | undefined {
		const part = Make("Part", {
			Position: position.toVector3(),
			Size: new Vector3(SPORE_SIZE, SPORE_SIZE, SPORE_SIZE),
			Parent: this.SpawnedSporesFolder,
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
