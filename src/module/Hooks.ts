import { warn, error, debug, i18n, i18nFormat } from './lib/lib';
import { ARMS_REACH_MODULE_NAME, ARMS_REACH_TAGGER_MODULE_NAME } from './settings';
import { StairwaysReach } from './StairwaysReach';
import { ResetDoorsAndFog } from './resetdoorsandfog';
import {
  checkTaggerForAmrsreach,
  getFirstPlayerToken,
  getFirstPlayerTokenSelected,
  getMousePosition,
  getPlaceablesAt,
  reselectTokenAfterInteraction,
} from './ArmsReachHelper';
import { ArmsReachVariables, DoorsReach } from './DoorsReach';
import { NotesReach } from './NotesReach';
import { TokensReach } from './TokensReach';
import { armsReachSocket, _socketIsReachable } from './ArmsReachSocket';
import { LightsReach } from './LightsReach';
import { DrawingsReach } from './DrawingsReach';
import { TilesReach } from './TilesReach';
import { SoundsReach } from './SoundsReach';
import { ArmsReach } from './ArmsReachApi';
import { WallsReach } from './WallsReach';
import { canvas, game } from './settings';

let taggerModuleActive;

export const initHooks = () => {
  warn('Init Hooks processing');

  taggerModuleActive =
    <boolean>game.modules.get(ARMS_REACH_TAGGER_MODULE_NAME)?.active &&
    <boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableTaggerIntegration');

  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableArmsReach')) {
    if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableDoorsIntegration')) {
      DoorsReach.init();

      //@ts-ignore
      libWrapper.register(
        ARMS_REACH_MODULE_NAME,
        'DoorControl.prototype._onMouseDown',
        DoorControlPrototypeOnMouseDownHandler,
        'MIXED',
      );
      //@ts-ignore
      libWrapper.register(
        ARMS_REACH_MODULE_NAME,
        'DoorControl.prototype._onRightDown',
        DoorControlPrototypeOnRightDownHandler,
        'MIXED',
      );
    }

    if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableJournalsIntegration')) {
      //@ts-ignore
      // libWrapper.register(
      //   ARMS_REACH_MODULE_NAME,
      //   'Note.prototype._onClickLeft',
      //   NotePrototypeOnClickLeftHandler,
      //   'MIXED');

      //@ts-ignore
      libWrapper.register(
        ARMS_REACH_MODULE_NAME,
        'Note.prototype._onClickLeft2',
        NotePrototypeOnClickLeftHandler,
        'MIXED',
      );
    }

    if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableTokensIntegration')) {
      // //@ts-ignore
      // libWrapper.register(
      //   ARMS_REACH_MODULE_NAME,
      //   'Token.prototype._onClickLeft',
      //   TokenPrototypeOnClickLeftHandler,
      //   'MIXED'
      // );
      //@ts-ignore
      libWrapper.register(
        ARMS_REACH_MODULE_NAME,
        'Token.prototype._onClickLeft2',
        TokenPrototypeOnClickLeftHandler,
        'MIXED',
      );
    }

    if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableLightsIntegration')) {
      //@ts-ignore
      libWrapper.register(
        ARMS_REACH_MODULE_NAME,
        'AmbientLight.prototype._onClickRight',
        AmbientLightPrototypeOnClickRightHandler,
        'MIXED',
      );
    }

    if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableSoundsIntegration')) {
      //@ts-ignore
      libWrapper.register(
        ARMS_REACH_MODULE_NAME,
        'AmbientSound.prototype._onClickRight',
        AmbientSoundPrototypeOnClickRightHandler,
        'MIXED',
      );
    }

    // if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableDrawingsIntegration')) {
    //   //@ts-ignore
    //   libWrapper.register(
    //     ARMS_REACH_MODULE_NAME,
    //     'Drawing.prototype._onHandleMouseDown',
    //     // 'Drawing.prototype._onClickLeft',
    //     DrawingPrototypeOnClickLeftHandler,
    //     'MIXED',
    //   );
    // }

    // if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableTilesIntegration')) {
    //   //@ts-ignore
    //   libWrapper.register(
    //     ARMS_REACH_MODULE_NAME,
    //     // 'Tile.prototype._onClickLeft',
    //     'Tile.prototype._onHandleMouseDown',
    //     TilePrototypeOnClickLeftHandler,
    //     'MIXED',
    //   );
    // }
  }
};

