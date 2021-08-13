import { error, i18n, i18nFormat } from "../foundryvtt-arms-reach";
import { DoorData, DoorSourceData, DoorTargetData } from "./ArmsReachModels";
import { getCanvas, ARMS_REACH_MODULE_NAME, getGame } from "./settings";
//@ts-ignore
import { SpeedProvider } from '../../drag-ruler/src/speed_provider.js';
//@ts-ignore
import { availableSpeedProviders, currentSpeedProvider} from '../../drag-ruler/src/api.js';
import { computeDistanceBetweenCoordinates, computeDistanceBetweenCoordinatesOLD, getCharacterName, getFirstPlayerToken, getFirstPlayerTokenSelected, getTokenCenter, isFocusOnCanvas, iteractionFailNotification } from "./ArmsReachhelper";

export const DoorsReach = {

  init : function(){

    // Door interaction
    document.addEventListener('keydown', (evt) => {
      //if (KeybindLib.isBoundTo(evt, MODULE_NAME, "bindNamesetCustomKeyBindForDoorInteraction")) {
      if (evt.key === 'e') {
        if(!getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionCenter")) {
          return;
        }
        if(ArmsReachVariables.door_interaction_cameraCentered) {
          ArmsReachVariables.door_interaction_cameraCentered = false;
          return;
        }

        if( !isFocusOnCanvas() ) {
          return;
        }

        if( ArmsReachVariables.door_interaction_keydown == false ) {
          ArmsReachVariables.door_interaction_lastTime = Date.now();
          ArmsReachVariables.door_interaction_keydown = true;
        } else {
          // Center camera on character (if  key was pressed for a time)
          let diff = Date.now() - ArmsReachVariables.door_interaction_lastTime;
          if( diff > 500 ) {
            ArmsReachVariables.door_interaction_lastTime = Date.now();
            let character = getFirstPlayerToken();
            if( !character ) {
              iteractionFailNotification(i18n("foundryvtt-arms-reach.noCharacterSelectedToCenterCamera"));
              return;
            }

            ArmsReachVariables.door_interaction_cameraCentered = true;
            getCanvas().animatePan({x: character.x, y: character.y});
          }
        }
      }
    });

    document.addEventListener('keyup', (evt) => {
      //if (KeybindLib.isBoundTo(evt, MODULE_NAME, "bindNamesetCustomKeyBindForDoorInteraction")) {
      if (evt.key === 'e') {
        ArmsReachVariables.door_interaction_keydown = false;

        if(ArmsReachVariables.door_interaction_cameraCentered) {
          return;
        }

        if( !isFocusOnCanvas() ) {
          return;
        }

        if (!getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteraction")){
          return;
        }
        // Get first token ownted by the player
        let character = getFirstPlayerToken();

        if( !character ) {
          iteractionFailNotification(i18n("foundryvtt-arms-reach.noCharacterSelected"));
          return;
        }

        DoorsReach.interactWithNearestDoor(character,0,0);
      }
    });

    // Double Tap to open nearest door -------------------------------------------------
    document.addEventListener('keyup', evt => {
      if (evt.key === 'ArrowUp' || evt.key === 'w') {
        if(getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) {
          return;
        }
        DoorsReach.ifStuckInteract('up', 0, -0.5);
      }

      if (evt.key === 'ArrowDown' || evt.key === 's') {
        if(getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) {
          return;
        }
        DoorsReach.ifStuckInteract('down', 0, +0.5);
      }

      if (evt.key === 'ArrowRight' || evt.key === 'd') {
        if(getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) {
          return;
        }
        DoorsReach.ifStuckInteract('right', +0.5, 0);
      }

      if (evt.key === 'ArrowLeft' || evt.key === 'a') {
        if(getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) {
          return;
        }
        DoorsReach.ifStuckInteract('left', -0.5, 0);
      }
    });

  },

  reselectTokenAfterInteraction: function(character:Token){
    
    // If settings is true do not deselect the current select token
    if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "forceReSelection")) {
      let isOwned:boolean = false;
      if(!character){
        character = <Token>getFirstPlayerTokenSelected();       
        if(!character){
          character = <Token>getFirstPlayerToken();
          if(character){
            isOwned = true;
          }
        }
        if(!character){
          if(getGame().user?.isGM){
            return true;
          }else{
            return false;
          }
        }
      }

      // Make sense only if use owned is false beacuse there is no way to check what
      // owned token is get from the array
      if(!isOwned) {
        //let character:Token = getFirstPlayerToken();
        if( !character ) {
          // DO NOTHING
        }else{
          const observable = getCanvas().tokens?.placeables.filter(t => t.id === character.id);
          if (observable !== undefined){
              observable[0].control();
          }
        }
      }
    }
  },

  globalInteractionDistance : async function(doorControl:DoorControl){

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
        return true;
      }else{
        return false;
      }
    }
    // OLD SETTING
    let globalInteraction = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
    if(globalInteraction <= 0){
      globalInteraction = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionMeasurement");
    }

    // Sets the global maximum interaction distance
    // Global interaction distance control. Replaces prototype function of DoorControl. Danger...
    if(globalInteraction  > 0 ) {

      // Check distance
      //let character:Token = getFirstPlayerToken();
      if( !getGame().user?.isGM || (getGame().user?.isGM && <boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistanceForGM"))) {

        const sourceData:DoorSourceData = {
          scene: <Scene>getCanvas().scene,
          name: doorControl.name,
          label: doorControl.name,
          icon: "", //doorControl.icon.texture.baseTexture., // TODO
          disabled: (doorControl.wall.data.ds === CONST.WALL_DOOR_STATES.LOCKED),
          hidden: (doorControl.wall.data.door === CONST.WALL_DOOR_TYPES.SECRET),
          animate: false,
          x: doorControl.x,
          y: doorControl.y
        };

        const targetData:DoorTargetData = {
          scene: <Scene>getCanvas().scene,
          name: character.name,
          label: character.name,
          icon: "", //doorControl.icon.texture.baseTexture., // TODO
          disabled: false,
          hidden: false,
          animate: false,
          x: getTokenCenter(character).x,
          y: getTokenCenter(character).y
        };

        //const sourceSceneId = getCanvas().scene.id;
        //const selectedOrOwnedTokenId = getCanvas().tokens.controlled.map((token) => token.id)
        //const targetSceneId = targetScene ? targetScene.id : null
        const doorData:DoorData = {
          sourceData: sourceData,
          selectedOrOwnedTokenId: character.id,
          targetData: targetData,
          userId: <string>getGame().userId
        }

        if( !character ) {
          iteractionFailNotification(i18n("foundryvtt-arms-reach.noCharacterSelected"));
          return false;
        }else{
          // PreHook (can abort the interaction with the door)
          if (Hooks.call('PreArmsReachInteraction', doorData) === false) {
            var tokenName = getCharacterName(character);
            if (tokenName){
              iteractionFailNotification(i18nFormat("foundryvtt-arms-reach.doorNotInReachFor",{tokenName : tokenName}));
            }
            else {
              iteractionFailNotification(i18n("foundryvtt-arms-reach.doorNotInReach"));
            }
            return false
          }

          let isNotNearEnough = false;
          const result = { status: 0 };
          Hooks.call('ReplaceArmsReachInteraction', doorData, result);
          const resultExplicitComputeDistance = result.status;
          let jumDefaultComputation = false;
          // undefined|null|Nan go with the standard compute distance
          if(typeof(resultExplicitComputeDistance) == 'number'){
            // 0 : Custom compute distance fail but fallback to the standard compute distance
            if (<number>resultExplicitComputeDistance === 0) {
              isNotNearEnough = true;
              jumDefaultComputation = false;
            }
            // 1 : Custom compute success
            else if (<number>resultExplicitComputeDistance === 1) {
              isNotNearEnough = false;
              jumDefaultComputation = true;
            }
            // 2 : If Custom compute distance fail
            else if (<number>resultExplicitComputeDistance === 2) {
              isNotNearEnough = true;
              jumDefaultComputation = true;
            }
            // x < 0 || x > 2 just fail but fallback to the standard compute distance
            else{
              isNotNearEnough = true;
              jumDefaultComputation = false;
            }
          }

          // Standard computing distance
          if(!jumDefaultComputation){
            // OLD SETTING
            if(<number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance") > 0){
              let dist = <number>computeDistanceBetweenCoordinatesOLD(doorControl, character); 
              isNotNearEnough = dist > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
            }else{
              let dist = computeDistanceBetweenCoordinates(doorControl, character);
              isNotNearEnough = dist > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionMeasurement");
            }
          }

          if (isNotNearEnough) {
            var tokenName = getCharacterName(character);
            if (tokenName){
              iteractionFailNotification(i18nFormat("foundryvtt-arms-reach.doorNotInReachFor",{tokenName : tokenName}));
            }
            else {
              iteractionFailNotification(i18n("foundryvtt-arms-reach.doorNotInReach"));
            }
            // MOD 4535992 MAKE SURE THE DOOR REMAIN CLOSED/OPEN AFTER CLICK ONLY WITH WRAPPER AND MIXED
            /*
            const [t] = args;
            const doorControl = t.currentTarget;
            let wall:Wall = getCanvas().walls.get(doorControl.wall.data._id);
            if(wall){
              if(wall.data.ds==CONST.WALL_DOOR_STATES.CLOSED)
              {
                await getCanvas().walls.get(doorControl.wall.data._id).update({
                    ds : CONST.WALL_DOOR_STATES.OPEN
                });
              }else if(wall.data.ds==CONST.WALL_DOOR_STATES.OPEN){
                await getCanvas().walls.get(doorControl.wall.data._id).update({
                    ds : CONST.WALL_DOOR_STATES.CLOSED
                });
              }else{
                error(i18nFormat("foundryvtt-arms-reach.errorNoDsProperty",{wallDataDs:wall.data.ds, wallDataId: doorControl.wall.data._id}));
              }
            }else{
              error(i18nFormat("foundryvtt-arms-reach.errorNoWallFoundForId",{wallDataId: doorControl.wall.data._id}));
            }
            */
            // If is a secret door we can do something
            /*
            if(doorControl.wall.data.door === CONST.WALL_DOOR_STATES.LOCKED){
              doorControl.wall.update(
                {"door" : CONST.WALL_DOOR_STATES.OPEN} // From secret door to normal door
              );
              let sent_message = `You have spotted a hidden door!`;
              let chatData = {
                user: getGame().user._id,
                content: sent_message,
                whisper : ChatMessage.getWhisperRecipients(getCharacterName(character)),
                speaker: ChatMessage.getSpeaker({alias: "Door"})
              };
              ChatMessage.create(chatData, {});
            }else if(doorControl.wall.data.door === CONST.WALL_DOOR_STATES.OPEN){
              doorControl.wall.update(
                {"door" : CONST.WALL_DOOR_STATES.CLOSED}
              );
            }
            */
           return false;
          }else{
            // Congratulations you are in reach
            // MOD 4535992 MAKE SURE THE DOOR REMAIN CLOSED/OPEN AFTER CLICK ONLY WITH OVERRIDE
            /*
            let wall:Wall = getCanvas().walls.get(doorControl.wall.data._id);
            if(wall){
              if(wall.data.ds==CONST.WALL_DOOR_STATES.CLOSED)
              {
                await getCanvas().walls.get(doorControl.wall.data._id).update({
                    ds : CONST.WALL_DOOR_STATES.OPEN
                });
              }else if(wall.data.ds==CONST.WALL_DOOR_STATES.OPEN){
                await getCanvas().walls.get(doorControl.wall.data._id).update({
                    ds : CONST.WALL_DOOR_STATES.CLOSED
                });
              }else if(wall.data.ds==CONST.WALL_DOOR_STATES.LOCKED){
                var tokenName = getCharacterName(character);
                if (tokenName){
                  iteractionFailNotification(i18nFormat("foundryvtt-arms-reach.doorIsInReachButIsLockedFor", {tokenName: tokenName}));
                }
                else {
                  iteractionFailNotification(i18n("foundryvtt-arms-reach.doorIsInReachButIsLocked"));
                }
              }
              else{
                error(i18nFormat("foundryvtt-arms-reach.errorNoDsProperty",{wallDataDs:wall.data.ds, wallDataId: doorControl.wall.data._id}));
              }
            }else{
              error(i18nFormat("foundryvtt-arms-reach.errorNoWallFoundForId",{wallDataId: doorControl.wall.data._id}));
            }
            */
            return true;
          }
          // END MOD ABD 4535992
        }

      } else if(getGame().user?.isGM) {
        /*
        let wall:Wall = getCanvas().walls.get(doorControl.wall.data._id);
        if(wall){
          if(wall.data.ds==CONST.WALL_DOOR_STATES.CLOSED)
          {
            await getCanvas().walls.get(doorControl.wall.data._id).update({
                ds : CONST.WALL_DOOR_STATES.OPEN
            });
          }else if(wall.data.ds==CONST.WALL_DOOR_STATES.OPEN){
            await getCanvas().walls.get(doorControl.wall.data._id).update({
                ds : CONST.WALL_DOOR_STATES.CLOSED
            });
          }else if(wall.data.ds==CONST.WALL_DOOR_STATES.LOCKED){
            // DO NOTHING
          }else{
            error(i18nFormat("foundryvtt-arms-reach.errorNoDsProperty",{wallDataDs:wall.data.ds, wallDataId: doorControl.wall.data._id}));
          }
        }else{
          error(i18nFormat("foundryvtt-arms-reach.errorNoWallFoundForId",{wallDataId: doorControl.wall.data._id}));
        }
        */
        return true;
      }

    }
    
  },

  preUpdateWallBugFixSoundHandler : async function(object, updateData, diff, userID){

    // if(
    //       (
    //       (object.door == 0 || updateData.ds == null) //Exit early if not a door OR door state not updating
    //   ||
    //       getGame().data.users.find(x => x._id === userID )['role'] >= getGame().settings.get(MODULE_NAME, "stealthDoor")
    //       )
    //       && getGame().keyboard.isDown("Alt")) // Exit if Sneaky Door Opening Mode
    // {
    //   return;
    // }

    let doorData = DoorsReach.defaultDoorData();

    let playpath = "";
    let playVolume = 0.8;

    if(object.data.ds == CONST.WALL_DOOR_STATES.LOCKED) { // Door Unlocking
      playpath = doorData.unlockPath;
      playVolume = doorData.unlockLevel;
    }
    else if(updateData.ds == CONST.WALL_DOOR_STATES.CLOSED) { //Door Close
      playpath = doorData.closePath;
      playVolume = doorData.closeLevel;
    }
    else if(updateData.ds == CONST.WALL_DOOR_STATES.OPEN) {//Door Open
      playpath = doorData.openPath;
      playVolume = doorData.openLevel;
    }
    else if(updateData.ds == CONST.WALL_DOOR_STATES.LOCKED) {// Door Lock
      playpath = doorData.lockPath;
      playVolume = doorData.lockLevel;
    }

    if(playpath != "" && playpath != null) {
      let fixedPlayPath = playpath.replace("[data]", "").trim();
      AudioHelper.play({src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false}, true);
    }

  },

  preUpdateWallBugFixSoundSimpleHandler : async function(updateData){

    // if(
    //       (
    //       (object.door == 0 || updateData.ds == null) //Exit early if not a door OR door state not updating
    //   ||
    //       getGame().data.users.find(x => x._id === userID )['role'] >= getGame().settings.get(MODULE_NAME, "stealthDoor")
    //       )
    //       && getGame().keyboard.isDown("Alt")) // Exit if Sneaky Door Opening Mode
    // {
    //   return;
    // }

    let doorData = DoorsReach.defaultDoorData();

    let playpath = "";
    let playVolume = 0.8;

    // if(object.data.ds == CONST.WALL_DOOR_STATES.LOCKED) { // Door Unlocking
    //   playpath = doorData.unlockPath;
    //   playVolume = doorData.unlockLevel;
    // }
    if(updateData.ds == CONST.WALL_DOOR_STATES.CLOSED) { //Door Close
      playpath = doorData.closePath;
      playVolume = doorData.closeLevel;
    }
    else if(updateData.ds == CONST.WALL_DOOR_STATES.OPEN) {//Door Open
      playpath = doorData.openPath;
      playVolume = doorData.openLevel;
    }
    else if(updateData.ds == CONST.WALL_DOOR_STATES.LOCKED) {// Door Lock
      playpath = doorData.lockPath;
      playVolume = doorData.lockLevel;
    }

    if(playpath != "" && playpath != null) {
      let fixedPlayPath = playpath.replace("[data]", "").trim();
      AudioHelper.play({src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false}, true);
    }

  },

  //grab the default sounds from the config paths
  defaultDoorData : function () {
    return {
      closePath: `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorCloseSound.wav`,
      closeLevel: 0.8,
      openPath: `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorOpenSound.wav`,
      openLevel: 0.8,
      lockPath:  `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorLockSound.wav`,
      lockLevel: 0.8,
      unlockPath: `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorUnlockSound.wav`,
      unlockLevel: 0.8,
      lockJinglePath: `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorLockPicking.wav`,
      lockJingleLevel: 0.8
    }
  },

  ifStuckInteract: function(key, offsetx, offsety) {

    if (!isFocusOnCanvas()){
      return;
    }
    let character = getFirstPlayerToken();
    if(!character){
      return;
    }
    if( Date.now() - ArmsReachVariables.lastData[key] > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay") ) {
      ArmsReachVariables.lastData.x = character.x;
      ArmsReachVariables.lastData.y = character.y;
      ArmsReachVariables.lastData[key] = Date.now();
      return;
    }

    // See if character is stuck
    if(character.x == ArmsReachVariables.lastData.x && character.y == ArmsReachVariables.lastData.y) {
      DoorsReach.interactWithNearestDoor(character, offsetx, offsety);
    }
  },

  /**
   * Interact with door
   */
  interactWithNearestDoor : function(token:Token, offsetx = 0, offsety = 0) {
    // Max distance definition
    let gridSize = <number>getCanvas().dimensions?.size;
    let maxDistance = Infinity;
    // OLD SETTING
    let globalMaxDistance = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
    if(globalMaxDistance <= 0){
      globalMaxDistance = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionMeasurement");
    }
    if( globalMaxDistance > 0 ) {
      if( globalMaxDistance < maxDistance ){
        maxDistance = globalMaxDistance;
      }
    } else {      
      maxDistance = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "doorInteractionDistance");
      if(maxDistance<=0){
        maxDistance = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "doorInteractionMeasurement")
      }
    }

    // Shortest dist
    let shortestDistance = Infinity;
    let closestDoor:DoorControl|null = null; // is a doorcontrol
    //const reach = actorReach(token.actor);
    // Find closest door
    //let charCenter = getTokenCenter(token);
    //charCenter.x += offsetx * gridSize;
    //charCenter.y += offsety * gridSize;

    for( let i = 0; i < <number>getCanvas().controls?.doors?.children.length ; i++ ) {



      let door:DoorControl = <DoorControl>getCanvas().controls?.doors?.getChildAt(0);
      if (!door.visible){
        continue;
      }

      if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME,"enableGridlessSupport")){
        // ==============================================================================
        /*
        const rd = getDistance(token, door, offsetx, offsety);


        if (rd.unitDistance < shortestDistance) {

          shortestDistance = rd.unitDistance;
          if (rd.unitDistance <= (reach + ArmsReachVariables.grace_distance)){
            closestDoor = door;
          }
        }
        else{
          iteractionFailNotification(`Door too far away: ${clampNum(rd.unitDistance)} > ${reach}`);
        }
        */
        // ================================================================================
        let dist = computeDistanceBetweenCoordinates(door, token);
        let distInGridUnits = (dist / gridSize) - 0.1;


        if ( distInGridUnits < maxDistance && dist < shortestDistance ) {
          closestDoor = door;
          shortestDistance = dist;
        }
      }else{
        let dist = computeDistanceBetweenCoordinates(door, token);
        let distInGridUnits = (dist / gridSize) - 0.1;


        if ( distInGridUnits < maxDistance && dist < shortestDistance ) {
          closestDoor = door;
          shortestDistance = dist;
        }
      }
    }

    // Operate the door
    if(closestDoor) {
      // Create a fake function... Ugly, but at same time take advantage of existing door interaction function of core FVTT
      let fakeEvent = {
        stopPropagation: event => {
          return;
        },
        //currentTarget: closestDoor
      };
      //@ts-ignore
      closestDoor._onMouseDown(fakeEvent);

    } else {

      var tokenName = getCharacterName(token);

      if (tokenName){
        iteractionFailNotification(i18nFormat("foundryvtt-arms-reach.doorNotFoundInReachFor",{tokenName: tokenName}));
        //iteractionFailNotification(`Door distance: ${clampNum(shortestDistance)} <= ${reach}`);
      }else{
        iteractionFailNotification(i18n("foundryvtt-arms-reach.doorNotFoundInReach"));
        //iteractionFailNotification(`Door distance: ${clampNum(shortestDistance)} <= ${reach}`);
      }
      return;
    }
  },

  /**
   * Get dorr center
   */
  getDoorCenter : function(token) {
    // let tokenCenter = {x: token.x + token.width / 2, y: token.y + token.height / 2}
    let tokenCenter = {x: token.x, y: token.y}
    return tokenCenter;
  }
}

export class ArmsReachVariables
{
  static door_interaction_lastTime = 0;
  static door_interaction_keydown = false;
  static door_interaction_cameraCentered = false;

  static weapon_interaction_lastTime = 0;
  static weapon_interaction_keydown = false;
  static weapon_interaction_cameraCentered = false;

  static grace_distance = 2.5;

  static lastData = {
    x: 0.0,
    y: 0.0,
    up: 0,
    down: 0,
    left: 0,
    right: 0
  };
}

