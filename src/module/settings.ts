import { i18n } from "./lib/lib";
import API from "./api";
import CONSTANTS from "./constants";

export const registerSettings = function () {
	game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetAllSettings", {
		name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
		icon: "fas fa-coins",
		type: ResetSettingsDialog,
		restricted: true,
	});

	// ========================================================
	// Arms Reach
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableArmsReach", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameEnableArmsReachFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintEnableArmsReachFeature`),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
		onChange: (data) => {
			// manageSettingsArmsReachFeature(data);
		},
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "notificationsInteractionFail", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotificationsFailedInteraction`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotificationsFailedInteraction`),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	// DEPRECATED

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistance", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionDistance`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalMaximumInteractionDistance`),
		scope: "world",
		config: true,
		default: 0, // instead of 1
		type: Number,
		//@ts-ignore
		range: { min: 0, max: 5, step: 1 },
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionMeasurement", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
		scope: "world",
		config: true,
		default: 5,
		type: Number,
		//@ts-ignore
		range: { min: 0, max: 20, step: 1 },
	});

	// game.settings.register(CONSTANTS.MODULE_NAME, 'globalInteractionDistanceForGM', {
	//   name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotificationsFailedInteractionEvenForGM`),
	//   hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotificationsFailedInteractionEvenForGM`),
	//   scope: 'world',
	//   config: true,
	//   default: false,
	//   type: Boolean,
	// });

	game.settings.register(CONSTANTS.MODULE_NAME, "forceReSelection", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameAvoidSelectsTheControlledToken`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintAvoidSelectsTheControlledToken`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "useOwnedTokenIfNoTokenIsSelected", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameUseOwnedTokenIfNoTokenIsSelected`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintUseOwnedTokenIfNoTokenIsSelected`),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	//@ts-ignore
	// KeybindLib.register(MODULE_NAME, "setCustomKeyBindForDoorInteraction", {
	// 	name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameSetCustomKeyBindForDoorInteraction`),
	// 	hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintSetCustomKeyBindForDoorInteraction`),
	// 	config: true,
	// 	default: "KeyE",
	// 	onKeyDown: () => {
	// 		console.log("Key pressed!");
	// 	}
	// });

	//   game.settings.register(CONSTANTS.MODULE_NAME,'setDistanceModeForDoorInteraction',{
	//     name: i18n(CONSTANTS.MODULE_NAME+".settingNameSetDistanceModeForDoorInteraction"),
	//     hint: i18n(CONSTANTS.MODULE_NAME+".settingHintSetDistanceModeForDoorInteraction"),
	//     scope: "world",
	//     config: false,
	//     default: "0",
	//     type: String,
	//     choices: {
	//         "0" : "Manhattan",
	//         "1" : "Euclidean",
	//         "2" : "Chebyshev"
	//     }
	//   });

	game.settings.register(CONSTANTS.MODULE_NAME, "autoCheckElevationByDefault", {
		name: `${CONSTANTS.MODULE_NAME}.settingNameAutoCheckElevationByDefault`,
		hint: `${CONSTANTS.MODULE_NAME}.settingHintAutoCheckElevationByDefault`,
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ========================================================
	// DOOR SUPPORT
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableDoorsIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDoorsIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDoorsIntegrationFeature`),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnDoors", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnDoors`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnDoors`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// DEPRECATED AND REMOVED

	game.settings.register(CONSTANTS.MODULE_NAME, "doorInteractionDistance", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorDistanceInteraction`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintMaximumDoorDistanceInteraction`),
		scope: "world",
		config: false,
		default: 0, // instead of 1
		type: Number,
		//@ts-ignore
		range: { min: 0, max: 10, step: 0.5 },
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "doorInteractionMeasurement", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintMaximumDoorMeasurementInteraction`),
		scope: "world",
		config: true,
		default: 0, // 5 before
		type: Number,
		//@ts-ignore
		range: { min: 0, max: 50, step: 1 },
	});

	// DEPRECATED

	game.settings.register(CONSTANTS.MODULE_NAME, "hotkeyDoorInteraction", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameHotKeyForInteraction`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintHotKeyForInteraction`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// DEPRECATED (double tap)

	game.settings.register(CONSTANTS.MODULE_NAME, "hotkeyDoorInteractionDelay", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDoubleTapInteraction`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDoubleTapInteraction`),
		scope: "world",
		config: true,
		default: 0, // 1 before // 200 before
		type: Number,
		//@ts-ignore
		//range: { min: 0, max: 750, step: 50 },
		range: { min: 0, max: 5, step: 0.5 },
	});

	// DEPRECATED

	game.settings.register(CONSTANTS.MODULE_NAME, "hotkeyDoorInteractionCenter", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameHotKeyToCenterCamera`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintHotKeyToCenterCamera`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "disableDoorSound", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDisableDoorSound`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDisableDoorSound`),
		scope: "world",
		config: true,
		default: true,
		type: Boolean,
	});

	// ========================================================
	// STAIRWAY SUPPORT
	// ========================================================

	// First of all Depends if the module is present and active

	game.settings.register(CONSTANTS.MODULE_NAME, "enableStairwaysIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameStairwaysIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintStairwaysIntegrationFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnStairways", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnStairways`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnStairways`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ========================================================
	// JOURNAL SUPPORT
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableJournalsIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotesIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotesIntegrationFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnNotes", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnNotes`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnNotes`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ========================================================
	// TOKEN SUPPORT
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableTokensIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnTokens", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnTokens`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnTokens`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "tokensIntegrationWithLootSheet", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationWithLootSheet`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationWithLootSheet`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "tokensIntegrationByPrefix", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationByPrefix`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationByPrefix`),
		scope: "world",
		config: true,
		default: "ART_",
		type: String,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "tokensIntegrationExplicitName", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationExplicitName`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationExplicitName`),
		scope: "client",
		config: true,
		default: game.user?.character?.name ?? "",
		type: String,
	});

	// ========================================================
	// LIGHT SUPPORT
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableLightsIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameLightsIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintLightsIntegrationFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnLights", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnLights`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnLights`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ========================================================
	// SOUNDS SUPPORT
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableSoundsIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameSoundsIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintSoundsIntegrationFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnSounds", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnSounds`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnSounds`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ========================================================
	// DRAWING SUPPORT
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableDrawingsIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDrawingsIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDrawingsIntegrationFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnDrawings", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnDrawings`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnDrawings`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ========================================================
	// TILE SUPPORT
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableTilesIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTilesIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTilesIntegrationFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnTiles", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnTiles`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnTiles`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ========================================================
	// WALL SUPPORT
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableWallsIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameWallsIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintWallsIntegrationFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	game.settings.register(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnWalls", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnWalls`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnWalls`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ========================================================
	// TEMPLATES SUPPORT
	// ========================================================

	// game.settings.register(CONSTANTS.MODULE_NAME, 'enableTemplatesIntegration', {
	//   name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTemplatesIntegrationFeature`),
	//   hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTemplatesIntegrationFeature`),
	//   scope: 'world',
	//   config: true,
	//   default: false,
	//   type: Boolean,
	// });

	// ========================================================
	// TAGGER SUPPORT
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableTaggerIntegration", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTaggerIntegrationFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTaggerIntegrationFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// ========================================================
	// Reset Doors and Fog
	// ========================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "enableResetDoorsAndFog", {
		name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameResetDoorsAndFogFeature`),
		hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintResetDoorsAndFogFeature`),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
	});

	// =========================================================
	// RANGE OVERLAY
	// =========================================================
	/*
  game.settings.register(CONSTANTS.MODULE_NAME, 'enableRangeOverlay', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameRangeOverlayFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintRangeOverlayFeature`),
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  const settingNames = {
    IS_ACTIVE: 'is-active',
    IC_VISIBILITY: 'ic_visibility',
    OOC_VISIBILITY: 'ooc_visibility',
    SHOW_TURN_ORDER: 'show-turn-order',
    SHOW_POTENTIAL_TARGETS: 'show-potential-targets',
    SHOW_DIFFICULT_TERRAIN: 'show-difficult-terrain',
    SHOW_WALLS: 'show-walls',
    MOVEMENT_ALPHA: 'movement-alpha',
    RANGES: 'ranges',
    DIAGONALS: 'diagonals',
    SHOW_WEAPON_RANGE: 'show-weapon-range',
    SPEED_ATTR_PATH: 'speed-attr-path',
    INFO_BUTTON: 'info-button',
    IGNORE_DIFFICULT_TERRAIN: 'ignore-difficult-terrain',
  };
  const hiddenSettings = [settingNames.IS_ACTIVE];

  const defaultFalse = [
    settingNames.IS_ACTIVE,
    settingNames.SHOW_DIFFICULT_TERRAIN,
    settingNames.SHOW_WALLS,
    settingNames.IGNORE_DIFFICULT_TERRAIN,
  ];

  const ignore = [
    settingNames.MOVEMENT_ALPHA,
    settingNames.IC_VISIBILITY,
    settingNames.OOC_VISIBILITY,
    settingNames.RANGES,
    settingNames.DIAGONALS,
    settingNames.SPEED_ATTR_PATH,
    settingNames.INFO_BUTTON,
  ];

  // noinspection JSUnusedLocalSymbols
  for (const [key, settingName] of Object.entries(settingNames)) {
    if (!ignore.includes(settingName)) {
      game.settings.register(CONSTANTS.MODULE_NAME, settingName, {
        name: `${CONSTANTS.MODULE_NAME}.${settingName}`,
        hint: `${CONSTANTS.MODULE_NAME}.${settingName}-hint`,
        // name: `${CONSTANTS.MODULE_NAME}.quick-settings.${settingName}.name`,
        // hint: `${CONSTANTS.MODULE_NAME}.quick-settings.${settingName}.hint`,
        scope: 'client',
        config: !hiddenSettings.includes(settingName),
        type: Boolean,
        default: !defaultFalse.includes(settingName),
        onChange: () => {
          API.combatRangeOverlay.instance.fullRefresh();
        },
      });
    }
  }

  game.settings.register(CONSTANTS.MODULE_NAME, 'movement-alpha', {
    name: `${CONSTANTS.MODULE_NAME}.movement-alpha`,
    hint: `${CONSTANTS.MODULE_NAME}.movement-alpha-hint`,
    scope: 'client',
    config: false,
    type: Number,
    default: 0.1,
    range: <any>{
      min: 0,
      max: 1,
      step: 0.05,
    },
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'ic_visibility', {
    name: `${CONSTANTS.MODULE_NAME}.ic_visibility`,
    hint: `${CONSTANTS.MODULE_NAME}.ic_visibility-hint`,
    scope: 'client',
    config: false,
    type: String,
    default: `never`,
    choices: <any>{
      always: `${CONSTANTS.MODULE_NAME}.visibilities.overlayVisibility.always`,
      hotkeys: `${CONSTANTS.MODULE_NAME}.visibilities.overlayVisibility.hotkeys`,
      never: `${CONSTANTS.MODULE_NAME}.visibilities.overlayVisibility.never`,
    },
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'ooc_visibility', {
    name: `${CONSTANTS.MODULE_NAME}.ooc_visibility`,
    hint: `${CONSTANTS.MODULE_NAME}.ooc_visibility-hint`,
    scope: 'client',
    config: false,
    type: String,
    default: `never`,
    choices: <any>{
      always: `${CONSTANTS.MODULE_NAME}.visibilities.overlayVisibility.always`,
      hotkeys: `${CONSTANTS.MODULE_NAME}.visibilities.overlayVisibility.hotkeys`,
      never: `${CONSTANTS.MODULE_NAME}.visibilities.overlayVisibility.never`,
    },
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'ranges', {
    name: `${CONSTANTS.MODULE_NAME}.ranges`,
    hint: `${CONSTANTS.MODULE_NAME}.ranges-hint`,
    scope: 'client',
    config: false,
    type: String,
    default: '5',
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'diagonals', {
    name: `${CONSTANTS.MODULE_NAME}.diagonals.name`,
    hint: `${CONSTANTS.MODULE_NAME}.diagonals.hint`,
    scope: 'world',
    config: false,
    type: String,
    default: 'fiveTenFive',
    choices: <any>{
      fiveTenFive: `${CONSTANTS.MODULE_NAME}.diagonals.fiveTenFive`,
      tenFiveTen: `${CONSTANTS.MODULE_NAME}.diagonals.tenFiveTen`,
      five: `${CONSTANTS.MODULE_NAME}.diagonals.five`,
      ten: `${CONSTANTS.MODULE_NAME}.diagonals.ten`,
    },
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'speed-attr-path', {
    name: `${CONSTANTS.MODULE_NAME}.speed-attr-path`,
    hint: `${CONSTANTS.MODULE_NAME}.speed-attr-path-hint`,
    scope: 'world',
    config: false,
    type: String,
    default: '',
  });
  */
	// ===================================================================

	game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
		name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
		hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
		scope: "client",
		config: true,
		default: false,
		type: Boolean,
	});

	// =========================================================

	// const settings = defaultSettings();
	// for (const [name, data] of Object.entries(settings)) {
	//     game.settings.register(CONSTANTS.MODULE_NAME, name, <any>data);
	// }

	// for (const [name, data] of Object.entries(otherSettings)) {
	//     game.settings.register(CONSTANTS.MODULE_NAME, name, data);
	// }
};

