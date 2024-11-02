import React, { useEffect, useState } from "@rbxts/react";
import { Players } from "@rbxts/services";
import { useSelectorCreator } from "@rbxts/react-reflex";

import ScreenGui from "client/common/ui/components/screenGui";
import { IMAGES } from "shared/constants";
import { selectPlayerDataSettings } from "shared/store/selectors/playerdata";
import { initialPlayerData } from "shared/store/slices/players/PlayerData";
import { Events } from "client/common/network";
import { ClientSignals } from "client/common/signals";

import CamerasPage from "./components/CamerasPage";
import Frame from "../components/frame";
import EventLog from "./components/EventLog";
import TeleportLoadingScreen from "./components/TeleportLoadingScreen";
import GameFadeInScreen from "./components/GameFadeInScreen";
import ControlBar from "./components/ControlBar";
import MovableWindow from "../components/movableWindow";
import SettingsPage from "./components/SettingsPage";

export default function CommonGUIApp() {
	const [eventLogIsOpen, setEventLogIsOpen] = useState(true);
	const [settingsIsOpen, setSettingsIsOpen] = useState(false);
	const [camerasIsOpen, setCamerasIsOpen] = useState(false);

	const settings =
		useSelectorCreator(selectPlayerDataSettings, Players.LocalPlayer.UserId) ?? initialPlayerData.settings;

	useEffect(() => {
		setEventLogIsOpen(settings.eventLogOpen);
	}, [settings.eventLogOpen]);

	return (
		<ScreenGui>
			<Frame BackgroundTransparency={1} Size={new UDim2(1, 0, 1, 0)}>
				<Frame Position={new UDim2(0, 0, 1, -150)} Size={new UDim2(0, 300, 0, 150)}>
					<uilistlayout FillDirection={"Vertical"} VerticalAlignment={"Bottom"} />
					<EventLog isOpen={eventLogIsOpen} />
					<ControlBar
						onOpenChatClick={() => {
							Events.setPlayerSettings({
								...settings,
								eventLogOpen: !eventLogIsOpen,
							});
							setEventLogIsOpen(!eventLogIsOpen);
						}}
						onSettingsClick={() => {
							setSettingsIsOpen(!settingsIsOpen);
						}}
						onCamerasClick={() => {
							setCamerasIsOpen(!camerasIsOpen);
						}}
						settingsIsOpen={settingsIsOpen}
						eventLogIsOpen={eventLogIsOpen}
						camerasIsOpen={camerasIsOpen}
					/>
				</Frame>
				<TeleportLoadingScreen />
				<GameFadeInScreen />
				<MovableWindow
					onCloseClicked={() => {
						setSettingsIsOpen(!settingsIsOpen);
					}}
					isOpen={settingsIsOpen}
					title="Settings"
					icon={IMAGES.Icon_Settings}
				>
					<SettingsPage playerDataSettings={settings} />
				</MovableWindow>
				<MovableWindow
					onCloseClicked={() => {
						ClientSignals.ForceCamera.Fire(undefined);
						setCamerasIsOpen(!camerasIsOpen);
					}}
					isOpen={camerasIsOpen}
					title="Cameras"
					icon={IMAGES.ICON_Camera}
				>
					<CamerasPage />
				</MovableWindow>
			</Frame>
		</ScreenGui>
	);
}
