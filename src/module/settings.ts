import { i18n } from '../foundryvtt-arms-reach';
import { ArmsReach } from './ArmsReachApi';

export const game = getGame();
export const canvas = getCanvas();

export const ARMS_REACH_MODULE_NAME = 'foundryvtt-arms-reach';
export const ARMS_REACH_TAGGER_MODULE_NAME = 'tagger';
export const ARMS_REACH_TAGGER_FLAG = 'armsreach';

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
    throw new Error('Canvas Is Not Initialized');
  }
  return canvas;
}

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game Is Not Initialized');
  }
  return game;
}

export function getAPI(): ArmsReach {
  if (!getGame()[ArmsReach.API]) {
    throw new Error('API Is Not Initialized');
  }
  return getGame()[ArmsReach.API];
}

// export function manageSettingsArmsReachFeature(data){
//   if(data){
//     $(`[name="${ARMS_REACH_MODULE_NAME}.notificationsInteractionFail"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.globalInteractionDistance"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.hotkeyDoorInteraction"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.hotkeyDoorInteractionDelay"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.doorInteractionDistance"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.hotkeyDoorInteractionCenter"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.globalInteractionDistanceForGM"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.forceReSelection"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.useOwnedTokenIfNoTokenIsSelected"]`).parents('.form-group').show();
//   } else {
//     $(`[name="${ARMS_REACH_MODULE_NAME}.notificationsInteractionFail"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.globalInteractionDistance"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.hotkeyDoorInteraction"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.hotkeyDoorInteractionDelay"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.doorInteractionDistance"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.hotkeyDoorInteractionCenter"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.globalInteractionDistanceForGM"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.forceReSelection"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.useOwnedTokenIfNoTokenIsSelected"]`).parents('.form-group').hide();
//   }
// }

// export function manageSettingsAmbientDoorFeature(data){
//   if(data){
//     $(`[name="${ARMS_REACH_MODULE_NAME}.stealthDoor"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.closeDoorPathDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.closeDoorLevelDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.openDoorPathDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.openDoorLevelDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.lockDoorPathDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.lockDoorLevelDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.unlockDoorPathDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.unlockDoorLevelDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.lockedDoorJinglePathDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.lockedDoorJingleLevelDefault"]`).parents('.form-group').show();
//   } else {
//     $(`[name="${ARMS_REACH_MODULE_NAME}.stealthDoor"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.closeDoorPathDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.closeDoorLevelDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.openDoorPathDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.openDoorLevelDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.lockDoorPathDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.lockDoorLevelDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.unlockDoorPathDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.unlockDoorLevelDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.lockedDoorJinglePathDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.lockedDoorJingleLevelDefault"]`).parents('.form-group').hide();
//   }
// }

// export function manageSettingsDesignerDoorFeature(data){
//   if(data){
//     $(`[name="${ARMS_REACH_MODULE_NAME}.doorClosedDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.doorOpenDefault"]`).parents('.form-group').show();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.doorLockedDefault"]`).parents('.form-group').show();
//   }else{
//     $(`[name="${ARMS_REACH_MODULE_NAME}.doorClosedDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.doorOpenDefault"]`).parents('.form-group').hide();
//     $(`[name="${ARMS_REACH_MODULE_NAME}.doorLockedDefault"]`).parents('.form-group').hide();
//   }
// }

// Hooks.on("renderSettingsConfig", (app, html, user) => {

//   // manageSettingsArmsReachFeature(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach"));
//   // manageSettingsAmbientDoorFeature(<boolean>game.settings.get(MODULE_NAME, "enableAmbientDoor"));
//   // manageSettingsDesignerDoorFeature(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor"));

// });

