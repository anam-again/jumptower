type DropPod = Model & {
	Seat4: VehicleSeat & {
		WeldConstraint: WeldConstraint;
	};
	Seat2: VehicleSeat & {
		WeldConstraint: WeldConstraint;
	};
	Seat3: VehicleSeat & {
		WeldConstraint: WeldConstraint;
	};
	Seat1: VehicleSeat & {
		WeldConstraint: WeldConstraint;
	};
	Base: Part;
	SpawnLocation: Part;
}
