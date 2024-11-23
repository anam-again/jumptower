import { Players } from "@rbxts/services";

export function getOrWaitForLocalCharacter(): Model {
	if (Players.LocalPlayer.Character) {
		return Players.LocalPlayer.Character;
	}
	const [character] = Players.LocalPlayer.CharacterAdded.Wait();
	return character;
}
