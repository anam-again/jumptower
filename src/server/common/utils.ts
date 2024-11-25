export function getOrWaitForServerCharacter(player: Player): Model {
	if (player.Character) {
		return player.Character;
	}
	const [character] = player.CharacterAdded.Wait();
	return character;
}
