import { Workspace } from "@rbxts/services";

/**
 * Throws error if DNE . Find this lelement in ws.
 * @param path The path to the element
 * @param key The instance type of the element
 * @returns The thing you're looking for
 */
export function getWorkspaceInstance<T extends keyof Instances>(path: Array<string>, key: T): Instances[T] {
	let instance = Workspace.FindFirstChild(path[0]);
	path.forEach((p, i) => {
		if (i === 0) return;
		if (instance === undefined) {
			throw error(`Unable to find workspace instance with path: ${path.join("/")}`);
		}
		instance = instance.FindFirstChild(p);
	});
	if (instance === undefined) {
		throw error(`Unable to find workspace instance with path: ${path.join("/")}`);
	}
	if (instance.IsA(key)) {
		return instance;
	} else {
		throw error(
			`Found instance of path: ${path.join("/")}, but not of correct type: ${key}. Found: ${instance.ClassName}`,
		);
	}
}
