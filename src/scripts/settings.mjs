import { i18n } from "./lib/lib.mjs";
import API from "./api.mjs";
import CONSTANTS from "./constants.mjs";

export const registerSettings = function () {
  game.settings.registerMenu(CONSTANTS.MODULE_ID, "resetAllSettings", {
    name: `${CONSTANTS.MODULE_ID}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.reset.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true,
  });

  // ========================================================
  // Arms Reach
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_ID, "enableArmsReach", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameEnableArmsReachFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintEnableArmsReachFeature`),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
    onChange: (data) => {
      // manageSettingsArmsReachFeature(data);
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, "notificationsInteractionFail", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameNotificationsFailedInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintNotificationsFailedInteraction`),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  // DEPRECATED

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistance", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalMaximumInteractionDistance`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalMaximumInteractionDistance`),
    scope: "world",
    config: true,
    default: 0, // instead of 1
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 5, step: 1 },
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionMeasurement", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalMaximumInteractionMeasurement`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalMaximumInteractionMeasurement`),
    scope: "world",
    config: true,
    default: 5,
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 20, step: 1 },
  });

  // game.settings.register(CONSTANTS.MODULE_ID, 'globalInteractionDistanceForGM', {
  //   name: i18n(`${CONSTANTS.MODULE_ID}.settingNameNotificationsFailedInteractionEvenForGM`),
  //   hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintNotificationsFailedInteractionEvenForGM`),
  //   scope: 'world',
  //   config: true,
  //   default: false,
  //   type: Boolean,
  // });

  game.settings.register(CONSTANTS.MODULE_ID, "forceReSelection", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameAvoidSelectsTheControlledToken`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintAvoidSelectsTheControlledToken`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "useOwnedTokenIfNoTokenIsSelected", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameUseOwnedTokenIfNoTokenIsSelected`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintUseOwnedTokenIfNoTokenIsSelected`),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  //@ts-ignore
  // KeybindLib.register(MODULE_ID, "setCustomKeyBindForDoorInteraction", {
  // 	name: i18n(`${CONSTANTS.MODULE_ID}.settingNameSetCustomKeyBindForDoorInteraction`),
  // 	hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintSetCustomKeyBindForDoorInteraction`),
  // 	config: true,
  // 	default: "KeyE",
  // 	onKeyDown: () => {
  // 		log("Key pressed!");
  // 	}
  // });

  //   game.settings.register(CONSTANTS.MODULE_ID,'setDistanceModeForDoorInteraction',{
  //     name: i18n(CONSTANTS.MODULE_ID+".settingNameSetDistanceModeForDoorInteraction"),
  //     hint: i18n(CONSTANTS.MODULE_ID+".settingHintSetDistanceModeForDoorInteraction"),
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

  game.settings.register(CONSTANTS.MODULE_ID, "autoCheckElevationByDefault", {
    name: `${CONSTANTS.MODULE_ID}.settingNameAutoCheckElevationByDefault`,
    hint: `${CONSTANTS.MODULE_ID}.settingHintAutoCheckElevationByDefault`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableInteractionForTokenOwnedByUser", {
    name: `${CONSTANTS.MODULE_ID}.settingNameEnableInteractionForTokenOwnedByUser`,
    hint: `${CONSTANTS.MODULE_ID}.settingHintEnableInteractionForTokenOwnedByUser`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // DOOR SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_ID, "enableDoorsIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameDoorsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintDoorsIntegrationFeature`),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDoors", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnDoors`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnDoors`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // DEPRECATED AND REMOVED

  game.settings.register(CONSTANTS.MODULE_ID, "doorInteractionDistance", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameMaximumDoorDistanceInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintMaximumDoorDistanceInteraction`),
    scope: "world",
    config: false,
    default: 0, // instead of 1
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 10, step: 0.5 },
  });

  game.settings.register(CONSTANTS.MODULE_ID, "doorInteractionMeasurement", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameMaximumDoorMeasurementInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintMaximumDoorMeasurementInteraction`),
    scope: "world",
    config: true,
    default: 0, // 5 before
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 50, step: 1 },
  });

  // DEPRECATED

  game.settings.register(CONSTANTS.MODULE_ID, "hotkeyDoorInteraction", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameHotKeyForInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintHotKeyForInteraction`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // DEPRECATED (double tap)

  game.settings.register(CONSTANTS.MODULE_ID, "hotkeyDoorInteractionDelay", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameDoubleTapInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintDoubleTapInteraction`),
    scope: "world",
    config: true,
    default: 0, // 1 before // 200 before
    type: Number,
    //@ts-ignore
    //range: { min: 0, max: 750, step: 50 },
    range: { min: 0, max: 5, step: 0.5 },
  });

  // DEPRECATED

  game.settings.register(CONSTANTS.MODULE_ID, "hotkeyDoorInteractionCenter", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameHotKeyToCenterCamera`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintHotKeyToCenterCamera`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "disableDoorSound", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameDisableDoorSound`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintDisableDoorSound`),
    scope: "world",
    config: true,
    default: true,
    type: Boolean,
  });

  // ========================================================
  // STAIRWAY SUPPORT
  // ========================================================

  // First of all Depends if the module is present and active

  game.settings.register(CONSTANTS.MODULE_ID, "enableStairwaysIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameStairwaysIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintStairwaysIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnStairways", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnStairways`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnStairways`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerStairwayIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerStairwayIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerStairwayIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // JOURNAL SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_ID, "enableJournalsIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameNotesIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintNotesIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnNotes", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnNotes`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnNotes`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerNoteIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerNoteIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerNoteIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // TOKEN SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_ID, "enableTokensIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnTokens", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnTokens`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnTokens`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "tokensIntegrationWithLootSheet", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationWithLootSheet`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationWithLootSheet`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "tokensIntegrationByPrefix", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationByPrefix`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationByPrefix`),
    scope: "world",
    config: true,
    default: "ART_",
    type: String,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "tokensIntegrationExplicitName", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationExplicitName`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationExplicitName`),
    scope: "client",
    config: true,
    default: game.user?.character?.name ?? "",
    type: String,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerTokenIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerTokenIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerTokenIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // LIGHT SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_ID, "enableLightsIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameLightsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintLightsIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnLights", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnLights`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnLights`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerLightIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerLightIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerLightIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // SOUNDS SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_ID, "enableSoundsIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameSoundsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintSoundsIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnSounds", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnSounds`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnSounds`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerSoundIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerSoundIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerSoundIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // DRAWING SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_ID, "enableDrawingsIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameDrawingsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintDrawingsIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDrawings", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnDrawings`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnDrawings`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerDrawingIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerDrawingIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerDrawingIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // TILE SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_ID, "enableTilesIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTilesIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTilesIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnTiles", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnTiles`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnTiles`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerTileIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerTileIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerTileIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // WALL SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_ID, "enableWallsIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameWallsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintWallsIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnWalls", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnWalls`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnWalls`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerWallIntegration", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerWallIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerWallIntegrationFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // TEMPLATES SUPPORT
  // ========================================================

  // game.settings.register(CONSTANTS.MODULE_ID, 'enableTemplatesIntegration', {
  //   name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTemplatesIntegrationFeature`),
  //   hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTemplatesIntegrationFeature`),
  //   scope: 'world',
  //   config: true,
  //   default: false,
  //   type: Boolean,
  // });

  // ========================================================
  // TAGGER SUPPORT
  // ========================================================

  // game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerIntegration", {
  // 	name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerIntegrationFeature`),
  // 	hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerIntegrationFeature`),
  // 	scope: "world",
  // 	config: true,
  // 	default: false,
  // 	type: Boolean,
  // });

  // ========================================================
  // Reset Doors and Fog
  // ========================================================
  /* REMOVED ON V11 IS IN CORE
  game.settings.register(CONSTANTS.MODULE_ID, "enableResetDoorsAndFog", {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameResetDoorsAndFogFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintResetDoorsAndFogFeature`),
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
  */
  // =========================================================
  // RANGE OVERLAY
  // =========================================================
  /*
  game.settings.register(CONSTANTS.MODULE_ID, 'enableRangeOverlay', {
    name: i18n(`${CONSTANTS.MODULE_ID}.settingNameRangeOverlayFeature`),
    hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintRangeOverlayFeature`),
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
      game.settings.register(CONSTANTS.MODULE_ID, settingName, {
        name: `${CONSTANTS.MODULE_ID}.${settingName}`,
        hint: `${CONSTANTS.MODULE_ID}.${settingName}-hint`,
        // name: `${CONSTANTS.MODULE_ID}.quick-settings.${settingName}.name`,
        // hint: `${CONSTANTS.MODULE_ID}.quick-settings.${settingName}.hint`,
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

  game.settings.register(CONSTANTS.MODULE_ID, 'movement-alpha', {
    name: `${CONSTANTS.MODULE_ID}.movement-alpha`,
    hint: `${CONSTANTS.MODULE_ID}.movement-alpha-hint`,
    scope: 'client',
    config: false,
    type: Number,
    default: 0.1,
    range: {
      min: 0,
      max: 1,
      step: 0.05,
    },
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'ic_visibility', {
    name: `${CONSTANTS.MODULE_ID}.ic_visibility`,
    hint: `${CONSTANTS.MODULE_ID}.ic_visibility-hint`,
    scope: 'client',
    config: false,
    type: String,
    default: `never`,
    choices: {
      always: `${CONSTANTS.MODULE_ID}.visibilities.overlayVisibility.always`,
      hotkeys: `${CONSTANTS.MODULE_ID}.visibilities.overlayVisibility.hotkeys`,
      never: `${CONSTANTS.MODULE_ID}.visibilities.overlayVisibility.never`,
    },
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'ooc_visibility', {
    name: `${CONSTANTS.MODULE_ID}.ooc_visibility`,
    hint: `${CONSTANTS.MODULE_ID}.ooc_visibility-hint`,
    scope: 'client',
    config: false,
    type: String,
    default: `never`,
    choices: {
      always: `${CONSTANTS.MODULE_ID}.visibilities.overlayVisibility.always`,
      hotkeys: `${CONSTANTS.MODULE_ID}.visibilities.overlayVisibility.hotkeys`,
      never: `${CONSTANTS.MODULE_ID}.visibilities.overlayVisibility.never`,
    },
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'ranges', {
    name: `${CONSTANTS.MODULE_ID}.ranges`,
    hint: `${CONSTANTS.MODULE_ID}.ranges-hint`,
    scope: 'client',
    config: false,
    type: String,
    default: '5',
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'diagonals', {
    name: `${CONSTANTS.MODULE_ID}.diagonals.name`,
    hint: `${CONSTANTS.MODULE_ID}.diagonals.hint`,
    scope: 'world',
    config: false,
    type: String,
    default: 'fiveTenFive',
    choices: {
      fiveTenFive: `${CONSTANTS.MODULE_ID}.diagonals.fiveTenFive`,
      tenFiveTen: `${CONSTANTS.MODULE_ID}.diagonals.tenFiveTen`,
      five: `${CONSTANTS.MODULE_ID}.diagonals.five`,
      ten: `${CONSTANTS.MODULE_ID}.diagonals.ten`,
    },
    onChange: () => {
      API.combatRangeOverlay.instance.fullRefresh();
    },
  });

  game.settings.register(CONSTANTS.MODULE_ID, 'speed-attr-path', {
    name: `${CONSTANTS.MODULE_ID}.speed-attr-path`,
    hint: `${CONSTANTS.MODULE_ID}.speed-attr-path-hint`,
    scope: 'world',
    config: false,
    type: String,
    default: '',
  });
  */
  // ===================================================================

  game.settings.register(CONSTANTS.MODULE_ID, "debug", {
    name: `${CONSTANTS.MODULE_ID}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_ID}.setting.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });

  // =========================================================

  // const settings = defaultSettings();
  // for (const [name, data] of Object.entries(settings)) {
  //     game.settings.register(CONSTANTS.MODULE_ID, name, data);
  // }

  // for (const [name, data] of Object.entries(otherSettings)) {
  //     game.settings.register(CONSTANTS.MODULE_ID, name, data);
  // }
};

class ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.content`) +
        "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.confirm`),
          callback: async () => {
            await applyDefaultSettings();
            window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_ID}.dialogs.resetsettings.cancel`),
        },
      },
      default: "cancel",
    });
  }

  async _updateObject(event, formData = undefined) {
    // do nothing
  }
}

async function applyDefaultSettings() {
  // const settings = defaultSettings(true);
  // for (const [name, data] of Object.entries(settings)) {
  //   await game.settings.set(CONSTANTS.MODULE_ID, name, data.default);
  // }
  const settings2 = otherSettings(true);
  for (const [name, data] of Object.entries(settings2)) {
    await game.settings.set(CONSTANTS.MODULE_ID, name, data.default);
  }
}

// function defaultSettings(apply = false) {
//   return {
//     //
//   };
// }

function otherSettings(apply = false) {
  return {
    // ========================================================
    // Arms Reach
    // ========================================================

    enableArmsReach: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameEnableArmsReachFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintEnableArmsReachFeature`),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
      onChange: (data) => {
        // manageSettingsArmsReachFeature(data);
      },
    },

    notificationsInteractionFail: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameNotificationsFailedInteraction`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintNotificationsFailedInteraction`),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    },

    // DEPRECATED

    globalInteractionDistance: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalMaximumInteractionDistance`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalMaximumInteractionDistance`),
      scope: "world",
      config: true,
      default: 0, // instead of 1
      type: Number,
      //@ts-ignore
      range: { min: 0, max: 5, step: 1 },
    },

    globalInteractionMeasurement: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalMaximumInteractionMeasurement`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalMaximumInteractionMeasurement`),
      scope: "world",
      config: true,
      default: 5,
      type: Number,
      //@ts-ignore
      range: { min: 0, max: 20, step: 1 },
    },

    globalInteractionDistanceForGM: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameNotificationsFailedInteractionEvenForGM`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintNotificationsFailedInteractionEvenForGM`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    forceReSelection: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameAvoidSelectsTheControlledToken`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintAvoidSelectsTheControlledToken`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    useOwnedTokenIfNoTokenIsSelected: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameUseOwnedTokenIfNoTokenIsSelected`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintUseOwnedTokenIfNoTokenIsSelected`),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    },

    //@ts-ignore
    // KeybindLib.register(MODULE_ID, "setCustomKeyBindForDoorInteraction: {
    // 	name: i18n(`${CONSTANTS.MODULE_ID}.settingNameSetCustomKeyBindForDoorInteraction`),
    // 	hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintSetCustomKeyBindForDoorInteraction`),
    // 	config: true,
    // 	default: "KeyE",
    // 	onKeyDown: () => {
    // 		log("Key pressed!");
    // 	}
    // },

    // setDistanceModeForDoorInteraction: {
    //     name: i18n(CONSTANTS.MODULE_ID+".settingNameSetDistanceModeForDoorInteraction"),
    //     hint: i18n(CONSTANTS.MODULE_ID+".settingHintSetDistanceModeForDoorInteraction"),
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
      name: `${CONSTANTS.MODULE_ID}.settingNameAutoCheckElevationByDefault`,
      hint: `${CONSTANTS.MODULE_ID}.settingHintAutoCheckElevationByDefault`,
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    enableInteractionForTokenOwnedByUser: {
      name: `${CONSTANTS.MODULE_ID}.settingNameEnableInteractionForTokenOwnedByUser`,
      hint: `${CONSTANTS.MODULE_ID}.settingHintEnableInteractionForTokenOwnedByUser`,
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // ========================================================
    // DOOR SUPPORT
    // ========================================================

    enableDoorsIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameDoorsIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintDoorsIntegrationFeature`),
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
    },

    globalInteractionDistanceForGMOnDoors: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnDoors`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnDoors`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // DEPRECATED AND REMOVED

    doorInteractionDistance: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameMaximumDoorDistanceInteraction`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintMaximumDoorDistanceInteraction`),
      scope: "world",
      config: false,
      default: 0, // instead of 1
      type: Number,
      //@ts-ignore
      range: { min: 0, max: 10, step: 0.5 },
    },

    doorInteractionMeasurement: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameMaximumDoorMeasurementInteraction`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintMaximumDoorMeasurementInteraction`),
      scope: "world",
      config: true,
      default: 0, // 5 before
      type: Number,
      //@ts-ignore
      range: { min: 0, max: 50, step: 1 },
    },

    // DEPRECATED

    hotkeyDoorInteraction: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameHotKeyForInteraction`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintHotKeyForInteraction`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // DEPRECATED (double tap)

    hotkeyDoorInteractionDelay: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameDoubleTapInteraction`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintDoubleTapInteraction`),
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
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameHotKeyToCenterCamera`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintHotKeyToCenterCamera`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    disableDoorSound: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameDisableDoorSound`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintDisableDoorSound`),
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
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameStairwaysIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintStairwaysIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    globalInteractionDistanceForGMOnStairways: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnStairways`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnStairways`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    enableTaggerStairwayIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerStairwayIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerStairwayIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // ========================================================
    // JOURNAL SUPPORT
    // ========================================================

    enableJournalsIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameNotesIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintNotesIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    globalInteractionDistanceForGMOnNotes: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnNotes`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnNotes`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    enableTaggerNoteIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerNoteIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerNoteIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // ========================================================
    // TOKEN SUPPORT
    // ========================================================

    enableTokensIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    globalInteractionDistanceForGMOnTokens: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnTokens`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnTokens`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    tokensIntegrationWithLootSheet: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationWithLootSheet`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationWithLootSheet`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    tokensIntegrationByPrefix: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationByPrefix`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationByPrefix`),
      scope: "world",
      config: true,
      default: "ART_",
      type: String,
    },

    tokensIntegrationExplicitName: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationExplicitName`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationExplicitName`),
      scope: "client",
      config: true,
      default: game.user?.character?.name ?? "",
      type: String,
    },

    enableTaggerTokenIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerTokenIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerTokenIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // ========================================================
    // LIGHT SUPPORT
    // ========================================================

    enableLightsIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameLightsIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintLightsIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    globalInteractionDistanceForGMOnLights: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnLights`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnLights`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    enableTaggerLightIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerLightIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerLightIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // ========================================================
    // SOUNDS SUPPORT
    // ========================================================

    enableSoundsIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameSoundsIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintSoundsIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    globalInteractionDistanceForGMOnSounds: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnSounds`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnSounds`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    enableTaggerSoundIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerSoundIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerSoundIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // ========================================================
    // DRAWING SUPPORT
    // ========================================================

    enableDrawingsIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameDrawingsIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintDrawingsIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    globalInteractionDistanceForGMOnDrawings: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnDrawings`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnDrawings`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    enableTaggerDrawingIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerDrawingIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerDrawingIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // ========================================================
    // TILE SUPPORT
    // ========================================================

    enableTilesIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTilesIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTilesIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    globalInteractionDistanceForGMOnTiles: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnTiles`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnTiles`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    enableTaggerTileIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerTileIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerTileIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // ========================================================
    // WALL SUPPORT
    // ========================================================

    enableWallsIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameWallsIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintWallsIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    globalInteractionDistanceForGMOnWalls: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnWalls`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnWalls`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    enableTaggerWallIntegration: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerWallIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerWallIntegrationFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    // ========================================================
    // TEMPLATES SUPPORT
    // ========================================================

    // enableTemplatesIntegration: {
    //   name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTemplatesIntegrationFeature`),
    //   hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTemplatesIntegrationFeature`),
    //   scope: 'world',
    //   config: true,
    //   default: false,
    //   type: Boolean,
    // },

    // ========================================================
    // TAGGER SUPPORT
    // ========================================================

    // enableTaggerIntegration: {
    // 	name: i18n(`${CONSTANTS.MODULE_ID}.settingNameTaggerIntegrationFeature`),
    // 	hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintTaggerIntegrationFeature`),
    // 	scope: "world",
    // 	config: true,
    // 	default: false,
    // 	type: Boolean,
    // },

    // ========================================================
    // Reset Doors and Fog
    // ========================================================

    enableResetDoorsAndFog: {
      name: i18n(`${CONSTANTS.MODULE_ID}.settingNameResetDoorsAndFogFeature`),
      hint: i18n(`${CONSTANTS.MODULE_ID}.settingHintResetDoorsAndFogFeature`),
      scope: "world",
      config: true,
      default: false,
      type: Boolean,
    },

    debug: {
      name: `${CONSTANTS.MODULE_ID}.setting.debug.name`,
      hint: `${CONSTANTS.MODULE_ID}.setting.debug.hint`,
      scope: "client",
      config: true,
      default: false,
      type: Boolean,
    },
  };
}
