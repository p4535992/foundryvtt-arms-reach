import { DoorsReach } from "./DoorsReach.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";

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
        name: `${CONSTANTS.MODULE_ID}.settingNameEnableArmsReachFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintEnableArmsReachFeature`,
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        onChange: (data) => {
            // manageSettingsArmsReachFeature(data);
        },
    });

    game.settings.register(CONSTANTS.MODULE_ID, "notificationsInteractionFail", {
        name: `${CONSTANTS.MODULE_ID}.settingNameNotificationsFailedInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintNotificationsFailedInteraction`,
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    // game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionMeasurement", {
    //     name: `${CONSTANTS.MODULE_ID}.settingNameGlobalMaximumInteractionMeasurement`,
    //     hint: `${CONSTANTS.MODULE_ID}.settingNameGlobalMaximumInteractionMeasurement`,
    //     scope: "world",
    //     config: true,
    //     default: 5,
    //     type: Number,

    //     range: { min: 0, max: 20, step: 0.5 },
    // });

    game.settings.register(CONSTANTS.MODULE_ID, "forceReSelection", {
        name: `${CONSTANTS.MODULE_ID}.settingNameAvoidSelectsTheControlledToken`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintAvoidSelectsTheControlledToken`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "useOwnedTokenIfNoTokenIsSelected", {
        name: `${CONSTANTS.MODULE_ID}.settingNameUseOwnedTokenIfNoTokenIsSelected`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintUseOwnedTokenIfNoTokenIsSelected`,
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

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
        name: `${CONSTANTS.MODULE_ID}.settingNameDoorsIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintDoorsIntegrationFeature`,
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDoors", {
        name: `${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnDoors`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnDoors`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "doorInteractionMeasurement", {
        name: `${CONSTANTS.MODULE_ID}.settingNameMaximumDoorMeasurementInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintMaximumDoorMeasurementInteraction`,
        scope: "world",
        config: true,
        default: 0.5, // 5 before
        type: Number,
        range: { min: 0, max: 15, step: 0.5 },
    });

    // DEPRECATED (double tap)

    // game.settings.register(CONSTANTS.MODULE_ID, "hotkeyDoorInteractionDelay", {
    //     name: `${CONSTANTS.MODULE_ID}.settingNameDoubleTapInteraction`,
    //     hint: `${CONSTANTS.MODULE_ID}.settingHintDoubleTapInteraction`,
    //     scope: "world",
    //     config: true,
    //     default: 0, // 1 before // 200 before
    //     type: Number,

    //     //range: { min: 0, max: 750, step: 50 },
    //     range: { min: 0, max: 5, step: 0.5 },
    // });

    // game.settings.register(CONSTANTS.MODULE_ID, "disableDoorSound", {
    //     name: `${CONSTANTS.MODULE_ID}.settingNameDisableDoorSound`,
    //     hint: `${CONSTANTS.MODULE_ID}.settingHintDisableDoorSound`,
    //     scope: "world",
    //     config: true,
    //     default: true,
    //     type: Boolean,
    // });

    // ========================================================
    // STAIRWAY SUPPORT
    // ========================================================

    // First of all Depends if the module is present and active

    game.settings.register(CONSTANTS.MODULE_ID, "enableStairwaysIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameStairwaysIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintStairwaysIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnStairways", {
        name: `${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnStairways`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnStairways`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "stairwayInteractionMeasurement", {
        name: `${CONSTANTS.MODULE_ID}.settingNameMaximumStairwayMeasurementInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintMaximumStairwayMeasurementInteraction`,
        scope: "world",
        config: true,
        default: 2.5,
        type: Number,
        range: { min: 0, max: 15, step: 0.5 },
    });

    game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerStairwayIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTaggerStairwayIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTaggerStairwayIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    // ========================================================
    // JOURNAL SUPPORT
    // ========================================================

    game.settings.register(CONSTANTS.MODULE_ID, "enableJournalsIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameNotesIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintNotesIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnNotes", {
        name: `${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnNotes`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnNotes`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "noteInteractionMeasurement", {
        name: `${CONSTANTS.MODULE_ID}.settingNameMaximumNoteMeasurementInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintMaximumNoteMeasurementInteraction`,
        scope: "world",
        config: true,
        default: 2.5,
        type: Number,
        range: { min: 0, max: 15, step: 0.5 },
    });

    game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerNoteIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTaggerNoteIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTaggerNoteIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    // ========================================================
    // TOKEN SUPPORT
    // ========================================================

    game.settings.register(CONSTANTS.MODULE_ID, "enableTokensIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnTokens", {
        name: `${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnTokens`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnTokens`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "tokenInteractionMeasurement", {
        name: `${CONSTANTS.MODULE_ID}.settingNameMaximumTokenMeasurementInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintMaximumTokenMeasurementInteraction`,
        scope: "world",
        config: true,
        default: 5,
        type: Number,
        range: { min: 0, max: 15, step: 0.5 },
    });

    // game.settings.register(CONSTANTS.MODULE_ID, "tokensIntegrationWithLootSheet", {
    //     name: `${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationWithLootSheet`,
    //     hint: `${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationWithLootSheet`,
    //     scope: "world",
    //     config: true,
    //     default: false,
    //     type: Boolean,
    // });

    // game.settings.register(CONSTANTS.MODULE_ID, "tokensIntegrationByPrefix", {
    //     name: `${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationByPrefix`,
    //     hint: `${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationByPrefix`,
    //     scope: "world",
    //     config: true,
    //     default: "ART_",
    //     type: String,
    // });

    // game.settings.register(CONSTANTS.MODULE_ID, "tokensIntegrationExplicitName", {
    //     name: `${CONSTANTS.MODULE_ID}.settingNameTokensIntegrationExplicitName`,
    //     hint: `${CONSTANTS.MODULE_ID}.settingHintTokensIntegrationExplicitName`,
    //     scope: "client",
    //     config: true,
    //     default: game.user?.character?.name ?? "",
    //     type: String,
    // });

    game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerTokenIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTaggerTokenIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTaggerTokenIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    // ========================================================
    // LIGHT SUPPORT
    // ========================================================

    game.settings.register(CONSTANTS.MODULE_ID, "enableLightsIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameLightsIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintLightsIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnLights", {
        name: `${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnLights`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnLights`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "lightInteractionMeasurement", {
        name: `${CONSTANTS.MODULE_ID}.settingNameMaximumLightMeasurementInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintMaximumLightMeasurementInteraction`,
        scope: "world",
        config: true,
        default: 2.5,
        type: Number,
        range: { min: 0, max: 15, step: 0.5 },
    });

    game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerLightIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTaggerLightIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTaggerLightIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    // ========================================================
    // SOUNDS SUPPORT
    // ========================================================

    game.settings.register(CONSTANTS.MODULE_ID, "enableSoundsIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameSoundsIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintSoundsIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnSounds", {
        name: `${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnSounds`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnSounds`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "soundInteractionMeasurement", {
        name: `${CONSTANTS.MODULE_ID}.settingNameMaximumSoundMeasurementInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintMaximumSoundMeasurementInteraction`,
        scope: "world",
        config: true,
        default: 2.5,
        type: Number,
        range: { min: 0, max: 15, step: 0.5 },
    });

    game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerSoundIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTaggerSoundIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTaggerSoundIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    // ========================================================
    // DRAWING SUPPORT
    // ========================================================

    game.settings.register(CONSTANTS.MODULE_ID, "enableDrawingsIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameDrawingsIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintDrawingsIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDrawings", {
        name: `${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnDrawings`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnDrawings`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "drawingInteractionMeasurement", {
        name: `${CONSTANTS.MODULE_ID}.settingNameMaximumDrawingMeasurementInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintMaximumDrawingMeasurementInteraction`,
        scope: "world",
        config: true,
        default: 5,
        type: Number,
        range: { min: 0, max: 15, step: 0.5 },
    });

    game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerDrawingIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTaggerDrawingIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTaggerDrawingIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    // ========================================================
    // TILE SUPPORT
    // ========================================================

    game.settings.register(CONSTANTS.MODULE_ID, "enableTilesIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTilesIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTilesIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnTiles", {
        name: `${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnTiles`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnTiles`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "tileInteractionMeasurement", {
        name: `${CONSTANTS.MODULE_ID}.settingNameMaximumTileMeasurementInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintMaximumTileMeasurementInteraction`,
        scope: "world",
        config: true,
        default: 5,
        type: Number,
        range: { min: 0, max: 15, step: 0.5 },
    });

    game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerTileIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTaggerTileIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTaggerTileIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    // ========================================================
    // WALL SUPPORT
    // ========================================================

    game.settings.register(CONSTANTS.MODULE_ID, "enableWallsIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameWallsIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintWallsIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnWalls", {
        name: `${CONSTANTS.MODULE_ID}.settingNameGlobalInteractionDistanceForGMOnWalls`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintGlobalInteractionDistanceForGMOnWalls`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    game.settings.register(CONSTANTS.MODULE_ID, "wallInteractionMeasurement", {
        name: `${CONSTANTS.MODULE_ID}.settingNameMaximumWallMeasurementInteraction`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintMaximumWallMeasurementInteraction`,
        scope: "world",
        config: true,
        default: 0,
        type: Number,
        range: { min: 0, max: 15, step: 0.5 },
    });

    game.settings.register(CONSTANTS.MODULE_ID, "enableTaggerWallIntegration", {
        name: `${CONSTANTS.MODULE_ID}.settingNameTaggerWallIntegrationFeature`,
        hint: `${CONSTANTS.MODULE_ID}.settingHintTaggerWallIntegrationFeature`,
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });

    // ===================================================================

    game.settings.register(CONSTANTS.MODULE_ID, "debug", {
        name: `${CONSTANTS.MODULE_ID}.setting.debug.name`,
        hint: `${CONSTANTS.MODULE_ID}.setting.debug.hint`,
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
    });
};

export const registerKeyBindings = function () {
    game.keybindings.register(CONSTANTS.MODULE_ID, "openClosestDoor", {
        name: `${CONSTANTS.MODULE_ID}.keybinding.openClosestDoor.name`,
        hint: `${CONSTANTS.MODULE_ID}.keybinding.openClosestDoor.hint`,
        // E
        editable: [{ key: "KeyE" }],
        // Ctrl + E
        // editable: [{ key: "KeyE", modifiers: [KeyboardManager.MODIFIER_KEYS.CONTROL] }],
        onDown: () => {
            DoorsReach.interactWithNearestDoor();
        },
        restricted: true,
        precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
    });
};

class ResetSettingsDialog extends FormApplication {
    constructor(...args) {
        super(...args);

        return new Dialog({
            title: game.i18n.localize(`downtime-dnd5e.SettingReset.dialogs.title`),
            content:
                '<p style="margin-bottom:1rem;">' +
                game.i18n.localize(`downtime-dnd5e.SettingReset.dialogs.content`) +
                "</p>",
            buttons: {
                confirm: {
                    icon: '<i class="fas fa-check"></i>',
                    label: game.i18n.localize(`downtime-dnd5e.SettingReset.dialogs.confirm`),
                    callback: async () => {
                        for (let setting of game.settings.storage
                            .get("world")
                            .filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_ID}.`))) {
                            Logger.debug(`Reset setting '${setting.key}'`);
                            await setting.delete();
                        }
                        //window.location.reload();
                    },
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: game.i18n.localize(`downtime-dnd5e.SettingReset.dialogs.cancel`),
                },
            },
            default: "cancel",
        });
    }

    async _updateObject(event, formData) {
        // do nothing
    }
}
