import CONSTANTS from "../constants";
import Logger from "./Logger";

export class ArmsReachFormConfig {
    static configHandlers = {
        TokenConfig: "_handleTokenConfig",
        TileConfig: "_handleTileConfig",
        DrawingConfig: "_handleDrawingConfig",
        AmbientLightConfig: "_handleAmbientLightConfig", // v9
        LightConfig: "_handleGenericConfig", // v8
        WallConfig: "_handleGenericConfig",
        AmbientSoundConfig: "_handleGenericConfig",
        MeasuredTemplateConfig: "_handleGenericConfig",
        NoteConfig: "_handleGenericConfig",
        StairwayConfig: "_handleStairwayConfig",
    };

    static _handleRenderFormApplication(app, html) {
        if (!game.settings.get(CONSTANTS.MODULE_ID, "enableAdditionalReachSettingOnPlaceableConfigSheet")) {
            Logger.debug("Setting 'enableAdditionalReachSettingOnPlaceableConfigSheet' is disabled");
            return;
        }
        let method = ArmsReachFormConfig.configHandlers[app.constructor.name];
        if (!method) {
            const key = Object.keys(ArmsReachFormConfig.configHandlers).find((name) =>
                app.constructor.name.includes(name),
            );
            if (!key) return;
            method = ArmsReachFormConfig.configHandlers[key];
        }
        ArmsReachFormConfig[method](app, html, true);
    }

    static _handleTokenConfig(app, html) {
        if (!game.settings.get(CONSTANTS.MODULE_ID, "enableAdditionalReachSettingOnPlaceableConfigSheet")) {
            Logger.debug("Setting 'enableAdditionalReachSettingOnPlaceableConfigSheet' is disabled");
            return;
        }
        const elem = html.find(`div[data-tab="character"]`);
        this._applyHtml(app, elem);
    }

    static _handleTileConfig(app, html) {
        if (!game.settings.get(CONSTANTS.MODULE_ID, "enableAdditionalReachSettingOnPlaceableConfigSheet")) {
            Logger.debug("Setting 'enableAdditionalReachSettingOnPlaceableConfigSheet' is disabled");
            return;
        }
        const elem = html.find(`div[data-tab="basic"]`);
        this._applyHtml(app, elem);
    }

    static _handleDrawingConfig(app, html) {
        if (!game.settings.get(CONSTANTS.MODULE_ID, "enableAdditionalReachSettingOnPlaceableConfigSheet")) {
            Logger.debug("Setting 'enableAdditionalReachSettingOnPlaceableConfigSheet' is disabled");
            return;
        }
        const elem = html.find(`div[data-tab="position"]`);
        this._applyHtml(app, elem);
    }

    static _handleAmbientLightConfig(app, html) {
        if (!game.settings.get(CONSTANTS.MODULE_ID, "enableAdditionalReachSettingOnPlaceableConfigSheet")) {
            Logger.debug("Setting 'enableAdditionalReachSettingOnPlaceableConfigSheet' is disabled");
            return;
        }
        let button = html.find(`button[name="submit"]`);
        let elem = (button.length ? button : html.find(`button[type="submit"]`)).parent();
        this._applyHtml(app, elem, true);
    }

    static _handleGenericConfig(app, html) {
        if (!game.settings.get(CONSTANTS.MODULE_ID, "enableAdditionalReachSettingOnPlaceableConfigSheet")) {
            Logger.debug("Setting 'enableAdditionalReachSettingOnPlaceableConfigSheet' is disabled");
            return;
        }
        let button = html.find(`button[name="submit"]`);
        let elem = button.length ? button : html.find(`button[type="submit"]`);
        this._applyHtml(app, elem, true);
    }

    static _handleStairwayConfig(app, html) {
        if (!game.settings.get(CONSTANTS.MODULE_ID, "enableAdditionalReachSettingOnPlaceableConfigSheet")) {
            Logger.debug("Setting 'enableAdditionalReachSettingOnPlaceableConfigSheet' is disabled");
            return;
        }
        const elem = html.find(`div[data-tab="label"]`);
        this._applyHtml(app, elem, true);
    }

    static _applyHtml(app, elem, insertBefore = false) {
        if (!elem) {
            return;
        }
        const object = app?.object?._object ?? app?.object;
        const tagDocument = object?.document ?? object;

        let range = getProperty(tagDocument, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.RANGE}`) || 0;
        // let isEnabled = getProperty(tagDocument, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.ENABLED}`) || false;

        let fieldset = `
        <fieldset>
            <legend>Arms reach</legend>
            <div class="form-group">
                <label for="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.RANGE}">
                    Arms Reach  Range
                </label>
                <div class="form-fields">
                    <input name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.RANGE}" type="number" value="${range}" min="0" step="0.5" max="15" placeholder="0">
                </div>
            </div>
        </fieldset>
        `;

        // <div class="form-group">
        //         <label for="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.ENABLED}">
        //             Arms Reach Enabled ?
        //         </label>
        //         <div class="form-fields">
        //             <input name="flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.ENABLED}" type="checkbox" ${isEnabled ? "checked" : ""} data-dtype="Boolean">
        //         </div>
        // </div>

        if (insertBefore) {
            $(fieldset).insertBefore(elem);
        } else {
            elem.append(fieldset);
        }
    }
}
