type Tool_BasicBlaster = Tool & {
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
}
