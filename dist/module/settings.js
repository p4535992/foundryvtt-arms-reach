import { i18n } from "../foundryvtt-arms-reach.js";
// import ImagePicker from "./libs/ImagePicker";
// import SoundPicker from "./libs/SoundPicker";
export const ARMS_REACH_MODULE_NAME = 'foundryvtt-arms-reach';
/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getCanvas() {
    if (!(canvas instanceof Canvas) || !canvas.ready) {
        throw new Error("Canvas Is Not Initialized");
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
export function getGame() {
    if (!(game instanceof Game)) {
        throw new Error("Game Is Not Initialized");
    }
    return game;
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
//   // manageSettingsArmsReachFeature(<boolean>getGame().settings.get(MODULE_NAME, "enableArmsReach"));
//   // manageSettingsAmbientDoorFeature(<boolean>getGame().settings.get(MODULE_NAME, "enableAmbientDoor"));
//   // manageSettingsDesignerDoorFeature(<boolean>getGame().settings.get(MODULE_NAME, "enableDesignerDoor"));
// });
export const registerSettings = function () {
    // ========================================================
    // Arms Reach
    // ========================================================
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "enableArmsReach", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameEnableArmsReachFeature`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintEnableArmsReachFeature`),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        onChange: (data) => {
            // manageSettingsArmsReachFeature(data);
        }
    });
    // $(`[name="${ARMS_REACH_MODULE_NAME}.enableArmsReach"]`).change(function() {
    //   if ($(this).is(':checked')) {
    //     manageSettingsArmsReachFeature(true);
    //   }
    //   else {
    //     manageSettingsArmsReachFeature(false);
    //   }
    // });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "notificationsInteractionFail", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameNotificationsFailedInteraction`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintNotificationsFailedInteraction`),
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "globalInteractionDistance", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameGlobalMaximumInteractionDistance`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintGlobalMaximumInteractionDistance`),
        scope: "world",
        config: true,
        default: 0,
        type: Number,
        //@ts-ignore
        range: { min: 0, max: 50, step: 0.5 }
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "doorInteractionDistance", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameMaximumDoorDistanceInteraction`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintMaximumDoorDistanceInteraction`),
        scope: "world",
        config: true,
        default: 0,
        type: Number,
        //@ts-ignore
        range: { min: 0, max: 10, step: 0.5 }
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "globalInteractionMeasurement", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameGlobalMaximumInteractionMeasurement`),
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        //@ts-ignore
        range: { min: 0, max: 50, step: 0.5 }
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "doorInteractionMeasurement", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameMaximumDoorMeasurementInteraction`),
        scope: "world",
        config: true,
        default: 1,
        type: Number,
        //@ts-ignore
        range: { min: 0, max: 50, step: 0.5 }
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteraction", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameHotKeyForInteraction`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintHotKeyForInteraction`),
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameDoubleTapInteraction`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintDoubleTapInteraction`),
        scope: "world",
        config: true,
        default: 200,
        type: Number,
        //@ts-ignore
        range: { min: 0, max: 750, step: 50 }
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionCenter", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameHotKeyToCenterCamera`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintHotKeyToCenterCamera`),
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "globalInteractionDistanceForGM", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameNotificationsFailedInteractionEvenForGM`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintNotificationsFailedInteractionEvenForGM`),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "forceReSelection", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameAvoidSelectsTheControlledToken`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintAvoidSelectsTheControlledToken`),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "useOwnedTokenIfNoTokenIsSelected", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameUseOwnedTokenIfNoTokenIsSelected`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintUseOwnedTokenIfNoTokenIsSelected`),
        scope: "world",
        config: true,
        default: true,
        type: Boolean
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
    //   getGame().settings.register(ARMS_REACH_MODULE_NAME,'setDistanceModeForDoorInteraction',{
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
    // STAIRWAY SUPPORT
    // ========================================================
    // First of all Depends if the module is present and active
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "enableStairwaysIntegration", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameStairwaysIntegrationFeature`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintStairwaysIntegrationFeature`),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    // ========================================================
    // JOURNAL SUPPORT
    // ========================================================
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "enableJournalsIntegration", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameJournalsIntegrationFeature`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintJournalsIntegrationFeature`),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    // ========================================================
    // GRIDLESS SUPPORT
    // ========================================================
    // getGame().settings.register(ARMS_REACH_MODULE_NAME, "enableGridlessSupport", {
    //   name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameGridlessSupportFeature`),
    //   hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintGridlessSupportFeature`),
    //   scope: "world",
    //   config: false,
    //   default: false,
    //   type: Boolean
    // });
    // ========================================================
    // Reset Doors and Fog
    // ========================================================
    getGame().settings.register(ARMS_REACH_MODULE_NAME, "enableResetDoorsAndFog", {
        name: i18n(`${ARMS_REACH_MODULE_NAME}.settingNameResetDoorsAndFogFeature`),
        hint: i18n(`${ARMS_REACH_MODULE_NAME}.settingHintResetDoorsAndFogFeature`),
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
};
