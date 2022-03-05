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
import { registerSettings } from './module/settings';
import { preloadTemplates } from './module/preloadTemplates';
import { ARMS_REACH_MODULE_NAME } from './module/settings';
import { initHooks, readyHooks, setupHooks } from './module/Hooks';
import { game } from './module/settings';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async () => {
  console.log(`${ARMS_REACH_MODULE_NAME} | Initializing ${ARMS_REACH_MODULE_NAME}`);

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

Hooks.once('setup', function () {
  // Do anything after initialization but before ready
  // setupModules();

  //registerSettings();

  setupHooks();
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', () => {
  // Do anything once the module is ready
  if (!game.modules.get('lib-wrapper')?.active && game.user?.isGM) {
    ui.notifications?.error(
      `The '${ARMS_REACH_MODULE_NAME}' module requires to install and activate the 'libWrapper' module.`,
    );
    return;
  }
  // if (!game.modules.get('drag-ruler')?.active && game.user?.isGM) {
  //   ui.notifications?.error(
  //     `The '${ARMS_REACH_MODULE_NAME}' module requires to install and activate the 'drag-ruler' module.`,
  //   );
  //   return;
  //}
  readyHooks();
});

// Add any additional hooks if necessary
Hooks.once('libChangelogsReady', function () {
  //@ts-ignore
  libChangelogs.register(
    ARMS_REACH_MODULE_NAME,
    `
    - Add new feature "If no token is selected and you are a GM this feature is not activated"
    - Set module setting "disableDoorSound" default value from false to true
    - Add warning for "No Select More Than One Token" for avoid strange distance calculation
    `,
    'minor',
  );
});
