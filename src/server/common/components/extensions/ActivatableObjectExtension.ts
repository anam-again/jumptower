import { Modify } from "@rbxts/altmake";

interface ChangeableAttributes extends Partial<Pick<BasePart, "Color" | "Transparency" | "CanTouch" | "CanCollide">> {}
interface ActivateableAttributes {
	active: ChangeableAttributes;
	inactive: ChangeableAttributes;
}

export class ActivateableObjectExtension {
	private readonly parent!: BasePart | Folder | Model;
	public active!: boolean;
	private activateableAttributes!: ActivateableAttributes;

	constructor(parent: BasePart | Folder | Model, props: ActivateableAttributes) {
		this.parent = parent;
		this.activateableAttributes = props;
	}

	public activate() {
		this.active = true;
		this.recursivelySet(this.parent, this.activateableAttributes.active);
	}

	public inactive() {
		this.active = false;
		this.recursivelySet(this.parent, this.activateableAttributes.inactive);
	}

	private recursivelySet(part: BasePart | Folder | Model | BillboardGui, attributes: ChangeableAttributes) {
		part.GetChildren().forEach((child) => {
			if (
				child.IsA("BasePart") ||
				child.IsA("Folder") ||
				child.IsA("UnionOperation") ||
				child.IsA("Model") ||
				child.IsA("BillboardGui")
			) {
				this.recursivelySet(child, attributes);
			}
		});
		if (part.IsA("BasePart") || part.IsA("UnionOperation")) {
			Modify(part, attributes);
		} else if (part.IsA("BillboardGui")) {
			if (attributes.Transparency !== undefined) part.Enabled = attributes.Transparency < 0.5;
		}
	}
}
