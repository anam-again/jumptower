// TODO: How do you rewwrite this
import { Make, Modify } from "@rbxts/altmake";

interface TycoonSpawnedObjectExtensionProps {
	vectorForce: Vector3;
	value: number;
	maxForce: number;
	doNotCreateInstances?: boolean;
}

export class TycoonSpawnedObjectExtension {
	static readonly SPAWNED_OBJ_ID_VF = "TycoonSpawnedObjectIdentifier_VectorForce";
	static readonly SPAWNED_OBJ_ID_AT = "TycoonSpawnedObjectIdentifier_Attachment";
	static readonly SPAWNED_OBJ_ID_VA = "TycoonSpawnedObjectIdentifier_Value";

	private readonly parent!: Instance;
	public linearVelocity!: LinearVelocity;
	public attachment!: Attachment;
	public value!: NumberValue;

	constructor(parent: Instance, props: TycoonSpawnedObjectExtensionProps) {
		this.parent = parent;

		const va = parent.FindFirstChild(TycoonSpawnedObjectExtension.SPAWNED_OBJ_ID_VA);
		if (va?.IsA("NumberValue")) {
			this.value = va;
		} else {
			if (!props.doNotCreateInstances) {
				this.value = Make("NumberValue", {
					Name: TycoonSpawnedObjectExtension.SPAWNED_OBJ_ID_VA,
					Parent: parent,
					Value: props.value,
				});
			}
		}

		const at = parent.FindFirstChild(TycoonSpawnedObjectExtension.SPAWNED_OBJ_ID_AT);
		if (at?.IsA("Attachment")) {
			this.attachment = at;
		} else {
			if (!props.doNotCreateInstances) {
				this.attachment = Make("Attachment", {
					Name: TycoonSpawnedObjectExtension.SPAWNED_OBJ_ID_AT,
					Parent: parent,
				});
			}
		}

		const vf = parent.FindFirstChild(TycoonSpawnedObjectExtension.SPAWNED_OBJ_ID_VF);
		if (vf?.IsA("LinearVelocity")) {
			this.linearVelocity = vf;
		} else {
			if (!props.doNotCreateInstances) {
				this.linearVelocity = Make("LinearVelocity", {
					Name: TycoonSpawnedObjectExtension.SPAWNED_OBJ_ID_VF,
					Parent: parent,
					VectorVelocity: props.vectorForce,
					MaxForce: props.maxForce,
					Attachment0: this.attachment,
					Enabled: false,
				});
			}
		}
	}

	public static getExtensionInstance(instance: Instance): TycoonSpawnedObjectExtension | undefined {
		if (
			instance.FindFirstChild(TycoonSpawnedObjectExtension.SPAWNED_OBJ_ID_VF)?.IsA("LinearVelocity") &&
			instance.FindFirstChild(TycoonSpawnedObjectExtension.SPAWNED_OBJ_ID_AT)?.IsA("Attachment") &&
			instance.FindFirstChild(TycoonSpawnedObjectExtension.SPAWNED_OBJ_ID_VA)?.IsA("NumberValue")
		) {
			return new TycoonSpawnedObjectExtension(instance, {
				value: 0,
				vectorForce: new Vector3(0, 0, 0),
				doNotCreateInstances: true,
				maxForce: 0,
			});
		} else {
			return undefined;
		}
	}
}
