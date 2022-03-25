import { i18n } from './lib/lib';
import API from './api';
import CONSTANTS from './constants';

export const game = getGame();
export const canvas = getCanvas();

// export const CONSTANTS.MODULE_NAME = CONSTANTS.MODULE_NAME;
// export const ARMS_REACH_TAGGER_MODULE_NAME = 'tagger';
// export const ARMS_REACH_TAGGER_FLAG = 'armsreach';

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

export const registerSettings = function () {
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'resetAllSettings', {
    name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
    icon: 'fas fa-coins',
    type: ResetSettingsDialog,
    restricted: true,
  });

  // ========================================================
  // Arms Reach
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableArmsReach', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameEnableArmsReachFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintEnableArmsReachFeature`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
    onChange: (data) => {
      // manageSettingsArmsReachFeature(data);
    },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'notificationsInteractionFail', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotificationsFailedInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotificationsFailedInteraction`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // DEPRECATED

  game.settings.register(CONSTANTS.MODULE_NAME, 'globalInteractionDistance', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionDistance`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalMaximumInteractionDistance`),
    scope: 'world',
    config: true,
    default: 0, // instead of 1
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 5, step: 1 },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'globalInteractionMeasurement', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
    scope: 'world',
    config: true,
    default: 5,
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 20, step: 5 },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'globalInteractionDistanceForGM', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotificationsFailedInteractionEvenForGM`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotificationsFailedInteractionEvenForGM`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'forceReSelection', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameAvoidSelectsTheControlledToken`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintAvoidSelectsTheControlledToken`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'useOwnedTokenIfNoTokenIsSelected', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameUseOwnedTokenIfNoTokenIsSelected`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintUseOwnedTokenIfNoTokenIsSelected`),
    scope: 'world',
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

  // ========================================================
  // DOOR SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableDoorsIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDoorsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDoorsIntegrationFeature`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // DEPRECATED AND REMOVED

  game.settings.register(CONSTANTS.MODULE_NAME, 'doorInteractionDistance', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorDistanceInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintMaximumDoorDistanceInteraction`),
    scope: 'world',
    config: false,
    default: 0, // instead of 1
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 10, step: 0.5 },
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'doorInteractionMeasurement', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
    scope: 'world',
    config: true,
    default: 5,
    type: Number,
    //@ts-ignore
    range: { min: 0, max: 50, step: 5 },
  });

  // DEPRECATED

  game.settings.register(CONSTANTS.MODULE_NAME, 'hotkeyDoorInteraction', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameHotKeyForInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintHotKeyForInteraction`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // DEPRECATED (double tap)

  game.settings.register(CONSTANTS.MODULE_NAME, 'hotkeyDoorInteractionDelay', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDoubleTapInteraction`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDoubleTapInteraction`),
    scope: 'world',
    config: true,
    default: 1, // 200
    type: Number,
    //@ts-ignore
    //range: { min: 0, max: 750, step: 50 },
    range: { min: 0, max: 5, step: 0.5 },
  });

  // DEPRECATED

  game.settings.register(CONSTANTS.MODULE_NAME, 'hotkeyDoorInteractionCenter', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameHotKeyToCenterCamera`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintHotKeyToCenterCamera`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'disableDoorSound', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDisableDoorSound`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDisableDoorSound`),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });

  // ========================================================
  // STAIRWAY SUPPORT
  // ========================================================

  // First of all Depends if the module is present and active

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableStairwaysIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameStairwaysIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintStairwaysIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // JOURNAL SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableJournalsIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotesIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotesIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // TOKEN SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableTokensIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'tokensIntegrationWithLootSheet', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationWithLootSheet`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationWithLootSheet`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'tokensIntegrationByPrefix', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationByPrefix`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationByPrefix`),
    scope: 'world',
    config: true,
    default: 'ART_',
    type: String,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'tokensIntegrationExplicitName', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationExplicitName`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationExplicitName`),
    scope: 'client',
    config: true,
    default: game.user?.character?.name ?? '',
    type: String,
  });

  // ========================================================
  // LIGHT SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableLightsIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameLightsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintLightsIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // SOUNDS SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableSoundsIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameSoundsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintSoundsIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // DRAWING SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableDrawingsIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDrawingsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDrawingsIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // TILE SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableTilesIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTilesIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTilesIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // WALL SUPPORT
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableWallsIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameWallsIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintWallsIntegrationFeature`),
    scope: 'world',
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

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableTaggerIntegration', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTaggerIntegrationFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTaggerIntegrationFeature`),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================
  // Reset Doors and Fog
  // ========================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'enableResetDoorsAndFog', {
    name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameResetDoorsAndFogFeature`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintResetDoorsAndFogFeature`),
    scope: 'world',
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
        '</p>',
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
      default: 'cancel',
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
      scope: 'world',
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
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    },

    // DEPRECATED

    globalInteractionDistance: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionDistance`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintGlobalMaximumInteractionDistance`),
      scope: 'world',
      config: true,
      default: 0, // instead of 1
      type: Number,
      //@ts-ignore
      range: { min: 0, max: 5, step: 1 },
    },

    globalInteractionMeasurement: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
      scope: 'world',
      config: true,
      default: 5,
      type: Number,
      //@ts-ignore
      range: { min: 0, max: 20, step: 5 },
    },

    globalInteractionDistanceForGM: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameNotificationsFailedInteractionEvenForGM`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintNotificationsFailedInteractionEvenForGM`),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    },

    forceReSelection: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameAvoidSelectsTheControlledToken`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintAvoidSelectsTheControlledToken`),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    },

    useOwnedTokenIfNoTokenIsSelected: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameUseOwnedTokenIfNoTokenIsSelected`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintUseOwnedTokenIfNoTokenIsSelected`),
      scope: 'world',
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

    // ========================================================
    // DOOR SUPPORT
    // ========================================================

    enableDoorsIntegration: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDoorsIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDoorsIntegrationFeature`),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    },

    // DEPRECATED AND REMOVED

    doorInteractionDistance: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorDistanceInteraction`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintMaximumDoorDistanceInteraction`),
      scope: 'world',
      config: false,
      default: 0, // instead of 1
      type: Number,
      //@ts-ignore
      range: { min: 0, max: 10, step: 0.5 },
    },

    doorInteractionMeasurement: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
      scope: 'world',
      config: true,
      default: 5,
      type: Number,
      //@ts-ignore
      range: { min: 0, max: 50, step: 5 },
    },

    // DEPRECATED

    hotkeyDoorInteraction: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameHotKeyForInteraction`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintHotKeyForInteraction`),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    },

    // DEPRECATED (double tap)

    hotkeyDoorInteractionDelay: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDoubleTapInteraction`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDoubleTapInteraction`),
      scope: 'world',
      config: true,
      default: 1, // 200
      type: Number,
      //@ts-ignore
      //range: { min: 0, max: 750, step: 50 },
      range: { min: 0, max: 5, step: 0.5 },
    },

    // DEPRECATED

    hotkeyDoorInteractionCenter: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameHotKeyToCenterCamera`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintHotKeyToCenterCamera`),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    },

    disableDoorSound: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameDisableDoorSound`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintDisableDoorSound`),
      scope: 'world',
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
      scope: 'world',
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
      scope: 'world',
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
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    },

    tokensIntegrationWithLootSheet: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationWithLootSheet`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationWithLootSheet`),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    },

    tokensIntegrationByPrefix: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationByPrefix`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationByPrefix`),
      scope: 'world',
      config: true,
      default: 'ART_',
      type: String,
    },

    tokensIntegrationExplicitName: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameTokensIntegrationExplicitName`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintTokensIntegrationExplicitName`),
      scope: 'client',
      config: true,
      default: game.user?.character?.name ?? '',
      type: String,
    },

    // ========================================================
    // LIGHT SUPPORT
    // ========================================================

    enableLightsIntegration: {
      name: i18n(`${CONSTANTS.MODULE_NAME}.settingNameLightsIntegrationFeature`),
      hint: i18n(`${CONSTANTS.MODULE_NAME}.settingHintLightsIntegrationFeature`),
      scope: 'world',
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
      scope: 'world',
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
      scope: 'world',
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
      scope: 'world',
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
      scope: 'world',
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
      scope: 'world',
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
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    },
  };
}
