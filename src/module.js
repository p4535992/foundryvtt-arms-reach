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
import { log } from "./scripts/lib/lib.mjs";

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
    ui.notifications?.error(
      `The '${CONSTANTS.MODULE_ID}' module requires to install and activate the 'libWrapper' module.`
    );
    return;
  }
  // if (!game.modules.get('drag-ruler')?.active && game.user?.isGM) {
  //   error(
  //     `The '${CONSTANTS.MODULE_ID}' module requires to install and activate the 'drag-ruler' module.`,
  //   );
  //   return;
  //}
  readyHooks();
});

// Add any additional hooks if necessary

/**
 * Initialization helper, to set API.
 * @param api to set to game module.
 */
export function setApi(api) {
  // setApiOld(api);
  // setApiOld2(api);
  const data = game.modules.get(CONSTANTS.MODULE_ID);
  data.api = api;
}

/**
 * Returns the set API.
 * @returns Api from games module.
 */
export function getApi() {
  const data = game.modules.get(CONSTANTS.MODULE_ID);
  return data.api;
}

/**
 * Initialization helper, to set Socket.
 * @param socket to set to game module.
 */
export function setSocket(socket) {
  // setSocketOld(socket);
  // setSocketOld2(socket);
  const data = game.modules.get(CONSTANTS.MODULE_ID);
  data.socket = socket;
}

/*
 * Returns the set socket.
 * @returns Socket from games module.
 */
export function getSocket() {
  const data = game.modules.get(CONSTANTS.MODULE_ID);
  return data.socket;
}

// /**
//  * Initialization helper, to set API.
//  * @param api to set to game module.
//  */
// function setApiOld(api) {
//   const data = game.modules.get(CONSTANTS.MODULE_ID_OLD);
//   data.api = api;
// }

// /**
//  * Initialization helper, to set API.
//  * @param api to set to game module.
//  */
// function setApiOld2(api) {
//   const data = game.modules.get(CONSTANTS.MODULE_ID_OLD_2);
//   data.api = api;
// }

// /**
//  * Initialization helper, to set Socket.
//  * @param socket to set to game module.
//  */
// function setSocketOld(socket) {
//   const data = game.modules.get(CONSTANTS.MODULE_ID_OLD);
//   data.socket = socket;
// }

// /**
//  * Initialization helper, to set Socket.
//  * @param socket to set to game module.
//  */
// function setSocketOld2(socket) {
//   const data = game.modules.get(CONSTANTS.MODULE_ID_OLD_2);
//   data.socket = socket;
// }