class ResetSettingsDialog extends FormApplication<FormApplicationOptions, object, any> {
	constructor(...args) {
		//@ts-ignore
		super(...args);
		//@ts-ignore
		return new Dialog({
			title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.title`),
			content:
				'<p style="margin-bottom:1rem;">' +
				game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.content`) +
				"</p>",
			buttons: {
				confirm: {
					icon: '<i class="fas fa-check"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.confirm`),
					callback: async () => {
						await applyDefaultSettings();
						window.location.reload();
					},
				},
				cancel: {
					icon: '<i class="fas fa-times"></i>',
					label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.cancel`),
				},
			},
			default: "cancel",
		});
	}

	async _updateObject(event: Event, formData?: object): Promise<any> {
		// do nothing
	}
}

async function applyDefaultSettings() {
	// const settings = defaultSettings(true);
	// for (const [name, data] of Object.entries(settings)) {
	//   await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
	// }
	const settings2 = otherSettings(true);
	for (const [name, data] of Object.entries(settings2)) {
		await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
	}
}

// function defaultSettings(apply = false) {
//   return {
//     //
//   };
// }

function otherSettings(apply = false) {
	return {
		// senses: {
		//   scope: 'world',
		//   config: false,
		//   //@ts-ignore
		//   default: apply && SYSTEMS.DATA ? SYSTEMS.DATA.SENSES : [],
		//   type: Array,
		// },

		// ========================================================
		// Arms Reach
		// ========================================================

		enableArmsReach: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameEnableArmsReachFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintEnableArmsReachFeature`),
			scope: "world",
			config: true,
			default: true,
			type: Boolean,
			onChange: (data) => {
				// manageSettingsArmsReachFeature(data);
			},
		},

		notificationsInteractionFail: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotificationsFailedInteraction`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotificationsFailedInteraction`),
			scope: "world",
			config: true,
			default: true,
			type: Boolean,
		},

