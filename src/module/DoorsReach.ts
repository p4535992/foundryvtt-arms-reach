import { error, i18n, i18nFormat } from '../foundryvtt-arms-reach';
import { DoorData, DoorSourceData, DoorTargetData } from './ArmsReachModels';
import { ARMS_REACH_MODULE_NAME } from './settings';
import {
  computeDistanceBetweenCoordinates,
  computeDistanceBetweenCoordinatesOLD,
  getCharacterName,
  getFirstPlayerToken,
  getFirstPlayerTokenSelected,
  getPlaceableCenter,
  getTokenCenter,
  isFocusOnCanvas,
  iteractionFailNotification,
} from './ArmsReachHelper';
import { canvas, game } from './settings';

export const DoorsReach = {
  init: function () {
    if (game.settings.get(ARMS_REACH_MODULE_NAME, 'hotkeyDoorInteractionCenter')) {
      // Door interaction
      document.addEventListener('keydown', (evt) => {
        //if (KeybindLib.isBoundTo(evt, MODULE_NAME, "bindNamesetCustomKeyBindForDoorInteraction")) {
        if (evt.key === 'e') {
          if (ArmsReachVariables.door_interaction_cameraCentered) {
            ArmsReachVariables.door_interaction_cameraCentered = false;
            return;
          }

          if (!isFocusOnCanvas()) {
            return;
          }

          if (ArmsReachVariables.door_interaction_keydown == false) {
            ArmsReachVariables.door_interaction_lastTime = Date.now();
            ArmsReachVariables.door_interaction_keydown = true;
          } else {
            // Center camera on character (if  key was pressed for a time)
            const diff = Date.now() - ArmsReachVariables.door_interaction_lastTime;
            if (diff > 500) {
              ArmsReachVariables.door_interaction_lastTime = Date.now();
              const character = getFirstPlayerToken();
              if (!character) {
                iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.noCharacterSelectedToCenterCamera`));
                return;
              }

              ArmsReachVariables.door_interaction_cameraCentered = true;
              canvas.animatePan({ x: character.x, y: character.y });
            }
          }
        }
      });
    }

    if (game.settings.get(ARMS_REACH_MODULE_NAME, 'hotkeyDoorInteraction')) {
      document.addEventListener('keyup', (evt) => {
        //if (KeybindLib.isBoundTo(evt, MODULE_NAME, "bindNamesetCustomKeyBindForDoorInteraction")) {
        if (evt.key === 'e') {
          ArmsReachVariables.door_interaction_keydown = false;

          if (ArmsReachVariables.door_interaction_cameraCentered) {
            return;
          }

          if (!isFocusOnCanvas()) {
            return;
          }

          // Get first token ownted by the player
          const character = getFirstPlayerToken();

          if (!character) {
            iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.noCharacterSelected`));
            return;
          }

          DoorsReach.interactWithNearestDoor(character, 0, 0);
        }
      });
    }

    // Double Tap to open nearest door -------------------------------------------------
    if (<number>game.settings.get(ARMS_REACH_MODULE_NAME, 'hotkeyDoorInteractionDelay') > 0) {
      document.addEventListener('keyup', (evt) => {
        if (evt.key === 'ArrowUp' || evt.key === 'w') {
          DoorsReach.ifStuckInteract('up', 0, -0.5);
        }

        if (evt.key === 'ArrowDown' || evt.key === 's') {
          DoorsReach.ifStuckInteract('down', 0, +0.5);
        }

        if (evt.key === 'ArrowRight' || evt.key === 'd') {
          DoorsReach.ifStuckInteract('right', +0.5, 0);
        }

        if (evt.key === 'ArrowLeft' || evt.key === 'a') {
          DoorsReach.ifStuckInteract('left', -0.5, 0);
        }
      });
    }
  },

  globalInteractionDistance: function (
    character: Token,
    doorControl: DoorControl,
    isRightHanler: boolean,
    userId?: String,
  ): boolean {
    // let character: Token = <Token>getFirstPlayerTokenSelected();
    let isOwned = false;
    if (!character) {
      character = <Token>getFirstPlayerToken();
      if (character) {
        isOwned = true;
      }
    }
    if (!character) {
      if (game.user?.isGM) {
        return true;
      } else {
        return false;
      }
    }
    // OLD SETTING
    let globalInteraction = <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
    if (globalInteraction <= 0) {
      globalInteraction = <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
    }

    // Sets the global maximum interaction distance
    // Global interaction distance control. Replaces prototype function of DoorControl. Danger...
    if (globalInteraction > 0) {
      // Check distance
      //let character:Token = getFirstPlayerToken();
      if (
        !game.user?.isGM ||
        (game.user?.isGM && <boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistanceForGM'))
      ) {
        const sourceData: DoorSourceData = {
          scene: <Scene>canvas.scene,
          name: doorControl.name,
          label: doorControl.name,
          icon: '', //doorControl.icon.texture.baseTexture., // TODO
          disabled: doorControl.wall.data.ds === CONST.WALL_DOOR_STATES.LOCKED,
          hidden: doorControl.wall.data.door === CONST.WALL_DOOR_TYPES.SECRET,
          animate: false,
          x: doorControl.x,
          y: doorControl.y,
        };

        const tokenCenter = getTokenCenter(character);

        const targetData: DoorTargetData = {
          scene: <Scene>canvas.scene,
          name: character.name,
          label: character.name,
          icon: '', //doorControl.icon.texture.baseTexture., // TODO
          disabled: false,
          hidden: false,
          animate: false,
          x: tokenCenter.x,
          y: tokenCenter.y,
        };

        //const sourceSceneId = canvas.scene.id;
        //const selectedOrOwnedTokenId = canvas.tokens.controlled.map((token) => token.id)
        //const targetSceneId = targetScene ? targetScene.id : null
        const doorData: DoorData = {
          sourceData: sourceData,
          selectedOrOwnedTokenId: character.id,
          targetData: targetData,
          userId: <string>game.userId,
        };

        if (!character) {
          iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.noCharacterSelected`));
          return false;
        } else {
          // PreHook (can abort the interaction with the door)
          // if (Hooks.call('ArmsReachPreInteraction', doorData) === false) {
          //   const tokenName = getCharacterName(character);
          //   if (tokenName) {
          //     iteractionFailNotification(
          //       i18nFormat(`${ARMS_REACH_MODULE_NAME}.doorNotInReachFor`, { tokenName: tokenName }),
          //     );
          //   } else {
          //     iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.doorNotInReach`));
          //   }
          //   return false;
          // }

          let isNotNearEnough = false;
          const result = { status: 0 };
          // Hooks.call('ArmsReachReplaceInteraction', doorData, result);
          const resultExplicitComputeDistance = result.status;
          let jumDefaultComputation = false;
          // undefined|null|Nan go with the standard compute distance
          if (typeof resultExplicitComputeDistance == 'number') {
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
            else {
              isNotNearEnough = true;
              jumDefaultComputation = false;
            }
          }

          // Standard computing distance
          if (!jumDefaultComputation) {
            // OLD SETTING
            if (<number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance') > 0) {
              const dist = <number>(
                computeDistanceBetweenCoordinatesOLD(DoorsReach.getDoorCenter(doorControl), character)
              );
              isNotNearEnough = dist > <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
            } else {
              const dist = computeDistanceBetweenCoordinates(DoorsReach.getDoorCenter(doorControl), character);
              isNotNearEnough =
                dist > <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
            }
          }
          if (game.user?.isGM && isRightHanler) {
            isNotNearEnough = false;
          }
          if (isNotNearEnough) {
            const tokenName = getCharacterName(character);
            if (tokenName) {
              iteractionFailNotification(
                i18nFormat(`${ARMS_REACH_MODULE_NAME}.doorNotInReachFor`, { tokenName: tokenName }),
              );
            } else {
              iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.doorNotInReach`));
            }
            return false;
          } else {
            // Congratulations you are in reach
            return true;
          }
          // END MOD ABD 4535992
        }
      } else if (game.user?.isGM) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  },

  preUpdateWallBugFixSoundHandler: async function (object, updateData, diff, userID) {
    // if(
    //       (
    //       (object.door == 0 || updateData.ds == null) //Exit early if not a door OR door state not updating
    //   ||
    //       game.data.users.find(x => x._id === userID )['role'] >= game.settings.get(MODULE_NAME, "stealthDoor")
    //       )
    //       && game.keyboard.isDown("Alt")) // Exit if Sneaky Door Opening Mode
    // {
    //   return;
    // }

    const doorData = DoorsReach.defaultDoorData();

    let playpath = '';
    let playVolume = 0.8;

    if (object.data.ds == CONST.WALL_DOOR_STATES.LOCKED) {
      // Door Unlocking
      playpath = doorData.unlockPath;
      playVolume = doorData.unlockLevel;
    } else if (updateData.ds == CONST.WALL_DOOR_STATES.CLOSED) {
      //Door Close
      playpath = doorData.closePath;
      playVolume = doorData.closeLevel;
    } else if (updateData.ds == CONST.WALL_DOOR_STATES.OPEN) {
      //Door Open
      playpath = doorData.openPath;
      playVolume = doorData.openLevel;
    } else if (updateData.ds == CONST.WALL_DOOR_STATES.LOCKED) {
      // Door Lock
      playpath = doorData.lockPath;
      playVolume = doorData.lockLevel;
    }

    if (playpath != '' && playpath != null) {
      const fixedPlayPath = playpath.replace('[data]', '').trim();
      AudioHelper.play({ src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false }, true);
    }
  },

  preUpdateWallBugFixSoundSimpleHandler: async function (updateData) {
    // if(
    //       (
    //       (object.door == 0 || updateData.ds == null) //Exit early if not a door OR door state not updating
    //   ||
    //       game.data.users.find(x => x._id === userID )['role'] >= game.settings.get(MODULE_NAME, "stealthDoor")
    //       )
    //       && game.keyboard.isDown("Alt")) // Exit if Sneaky Door Opening Mode
    // {
    //   return;
    // }

    const doorData = DoorsReach.defaultDoorData();

    let playpath = '';
    let playVolume = 0.8;

    // if(object.data.ds == CONST.WALL_DOOR_STATES.LOCKED) { // Door Unlocking
    //   playpath = doorData.unlockPath;
    //   playVolume = doorData.unlockLevel;
    // }
    if (updateData.ds == CONST.WALL_DOOR_STATES.CLOSED) {
      //Door Close
      playpath = doorData.closePath;
      playVolume = doorData.closeLevel;
    } else if (updateData.ds == CONST.WALL_DOOR_STATES.OPEN) {
      //Door Open
      playpath = doorData.openPath;
      playVolume = doorData.openLevel;
    } else if (updateData.ds == CONST.WALL_DOOR_STATES.LOCKED) {
      // Door Lock
      playpath = doorData.lockPath;
      playVolume = doorData.lockLevel;
    }

    if (playpath != '' && playpath != null) {
      const fixedPlayPath = playpath.replace('[data]', '').trim();
      AudioHelper.play({ src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false }, true);
    }
  },

  //grab the default sounds from the config paths
  defaultDoorData: function () {
    return {
      closePath: `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorCloseSound.wav`,
      closeLevel: 0.8,
      openPath: `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorOpenSound.wav`,
      openLevel: 0.8,
      lockPath: `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorLockSound.wav`,
      lockLevel: 0.8,
      unlockPath: `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorUnlockSound.wav`,
      unlockLevel: 0.8,
      lockJinglePath: `modules/${ARMS_REACH_MODULE_NAME}/assets/defaultSounds/DoorLockPicking.wav`,
      lockJingleLevel: 0.8,
    };
  },

  ifStuckInteract: function (key, offsetx, offsety) {
    if (!isFocusOnCanvas()) {
      return;
    }
    const character = getFirstPlayerToken();
    if (!character) {
      return;
    }
    // if (
    //   Date.now() - ArmsReachVariables.lastData[key] >
    //   <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'hotkeyDoorInteractionDelay')
    // ) {
    if (
      (Date.now() - ArmsReachVariables.lastData[key]) / 1000 >
      <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'hotkeyDoorInteractionDelay')
    ) {
      ArmsReachVariables.lastData.x = character.x;
      ArmsReachVariables.lastData.y = character.y;
      ArmsReachVariables.lastData[key] = Date.now();
      return;
    }

    // See if character is stuck
    if (character.x == ArmsReachVariables.lastData.x && character.y == ArmsReachVariables.lastData.y) {
      DoorsReach.interactWithNearestDoor(character, offsetx, offsety);
    }
  },

  /**
   * Interact with door
   */
  interactWithNearestDoor: function (token: Token, offsetx = 0, offsety = 0) {
    // Max distance definition
    const gridSize = <number>canvas.dimensions?.size;
    let maxDistance = Infinity;
    // OLD SETTING
    let globalMaxDistance = <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
    if (globalMaxDistance <= 0) {
      globalMaxDistance = <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
    }
    if (globalMaxDistance > 0) {
      if (globalMaxDistance < maxDistance) {
        maxDistance = globalMaxDistance;
      }
    } else {
      // DEPRECATED AND REMOVED
      // maxDistance = <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'doorInteractionDistance');
      // if (maxDistance <= 0) {
      maxDistance = <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'doorInteractionMeasurement');
      // }
    }

    // Shortest dist
    let shortestDistance = Infinity;
    let closestDoor: DoorControl | null = null; // is a doorcontrol
    //const reach = actorReach(token.actor);
    // Find closest door
    //let charCenter = getTokenCenter(token);
    //charCenter.x += offsetx * gridSize;
    //charCenter.y += offsety * gridSize;

    // for (let i = 0; i < <number>canvas.controls?.doors?.children.length; i++) {
    //   const door: DoorControl = <DoorControl>canvas.controls?.doors?.getChildAt(0);
    game.scenes?.current?.walls.contents.forEach((wall: WallDocument) => {
      if (wall.data.door > 0) {
        const door: DoorControl = <DoorControl>canvas.controls?.doors?.children.find((x: DoorControl) => {
          return x.wall.id == <string>wall.id;
        });
        // if (!door.visible) {
        //   continue;
        // }
        let isNotNearEnough = false;
        let dist;
        // OLD SETTING
        if (<number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance') > 0) {
          dist = <number>computeDistanceBetweenCoordinatesOLD(DoorsReach.getDoorCenter(door), token);
          isNotNearEnough = dist > <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
        } else {
          dist = computeDistanceBetweenCoordinates(DoorsReach.getDoorCenter(door), token);
          isNotNearEnough = dist > <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
        }
        // const dist = computeDistanceBetweenCoordinates(DoorsReach.getDoorCenter(door), token);
        // const distInGridUnits = dist / gridSize - 0.1;
        // if (distInGridUnits < maxDistance && dist < shortestDistance) {
        if (!isNotNearEnough) {
          closestDoor = door;
          shortestDistance = dist;
        }
      }
    });

    // Operate the door
    if (closestDoor) {
      // Create a fake function... Ugly, but at same time take advantage of existing door interaction function of core FVTT
      const fakeEvent = {
        stopPropagation: (event) => {
          return;
        },
        data: {
          originalEvent: {
            button: 0,
          },
        },
        //currentTarget: closestDoor
      };
      //@ts-ignore
      closestDoor._onMouseDown(fakeEvent);
    } else {
      const tokenName = getCharacterName(token);

      if (tokenName) {
        iteractionFailNotification(
          i18nFormat(`${ARMS_REACH_MODULE_NAME}.doorNotFoundInReachFor`, { tokenName: tokenName }),
        );
        //iteractionFailNotification(`Door distance: ${clampNum(shortestDistance)} <= ${reach}`);
      } else {
        iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.doorNotFoundInReach`));
        //iteractionFailNotification(`Door distance: ${clampNum(shortestDistance)} <= ${reach}`);
      }
      return;
    }
  },

  /**
   * Get dorr center
   */
  getDoorCenter: function (doorCoontrol: DoorControl) {
    //const doorCenter = { x: doorCoontrol.x, y: doorCoontrol.y };
    return getPlaceableCenter(doorCoontrol);
  },
};

export class ArmsReachVariables {
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
    right: 0,
  };
}
