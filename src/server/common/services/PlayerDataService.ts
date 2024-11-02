import { OnInit, Service } from "@flamework/core";
import Signal from "@rbxts/signal";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { Players, RunService } from "@rbxts/services";

import { store } from "server/common/store";
import { initialPlayerData, PlayerData, Settings } from "shared/store/slices/players/PlayerData";
import { selectPlayerDataSettings } from "shared/store/selectors/playerdata";

import { DoubletapService } from "./DoubletapService";
import { Events } from "../network";

let DataStoreName = "Production";
const KEY_TEMPLATE = "%d_Data";

if (RunService.IsStudio()) DataStoreName = "Testing";

@Service()
export class PlayerDataService implements OnInit {
	// https://github.com/MadStudioRoblox/ProfileService/blob/master/Examples/PlayerProfileExample.server.lua

	private profileStore = ProfileService.GetProfileStore(DataStoreName, initialPlayerData);
	private profiles = new Map<number, Profile<PlayerData>>();

	constructor(private DoubletapService: DoubletapService) {}

	onInit(): void | Promise<void> {
		Players.PlayerAdded.Connect((player) => {
			this.playerAdded(player);
		});
		Players.PlayerRemoving.Connect((player) => {
			this.playerRemoving(player);
		});
		Events.setPlayerSettings.connect((player, settings) => {
			this.setPlayerSettings(player, settings);
		});
	}

	playerAdded(player: Player) {
		// TODO does this actually do anything?
		const profile = this.profileStore.LoadProfileAsync(`PlayerData_${player.UserId}`);
		if (!profile) return;

		profile.ListenToRelease(() => {
			// -- The profile could've been loaded on another Roblox server:
			this.profiles.delete(player.UserId);
			player.Kick();
		});
		profile.AddUserId(player.UserId);
		profile.Reconcile();
		// TODO probably put all data
		store.putSettings(player.UserId, profile.Data.settings);

		const waitSignal = new Signal();
		const unsubscribe = store.subscribe(selectPlayerDataSettings(player.UserId), (save) => {
			if (save) {
				profile.Data.settings = save;
			}
			waitSignal.Fire();
		});
		const playerremoving = Players.PlayerRemoving.Connect((player) => {
			if (player === player) unsubscribe();
		});

		if (player.IsDescendantOf(Players)) {
			// loaded succesfully
		} else {
			// player left before loaded
			profile.Release();
		}
		waitSignal.Wait();
		playerremoving.Disconnect();
	}

	playerRemoving(player: Player) {
		const profile = this.profiles.get(player.UserId);
		if (!profile) return;
		profile.Release();
	}

	// getPlayerSettings(player: Player) {
	// 	const profile = this.profiles.get(player.UserId);
	// 	if (!profile) return;
	// 	return profile.Data.settings;
	// }

	setPlayerSettings(player: Player, settings: Settings) {
		if (this.DoubletapService.isDoubletapped(`PlayerDataService.setPlayerSettings.${player.UserId}`, 5000)) {
			store.putSettings(player.UserId, settings);
		}
	}
}
