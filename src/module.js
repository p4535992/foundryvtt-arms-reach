/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */
// Import JavaScript modules

// Import TypeScript modules
import { registerSettings } from "./scripts/settings.mjs";
import { preloadTemplates } from "./scripts/preloadTemplates.mjs";
import { initHooks, readyHooks, setupHooks } from "./scripts/module.mjs";
import API from "./scripts/api.mjs";
import CONSTANTS from "./scripts/constants.mjs";
import { error, log } from "./scripts/lib/lib.mjs";

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once("init", async () => {
  log(`${CONSTANTS.MODULE_ID} | Initializing ${CONSTANTS.MODULE_ID}`);

  // Register custom module settings
  registerSettings();

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

  //registerSettings();

  setupHooks();
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", () => {
  // Do anything once the module is ready
  if (!game.modules.get("lib-wrapper")?.active && game.user?.isGM) {
    error(`The '${CONSTANTS.MODULE_ID}' module requires to install and activate the 'libWrapper' module.`, true);
    return;
  }
  if (game.modules.get("foundryvtt-arms-reach")?.active && game.user?.isGM) {
    error(
      `Attention in version 11 the module id of "foundryvtt-arms-reach" has become "arms-reach". If present uninstall the "foundryvtt-arms-reach" version.`,
      true
    );
  }
  readyHooks();
});

// Add any additional hooks if necessary
