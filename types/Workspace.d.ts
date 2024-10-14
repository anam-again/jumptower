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
		baseplate: Part & {
			Texture: Texture;
		};
	};
	Camera: Camera;
	SpawnedEffects: Folder;
	SpawnedSpores: Folder;
	Map: Folder & {
		Baseplate: Part & {
			Texture: Texture;
		};
		Lobby: Folder & {
			Teleporter: Part & {
				SurfaceLight: SurfaceLight;
				PointLight: PointLight;
			};
			Static: Folder & {
				Furniture: Folder;
				Building: Folder;
				Outside_Stuff: Folder & {
					["Animated Tree"]: Model & {
						TreeMeshTop: Part & {
							TopTreeMesh: SpecialMesh;
						};
						Part: MeshPart & {
							Weld: Weld;
						};
					};
					TallGrass: Model;
					Maxwell: Model & {
						maxwell: MeshPart & {
							SurfaceAppearance: SurfaceAppearance;
							weld: Weld;
						};
						forgor: MeshPart;
					};
					["Tree With Grass"]: Model;
					["Flower Bush Grass"]: Model & {
						["Large Bush G"]: MeshPart;
						["Large Bush F"]: MeshPart & {
							Weld: Weld;
						};
					};
				};
				SpawnLocation: SpawnLocation & {
					Decal: Decal;
				};
				GlassDome: Folder;
			};
		};
		Map_Testing: Folder & {
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
			PlayerSpawn: Part & {
				PointLight: PointLight;
			};
			temp: Folder & {
				GiveLaserButton: Part & {
					Tool_BasicBlaster: Tool;
					Body: Model & {
						Union: UnionOperation;
					};
				};
			};
			GlassBox: Folder;
			RoomBlocks: Folder;
		};
	};
}
