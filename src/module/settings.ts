// import { hotkeys } from './libs/lib-df-hotkeys.shim.js';
import ImagePicker from "./libs/ImagePicker";
import SoundPicker from "./libs/SoundPicker";
// import { KeybindLib } from "/modules/keybind-lib/keybind-lib.js";
export const MODULE_NAME = 'foundryvtt-arms-reach';

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
 export function getCanvas(): Canvas {
	if (!(canvas instanceof Canvas) || !canvas.ready) {
		throw new Error("Canvas Is Not Initialized");
	}
	return canvas;
}

export function manageSettingsArmsReachFeature(data){
  if(data){
    $(`[name="${MODULE_NAME}.notificationsInteractionFail"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.globalInteractionDistance"]`).parents('.form-group').show(); 
    $(`[name="${MODULE_NAME}.hotkeyDoorInteraction"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.hotkeyDoorInteractionDelay"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.doorInteractionDistance"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.hotkeyDoorInteractionCenter"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.globalInteractionDistanceForGM"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.forceReSelection"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.useOwnedTokenIfNoTokenIsSelected"]`).parents('.form-group').show();
  } else {
    $(`[name="${MODULE_NAME}.notificationsInteractionFail"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.globalInteractionDistance"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.hotkeyDoorInteraction"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.hotkeyDoorInteractionDelay"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.doorInteractionDistance"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.hotkeyDoorInteractionCenter"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.globalInteractionDistanceForGM"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.forceReSelection"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.useOwnedTokenIfNoTokenIsSelected"]`).parents('.form-group').hide();
  }
}

export function manageSettingsAmbientDoorFeature(data){
  if(data){
    $(`[name="${MODULE_NAME}.stealthDoor"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.closeDoorPathDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.closeDoorLevelDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.openDoorPathDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.openDoorLevelDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.lockDoorPathDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.lockDoorLevelDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.unlockDoorPathDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.unlockDoorLevelDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.lockedDoorJinglePathDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.lockedDoorJingleLevelDefault"]`).parents('.form-group').show();
  } else {
    $(`[name="${MODULE_NAME}.stealthDoor"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.closeDoorPathDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.closeDoorLevelDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.openDoorPathDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.openDoorLevelDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.lockDoorPathDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.lockDoorLevelDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.unlockDoorPathDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.unlockDoorLevelDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.lockedDoorJinglePathDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.lockedDoorJingleLevelDefault"]`).parents('.form-group').hide();
  }
}

export function manageSettingsDesignerDoorFeature(data){
  if(data){
    $(`[name="${MODULE_NAME}.doorClosedDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.doorOpenDefault"]`).parents('.form-group').show();
    $(`[name="${MODULE_NAME}.doorLockedDefault"]`).parents('.form-group').show();
  }else{
    $(`[name="${MODULE_NAME}.doorClosedDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.doorOpenDefault"]`).parents('.form-group').hide();
    $(`[name="${MODULE_NAME}.doorLockedDefault"]`).parents('.form-group').hide();
  }
}

