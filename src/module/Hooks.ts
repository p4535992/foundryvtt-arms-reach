import { warn, error, debug, i18n, i18nFormat } from "../foundryvtt-arms-reach";
import { getCanvas, ARMS_REACH_MODULE_NAME, getGame } from './settings';
import { StairwaysReach } from './StairwaysReach';
import { ResetDoorsAndFog } from './resetdoorsandfog';
import { getFirstPlayerToken, getFirstPlayerTokenSelected } from "./ArmsReachhelper";
import { DoorsReach } from "./DoorsReach";
//@ts-ignore
// import { KeybindLib } from "/modules/keybind-lib/keybind-lib.js";

// const previewer = new SoundPreviewerApplication();

export let readyHooks = async () => {

  // setup all the hooks

  Hooks.on('preUpdateWall', async (object, updateData, diff, userID) => {

    // THIS IS ONLY A BUG FIXING FOR THE SOUND DISABLE FOR THE lib-wrapper override
    if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "enableArmsReach")) {
      // if ambient door is present and active dont' do this
      if(!getGame().modules.get("ambientdoors")?.active){
        DoorsReach.preUpdateWallBugFixSoundHandler(object, updateData, diff, userID);
      }
    }

  });

  // Management of the Stairways module
  if (getGame().modules.get("stairways")?.active){
    Hooks.on('PreStairwayTeleport', (data) => {
      if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "enableStairwaysIntegration")) {
        const { sourceSceneId, sourceData, selectedTokenIds, targetSceneId, targetData, userId } = data
        let tokenSelected;
        if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "forceReSelection")) {
          tokenSelected = <Token>getFirstPlayerTokenSelected(); 
          if(!tokenSelected){
            tokenSelected = <Token>getFirstPlayerToken();
          } 
        }
        const result = StairwaysReach.globalInteractionDistance(sourceData,selectedTokenIds,userId);
        DoorsReach.reselectTokenAfterInteraction(tokenSelected);
        return result;
      }

    });
  }

  // Adds menu option to Scene Nav and Directory
  Hooks.on("getSceneNavigationContext", (html, contextOptions) => {
    if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "enableResetDoorsAndFog")) {
      contextOptions.push(<any>ResetDoorsAndFog.getContextOption2('sceneId'));
    }
  });

  Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) => {
    if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "enableResetDoorsAndFog")) {
      contextOptions.push(ResetDoorsAndFog.getContextOption2('entityId'));
    }
  });

  // Adds Shut All Doors button to Walls Control Layer
  Hooks.on("getSceneControlButtons", function(controls){
    if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "enableResetDoorsAndFog")) {
      controls[4].tools.splice(controls[4].tools.length-2,0,{
          name: "close",
          title: "Close Open Doors",
          icon: "fas fa-door-closed",
          onClick: () => {
              ResetDoorsAndFog.resetDoors(true,null);
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

  if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "enableArmsReach")) {
    DoorsReach.init();
  }

  if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "enableArmsReach")) {
    //@ts-ignore
    libWrapper.register(ARMS_REACH_MODULE_NAME, 'DoorControl.prototype._onMouseDown', DoorControlPrototypeOnMouseDownHandler, 'MIXED');
    //@ts-ignore
    libWrapper.register(ARMS_REACH_MODULE_NAME, 'DoorControl.prototype._onRightDown', DoorControlPrototypeOnRightDownHandler, 'MIXED');

  }

}

export const DoorControlPrototypeOnMouseDownHandler = async function (wrapped, ...args) {
    const doorControl = this;
    if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "enableArmsReach")) {
      let tokenSelected;
      if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "forceReSelection")) {
        tokenSelected = <Token>getFirstPlayerTokenSelected(); 
        if(!tokenSelected){
          tokenSelected = <Token>getFirstPlayerToken();
        } 
      }
      const isInReach = await DoorsReach.globalInteractionDistance(doorControl, false);
      DoorsReach.reselectTokenAfterInteraction(tokenSelected);
      if(!isInReach){
        // Bug fix not sure why i need to do this
        if(doorControl.wall.data.ds == CONST.WALL_DOOR_STATES.LOCKED) {// Door Lock
          let doorData = DoorsReach.defaultDoorData();
          let playpath = doorData.lockPath;
          let playVolume = doorData.lockLevel;
          let fixedPlayPath = playpath.replace("[data]", "").trim();
          AudioHelper.play({src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false}, true);
        }
        return;
      }
    }

    // YOU NEED THIS ANYWAY FOR A STRANGE BUG WITH OVERRIDE AND SOUND OF DOOR
    //if(<boolean>getGame().settings.get(MODULE_NAME, "enableAmbientDoor")) {
    //  AmbientDoors.onDoorMouseDownCheck(doorControl);
    //}
    // Call original method
    //return originalMethod.apply(this,arguments);
    return wrapped(...args);
}

export const DoorControlPrototypeOnRightDownHandler = async function (wrapped, ...args) {
  const doorControl = this; //evt.currentTarget;
  if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "enableArmsReach")) {
    let character:Token = <Token>getFirstPlayerTokenSelected();
    let isOwned:boolean = false;
    if(!character){
      character = <Token>getFirstPlayerToken();
      if(character){
        isOwned = true;
      }
    }
    if(!character){
      if(getGame().user?.isGM){
        return wrapped(...args);
      }else{
        return;
      }
    }
    const isInReach = await DoorsReach.globalInteractionDistance(doorControl, true);
    DoorsReach.reselectTokenAfterInteraction(character);
    if (!isInReach) {
      return;
    }
  }
  return wrapped(...args);
}
