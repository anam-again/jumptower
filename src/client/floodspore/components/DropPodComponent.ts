import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import { ContextActionService, Players } from "@rbxts/services";

import { TAGS } from "shared/constants";
import { Events } from "client/common/network";
import { getObjectSubInstance } from "shared/utils/object";

// TODO: https://create.roblox.com/docs/tutorials/use-case-tutorials/input-and-camera/detecting-user-input

const ACTIONS = {
	DeployDropship: "DeployDropship",
};

@Component({
	tag: TAGS.DropPod,
})
export class DropPodComponent extends BaseComponent<{}> implements OnStart {
	onStart(): void {
		this.checkSeats();
	}

	checkSeats() {
		[
			getObjectSubInstance(this.instance, ["Seat1"], "VehicleSeat"),
			getObjectSubInstance(this.instance, ["Seat2"], "VehicleSeat"),
			getObjectSubInstance(this.instance, ["Seat3"], "VehicleSeat"),
			getObjectSubInstance(this.instance, ["Seat4"], "VehicleSeat"),
		].forEach((seat) => {
			seat.GetPropertyChangedSignal("Occupant").Connect(() => {
				this.occupantChanged(seat);
			});
		});
	}

	occupantChanged(seat: VehicleSeat) {
		if (seat.Occupant === undefined) return;
		if (Players.GetPlayerFromCharacter(seat.Occupant.Parent) === Players.LocalPlayer) {
			ContextActionService.BindAction(
				ACTIONS.DeployDropship,
				() => {
					if (!this.instance.IsA("Model")) return;
					Events.deployDropship.fire(this.instance);
				},
				true,
				Enum.KeyCode.E,
			);
			seat.GetPropertyChangedSignal("Occupant").Once(() => {
				ContextActionService.UnbindAction(ACTIONS.DeployDropship);
			});
		}
	}
}
