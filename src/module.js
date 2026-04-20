import { registerKeyBindings, registerSettings } from "./scripts/settings.js";
import { preloadTemplates } from "./scripts/preloadTemplates.js";
import { initHooks, readyHooks, setupHooks } from "./scripts/main.js";
import CONSTANTS from "./scripts/constants.js";
import Logger from "./scripts/lib/Logger.js";
import { ArmsReachFormConfig } from "./scripts/lib/ArmsReachFormConfig.js";

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once("init", async () => {
  Logger.log(`${CONSTANTS.MODULE_ID} | Initializing ${CONSTANTS.MODULE_ID}`);

  // Register custom module settings
  registerSettings();
  registerKeyBindings();

  // Assign custom classes and constants here
  initHooks();

  // Preload Handlebars templates
  await preloadTemplates();
  // Register custom sheets (if any)
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */

Hooks.once("setup", function () {
  // Do anything after initialization but before ready
  // setupModules();

  // registerSettings();

  setupHooks();
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", () => {
  // Do anything once the module is ready
  if (!game.modules.get("lib-wrapper")?.active && game.user?.isGM) {
    Logger.error(`The '${CONSTANTS.MODULE_ID}' module requires to install and activate the 'libWrapper' module.`, true);
    return;
  }
  if (game.modules.get("foundryvtt-arms-reach")?.active && game.user?.isGM) {
    Logger.error(
      `Attention in version 11 the module id of "foundryvtt-arms-reach" has become "arms-reach". If present uninstall the "foundryvtt-arms-reach" version.`,
      true,
    );
  }
  readyHooks();
});

// Add any additional hooks if necessary.
//
// Foundry v13 converted TokenConfig, TileConfig, AmbientLightConfig, AmbientSoundConfig,
// WallConfig, NoteConfig, DrawingConfig, MeasuredTemplateConfig (removed in v14), LightConfig
// and StairwayConfig to ApplicationV2. The legacy `renderFormApplication` hook no longer
// fires for those, which is why the "Arms Reach Range" fieldset stopped appearing in v13+.
// Hook on `renderApplicationV2` as well, and keep the V1 hook so anything that stayed V1
// (or third-party V1 configs from other modules) still gets the injection.
Hooks.on("renderFormApplication", (app, html, options) => {
  ArmsReachFormConfig._handleRenderFormApplication(app, html);
});
Hooks.on("renderApplicationV2", (app, html, data) => {
  ArmsReachFormConfig._handleRenderFormApplication(app, html);
});
