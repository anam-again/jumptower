export function getObjectSubInstance<T extends keyof Instances>(
	instance: Instance,
	path: Array<string>,
	key: T,
): Instances[T] {
	let instance_s: Instance | undefined = instance;
	path.forEach((p, i) => {
		if (instance_s === undefined) {
			throw error(`Unable to find workspace instance with path: ${path.join("/")}`);
		}
		instance_s = instance_s.FindFirstChild(p);
	});
	if (instance_s === undefined) {
		throw error(`Unable to find workspace instance with path: ${path.join("/")}`);
	}
	if (instance_s.IsA(key)) {
		return instance_s;
	} else {
		throw error(
			`Found instance of path: ${path.join("/")}, but not of correct type: ${key}. Found: ${instance_s.ClassName}`,
		);
	}
}
