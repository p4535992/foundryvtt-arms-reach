import { debug, log, setDebugLevel, warn, i18n } from '../ArmsReach';

export const MODULE_NAME = 'foundryvtt-arms-reach';

export const registerSettings = function () {
  game.settings.register(`${MODULE_NAME}`, "notificationsInteractionFail", {
		name: "Notifications failed interactions",
    hint: "Emit notifications for when a player fails to interact with a door. Good for debugging.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
	game.settings.register(`${MODULE_NAME}`, "globalInteractionDistance", {
		name: "Global maximum interaction distance",
		hint: "Max distance (in tiles) that a token can interact with a door... 0 will disable the limit (needs app reload). GM's ignore this distance limitation.",
		scope: "world",
		config: true,
		default: 1,
    type: Number,
    range: {min: 0, max: 50, step: 0.5}
	});
  
  game.settings.register(`${MODULE_NAME}`, "hotkeyDoorInteraction", {
		name: "Hotkey 'e' for interaction",
		hint: "Pressing 'e' will open or close nearest door. Holding 'e' will center camera on current token.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
  
  game.settings.register(`${MODULE_NAME}`, "hotkeyDoorInteractionDelay", {
		name: "Interaction double tap delay",
		hint: "Double tapping a move key on the direction of a door will interact with it. This option sets the delay between required key presses (the lower the faster you need to tap). Setting this option to zero will disable interaction with double tap.",
		scope: "world",
		config: true,
		default: 200,
    type: Number,
    range: {min: 0, max: 750, step: 50}
	});
  
	game.settings.register(`${MODULE_NAME}`, "doorInteractionDistance", {
		name: "Maximum door interaction distance",
		scope: "world",
		config: true,
		default: 1,
    type: Number,
    range: {min: 0, max: 10, step: 0.5}
	});
  
  game.settings.register(`${MODULE_NAME}`, "hotkeyDoorInteractionCenter", {
		name: "Hotkey 'e' to center camera",
		hint: "Holding 'e' will center the camera on current selected token.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});
}