import { Make } from "@rbxts/altmake";
import Object from "@rbxts/object-utils";
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

export function writeObjectToFolder(name: string, object: object): Folder {
	const folder = Make("Folder", {
		Name: name,
	});
	Object.entries(object).forEach(([k, v]) => {
		if (typeOf(v)) {
			switch (typeOf(v)) {
				case "string":
					Make("StringValue", {
						Parent: folder,
						Name: k as string,
						Value: v as string,
					});
					break;
				case "number":
					Make("NumberValue", {
						Parent: folder,
						Name: k as string,
						Value: v as number,
					});
					break;
				case "Instance":
					Make("ObjectValue", {
						Parent: folder,
						Name: k as string,
						Value: v as Instance,
					});
					break;
				default:
					throw error(`An unknown type was provided to writeObjectToFolder: [${typeOf(k)}, ${typeOf(v)}]`);
			}
		}
	});
	return folder;
}

export function readObjectFromFolder<T>(folder: Folder): T {
	const object: Record<string, unknown> = {};
	folder.GetChildren().forEach((child) => {
		if (child.IsA("StringValue") || child.IsA("NumberValue") || child.IsA("ObjectValue")) {
			object[child.Name] = child.Value;
		} else {
			throw error(`Unknown type read from Folder: ${folder.Name}: ${child.Name}:${typeOf(child)}`);
		}
	});
	const typedObject = object as T;
	if (typedObject === undefined) throw error(`Failed to read folder: ${folder.Name}`);
	typedObject;
	return typedObject;
}
