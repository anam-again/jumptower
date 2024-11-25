export interface StaticNPCDialogue {
	text: string;
	delayUntilNext: number;
}

export interface InputState {
	Up: boolean;
	Left: boolean;
	Down: boolean;
	Right: boolean;
	Jump: boolean;
}
export enum Facing {
	Up,
	Down,
	Left,
	Right,
}

export interface PlayerState {
	player: Player;
	inputState: InputState;
	facing: Facing;
	hitbox: Part;
	model: Model;
	dy: number;
	dx: number;
	isGrounded: boolean;
	isBounced: boolean;
	chargingJump: boolean;
	startedChargingJumpAt: number;
	floorFallen: boolean;
	floorFallenDt: number;
	isWalking: boolean;
}

export interface MirroredState {
	position: [number, number];
	facing: Facing;
}

export enum PlayerAnimations {
	bouncedAirbornPose = "bouncedAirbornPose",
	floorFallenPose = "floorFallenPose",
	fallingPose = "fallingPose",
	airbornPose = "airbornPose",
	walkPose1 = "walkPose1",
	idlePose1 = "idlePose1",
	jumpChargePose = "jumpChargePose",
	jumpCharge = "jumpCharge",
	dab = "dab",
}

export enum PlayerSounds {
	jumpChargeStartSound = "jumpChargeStartSound",
	landSound = "landSound",
	jumpSound = "jumpSound",
	glassSplat = "glassSplat",
	bounceSound = "bounceSound",
	doinkyStep = "doinkyStep",
}
