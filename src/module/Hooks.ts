import { WindowDoors } from './WindowDoors';
import { AmbientDoors } from './AmbientDoors';
import { warn, error, debug, i18n, i18nFormat } from "../foundryvtt-arms-reach";
import { Armsreach } from "./ArmsReach";
import { manageSettingsArmsReachFeature, MODULE_NAME } from './settings';
import { SoundPreviewer } from "./SoundPreviewer";
import { DesignerDoors } from './DesignerDoors';
import { ShowDoorIcons } from './showdooricons';
//@ts-ignore
// import { KeybindLib } from "/modules/keybind-lib/keybind-lib.js";

// const previewer = new SoundPreviewerApplication();

export let readyHooks = async () => {

  // setup all the hooks

  // Register custom sheets (if any)

  Hooks.on('preUpdateWall', async (scene, object, updateData, diff, userID) => {

    if(<boolean>game.settings.get(MODULE_NAME, "enableAmbientDoor")) {
      AmbientDoors.preUpdateWallHandler(scene, object, updateData, diff, userID);
    }
    // THIS IS ONLY A BUG FIXING FOR THE SOUND DISABLE FOR THE lib-wrapper override
    else if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
      Armsreach.preUpdateWallBugFixSoundHandler(scene, object, updateData, diff, userID);
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
      // DesignerDoors.renderSettingsConfigHandler(app, html, user);
    }

  });

  Hooks.on('canvasInit', () => {

    if(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor")) {
      DesignerDoors.canvasInitHandler();
    }

  });



}

export let setupHooks = () => {
  
  if(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor")) {
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'DoorControl.prototype._getTexture', DoorControlPrototypeGetTextureHandler, 'MIXED');
  }
}



export let initHooks = () => {
  warn("Init Hooks processing");
  
  if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
    Armsreach.init();
  }

  if(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor")) {
    DesignerDoors.init();
  }

  //@ts-ignore
  //libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onMouseOver', DoorControlPrototypeOnMouseOverHandler, 'WRAPPER');
  
  if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onMouseDown', DoorControlPrototypeOnMouseDownHandler, 'OVERRIDE');
  }else{
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onMouseDown', DoorControlPrototypeOnMouseDownHandler2, 'WRAPPER');
  }

  if(<boolean>game.settings.get(MODULE_NAME, "enabledShowDoorIcons")) {
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'ControlsLayer.prototype.drawDoors', ControlsLayerPrototypeDrawDoorsHandler, 'MIXED');
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'Wall.prototype._onModifyWall', WallPrototypeOnModifyWallHandler, 'WRAPPER');
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'WallsLayer.prototype.activate', WallsLayerPrototypeActivateHandler, 'MIXED');
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

export const DoorControlPrototypeGetTextureHandler  = async function(wrapped, ...args) {

  const doorControl = this;
  let texture:PIXI.Texture;
  if(<boolean>game.settings.get(MODULE_NAME, "enableDesignerDoor")) {
    texture = DesignerDoors.getTextureOverride(doorControl);
    if(texture!=null){
      return texture;
    }else{
      return wrapped(...args);
    }
  }else{
    return wrapped(...args);
  }
}

export const ControlsLayerPrototypeDrawDoorsHandler = async function (wrapped, ...args) {
  if(<boolean>game.settings.get(MODULE_NAME, "enabledShowDoorIcons")) {
    ShowDoorIcons.controlsLayerPrototypeDrawDoorsHandler(this);
  }
  return wrapped(...args);
};

export const WallsLayerPrototypeActivateHandler = function (wrapped, ...args) {
  if(<boolean>game.settings.get(MODULE_NAME, "enabledShowDoorIcons")) {
    ShowDoorIcons.wallsLayerPrototypeActivateHandler();
  }
  return wrapped(...args);
}

export const WallPrototypeOnModifyWallHandler = function (wrapped, ...args) {
  if(<boolean>game.settings.get(MODULE_NAME, "enabledShowDoorIcons")) {
    const [state] = args;
    ShowDoorIcons.wallPrototypeOnModifyWallHandler(state);
  }
  return wrapped(...args);
}