Hooks.on("renderSettingsConfig", (app, html, user) => {

  manageSettingsArmsReachFeature(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach"));
  manageSettingsAmbientDoorFeature(<boolean>game.settings.get(MODULE_NAME, "enableAmbientDoor"));
  manageSettingsDesignerDoorFeature(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor"));

});

export const registerSettings = function () {

  // ========================================================
  // Arms Reach
  // ========================================================

	game.settings.register(MODULE_NAME, "enableArmsReach", {
		  name: "Enable/Disable arms reach feature",
    	hint: "Enable the GM to select the maximum distance that players can interact with a door",
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
      onChange: (data) => {
        manageSettingsArmsReachFeature(data);
      }
	});

  	game.settings.register(MODULE_NAME, "notificationsInteractionFail", {
		  name: "Notifications failed interactions",
    	hint: "Emit notifications for when a player fails to interact with a door. Good for debugging.",
      scope: "world",
      config: true,
      default: true,
      type: Boolean
	});

	game.settings.register(MODULE_NAME, "globalInteractionDistance", {
		name: "Global maximum interaction distance",
		hint: "Max distance (in tiles) that a token can interact with a door... 0 will disable the limit (needs app reload). GM's ignore this distance limitation.",
		scope: "world",
		config: true,
		default: 1,
		type: Number,
		range: {min: 0, max: 50, step: 0.5}
	});

  game.settings.register(MODULE_NAME, "hotkeyDoorInteraction", {
		name: "Hotkey 'e' for interaction",
		hint: "Pressing 'e' will open or close nearest door. Holding 'e' will center camera on current token.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

  game.settings.register(MODULE_NAME, "hotkeyDoorInteractionDelay", {
		name: "Interaction double tap delay",
		hint: "Double tapping a move key on the direction of a door will interact with it. This option sets the delay between required key presses (the lower the faster you need to tap). Setting this option to zero will disable interaction with double tap.",
		scope: "world",
		config: true,
		default: 200,
		type: Number,
		range: {min: 0, max: 750, step: 50}
	});

	game.settings.register(MODULE_NAME, "doorInteractionDistance", {
		name: "Maximum door interaction distance",
    hint: "",
		scope: "world",
		config: true,
		default: 1,
		type: Number,
		range: {min: 0, max: 10, step: 0.5}
	});

    game.settings.register(MODULE_NAME, "hotkeyDoorInteractionCenter", {
		name: "Hotkey 'e' to center camera",
		hint: "Holding 'e' will center the camera on current selected token.",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

	game.settings.register(MODULE_NAME, "globalInteractionDistanceForGM", {
		name: "Notifications failed interactions even for GM",
    	hint: "Emit notifications for when a player fails to interact with a door. Good for debugging even for GM.",
		scope: "world",
		config: true,
		default: false,
		type: Boolean
	});

	game.settings.register(MODULE_NAME, "forceReSelection", {
		name: "Avoid deselects the controlled token when open/close the door",
    	hint: "Avoid deselects the controlled token if opening the door with a mouse click and 'Left-Click to Release Objects' is checked in the Core",
		scope: "world",
		config: true,
		default: false,
		type: Boolean
	});

	game.settings.register(MODULE_NAME, "useOwnedTokenIfNoTokenIsSelected", {
		name: "Use the owned tokens if no tokens is selected",
    	hint: "Use the owned tokens if no tokens is selected",
		scope: "world",
		config: true,
		default: true,
		type: Boolean
	});

	//@ts-ignore
	// KeybindLib.register(MODULE_NAME, "setCustomKeyBindForDoorInteraction", {
	// 	name: "Set a custom keybind for door interaction",
	// 	hint: "Set a custom keybind for door interaction",
	// 	config: true,
	// 	default: "KeyE",
	// 	onKeyDown: () => {
	// 		console.log("Key pressed!");
	// 	}
	// });

	// ========================================================
  // Ambient Door
  // ========================================================

	game.settings.register(MODULE_NAME, "enableAmbientDoor", {
		  name: "Enable/Disable ambient door feature",
    	hint: "Adds easily customized sounds effects that trigger for all user when interacting with doors. Just open up a doors configuration window to initialize the set up for that door, and you'll be able to enter in the sound file pathways that you wish to play when that door; is opened, is closed, is locked, or is unlocked. If you do not wish for any sound effect to play when an certain action is taken, just leave that specific field blank. Some default sounds have been provided.",
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
      onChange: (data) => {
        manageSettingsAmbientDoorFeature(data);
      }
	});

	game.settings.register(MODULE_NAME, "stealthDoor",{
		  name: "Silent Door Permission Level",
      hint: "The required role permission level to use the silent door open/close feature. (Alt + Click the Door)",
      scope: "world",
      config: true,
      default: "2",
      choices: {1: "Player", 2: "Trusted", 3: "Assistant", 4: "Game Master"},
      type: String
	});

    game.settings.register(MODULE_NAME, "closeDoorPathDefault", {
        name: "Door Close",
        hint: "The default sound effect that will be played when a door is closed.",
        scope: 'world',
        config: true,
        default: `modules/${MODULE_NAME}/assets/defaultSounds/DoorCloseSound.wav`,
        //type: String
        //@ts-ignore
        type: SoundPicker.Sound,
    });

    game.settings.register(MODULE_NAME, "closeDoorLevelDefault", {
        name: "Close Door Volume Level",
        hint: "The default volume level that the close door SFX will be played at.",
        scope: 'world',
        config: true,
        default: 0.8,
        type: Number,
		    range: {min:0, max:2, step:0.05}
    });

    game.settings.register(MODULE_NAME, "openDoorPathDefault", {
        name: "Door Open",
        hint: "The default sound effect that will be played when a door is opened.",
        scope: 'world',
        config: true,
        default: `modules/${MODULE_NAME}/assets/defaultSounds/DoorOpenSound.wav`,
        //type: String
        //@ts-ignore
        type: SoundPicker.Sound,
    });

    game.settings.register(MODULE_NAME, "openDoorLevelDefault", {
        name: "Open Door Volume Level",
        hint: "The default volume level that the open door SFX will be played at.",
        scope: 'world',
        config: true,
        default: 0.8,
        type: Number,
		    range: {min:0, max:2, step:0.05}
    });

    game.settings.register(MODULE_NAME, "lockDoorPathDefault", {
        name: "Door Lock",
        hint: "The default sound effect that will be played when a door is locked.",
        scope: 'world',
        config: true,
        default: `modules/${MODULE_NAME}/assets/defaultSounds/DoorLockSound.wav`,
        //type: String
        //@ts-ignore
        type: SoundPicker.Sound,
    });

    game.settings.register(MODULE_NAME, "lockDoorLevelDefault", {
        name: "Close Lock Volume Level",
        hint: "The default volume level that the lock door SFX will be played at.",
        scope: 'world',
        config: true,
        default: 0.8,
        type: Number,
	    	range: {min:0, max:2, step:0.05}
    });

    game.settings.register(MODULE_NAME, "unlockDoorPathDefault", {
        name: "Door Unlock",
        hint: "The default sound effect that will be played when a door is unlocked.",
        scope: 'world',
        config: true,
        default: `modules/${MODULE_NAME}/assets/defaultSounds/DoorUnlockSound.wav`,
        //type: String
        //@ts-ignore
        type: SoundPicker.Sound,
    });

    game.settings.register(MODULE_NAME, "unlockDoorLevelDefault", {
        name: "Unlock Door Volume Level",
        hint: "The default volume level that the unlock door SFX will be played at.",
        scope: 'world',
        config: true,
        default: 0.8,
        type: Number,
		    range: {min:0, max:2, step:0.05}
    });

    game.settings.register(MODULE_NAME, "lockedDoorJinglePathDefault", {
        name: "Locked Door Jingle",
        hint: "The default sound effect that will be played when a locked door is attempted to be opened.",
        scope: 'world',
        config: true,
        default: `sounds/lock.wav`,
        type: String
    });

    game.settings.register(MODULE_NAME, "lockedDoorJingleLevelDefault", {
        name: "Locked Door Jingle Volume Level",
        hint: "The default volume level that the unlock door SFX will be played at.",
        scope: 'world',
        config: true,
        default: 0.8,
        type: Number,
		    range: {min:0, max:2, step:0.05}
    });

	  // ========================================================
    // Sound Previewer
    // ========================================================

    game.settings.register(MODULE_NAME, "enableSoundPreviewer", {
        name: "Enable/Disable Sound Previewer feature",
        hint: "Double click on any audio file within the file picker. Sound should stop playing once a different file is chosen, the file picker is closed, or navigation changed.",
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    // ========================================================
    // Designer Door
    // ========================================================

    game.settings.register(MODULE_NAME, "enableDesignerDoor", {
      name: "Enable/Disable Designer Door",
      hint: "You can change the default door icons used to show closed, open and locked doors. These are set through the module settings panel and will be applied to all doors that DO NOT have their own custom icons.",
      scope: "world",
      config: true,
      default: true,
      type: Boolean,
      onChange: (data) => {
        manageSettingsDesignerDoorFeature(data);
      }
    });

    // Initialise settings for default icon paths
    // Closed door default icon

    game.settings.register(MODULE_NAME, 'doorClosedDefault', {
        name: 'Closed Door',
        hint: 'The default icon for a closed door',
        scope: 'world',
        config: true,
        default: `modules/${MODULE_NAME}/assets/icons/door-steel.svg`,
        //type: String
        //@ts-ignore
        type: ImagePicker.Img,
    });

    // Open door default icon

    game.settings.register(MODULE_NAME, 'doorOpenDefault', {
        name: 'Open Door',
        hint: 'The default icon for an open door',
        scope: 'world',
        config: true,
        default: `modules/${MODULE_NAME}/assets/icons/door-exit.svg`,
        //type: String
        //@ts-ignore
        type: ImagePicker.Img,
    });

    // Locked door default icon

    game.settings.register(MODULE_NAME, 'doorLockedDefault', {
        name: 'Locked Door',
        hint: 'The default icon for a locked door',
        scope: 'world',
        config: true,
        default: `modules/${MODULE_NAME}/assets/icons/padlock.svg`,
        //type: String
        //@ts-ignore
        type: ImagePicker.Img,
    });


    // ========================================================
    // Windows Door
    // ========================================================

    game.settings.register(MODULE_NAME, "enableWindowDoor", {
      name: "Enable/Disable Window Door",
      hint: "Enable/Disable Window Door",
      scope: "world",
      config: true,
      default: false,
      type: Boolean
    });


}
