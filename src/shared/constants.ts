export const enum ComponentTags {
	SporeUnitComponent = "SporeUnitComponent",
}

export const TAGS = {
	DropPod: "Component_DropPod",
};

export const PlaceIds = {
	Lobby: 125910820416738,
	Sandy: 100020441650754,
	SpaceTest: 114245918015298,
};

export const COLOURS = {
	Black: new Color3(0, 0, 0),
	White: new Color3(1, 1, 1),
	UIBase: new Color3(0.16, 0.41, 0.64),
	UIBaseAlt: new Color3(0.05, 0.47, 0.47),
	UILighter: new Color3(0.49, 0.64, 0.75),
	UIDarker: new Color3(0.15, 0.23, 0.23),
	UIBorderContrast: new Color3(0.41, 0.6, 0.54),
} satisfies Record<string, Color3>;

export const FONTS = {
	Title: Enum.Font.Michroma,
	Main: Enum.Font.Ubuntu,
	Mono: Enum.Font.RobotoMono,
	Highlight: Enum.Font.Jura,
} satisfies Record<string, Enum.Font>;

export const FONT_SIZE = {
	Common: 16,
};

export const IMAGES = {
	SporefloodLogo: "rbxassetid://138098951816242",
	Icon_Settings: "rbxassetid://119419849776528",
	Icon_Karet: "rbxassetid://103590594401864",
	Icon_X: "rbxassetid://111252320257144",
	Icon_CheckEmpty: "rbxassetid://130305656750612",
	Icon_CheckFull: "rbxassetid://81366002350009",
	ICON_Camera: "rbxassetid://105977539213887",
};

export const SOUNDS = {
	Click1: "rbxassetid://86885124671986",
	Click2: "rbxassetid://133158780412357",
};

export const ANIMATION = {
	Dab: "rbxassetid://107196631869033",
};
