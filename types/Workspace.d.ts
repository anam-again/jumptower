interface Workspace extends Model {
	Objects: Folder & {
		Tool_BasicBlaster: Tool & {
			Handle: Part & {
				TouchInterest: TouchTransmitter;
				WeldConstraint: WeldConstraint;
			};
			BeamOrigin: Part & {
				AttachmentOrigin: Attachment;
				WeldConstraint: WeldConstraint;
			};
			Body: Model & {
				Union: UnionOperation;
			};
		};
	};
	Camera: Camera;
	SpawnedEffects: Folder;
	SpawnedSpores: Folder;
	Map: Folder & {
		Spawners: Folder & {
			Spawn1: Part;
			Spawn2: Part;
			Spawn8: Part;
			Spawn6: Part;
			Spawn5: Part;
			Spawn7: Part;
			Spawn10: Part;
			Spawn9: Part;
			Spawn4: Part;
			Spawn3: Part;
		};
		Baseplate: Part & {
			Texture: Texture;
		};
		GlassBox: Folder;
		temp: Folder & {
			button: Part;
			GiveGunButton: Part;
		};
		SpawnLocation: SpawnLocation & {
			Decal: Decal;
		};
		RoomBlocks: Folder;
	};
}
