import { error, i18n, i18nFormat } from "../foundryvtt-arms-reach";
import { DoorData, DoorSourceData, DoorTargetData } from "./models";
import { getCanvas, ARMS_REACH_MODULE_NAME, getGame } from "./settings";
//@ts-ignore
import { SpeedProvider } from '../../drag-ruler/src/speed_provider.js';
//@ts-ignore
import { availableSpeedProviders, currentSpeedProvider} from '../../drag-ruler/src/api.js';

export const Armsreach = {

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

        interactWithNearestDoor(character,0,0);
      }
    });

    // Double Tap to open nearest door -------------------------------------------------
    document.addEventListener('keyup', evt => {
      if (evt.key === 'ArrowUp' || evt.key === 'w') {
        if(getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) {
          return;
        }
        ifStuckInteract('up', 0, -0.5);
      }

      if (evt.key === 'ArrowDown' || evt.key === 's') {
        if(getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) {
          return;
        }
        ifStuckInteract('down', 0, +0.5);
      }

      if (evt.key === 'ArrowRight' || evt.key === 'd') {
        if(getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) {
          return;
        }
        ifStuckInteract('right', +0.5, 0);
      }

      if (evt.key === 'ArrowLeft' || evt.key === 'a') {
        if(getGame().settings.get(ARMS_REACH_MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) {
          return;
        }
        ifStuckInteract('left', -0.5, 0);
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

    // Sets the global maximum interaction distance
    // Global interaction distance control. Replaces prototype function of DoorControl. Danger...
    if( <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance") > 0 ) {

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

          let gridSize = <number>getCanvas().dimensions?.size;
          let dist = computeDistanceBetweenCoordinates(doorControl, character);
          if(!jumDefaultComputation){
            isNotNearEnough = (dist / gridSize) > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
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

    let doorData = Armsreach.defaultDoorData();

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

    let doorData = Armsreach.defaultDoorData();

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
  }

}

// export const SQRT_2 = Math.sqrt(2);

/**
 * @href https://stackoverflow.com/questions/30368632/calculate-distance-on-a-grid-between-2-points
 * @param doorControl or placeable
 * @param charCenter
 * @returns
 */
export const computeDistanceBetweenCoordinates = function(placeable, character:Token){

  const xPlaceable = placeable._validPosition?.x ? placeable._validPosition?.x : placeable.x;
  const yPlaceable = placeable._validPosition?.y ? placeable._validPosition?.y : placeable.y;
  //@ts-ignore
  const xToken = character._validPosition?.x ? character._validPosition?.x : character.x;
  //@ts-ignore
  const yToken = character._validPosition?.y ? character._validPosition?.y : character.y;
  const segments = [{ray: new Ray({x: xToken, y: yToken}, {x: xPlaceable, y: yPlaceable})}];
  const shape = getTokenShape(character);
  const distances = measureDistances(segments, character, shape);
	// Sum up the distances
	return distances.reduce((acc, val) => acc + val, 0);
  /*
  //@ts-ignore
  const xMinA = character._validPosition.x;
  //@ts-ignore
  const yMinA = character._validPosition.y;
  //@ts-ignore
  const xMaxA = xMinA + character.hitArea.width;
  //@ts-ignore
  const yMaxA = yMinA + character.hitArea.height;

  const xMinB = placeable._validPosition.x;
  const yMinB = placeable._validPosition.y;
  const xMaxB = xMinB + placeable.hitArea.width;
  const yMaxB = yMinB + placeable.hitArea.height;

  const deltaBeneath = ((xMinB - xMaxA) / 20);
  const deltaLeft = ((xMinA - xMaxB) / 20);
  const deltaAbove = ((yMinB - yMaxA) / 20);
  const deltaRight = ((yMinA - yMaxB) / 20);

  return 5 + Math.max(deltaBeneath, deltaLeft, deltaAbove, deltaRight);
  */

  /*
  const charCenter = getTokenCenter(character);
  const x1 = placeable.x;
  const y1 = placeable.y;
  const x2 = charCenter.x;
  const y2 = charCenter.y;
  const  dx = Math.abs(x2 - x1);
  const  dy = Math.abs(y2 - y1);

  const  min = Math.min(dx, dy);
  const  max = Math.max(dx, dy);

  const  diagonalSteps = min;
  const  straightSteps = max - min;

  return (SQRT_2 * diagonalSteps + straightSteps) - <number>getCanvas().dimensions?.size;
  */
  //return Math.sqrt(getCanvas().dimensions.size) * diagonalSteps + straightSteps;
  //return getManhattanBetween(doorControl, charCenter);
}

export function measureDistances(segments, entity:Token, shape, options:any={}) {

	const opts = duplicate(options)

	if (opts.enableTerrainRuler || getGame().modules.get("terrain-ruler")?.active) {
		opts.gridSpaces = true;
		const firstNewSegmentIndex = segments.findIndex(segment => !segment.ray.dragRulerVisitedSpaces);
		const previousSegments = segments.slice(0, firstNewSegmentIndex);
		const newSegments = segments.slice(firstNewSegmentIndex);
		const distances = previousSegments.map(segment => segment.ray.dragRulerVisitedSpaces[segment.ray.dragRulerVisitedSpaces.length - 1].distance);
		previousSegments.forEach(segment => segment.ray.terrainRulerVisitedSpaces = duplicate(segment.ray.dragRulerVisitedSpaces));
		opts.costFunction = (x, y, costOptions={}) => {	
      return getCostFromSpeedProvider(entity, getAreaFromPositionAndShape({x, y}, shape), costOptions); 
    }
		if (previousSegments.length > 0){
			opts.terrainRulerInitialState = previousSegments[previousSegments.length - 1].ray.dragRulerFinalState;
    }
    //@ts-ignore
		return distances.concat(terrainRuler.measureDistances(newSegments, opts));
	}
	else {
		// If another module wants to enable grid measurements but disable grid highlighting,
		// manually set the *duplicate* option's gridSpaces value to true for the Foundry logic to work properly
		if(!opts.ignoreGrid) {
			opts.gridSpaces = true;
		}
		return getCanvas().grid?.measureDistances(segments, opts);
	}
}

export function getAreaFromPositionAndShape(position, shape) {
	return shape.map(space => {
		let x = position.x + space.x;
		let y = position.y + space.y;
		if (getCanvas().grid?.isHex) {
			let shiftedRow;
      //@ts-ignore
			if (getCanvas().grid?.grid?.options.even){
				shiftedRow = 1
      }
			else{
				shiftedRow = 0
      }
      //@ts-ignore
			if (getCanvas().grid?.grid?.options.columns) {
				if (space.x % 2 !== 0 && position.x % 2 !== shiftedRow) {
					y += 1;
				}
			}
			else {
				if (space.y % 2 !== 0 && position.y % 2 !== shiftedRow) {
					x += 1;
				}
			}
		}
		return {x, y}
	});
}

export function getTokenShape(token) {
	if (token.scene.data.gridType === CONST.GRID_TYPES.GRIDLESS) {
		return [{x: 0, y: 0}]
	}
	else if (token.scene.data.gridType === CONST.GRID_TYPES.SQUARE) {
		const topOffset = -Math.floor(token.data.height / 2)
		const leftOffset = -Math.floor(token.data.width / 2)
		const shape = []
		for (let y = 0;y < token.data.height;y++) {
			for (let x = 0;x < token.data.width;x++) {
				shape.push(<never>{x: x + leftOffset, y: y + topOffset})
			}
		}
		return shape
	}
	else {
		// Hex grids
    //@ts-ignore
		if (getGame().modules.get("hex-size-support")?.active && CONFIG.hexSizeSupport.getAltSnappingFlag(token)) {
			const borderSize = token.data.flags["hex-size-support"].borderSize;
			let shape = [{x: 0, y: 0}];
			if (borderSize >= 2){
				shape = shape.concat([{x: 0, y: -1}, {x: -1, y: -1}]);
      }
			if (borderSize >= 3){
				shape = shape.concat([{x: 0, y: 1}, {x: -1, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}]);
      }
			if (borderSize >= 4){
				shape = shape.concat([{x: -2, y: -1}, {x: 1, y: -1}, {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2}])
      }
      //@ts-ignore
			if (Boolean(CONFIG.hexSizeSupport.getAltOrientationFlag(token)) !== canvas.grid.grid.options.columns){
				shape.forEach(space => space.y *= -1);
      }
      //@ts-ignore
			if (getCanvas().grid?.grid?.options.columns)
				shape = shape.map(space => {return {x: space.y, y: space.x}});
			return shape;
		}
		else {
			return [{x: 0, y: 0}];
		}
	}
}

export function getCostFromSpeedProvider(token, area, options) {
	try {
		if (currentSpeedProvider instanceof Function) {
			return SpeedProvider.prototype.getCostForStep.call(undefined, token, area, options);
		}
		return currentSpeedProvider.getCostForStep(token, area, options);
	}
	catch (e) {
		console.error(e);
		return 1;
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

export function ifStuckInteract(key, offsetx, offsety) {

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
    interactWithNearestDoor(character, offsetx, offsety);
  }
}

/**
 * Interact with door
 */
export const interactWithNearestDoor = function(token:Token, offsetx = 0, offsety = 0) {
    // Max distance definition
    let gridSize = <number>getCanvas().dimensions?.size;
    let maxDistance = Infinity;
    let globalMaxDistance = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
    if( globalMaxDistance > 0 ) {
      if( globalMaxDistance < maxDistance ){
         maxDistance = globalMaxDistance;
      }
    } else {
      maxDistance = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "doorInteractionDistance");
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
}

/**
 * Get token center
 */
export const getTokenCenter = function(token) {
    /*
    let tokenCenter = {x: token.x , y: token.y };
    tokenCenter.x += -20 + ( token.w * 0.50 );
    tokenCenter.y += -20 + ( token.h * 0.50 );
    */
    let tokenCenter = {x: token.x + token.w / 2, y: token.y + token.h / 2}
    return tokenCenter;
}


/**
 * Get dorr center
 */
 export const getDoorCenter = function(token) {
  // let tokenCenter = {x: token.x + token.width / 2, y: token.y + token.height / 2}
  let tokenCenter = {x: token.x, y: token.y}
  return tokenCenter;
}

/**
 * Get chracter name from token
 */
export const getCharacterName = function(token) {
  var tokenName = null;
  if( token.name ) {
    tokenName = token.name;
  } else if (token.actor && token.actor.data && token.actor.data.name) {
    tokenName = token.actor.data.name;
  }
  return tokenName;
}

/**
 * Interation fail messages
 */
export const iteractionFailNotification = function(message) {
  if( !getGame().settings.get(ARMS_REACH_MODULE_NAME, "notificationsInteractionFail") ){
     return;
  }
  ui.notifications?.warn(message);
}

// /**
//  * Returns the first selected token or owned token
//  */
// export const getFirstPlayerToken = function() {
//     // Get first token ownted by the player
//     let selectedTokens = getSelectedOrOwnedTokens();
//     if(!selectedTokens || selectedTokens.length == 0){
//       return null;
//     }
//     return selectedTokens[0];
// }

/**
 * Returns the first selected token
 */
 export const getFirstPlayerTokenSelected = function():Token|null {
  // Get first token ownted by the player
  let selectedTokens = <Token[]>getCanvas().tokens?.controlled;
  if (selectedTokens.length > 1) {
      //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
      return null;
  }
  if(!selectedTokens || selectedTokens.length == 0){
    //if(getGame().user.character.data.token){
    //  //@ts-ignore
    //  return getGame().user.character.data.token;
    //}else{
      return null;
    //}
  }
  return selectedTokens[0];
}

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
export const getFirstPlayerToken = function():Token|null
{
  // Get controlled token
  let token:Token;
  let controlled:Token[] = <Token[]>getCanvas().tokens?.controlled;
  // Do nothing if multiple tokens are selected
  if (controlled.length && controlled.length > 1) {
      //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
      return null;
  }
  // If exactly one token is selected, take that
  token = controlled[0];
  if(!token){
    if(<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "useOwnedTokenIfNoTokenIsSelected")) {
      if(!controlled.length || controlled.length == 0 ){
        // If no token is selected use the token of the users character
        token = <Token>getCanvas().tokens?.placeables.find(token => token.data._id === getGame().user?.character?.data?._id);
      }
      // If no token is selected use the first owned token of the users character you found
      if(!token){
        token = <Token>getCanvas().tokens?.ownedTokens[0];
      }
    }
  }
  return token;
}

/**
 * Simple Manhattan Distance between two objects that have x and y attrs.
 */
export const getManhattanBetween = function(obj1, obj2)  {
  // console.log("[" + obj1.x + " , " + obj1.y + "],[" + obj2.x + " , " + obj2.y + "]"); // DEBUG
  return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y)-20; //The -20 seem to fix some calculation issue
}

/**
 * Check if active document is the canvas
 */
export const isFocusOnCanvas = function() {
  if(   !document.activeElement ||
        !document.activeElement.attributes ||
        !document.activeElement.attributes['class'] ||
        document.activeElement.attributes['class'].value.substr(0,8) !== "vtt game"
    )
  {
    return false;
  }
  else
  {
    return true;
  }
}

// ===================================
// POSSIBLE GRIDLESS SUPPORT
// ===================================

// function getRay(pointA, pointB, scene) {
// 	const rd = {
// 		ray: new Ray(pointA, pointB),
// 		get cellDistance() { return this.ray.distance / scene.data.grid; }, // cells
// 		get unitDistance() { return this.cellDistance * scene.data.gridDistance; }, // feet, meters, whatever
// 	};

// 	//console.log("getRay:", pointA, pointB, rd.unitDistance);

// 	return rd;
// }

// function getSector(radian) {
// 	const clampDeg = (d) => d >= 360 ? d - 360 : d;
// 	//const clampRad = (r) => r >= Math.PI * 2 ? r - Math.PI * 2 : r;
// 	const wrapSector = (s) => s >= 8 ? 0 : s;
// 	const rad2deg = (rad) => rad * (180 / Math.PI);
// 	const angleDeg = clampDeg(rad2deg(radian)),
// 		sectorAngle = 360 / 8, // 8 sectors
// 		//sectorMargin = sectorAngle / 2; //
// 		sector = wrapSector(Math.round(angleDeg / sectorAngle));
// 	//console.log('rad:', Number(radian.toFixed(3)), '-> deg:', Number(angleDeg.toFixed(2)), '= sector:', sector, `[${sectorName(sector)}]`);
// 	return sector;
// }

// const sectorMap = {
// 	0: { x: 0.5, y: 0, label: 'MR' }, // middle right
// 	1: { x: 0.5, y: 0.5, label: 'BR' }, // bottom right,
// 	2: { x: 0, y: 0.5, label: 'BM' }, // bottom middle,
// 	3: { x: -0.5, y: 0.5, label: 'BL' }, // bottom left,
// 	4: { x: -0.5, y: 0, label: 'ML' }, // middle left,
// 	5: { x: -0.5, y: -0.5, label: 'TL' }, // top left,
// 	6: { x: 0, y: -0.5, label: 'TM' }, // top middle,
// 	7: { x: 0.5, y: -0.5, label: 'TR' }, // top right,
// };

// // function sectorName(sector) {
// // 	const l = { M: 'Middle', T: 'Top', B: 'Bottom', L: 'Left', 'R': 'Right' };
// // 	const a = '→↘↓↙←↖↑↗';
// // 	const s = sectorMap[sector].label;
// // 	return `${l[s[0]]} ${l[s[1]]} ${a[sector]}`;
// // }

// function sectorAdjust(sector, token, origin) {
// 	const adjust = sectorMap[sector];
// 	//console.log(sector, adjust, token, origin);
// 	return {
// 		x: (adjust.x * token.w) + origin.x,
// 		y: (adjust.y * token.h) + origin.y
// 	};
// }

// function getDistance(token:Token, door:DoorControl, offsetx:Number, offsety:Number) {
// 	const scene = getCanvas().scene;

// 	const origin:any = { x: token.data.x, y: token.data.y };
// 	const dest = { x: door.x, y: door.y };

// 	const basicRayOnly = offsetx !== undefined && offsety !== undefined;

// 	if (basicRayOnly) {
// 		origin.x += offsetx;
// 		origin.y += offsety;
// 	}

// 	// Basic distance ray
// 	const rd = getRay(origin, dest, scene);
// 	if (basicRayOnly) return rd;

// 	// Advanced ray calculated from token sector.
// 	const originSector = getSector(rd.ray.normAngle),
// 		newOrigin = sectorAdjust(originSector, token, origin);

// 	return getRay(newOrigin, door, scene);
// }


// function actorReach(actor) {
// 	return Math.max(5, actor.data.data.range.melee);
// }

// // Clamps number to 1 decimal
// function clampNum(n) {
// 	return Math.floor(n * 10) / 10;
// }