		// DEPRECATED

		globalInteractionDistance: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionDistance`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalMaximumInteractionDistance`),
			scope: "world",
			config: true,
			default: 0, // instead of 1
			type: Number,
			//@ts-ignore
			range: { min: 0, max: 5, step: 1 },
		},

		globalInteractionMeasurement: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
			scope: "world",
			config: true,
			default: 5,
			type: Number,
			//@ts-ignore
			range: { min: 0, max: 20, step: 1 },
		},

		globalInteractionDistanceForGM: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotificationsFailedInteractionEvenForGM`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotificationsFailedInteractionEvenForGM`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		forceReSelection: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameAvoidSelectsTheControlledToken`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintAvoidSelectsTheControlledToken`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		useOwnedTokenIfNoTokenIsSelected: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameUseOwnedTokenIfNoTokenIsSelected`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintUseOwnedTokenIfNoTokenIsSelected`),
			scope: "world",
			config: true,
			default: true,
			type: Boolean,
		},

		//@ts-ignore
		// KeybindLib.register(MODULE_NAME, "setCustomKeyBindForDoorInteraction: {
		// 	name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameSetCustomKeyBindForDoorInteraction`),
		// 	hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintSetCustomKeyBindForDoorInteraction`),
		// 	config: true,
		// 	default: "KeyE",
		// 	onKeyDown: () => {
		// 		console.log("Key pressed!");
		// 	}
		// },

		// setDistanceModeForDoorInteraction: {
		//     name: i18n(CONSTANTS.MODULE_NAME+".settingNameSetDistanceModeForDoorInteraction"),
		//     hint: i18n(CONSTANTS.MODULE_NAME+".settingHintSetDistanceModeForDoorInteraction"),
		//     scope: "world",
		//     config: false,
		//     default: "0",
		//     type: String,
		//     choices: {
		//         "0" : "Manhattan",
		//         "1" : "Euclidean",
		//         "2" : "Chebyshev"
		//     }
		//   },

		autoCheckElevationByDefault: {
			name: `${CONSTANTS.MODULE_NAME}.settingNameAutoCheckElevationByDefault`,
			hint: `${CONSTANTS.MODULE_NAME}.settingHintAutoCheckElevationByDefault`,
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// ========================================================
		// DOOR SUPPORT
		// ========================================================

		enableDoorsIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDoorsIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDoorsIntegrationFeature`),
			scope: "world",
			config: true,
			default: true,
			type: Boolean,
		},

		globalInteractionDistanceForGMOnDoors: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnDoors`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnDoors`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// DEPRECATED AND REMOVED

		doorInteractionDistance: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorDistanceInteraction`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintMaximumDoorDistanceInteraction`),
			scope: "world",
			config: false,
			default: 0, // instead of 1
			type: Number,
			//@ts-ignore
			range: { min: 0, max: 10, step: 0.5 },
		},

		doorInteractionMeasurement: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintMaximumDoorMeasurementInteraction`),
			scope: "world",
			config: true,
			default: 0, // 5 before
			type: Number,
			//@ts-ignore
			range: { min: 0, max: 50, step: 1 },
		},

		// DEPRECATED

		hotkeyDoorInteraction: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameHotKeyForInteraction`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintHotKeyForInteraction`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// DEPRECATED (double tap)

		hotkeyDoorInteractionDelay: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDoubleTapInteraction`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDoubleTapInteraction`),
			scope: "world",
			config: true,
			default: 0, // 1 before // 200 before
			type: Number,
			//@ts-ignore
			//range: { min: 0, max: 750, step: 50 },
			range: { min: 0, max: 5, step: 0.5 },
		},

		// DEPRECATED

		hotkeyDoorInteractionCenter: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameHotKeyToCenterCamera`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintHotKeyToCenterCamera`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		disableDoorSound: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDisableDoorSound`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDisableDoorSound`),
			scope: "world",
			config: true,
			default: true,
			type: Boolean,
		},

		// ========================================================
		// STAIRWAY SUPPORT
		// ========================================================

		// First of all Depends if the module is present and active

		enableStairwaysIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameStairwaysIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintStairwaysIntegrationFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		globalInteractionDistanceForGMOnStairways: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnStairways`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnStairways`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// ========================================================
		// JOURNAL SUPPORT
		// ========================================================

		enableJournalsIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotesIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotesIntegrationFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		globalInteractionDistanceForGMOnNotes: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnNotes`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnNotes`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// ========================================================
		// TOKEN SUPPORT
		// ========================================================

		enableTokensIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		globalInteractionDistanceForGMOnTokens: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnTokens`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnTokens`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		tokensIntegrationWithLootSheet: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationWithLootSheet`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationWithLootSheet`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		tokensIntegrationByPrefix: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationByPrefix`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationByPrefix`),
			scope: "world",
			config: true,
			default: "ART_",
			type: String,
		},

		tokensIntegrationExplicitName: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationExplicitName`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationExplicitName`),
			scope: "client",
			config: true,
			default: game.user?.character?.name ?? "",
			type: String,
		},

		// ========================================================
		// LIGHT SUPPORT
		// ========================================================

		enableLightsIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameLightsIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintLightsIntegrationFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		globalInteractionDistanceForGMOnLights: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnLights`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnLights`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// ========================================================
		// SOUNDS SUPPORT
		// ========================================================

		enableSoundsIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameSoundsIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintSoundsIntegrationFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		globalInteractionDistanceForGMOnSounds: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnSounds`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnSounds`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// ========================================================
		// DRAWING SUPPORT
		// ========================================================

		enableDrawingsIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDrawingsIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDrawingsIntegrationFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		globalInteractionDistanceForGMOnDrawings: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnDrawings`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnDrawings`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// ========================================================
		// TILE SUPPORT
		// ========================================================

		enableTilesIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTilesIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTilesIntegrationFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		globalInteractionDistanceForGMOnTiles: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnTiles`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnTiles`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// ========================================================
		// WALL SUPPORT
		// ========================================================

		enableWallsIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameWallsIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintWallsIntegrationFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		globalInteractionDistanceForGMOnWalls: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalInteractionDistanceForGMOnWalls`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalInteractionDistanceForGMOnWalls`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// ========================================================
		// TEMPLATES SUPPORT
		// ========================================================

		// enableTemplatesIntegration: {
		//   name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTemplatesIntegrationFeature`),
		//   hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTemplatesIntegrationFeature`),
		//   scope: 'world',
		//   config: true,
		//   default: false,
		//   type: Boolean,
		// },

		// ========================================================
		// TAGGER SUPPORT
		// ========================================================

		enableTaggerIntegration: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTaggerIntegrationFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTaggerIntegrationFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		// ========================================================
		// Reset Doors and Fog
		// ========================================================

		enableResetDoorsAndFog: {
			name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameResetDoorsAndFogFeature`),
			hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintResetDoorsAndFogFeature`),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
		},

		debug: {
			name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
			hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
			scope: "client",
			config: true,
			default: false,
			type: Boolean,
		},
	};
}