export const registerSettings = function () {
  // ========================================================
  // Arms Reach
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableArmsReach', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameEnableArmsReachFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintEnableArmsReachFeature`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    onChange: (data) => {
      // manageSettingsArmsReachFeature(data);
    },
  });

  // $(`[name="${ARMS_REACH_MODULE_NAME}.enableArmsReach"]`).change(function() {
  //   if ($(this).is(':checked')) {
  //     manageSettingsArmsReachFeature(true);
  //   }
  //   else {
  //     manageSettingsArmsReachFeature(false);
  //   }
  // });

  game.settings.register(ARMS_REACH_MODULE_NAME, 'notificationsInteractionFail', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameNotificationsFailedInteraction`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintNotificationsFailedInteraction`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // DEPRECATED

  game.settings.register(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameGlobalMaximumInteractionDistance`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintGlobalMaximumInteractionDistance`),
    scope: 'world',
    config: true,
    default: 0, // instead of 1
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 5, step: 0.5 },
  });

  game.settings.register(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
    scope: 'world',
    config: true,
    default: 5,
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 20, step: 0.5 },
  });

  game.settings.register(ARMS_REACH_MODULE_NAME, 'globalInteractionDistanceForGM', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameNotificationsFailedInteractionEvenForGM`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintNotificationsFailedInteractionEvenForGM`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(ARMS_REACH_MODULE_NAME, 'forceReSelection', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameAvoidSelectsTheControlledToken`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintAvoidSelectsTheControlledToken`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(ARMS_REACH_MODULE_NAME, 'useOwnedTokenIfNoTokenIsSelected', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameUseOwnedTokenIfNoTokenIsSelected`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintUseOwnedTokenIfNoTokenIsSelected`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  //@ts-ignore
  // KeybindLib.register(MODULE_NAME, "setCustomKeyBindForDoorInteraction", {
  // 	name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameSetCustomKeyBindForDoorInteraction`),
  // 	hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintSetCustomKeyBindForDoorInteraction`),
  // 	config: true,
  // 	default: "KeyE",
  // 	onKeyDown: () => {
  // 		console.log("Key pressed!");
  // 	}
  // });

  //   game.settings.register(ARMS_REACH_MODULE_NAME,'setDistanceModeForDoorInteraction',{
  //     name: i18n(ARMS_REACH_MODULE_NAME+".settingNameSetDistanceModeForDoorInteraction"),
  //     hint: i18n(ARMS_REACH_MODULE_NAME+".settingHintSetDistanceModeForDoorInteraction"),
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

  // ========================================================
  // DOOR SUPPORT
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableDoorsIntegration', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameDoorsIntegrationFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintDoorsIntegrationFeature`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // DEPRECATED AND REMOVED

  game.settings.register(ARMS_REACH_MODULE_NAME, 'doorInteractionDistance', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameMaximumDoorDistanceInteraction`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintMaximumDoorDistanceInteraction`),
    scope: 'world',
    config: false,
    default: 0, // instead of 1
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 10, step: 0.5 },
  });

  game.settings.register(ARMS_REACH_MODULE_NAME, 'doorInteractionMeasurement', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
    scope: 'world',
    config: true,
    default: 5,
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 50, step: 0.5 },
  });

  // DEPRECATED

  game.settings.register(ARMS_REACH_MODULE_NAME, 'hotkeyDoorInteraction', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameHotKeyForInteraction`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintHotKeyForInteraction`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // DEPRECATED (double tap)

  game.settings.register(ARMS_REACH_MODULE_NAME, 'hotkeyDoorInteractionDelay', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameDoubleTapInteraction`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintDoubleTapInteraction`),
    scope: 'world',
    config: true,
    default: 1, // 200
    type: Number,
    //@ts-ignore
    //range: { min: 0, max: 750, step: 50 },
    range: { min: 0, max: 5, step: 0.5 },
  });

  // DEPRECATED

  game.settings.register(ARMS_REACH_MODULE_NAME, 'hotkeyDoorInteractionCenter', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameHotKeyToCenterCamera`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintHotKeyToCenterCamera`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // STAIRWAY SUPPORT
  // ========================================================

  // First of all Depends if the module is present and active

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableStairwaysIntegration', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameStairwaysIntegrationFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintStairwaysIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // JOURNAL SUPPORT
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableJournalsIntegration', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameNotesIntegrationFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintNotesIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // TOKEN SUPPORT
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableTokensIntegration', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameTokensIntegrationFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintTokensIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(ARMS_REACH_MODULE_NAME, 'tokensIntegrationWithLootSheet', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameTokensIntegrationWithLootSheet`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintTokensIntegrationWithLootSheet`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(ARMS_REACH_MODULE_NAME, 'tokensIntegrationByPrefix', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameTokensIntegrationByPrefix`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintTokensIntegrationByPrefix`),
    scope: 'world',
    config: true,
    default: 'ART_',
    type: String,
  });

  game.settings.register(ARMS_REACH_MODULE_NAME, 'tokensIntegrationExplicitName', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameTokensIntegrationExplicitName`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintTokensIntegrationExplicitName`),
    scope: 'client',
    config: true,
    default: game.user?.character?.name ?? '',
    type: String,
  });

  // ========================================================
  // LIGHT SUPPORT
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableLightsIntegration', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameLightsIntegrationFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintLightsIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // SOUNDS SUPPORT
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableSoundsIntegration', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameSoundsIntegrationFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintSoundsIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // DRAWING SUPPORT
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableDrawingsIntegration', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameDrawingsIntegrationFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintDrawingsIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // TILE SUPPORT
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableTilesIntegration', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameTilesIntegrationFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintTilesIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // TEMPLATES SUPPORT
  // ========================================================

  // game.settings.register(ARMS_REACH_MODULE_NAME, 'enableTemplatesIntegration', {
  //   name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameTemplatesIntegrationFeature`),
  //   hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintTemplatesIntegrationFeature`),
  //   scope: 'world',
  //   config: true,
  //   default: false,
  //   type: Boolean,
  // });

  // ========================================================
  // TAGGER SUPPORT
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableTaggerIntegration', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameTaggerIntegrationFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintTaggerIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // Reset Doors and Fog
  // ========================================================

  game.settings.register(ARMS_REACH_MODULE_NAME, 'enableResetDoorsAndFog', {
    name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameResetDoorsAndFogFeature`),
    hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintResetDoorsAndFogFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
};