export const setupHooks = () => {
  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableArmsReach')) {
    if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableJournalsIntegration')) {
      game.settings.set('core', 'notesDisplayToggle', true);
    }
  }
};

export const readyHooks = async () => {
  // setup all the hooks
  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableArmsReach')) {
    game[ArmsReach.API] = new ArmsReach();

    Hooks.on('preUpdateWall', async (object, updateData, diff, userID) => {
      // THIS IS ONLY A BUG FIXING FOR THE SOUND DISABLE FOR THE lib-wrapper override
      if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableDoorsIntegration')) {
        // if ambient door is present and active dont' do this
        if (!game.modules.get('ambientdoors')?.active) {
          DoorsReach.preUpdateWallBugFixSoundHandler(object, updateData, diff, userID);
        }
      }
    });

    // Management of the Stairways module
    if (game.modules.get('stairways')?.active) {
      Hooks.on('PreStairwayTeleport', (data) => {
        if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableStairwaysIntegration')) {
          const { sourceSceneId, sourceData, selectedTokenIds, targetSceneId, targetData, userId } = data;
          let tokenSelected;

          tokenSelected = <Token>getFirstPlayerTokenSelected();
          if (!tokenSelected) {
            tokenSelected = <Token>getFirstPlayerToken();
          }
          // Check if no token is selected and you are the GM avoid the distance calculation
          let doNotReselectIfGM = false;
          if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
          ) {
            doNotReselectIfGM = true;
          }

          const result = StairwaysReach.globalInteractionDistance(sourceData, selectedTokenIds, userId);
          if (!doNotReselectIfGM) {
            reselectTokenAfterInteraction(tokenSelected);
          }
          return result;
        }
      });
    }

    // Adds menu option to Scene Nav and Directory
    Hooks.on('getSceneNavigationContext', (html, contextOptions) => {
      if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableResetDoorsAndFog')) {
        contextOptions.push(<any>ResetDoorsAndFog.getContextOption('sceneId'));
      }
    });

    Hooks.on('getSceneDirectoryEntryContext', (html, contextOptions) => {
      if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableResetDoorsAndFog')) {
        contextOptions.push(ResetDoorsAndFog.getContextOption(undefined));
      }
    });

    // Adds Shut All Doors button to Walls Control Layer
    Hooks.on('getSceneControlButtons', function (controls) {
      if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableResetDoorsAndFog')) {
        controls[4].tools.splice(controls[4].tools.length - 2, 0, {
          name: 'close',
          title: 'Close Open Doors',
          icon: 'fas fa-door-closed',
          onClick: () => {
            ResetDoorsAndFog.resetDoors(true, <string>game.scenes?.current?.id);
          },
          button: true,
        });
        return controls;
      }
    });

    // Hooks.on('canvasReady',function (canvas: Canvas) {
    // const [target] = args;
    // const canvas = this as Canvas;
    canvas?.stage?.on('mousedown', async (event) => {
      const position = getMousePosition(canvas, event);

      const clickWalls: PlaceableObject[] = getPlaceablesAt(canvas?.walls?.placeables, position) || [];
      // const clickNotes:PlaceableObject[] = getPlaceablesAt(canvas?.notes?.placeables, position) || [];
      // const clickTokens:PlaceableObject[] = getPlaceablesAt(canvas?.tokens?.placeables, position) || [];
      // const clickLights:PlaceableObject[] = getPlaceablesAt(canvas?.lighting?.placeables, position) || [];
      // const clickSounds:PlaceableObject[] = getPlaceablesAt(canvas?.lighting?.placeables, position) || [];
      const clickDrawings: PlaceableObject[] = getPlaceablesAt(canvas?.drawings?.placeables, position) || [];
      const clickTiles: PlaceableObject[] = getPlaceablesAt(canvas.background?.placeables, position) || [];
      // const clickTemplates:PlaceableObject[] = getPlaceablesAt(canvas?.templates?.placeables, position) || [];

      const downTriggers: PlaceableObject[] = [];
      downTriggers.push(...clickWalls);
      // downTriggers.push(...clickLights);
      // downTriggers.push(...clickSounds);
      downTriggers.push(...clickDrawings);
      downTriggers.push(...clickTiles);
      // downTriggers.push(...clickTemplates);
      if (downTriggers.length === 0) {
        return;
      }
      if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableDrawingsIntegration')) {
        if (clickDrawings.length > 0) {
          const drawing = clickDrawings[0] as Drawing;
          let tokenSelected;

          tokenSelected = <Token>getFirstPlayerTokenSelected();
          if (!tokenSelected) {
            tokenSelected = <Token>getFirstPlayerToken();
          }
          // Check if no token is selected and you are the GM avoid the distance calculation
          let doNotReselectIfGM = false;
          if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
          ) {
            doNotReselectIfGM = true;
          }
          if (taggerModuleActive && !checkTaggerForAmrsreach(drawing)) {
            if (!doNotReselectIfGM) {
              reselectTokenAfterInteraction(tokenSelected);
            }
            return;
          }
          const isInReach = await DrawingsReach.globalInteractionDistance(tokenSelected, drawing);
          if (!doNotReselectIfGM) {
            reselectTokenAfterInteraction(tokenSelected);
          }
          if (!isInReach) {
            return;
          }
        }
      }
      if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableTilesIntegration')) {
        if (clickTiles.length > 0) {
          const tile = clickTiles[0] as Tile;
          let tokenSelected;

          tokenSelected = <Token>getFirstPlayerTokenSelected();
          if (!tokenSelected) {
            tokenSelected = <Token>getFirstPlayerToken();
          }
          // Check if no token is selected and you are the GM avoid the distance calculation
          let doNotReselectIfGM = false;
          if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
          ) {
            doNotReselectIfGM = true;
          }
          if (taggerModuleActive && !checkTaggerForAmrsreach(tile)) {
            if (!doNotReselectIfGM) {
              reselectTokenAfterInteraction(tokenSelected);
            }
            return;
          }
          const isInReach = await TilesReach.globalInteractionDistance(tokenSelected, tile);
          if (!doNotReselectIfGM) {
            reselectTokenAfterInteraction(tokenSelected);
          }
          if (!isInReach) {
            return;
          }
        }
      }
      if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableWallsIntegration')) {
        if (clickWalls.length > 0) {
          const wall = clickWalls[0] as Wall;
          let tokenSelected;

          tokenSelected = <Token>getFirstPlayerTokenSelected();
          if (!tokenSelected) {
            tokenSelected = <Token>getFirstPlayerToken();
          }
          // Check if no token is selected and you are the GM avoid the distance calculation
          let doNotReselectIfGM = false;
          if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
          ) {
            doNotReselectIfGM = true;
          }
          if (taggerModuleActive && !checkTaggerForAmrsreach(wall)) {
            if (!doNotReselectIfGM) {
              reselectTokenAfterInteraction(tokenSelected);
            }
            return;
          }
          const isInReach = await WallsReach.globalInteractionDistance(tokenSelected, wall);
          if (!doNotReselectIfGM) {
            reselectTokenAfterInteraction(tokenSelected);
          }
          if (!isInReach) {
            return;
          }
        }
      }
    });

    // });
  }

  // Register custom sheets (if any)
};

