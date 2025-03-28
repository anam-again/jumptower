export const enum ComponentTags {}

export const TAGS = {
	StaticNPC: "StaticNPC",
	PassPurchaseArea: "PassPurchaseArea",
	EndlesslyRotating: "EndlesslyRotating",
	ThoughtProvidor: "ThoughtProvider",
};

export const PlaceIds = {
	Tower: 12345,
};

export const PASSES = {
	SUPERSupporter: 976809595,
	MINISupporter: 975603593,
};

export const COLOURS = {
	Black: new Color3(0, 0, 0),
	White: new Color3(1, 1, 1),
	UIBase: new Color3(0.16, 0.41, 0.64),
	UIBaseAlt: new Color3(0.05, 0.47, 0.47),
	UILighter: new Color3(0.49, 0.64, 0.75),
	UIDarker: new Color3(0.15, 0.23, 0.23),
	UIBorderContrast: new Color3(0.41, 0.6, 0.54),
	Red: new Color3(1, 0, 0),
	SuccessGreen: new Color3(0.02, 0.61, 0.22),
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
	ICON_Menu: "rbxassetid://99396165563805",
};

export const SOUNDS = {
	Click1: "rbxassetid://86885124671986",
	Click2: "rbxassetid://133158780412357",
	RobloxClick: "rbxassetid://15675032796",
	FutureClick: "rbxassetid://4499400560",

	ErrorSound: "rbxassetid://2130284653",
	GlassSplat: "rbxassetid://9114616111",
	GlassSplat2: "rbxassetid://9114615719",
	HelloNeighborJump: "rbxassetid://5672293922",
	RobloxCuteGoodbye: "rbxassetid://15675081158",
	UITapVariant: "rbxassetid://3623733749",
	doinkyStep: "rbxassetid://3318723701",
	hl2UIRollover: "rbxassetid://3199281218",
	uiHover: "rbxassetid://18926058970",
} satisfies Record<string, string>;

export const ANIMATION = {
	Dab: "rbxassetid://122516657393506", // "rbxassetid://107196631869033",
	JumpCharge: "rbxassetid://114612606535573", // "rbxassetid://82558693603473",
	JumpChargePose: "rbxassetid://118080321233142", // 117764993181844",
	IdlePose1: "rbxassetid://72840286158559", // "rbxassetid://140439813641021",
	WalkPose1: "rbxassetid://87731425337699", // "rbxassetid://118163663049093",
	AirbornPose: "rbxassetid://135790858384936", // "rbxassetid://119565995642288",
	FallingPose: "rbxassetid://92159168619662", // "rbxassetid://106940000293842",
	BouncedAirbornPose: "rbxassetid://121832166768726", // "rbxassetid://83598200427543",
	FloorFallenPose: "rbxassetid://73935809113324", // "rbxassetid://116292074515293",
};

export const MUSIC = {
	CalmNightPiano: "rbxassetid://84718875261044",
	SoftPiano: "rbxassetid://124854852380942",
	Gymnopedie: "rbxassetid://9045766377",
	ClaireDeLune: "rbxassetid://1838457617",

	Reflection: "rbxassetid://9042437001",

	LoFiChillA: "rbxassetid://9043887091",
	BossaMe: "rbxassetid://1837768517",
	Relax: "rbxassetid://1839841807",
	QuietnessSustained: "rbxassetid://1848354561",
	WhenStarsCollide: "rbxassetid://9044560778",
};
