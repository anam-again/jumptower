import { Controller, OnStart } from "@flamework/core";
import { Make } from "@rbxts/altmake";
import { SoundService, Workspace } from "@rbxts/services";

interface EncapsulatedSoundProps {
	shouldVaryFollowupSounds?: boolean;
	track?: number;
}
interface EncapsulatedSound {
	sound: Array<Sound>;
	encapsulatedSoundProps?: EncapsulatedSoundProps;
}
export const enum TRACK {
	MASTER = 0,
	UI = 1,
	MUSIC = 2,
}
@Controller({})
export class CommonSoundController implements OnStart {
	private SoundFolder!: Folder;
	private soundGroups: Array<SoundGroup> = [];

	private soundsMap = new Map<string, EncapsulatedSound>();
	private music = new Array<Sound>();

	onStart() {
		this.SoundFolder = Make("Folder", {
			Name: "Sounds",
			Parent: Workspace,
		});
		this.soundGroups[TRACK.MASTER] = Make("SoundGroup", {
			Name: "Master",
			Parent: this.SoundFolder,
		});
		const comp = Make("CompressorSoundEffect", {
			Parent: this.soundGroups[0],
		});
		comp.GainMakeup = 18; // ?

		this.soundGroups[TRACK.UI] = Make("SoundGroup", {
			Name: "UI",
			Parent: this.SoundFolder,
		});

		this.soundGroups[TRACK.MUSIC] = Make("SoundGroup", {
			Name: "UI",
			Parent: this.SoundFolder,
		});
	}

	makeSound(track: TRACK, soundProps?: Partial<WritableInstanceProperties<Sound>>): Sound {
		const sg = this.soundGroups[track];
		return Make("Sound", {
			...soundProps,
			SoundGroup: sg,
			Parent: SoundService,
			Name: soundProps?.Name ?? soundProps?.SoundId,
		});
	}

	public registerSound(
		key: string,
		soundId: string,
		encapsulatedSoundProps?: EncapsulatedSoundProps,
		soundProps?: Partial<WritableInstanceProperties<Sound>>,
	) {
		if (this.soundsMap.get(key)) return;
		const sound = this.makeSound(encapsulatedSoundProps?.track ?? TRACK.MASTER, {
			...soundProps,
			SoundId: soundId,
		});
		this.soundsMap.set(key, {
			encapsulatedSoundProps,
			sound: [sound],
		});
	}

	public insertMusic(soundId: string) {
		// TODO lazy load these
		const sound = this.makeSound(TRACK.MUSIC, {
			SoundId: soundId,
			Volume: 0.2,
		});
		this.music.push(sound);
	}
	public playMusic() {
		task.spawn(() => {
			while (true) {
				this.music.forEach((song) => {
					song.Play();
					song.Ended.Wait();
				});
			}
		});
	}

	private appendSound(sound: EncapsulatedSound): Sound {
		// TODO cloning doesn't work
		const newsound = this.makeSound(sound.encapsulatedSoundProps?.track ?? TRACK.MASTER, {
			SoundId: sound.sound[0].SoundId,
			Parent: sound.sound[0].Parent,
			Volume: sound.sound[0].Volume,
			Playing: false,
		});
		if (sound.encapsulatedSoundProps?.shouldVaryFollowupSounds) {
			Make("EqualizerSoundEffect", {
				Parent: newsound,
				HighGain: math.random() * 20 - 10,
				MidGain: math.random() * 20 - 10,
				LowGain: math.random() * 20 - 10,
			});
		}
		return newsound;
	}

	public playSound(key: string) {
		// TODO, add indexing so it doesn't always search through?
		const sound = this.soundsMap.get(key);
		if (!sound) throw error(`playSound not found at key: ${key}`);
		const found = sound.sound.find((s) => {
			return s.Playing === false;
		});
		if (found) {
			found.Play();
		} else {
			const newSound = this.appendSound(sound);
			newSound.Play();
			sound.sound.push(newSound);
		}
	}
}