export const TokenPrototypeOnClickLeftHandler = async function (wrapped, ...args) {
  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableTokensIntegration')) {
    const [target] = args;
    const token = this as Token;
    const prefixToCheck = <string>game.settings.get(ARMS_REACH_MODULE_NAME, 'tokensIntegrationByPrefix');
    const isTokenNameChecked = token.name?.startsWith(prefixToCheck);
    // lootsheetnpc5e/template/npc-sheet.html
    const isNPCLootSheet = token.document.actor?.sheet?.template.includes('lootsheetnpc5e/template/npc-sheet.html');
    const enableNPCLootSheet = <boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'tokensIntegrationWithLootSheet');
    if (isTokenNameChecked || (isNPCLootSheet && enableNPCLootSheet)) {
      const nameSourceToken = <string>game.settings.get(ARMS_REACH_MODULE_NAME, 'tokensIntegrationExplicitName');
      let tokenSelected;
      if (nameSourceToken) {
        tokenSelected = <Token>canvas.tokens?.placeables.find((tokenTmp: Token) => tokenTmp.name === nameSourceToken);
      } else {
        tokenSelected = <Token>getFirstPlayerTokenSelected();
        if (!tokenSelected) {
          tokenSelected = <Token>getFirstPlayerToken();
        }
      }
      // Check if no token is selected and you are the GM avoid the distance calculation
      let doNotReselectIfGM = false;
      if (
        (!canvas.tokens?.controlled && game.user?.isGM) ||
        (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
      ) {
        doNotReselectIfGM = true;
      }
      if (taggerModuleActive && !checkTaggerForAmrsreach(token)) {
        if (!doNotReselectIfGM) {
          reselectTokenAfterInteraction(tokenSelected);
        }
        return wrapped(...args);
      }
      const isInReach = await TokensReach.globalInteractionDistance(tokenSelected, token);
      if (!doNotReselectIfGM) {
        reselectTokenAfterInteraction(tokenSelected);
      }
      if (!isInReach) {
        return;
      }
    }
  }
  return wrapped(...args);
};

