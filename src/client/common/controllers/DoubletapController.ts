import { Controller } from "@flamework/core";
import Signal from "@rbxts/signal";

@Controller({})
export class DoubletapController {
	private doubletap: Map<string, Signal> = new Map<string, Signal>();

	setTapSignal(key: string, timeMs: number): Signal {
		if (this.doubletap.get(key)) {
			throw error(`Doubletap key already exists: ${key}`);
		}
		const signal = new Signal<() => void>();
		this.doubletap.set(key, signal);
		task.spawn(() => {
			task.wait(timeMs / 1000);
			signal.Fire();
			signal.Destroy();
			this.doubletap.delete(key);
		});
		return signal;
	}

	/**
	 * This function will set the doubletap array, and check it at the same time;
	 * @param key Must be unique
	 * @return If the doubletap exists already or not
	 **/
	isDoubletapped(key: string, timeMs = 1000): boolean {
		if (this.doubletap.get(key) === undefined) {
			this.setTapSignal(key, timeMs);
			return true;
		} else {
			// value already exists;
			return false;
		}
	}
}
