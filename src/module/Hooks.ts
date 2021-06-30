import { warn, error, debug, i18n, i18nFormat } from "../foundryvtt-arms-reach";
import { Armsreach, computeDistanceBetweenCoordinates, getCharacterName, getFirstPlayerToken, getFirstPlayerTokenSelected, getTokenCenter, iteractionFailNotification } from "./ArmsReach";
import { getCanvas, MODULE_NAME } from './settings';
import { StairwaysReach } from './StairwaysReach';
import { ResetDoorsAndFog } from './resetdoorsandfog';
//@ts-ignore
// import { KeybindLib } from "/modules/keybind-lib/keybind-lib.js";

// const previewer = new SoundPreviewerApplication();

export let readyHooks = async () => {

  // setup all the hooks

  Hooks.on('preUpdateWall', async (object, updateData, diff, userID) => {

    // THIS IS ONLY A BUG FIXING FOR THE SOUND DISABLE FOR THE lib-wrapper override
    if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
      // if ambient door is present and active dont' do this
      if(!game.modules.get("ambientdoors")?.active){
        Armsreach.preUpdateWallBugFixSoundHandler(object, updateData, diff, userID);
      }
    }

  });

  // Management of the Stairways module
  if (game.modules.get("stairways")?.active){
    Hooks.on('PreStairwayTeleport', (data) => {
      if(<boolean>game.settings.get(MODULE_NAME, "enableStairwaysIntegration")) {
        const { sourceSceneId, sourceData, selectedTokenIds, targetSceneId, targetData, userId } = data

        return StairwaysReach.globalInteractionDistance(sourceData,selectedTokenIds,userId);
      }

    });
  }

  // Adds menu option to Scene Nav and Directory
  Hooks.on("getSceneNavigationContext", (html, contextOptions) => {
    if(<boolean>game.settings.get(MODULE_NAME, "enableResetDoorsAndFog")) {
      contextOptions.push(ResetDoorsAndFog.getContextOption2('sceneId'));
    }
  });

  Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) => {
    if(<boolean>game.settings.get(MODULE_NAME, "enableResetDoorsAndFog")) {
      contextOptions.push(ResetDoorsAndFog.getContextOption2('entityId'));
    }
  });

  // Adds Shut All Doors button to Walls Control Layer
  Hooks.on("getSceneControlButtons", function(controls){
    if(<boolean>game.settings.get(MODULE_NAME, "enableResetDoorsAndFog")) {
      controls[4].tools.splice(controls[4].tools.length-2,0,{
          name: "close",
          title: "Close Open Doors",
          icon: "fas fa-door-closed",
          onClick: () => {
              ResetDoorsAndFog.resetDoors(true);
          },
          button: true
      })
      return controls;
    }
  })

  // Register custom sheets (if any)

}

export let setupHooks = () => {


}



export let initHooks = () => {
  warn("Init Hooks processing");

  if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
    Armsreach.init();
  }

  if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onMouseDown', DoorControlPrototypeOnMouseDownHandler, 'MIXED');
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onRightDown', DoorControlPrototypeOnRightDownHandler, 'MIXED');

  }

}

export const DoorControlPrototypeOnMouseDownHandler = async function (wrapped, ...args) {
    const doorControl = this;
    if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
      const isInReach = await Armsreach.globalInteractionDistance(doorControl);
      if(!isInReach){
        // Bug fix not sure why i need to do this
        if(doorControl.wall.data.ds == CONST.WALL_DOOR_STATES.LOCKED) {// Door Lock
          let doorData = Armsreach.defaultDoorData();
          let playpath = doorData.lockPath;
          let playVolume = doorData.lockLevel;
          let fixedPlayPath = playpath.replace("[data]", "").trim();
          AudioHelper.play({src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false}, true);
        }
        return;
      }
    }

    // YOU NEED THIS ANYWAY FOR A STRANGE BUG WITH OVERRIDE AND SOUND OF DOOR
    //if(<boolean>game.settings.get(MODULE_NAME, "enableAmbientDoor")) {
    //  AmbientDoors.onDoorMouseDownCheck(doorControl);
    //}
    // Call original method
    //return originalMethod.apply(this,arguments);
    return wrapped(...args);
}

export const DoorControlPrototypeOnRightDownHandler = async function (wrapped, ...args) {
  const doorControl = this; //evt.currentTarget;
  if(<boolean>game.settings.get(MODULE_NAME, "enableArmsReach")) {
    let character:Token = getFirstPlayerTokenSelected();
    let isOwned:boolean = false;
    if(!character){
      character = getFirstPlayerToken();
      if(character){
        isOwned = true;
      }
    }
    if(!character){
      if(game.user.isGM){
        return wrapped(...args);
      }else{
        return;
      }
    }
    const isInReach = await Armsreach.globalInteractionDistance(doorControl);
    if (!isInReach) {
      return;
    }
  }
  return wrapped(...args);
}