export const NotePrototypeOnClickLeftHandler = async function (wrapped, ...args) {
  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableJournalsIntegration')) {
    const [target] = args;
    const note = this as Note;
    let tokenSelected;

    tokenSelected = <Token>getFirstPlayerTokenSelected();
    if (!tokenSelected) {
      tokenSelected = <Token>getFirstPlayerToken();
    }
    // Check if no token is selected and you are the GM avoid the distance calculation
    let doNotReselectIfGM = false;
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreach(note)) {
      if (!doNotReselectIfGM) {
        reselectTokenAfterInteraction(tokenSelected);
      }
      return wrapped(...args);
    }
    const isInReach = await NotesReach.globalInteractionDistance(tokenSelected, note);
    if (!doNotReselectIfGM) {
      reselectTokenAfterInteraction(tokenSelected);
    }
    if (!isInReach) {
      return;
    }
  }
  return wrapped(...args);
};

export const DoorControlPrototypeOnMouseDownHandler = async function (wrapped, ...args) {
  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableDoorsIntegration')) {
    const doorControl = this as DoorControl;
    let tokenSelected;

    tokenSelected = <Token>getFirstPlayerTokenSelected();
    if (!tokenSelected) {
      tokenSelected = <Token>getFirstPlayerToken();
    }
    // Check if no token is selected and you are the GM avoid the distance calculation
    let doNotReselectIfGM = false;
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreach(doorControl.wall)) {
      if (!doNotReselectIfGM) {
        reselectTokenAfterInteraction(tokenSelected);
      }
      return wrapped(...args);
    }
    const isInReach = await DoorsReach.globalInteractionDistance(tokenSelected, doorControl, false);
    if (!doNotReselectIfGM) {
      reselectTokenAfterInteraction(tokenSelected);
    }
    if (!isInReach) {
      // Bug fix not sure why i need to do this
      if (doorControl.wall.data.ds == CONST.WALL_DOOR_STATES.LOCKED) {
        if (game.settings.get(ARMS_REACH_MODULE_NAME, 'disableDoorSound')) {
          return;
        }
        // Door Lock
        const doorData = DoorsReach.defaultDoorData();
        const playpath = doorData.lockPath;
        const playVolume = doorData.lockLevel;
        const fixedPlayPath = playpath.replace('[data]', '').trim();
        AudioHelper.play({ src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false }, true);
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
};

export const DoorControlPrototypeOnRightDownHandler = async function (wrapped, ...args) {
  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableDoorsIntegration')) {
    const doorControl = this as DoorControl; //evt.currentTarget;
    let tokenSelected: Token = <Token>getFirstPlayerTokenSelected();
    let isOwned = false;
    if (!tokenSelected) {
      tokenSelected = <Token>getFirstPlayerToken();
      if (tokenSelected) {
        isOwned = true;
      }
    }
    if (!tokenSelected) {
      if (game.user?.isGM) {
        return wrapped(...args);
      } else {
        return;
      }
    }
    // Check if no token is selected and you are the GM avoid the distance calculation
    let doNotReselectIfGM = false;
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreach(doorControl.wall)) {
      if (!doNotReselectIfGM) {
        reselectTokenAfterInteraction(tokenSelected);
      }
      return wrapped(...args);
    }
    const isInReach = await DoorsReach.globalInteractionDistance(tokenSelected, doorControl, true);
    if (!doNotReselectIfGM) {
      reselectTokenAfterInteraction(tokenSelected);
    }
    if (!isInReach) {
      return;
    }
  }
  return wrapped(...args);
};

