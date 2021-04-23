import { WindowDoors } from './WindowDoors';
import { AmbientDoors } from './AmbientDoors';
import { warn, error, debug, i18n, i18nFormat } from "../foundryvtt-arms-reach";
import { Armsreach } from "./ArmsReach";
import { manageSettingsArmsReachFeature, MODULE_NAME } from './settings';
import { SoundPreviewer } from "./SoundPreviewer";
import { DesignerDoors } from './DesignerDoors';
//@ts-ignore
// import { KeybindLib } from "/modules/keybind-lib/keybind-lib.js";

// const previewer = new SoundPreviewerApplication();

export let readyHooks = async () => {

  Hooks.on('preUpdateWall', async (scene, object, updateData, diff, userID) => {

    if(<boolean>game.settings.get(MODULE_NAME, "enableAmbientDoor")) {
      AmbientDoors.preUpdateWallHandler(scene, object, updateData, diff, userID);
    }else if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
      Armsreach.preUpdateWallHandler(scene, object, updateData, diff, userID);
    }

  });


  Hooks.on("renderWallConfig", (app, html, data) => {

    if(<boolean>game.settings.get(MODULE_NAME, "enableAmbientDoor")) {
      AmbientDoors.renderWallConfigHandler(app, html, data);
    }

    if(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor")) {
      DesignerDoors.renderWallConfigHandler(app, html, data);
    }

    if(<boolean>game.settings.get(MODULE_NAME, "enableWindowDoor")) {
      WindowDoors.renderWallConfigHandler(app, html, data);
    }

  });

  Hooks.on('renderFilePicker', (_app, html, _data) => {

    if(<boolean>game.settings.get(MODULE_NAME, "enableSoundPreviewer")) {
      SoundPreviewer.start(html);
    }

  });

  Hooks.on('closeFilePicker', () => {

    // Sound Preview

    if(<boolean>game.settings.get(MODULE_NAME, "enableSoundPreviewer")) {
      SoundPreviewer.stop();
    }
  });

  Hooks.on("renderSettingsConfig", (app, html, user) => {

    if(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor")) {
      DesignerDoors.renderSettingsConfigHandler(app, html, user);
    }

  });

  Hooks.on('canvasInit', () => {

    if(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor")) {
      DesignerDoors.canvasInitHandler();
    }

  });

  //@ts-ignore
  libWrapper.register(MODULE_NAME, 'DoorControl.prototype._getTexture', DoorControlPrototypeGetTextureHandler, 'MIXED');


}

export let initHooks = () => {
  warn("Init Hooks processing");

  if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
    Armsreach.init();
  }

  if(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor")) {
    DesignerDoors.init();
  }

  // setup all the hooks

  // Register custom sheets (if any)

  //@ts-ignore
  //libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onMouseOver', DoorControlPrototypeOnMouseOverHandler, 'WRAPPER');

  if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onMouseDown', DoorControlPrototypeOnMouseDownHandler, 'OVERRIDE');
  }else{
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onMouseDown', DoorControlPrototypeOnMouseDownHandler2, 'WRAPPER');
  }

}

export const DoorControlPrototypeOnMouseDownHandler = async function () { //function (wrapped, ...args) {

    // const [t] = args;
    // const doorControl = t.currentTarget;
    const doorControl = this; //evt.currentTarget;

    if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
      Armsreach.globalInteractionDistance(doorControl);
    }

    // YOU NEED THIS ANYWAY FOR A STRANGE BUG WITH OVERRIDE AND SOUND OF DOOR
    //if(<boolean>game.settings.get(MODULE_NAME, "enableAmbientDoor")) {
      AmbientDoors.onDoorMouseDownCheck(doorControl);
    //}
    // Call original method
    //return originalMethod.apply(this,arguments);
    //return wrapped(...args);
}

export const DoorControlPrototypeOnMouseDownHandler2 = async function (wrapped, ...args) {
  
  const doorControl = this; 
  
  if(<boolean>game.settings.get(MODULE_NAME, "enableAmbientDoor")) {
    AmbientDoors.onDoorMouseDownCheck(doorControl);
  }

  return wrapped(...args);
}

export const DoorControlPrototypeGetTextureHandler  = async function (wrapped, ...args) {

  const doorControl = this;

  if(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor")) {
    DesignerDoors.getTextureOverride(doorControl);
  }

  return wrapped(...args);
}