export const AmbientLightPrototypeOnClickRightHandler = async function (wrapped, ...args) {
  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableJournalsIntegration')) {
    const [target] = args;
    const light = this as AmbientLight;
    let tokenSelected;

    tokenSelected = <Token>getFirstPlayerTokenSelected();
    if (!tokenSelected) {
      tokenSelected = <Token>getFirstPlayerToken();
    }
    // Check if no token is selected and you are the GM avoid the distance calculation
    let doNotReselectIfGM = false;
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreach(light)) {
      if (!doNotReselectIfGM) {
        reselectTokenAfterInteraction(tokenSelected);
      }
      return wrapped(...args);
    }
    const isInReach = await LightsReach.globalInteractionDistance(tokenSelected, light);
    if (!doNotReselectIfGM) {
      reselectTokenAfterInteraction(tokenSelected);
    }
    if (!isInReach) {
      return;
    }
  }
  return wrapped(...args);
};

export const AmbientSoundPrototypeOnClickRightHandler = async function (wrapped, ...args) {
  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableSoundsIntegration')) {
    const [target] = args;
    const sound = this as AmbientSound;
    let tokenSelected;

    tokenSelected = <Token>getFirstPlayerTokenSelected();
    if (!tokenSelected) {
      tokenSelected = <Token>getFirstPlayerToken();
    }
    // Check if no token is selected and you are the GM avoid the distance calculation
    let doNotReselectIfGM = false;
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreach(sound)) {
      if (!doNotReselectIfGM) {
        reselectTokenAfterInteraction(tokenSelected);
      }
      return wrapped(...args);
    }
    const isInReach = await SoundsReach.globalInteractionDistance(tokenSelected, sound);
    if (!doNotReselectIfGM) {
      reselectTokenAfterInteraction(tokenSelected);
    }
    if (!isInReach) {
      return;
    }
  }
  return wrapped(...args);
};

// export const DrawingPrototypeOnClickLeftHandler = async function (wrapped, ...args) {
//   if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableDrawingsIntegration')) {
//     const [target] = args;
//     const drawing = this as Drawing;
//     let tokenSelected;

//     tokenSelected = <Token>getFirstPlayerTokenSelected();
//     if (!tokenSelected) {
//       tokenSelected = <Token>getFirstPlayerToken();
//     }

//     if(taggerModuleActive && !checkTaggerForAmrsreach(drawing)){
// if(!doNotReselectIfGM){
//   reselectTokenAfterInteraction(tokenSelected);
// }
//       return wrapped(...args);
//     }
//     const isInReach = await DrawingsReach.globalInteractionDistance(tokenSelected, drawing);
// if(!doNotReselectIfGM){
//   reselectTokenAfterInteraction(tokenSelected);
// }
//     if (!isInReach) {
//       return;
//     }
//   }
//   return wrapped(...args);
// };

// export const TilePrototypeOnClickLeftHandler = async function (wrapped, ...args) {
//   if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'enableTilesIntegration')) {
//     const [target] = args;
//     const tile = this as Tile;
//     let tokenSelected;

//     tokenSelected = <Token>getFirstPlayerTokenSelected();
//     if (!tokenSelected) {
//       tokenSelected = <Token>getFirstPlayerToken();
//     }

//     if(taggerModuleActive && !checkTaggerForAmrsreach(tile)){
// if(!doNotReselectIfGM){
//   reselectTokenAfterInteraction(tokenSelected);
// }
//       return wrapped(...args);
//     }
//     const isInReach = await TilesReach.globalInteractionDistance(tokenSelected, tile);
// if(!doNotReselectIfGM){
//   reselectTokenAfterInteraction(tokenSelected);
// }
//     if (!isInReach) {
//       return;
//     }
//   }
//   return wrapped(...args);
// };
