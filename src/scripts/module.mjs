import { warn, error, debug, i18n, i18nFormat, getCharacterName } from "./lib/lib.mjs";
import { StairwaysReach } from "./StairwaysReach.mjs";
// import { ResetDoorsAndFog } from "./resetdoorsandfog.mjs";
import {
  checkTaggerForAmrsreachForDrawing,
  checkTaggerForAmrsreachForLight,
  checkTaggerForAmrsreachForNote,
  checkTaggerForAmrsreachForSound,
  checkTaggerForAmrsreachForTile,
  checkTaggerForAmrsreachForToken,
  checkTaggerForAmrsreachForWall,
  getFirstPlayerToken,
  getFirstPlayerTokenNo,
  getFirstPlayerTokenSelected,
  getFirstPlayerTokenSelectedNo,
  getMousePosition,
  getPlaceablesAt,
  reselectTokenAfterInteraction,
} from "./ArmsReachHelper";
import { ArmsReachVariables, DoorsReach } from "./DoorsReach";
import { NotesReach } from "./NotesReach";
import { TokensReach } from "./TokensReach";
import { LightsReach } from "./LightsReach";
import { DrawingsReach } from "./DrawingsReach";
import { TilesReach } from "./TilesReach";
import { SoundsReach } from "./SoundsReach";
import { WallsReach } from "./WallsReach";
import CONSTANTS from "./constants";
import API from "./api";
import { setApi } from "../module.js";
import { registerSocket } from "./socket";
// import { Overlay } from "./apps/range_overlay/overlay";
// import { keyboard } from "./apps/range_overlay/keyboard";
// import { mouse } from "./apps/range_overlay/mouse";
// import { TOGGLE_BUTTON, _toggleButtonClick } from "./apps/range_overlay/controls";
// import { canvasTokensGet } from "./apps/range_overlay/utility";
// import { TokenInfo, updateLocation, updateMeasureFrom } from "./apps/range_overlay/tokenInfo";

let taggerModuleActive;

export const initHooks = () => {
  warn("Init Hooks processing");
  Hooks.once("socketlib.ready", registerSocket);

  taggerModuleActive = game.modules.get(CONSTANTS.TAGGER_MODULE_ID)?.active;
  // game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerIntegration");

  if (game.settings.get(CONSTANTS.MODULE_ID, "enableArmsReach")) {
    if (game.settings.get(CONSTANTS.MODULE_ID, "enableDoorsIntegration")) {
      DoorsReach.init();

      //@ts-ignore
      libWrapper.register(
        CONSTANTS.MODULE_ID,
        "DoorControl.prototype._onMouseDown",
        DoorControlPrototypeOnMouseDownHandler,
        "MIXED"
      );
      //@ts-ignore
      libWrapper.register(
        CONSTANTS.MODULE_ID,
        "DoorControl.prototype._onRightDown",
        DoorControlPrototypeOnRightDownHandler,
        "MIXED"
      );
    }

    if (game.settings.get(CONSTANTS.MODULE_ID, "enableJournalsIntegration")) {
      //@ts-ignore
      libWrapper.register(
        CONSTANTS.MODULE_ID,
        "Note.prototype._onClickLeft",
        NotePrototypeOnClickLeft1Handler,
        "MIXED"
      );

      //@ts-ignore
      libWrapper.register(
        CONSTANTS.MODULE_ID,
        "Note.prototype._onClickLeft2",
        NotePrototypeOnClickLeft2Handler,
        "MIXED"
      );
    }

    if (game.settings.get(CONSTANTS.MODULE_ID, "enableTokensIntegration")) {
      //@ts-ignore
      libWrapper.register(
        CONSTANTS.MODULE_ID,
        "Token.prototype._onClickLeft",
        TokenPrototypeOnClickLeftHandler,
        "MIXED"
      );
      //@ts-ignore
      libWrapper.register(
        CONSTANTS.MODULE_ID,
        "Token.prototype._onClickLeft2",
        TokenPrototypeOnClickLeft2Handler,
        "MIXED"
      );
    }

    if (game.settings.get(CONSTANTS.MODULE_ID, "enableLightsIntegration")) {
      //@ts-ignore
      libWrapper.register(
        CONSTANTS.MODULE_ID,
        "AmbientLight.prototype._onClickRight",
        AmbientLightPrototypeOnClickRightHandler,
        "MIXED"
      );
    }

    if (game.settings.get(CONSTANTS.MODULE_ID, "enableSoundsIntegration")) {
      //@ts-ignore
      libWrapper.register(
        CONSTANTS.MODULE_ID,
        "AmbientSound.prototype._onClickRight",
        AmbientSoundPrototypeOnClickRightHandler,
        "MIXED"
      );
    }

    // if (game.settings.get(CONSTANTS.MODULE_ID, 'enableDrawingsIntegration')) {
    //   //@ts-ignore
    //   libWrapper.register(
    //     CONSTANTS.MODULE_ID,
    //     'Drawing.prototype._onHandleMouseDown',
    //     // 'Drawing.prototype._onClickLeft',
    //     DrawingPrototypeOnClickLeftHandler,
    //     'MIXED',
    //   );
    // }

    // if (game.settings.get(CONSTANTS.MODULE_ID, 'enableTilesIntegration')) {
    //   //@ts-ignore
    //   libWrapper.register(
    //     CONSTANTS.MODULE_ID,
    //     // 'Tile.prototype._onClickLeft',
    //     'Tile.prototype._onHandleMouseDown',
    //     TilePrototypeOnClickLeftHandler,
    //     'MIXED',
    //   );
    // }
  }
};

export const setupHooks = () => {
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableArmsReach")) {
    if (game.settings.get(CONSTANTS.MODULE_ID, "enableJournalsIntegration")) {
      if (!game.settings.get("core", "notesDisplayToggle")) {
        game.settings.set("core", "notesDisplayToggle", true);
      }
    }
  }

  setApi(API);
};

export const readyHooks = async () => {
  // setup all the hooks
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableArmsReach")) {
    /* REMOVED WITH v11
    Hooks.on("preUpdateWall", async (object, updateData, diff, userID) => {
      // THIS IS ONLY A BUG FIXING FOR THE SOUND DISABLE FOR THE lib-wrapper override
      if (game.settings.get(CONSTANTS.MODULE_ID, "enableDoorsIntegration")) {
        // if ambient door is present and active dont' do this
        if (!game.modules.get("ambientdoors")?.active) {
          DoorsReach.preUpdateWallBugFixSoundHandler(object, updateData, diff, userID);
        }
      }
    });
    */
    // Management of the Stairways module
    if (game.modules.get("stairways")?.active) {
      Hooks.on("PreStairwayTeleport", (data) => {
        if (game.settings.get(CONSTANTS.MODULE_ID, "enableStairwaysIntegration")) {
          const { sourceSceneId, sourceData, selectedTokenIds, targetSceneId, targetData, userId } = data;
          let tokenSelected;

          tokenSelected = getFirstPlayerTokenSelected();
          if (!tokenSelected) {
            tokenSelected = getFirstPlayerToken();
          }
          // Check if no token is selected and you are the GM avoid the distance calculation
          let doNotReselectIfGM = false;
          if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
            (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnStairways") && game.user?.isGM)
          ) {
            doNotReselectIfGM = true;
          }

          const result = StairwaysReach.globalInteractionDistance(sourceData, selectedTokenIds, userId);
          if (!doNotReselectIfGM) {
            reselectTokenAfterInteraction(tokenSelected);
          }
          return result;
        } else {
          return true;
        }
      });
    }

    /* REMOVED ON V11 IS IN CORE
    // Adds menu option to Scene Nav and Directory
    Hooks.on("getSceneNavigationContext", (html, contextOptions) => {
      if (game.settings.get(CONSTANTS.MODULE_ID, "enableResetDoorsAndFog")) {
        contextOptions.push(ResetDoorsAndFog.getContextOption("sceneId"));
      }
    });

    Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) => {
      if (game.settings.get(CONSTANTS.MODULE_ID, "enableResetDoorsAndFog")) {
        contextOptions.push(ResetDoorsAndFog.getContextOption(undefined));
      }
    });

    // Adds Shut All Doors button to Walls Control Layer
    Hooks.on("getSceneControlButtons", (controls) => {
      if (game.settings.get(CONSTANTS.MODULE_ID, "enableResetDoorsAndFog")) {
        controls[4]?.tools.splice(controls[4].tools.length - 2, 0, {
          name: "close",
          title: "Close Open Doors",
          icon: "fas fa-door-closed",
          onClick: () => {
            ResetDoorsAndFog.resetDoors(true, game.scenes?.current?.id);
          },
          button: true,
        });
        return controls;
      }
    });
    */

    // Hooks.on('canvasReady',function (canvas: Canvas) {
    // const [target] = args;
    // const canvas = this as Canvas;
    canvas?.stage?.on("mousedown", async (event) => {
      const position = getMousePosition(canvas, event);

      const clickWalls = getPlaceablesAt(canvas?.walls?.placeables, position) || [];
      // const clickNotes = getPlaceablesAt(canvas?.notes?.placeables, position) || [];
      // const clickTokens = getPlaceablesAt(canvas?.tokens?.placeables, position) || [];
      // const clickLights = getPlaceablesAt(canvas?.lighting?.placeables, position) || [];
      // const clickSounds = getPlaceablesAt(canvas?.lighting?.placeables, position) || [];
      const clickDrawings = getPlaceablesAt(canvas?.drawings?.placeables, position) || [];
      const clickTiles = getPlaceablesAt(canvas.background?.placeables, position) || [];
      // const clickTemplates = getPlaceablesAt(canvas?.templates?.placeables, position) || [];

      const downTriggers = [];
      downTriggers.push(...clickWalls);
      // downTriggers.push(...clickLights);
      // downTriggers.push(...clickSounds);
      downTriggers.push(...clickDrawings);
      downTriggers.push(...clickTiles);
      // downTriggers.push(...clickTemplates);
      if (downTriggers.length === 0) {
        return;
      }
      if (game.settings.get(CONSTANTS.MODULE_ID, "enableDrawingsIntegration")) {
        if (clickDrawings.length > 0) {
          const drawing = clickDrawings[0];
          let tokenSelected;

          tokenSelected = getFirstPlayerTokenSelected();
          if (!tokenSelected) {
            tokenSelected = getFirstPlayerToken();
          }
          // Check if no token is selected and you are the GM avoid the distance calculation
          let doNotReselectIfGM = false;
          if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
            (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDrawings") && game.user?.isGM)
          ) {
            doNotReselectIfGM = true;
          }
          if (taggerModuleActive && !checkTaggerForAmrsreachForDrawing(drawing)) {
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
      if (game.settings.get(CONSTANTS.MODULE_ID, "enableTilesIntegration")) {
        if (clickTiles.length > 0) {
          const tile = clickTiles[0];
          let tokenSelected;

          tokenSelected = getFirstPlayerTokenSelected();
          if (!tokenSelected) {
            tokenSelected = getFirstPlayerToken();
          }
          // Check if no token is selected and you are the GM avoid the distance calculation
          let doNotReselectIfGM = false;
          if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
            (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnTiles") && game.user?.isGM)
          ) {
            doNotReselectIfGM = true;
          }
          if (taggerModuleActive && !checkTaggerForAmrsreachForTile(tile)) {
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
      if (game.settings.get(CONSTANTS.MODULE_ID, "enableWallsIntegration")) {
        if (clickWalls.length > 0) {
          const wall = clickWalls[0];
          let tokenSelected;

          tokenSelected = getFirstPlayerTokenSelected();
          if (!tokenSelected) {
            tokenSelected = getFirstPlayerToken();
          }
          // Check if no token is selected and you are the GM avoid the distance calculation
          let doNotReselectIfGM = false;
          if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
            (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnWalls") && game.user?.isGM)
          ) {
            doNotReselectIfGM = true;
          }
          if (taggerModuleActive && !checkTaggerForAmrsreachForWall(wall)) {
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

  // [EXPERIMENTAL] Range Overlay Integration
  /*
  if (game.settings.get(CONSTANTS.MODULE_ID, 'enableRangeOverlay')) {
    Hooks.on('getSceneControlButtons', (controls: SceneControl[]) => {
      if (!game.settings.get(CONSTANTS.MODULE_ID, 'enableRangeOverlay')) {
        return;
      }
      const tokenButton = controls.find((b) => b.name == 'token');

      if (tokenButton) {
        tokenButton.tools.push({
          name: TOGGLE_BUTTON,
          title: `${CONSTANTS.MODULE_ID}.controlButton`,
          icon: 'fas fa-people-arrows',
          toggle: true,
          active: game.settings.get(CONSTANTS.MODULE_ID, 'is-active'),
          onClick: (toggled) => _toggleButtonClick(toggled, controls),
          visible: true, // TODO: Figure out how to disable this from Settings
          // onClick: (value) => {
          //   game.settings.set(TRIGGER_HAPPY_MODULE_ID, 'enableTriggers', value);
          //   if (game.triggers) game.triggers._parseJournals.bind(game.triggers)();
          // },
        });
      }
    });

    //@ts-ignore
    libWrapper.ignore_conflicts(
      CONSTANTS.MODULE_ID,
      ['drag-ruler', 'enhanced-terrain-layer'],
      ['Token.prototype._onDragLeftStart', 'Token.prototype._onDragLeftDrop', 'Token.prototype._onDragLeftCancel'],
    );

    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_ID,
      'Token.prototype._onDragLeftStart',
      mouse._dragStartWrapper.bind(mouse),
      'WRAPPER',
    );

    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_ID,
      'Token.prototype._onDragLeftDrop',
      mouse._dragDropWrapper.bind(mouse),
      'WRAPPER',
    );

    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_ID,
      'Token.prototype._onDragLeftCancel',
      mouse._dragCancelWrapper.bind(mouse),
      'WRAPPER',
    );

    const instance = new Overlay();
    API.combatRangeOverlay = {
      instance,
      showNumericMovementCost: false,
      showPathLines: false,
      roundNumericMovementCost: true,
    };
    instance.registerHooks();
    keyboard.addHook('Alt', instance.altKeyHandler.bind(instance));
    mouse.addHook(instance.dragHandler.bind(instance));

    // noinspection JSUnusedLocalSymbols
    Hooks.on('createCombatant', (combatant, options, someId) => {
      if (!game.settings.get(CONSTANTS.MODULE_ID, 'enableRangeOverlay')) {
        return;
      }
      const token = canvasTokensGet(combatant.token.id);
      updateMeasureFrom(token, undefined);
      API.combatRangeOverlay.instance.fullRefresh();
    });

    // noinspection JSUnusedLocalSymbols
    Hooks.on('deleteCombatant', (combatant, options, someId) => {
      if (!game.settings.get(CONSTANTS.MODULE_ID, 'enableRangeOverlay')) {
        return;
      }
      const token = canvasTokensGet(combatant.token.id);
      updateMeasureFrom(token, undefined);
      API.combatRangeOverlay.instance.fullRefresh();
    });

    // noinspection JSUnusedLocalSymbols
    Hooks.on('updateCombat', (combat, turnInfo, diff, someId) => {
      if (!game.settings.get(CONSTANTS.MODULE_ID, 'enableRangeOverlay')) {
        return;
      }
      if (combat?.previous?.tokenId) {
        const token = canvasTokensGet(combat.previous.tokenId);
        updateMeasureFrom(token, undefined);
      }
      API.combatRangeOverlay.instance.fullRefresh();
    });

    // noinspection JSUnusedLocalSymbols
    Hooks.on('updateToken', (tokenDocument, updateData, options, someId) => {
      if (!game.settings.get(CONSTANTS.MODULE_ID, 'enableRangeOverlay')) {
        return;
      }
      const tokenId = tokenDocument.id;
      const realToken = canvasTokensGet(tokenId); // Get the real token
      updateLocation(realToken, updateData);
      if (!realToken.inCombat) {
        updateMeasureFrom(realToken, updateData);
      }
      API.combatRangeOverlay.instance.fullRefresh();
    });

    Hooks.on('controlToken', (token, boolFlag) => {
      if (!game.settings.get(CONSTANTS.MODULE_ID, 'enableRangeOverlay')) {
        return;
      }
      if (boolFlag && TokenInfo.current.speed === 0 && TokenInfo.current.getSpeedFromAttributes() === 0) {
        if (game.user?.isGM) {
          warn(i18n(`${CONSTANTS.MODULE_ID}.token-speed-warning-gm`), true);
        } else {
          warn(i18n(`${CONSTANTS.MODULE_ID}.token-speed-warning-player`), true);
        }
      }
    });
  }
  */
};

export let currentTokenForToken = undefined;

export const TokenPrototypeOnClickLeftHandler = async function (wrapped, ...args) {
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableTokensIntegration")) {
    const [target] = args;
    const token = this;
    // let tokenSelected;

    // tokenSelected = getFirstPlayerTokenSelected();
    // if (!tokenSelected) {
    // 	tokenSelected = getFirstPlayerToken();
    // }
    if (!currentTokenForToken) {
      currentTokenForToken = token;
    }
    // else {
    // 	currentTokenForToken = undefined;
    // }
  }
  return wrapped(...args);
};

export const TokenPrototypeOnClickLeft2Handler = async function (wrapped, ...args) {
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableTokensIntegration")) {
    const [target] = args;
    const token = this;
    const prefixToCheck = game.settings.get(CONSTANTS.MODULE_ID, "tokensIntegrationByPrefix");
    const isTokenNameChecked = getCharacterName(token)?.startsWith(prefixToCheck);
    // lootsheetnpc5e/template/npc-sheet.html
    const isNPCLootSheet = token.document.actor?.sheet?.template.includes("lootsheetnpc5e/template/npc-sheet.html");
    const enableNPCLootSheet = game.settings.get(CONSTANTS.MODULE_ID, "tokensIntegrationWithLootSheet");
    if (
      isTokenNameChecked ||
      (isNPCLootSheet && enableNPCLootSheet) ||
      (taggerModuleActive && checkTaggerForAmrsreachForToken(token))
    ) {
      const nameSourceToken = game.settings.get(CONSTANTS.MODULE_ID, "tokensIntegrationExplicitName");
      let tokenSelected;

      if (nameSourceToken) {
        tokenSelected = canvas.tokens?.placeables.find(
          (tokenTmp) => tokenTmp.name === nameSourceToken || tokenTmp.document.name === nameSourceToken
        );
      } else {
        if (currentTokenForToken?.id !== token.id) {
          tokenSelected = currentTokenForToken;
          reselectTokenAfterInteraction(tokenSelected);
        }
        if (!tokenSelected) {
          tokenSelected = getFirstPlayerTokenSelectedNo(currentTokenForToken);
          if (!tokenSelected) {
            tokenSelected = getFirstPlayerTokenNo(currentTokenForToken);
          }
        }
      }

      // Check if no token is selected and you are the GM avoid the distance calculation
      let doNotReselectIfGM = false;
      if (
        (!canvas.tokens?.controlled && game.user?.isGM) ||
        (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
        (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnTokens") && game.user?.isGM)
      ) {
        doNotReselectIfGM = true;
      }
      if (taggerModuleActive && !checkTaggerForAmrsreachForToken(token)) {
        if (!doNotReselectIfGM) {
          reselectTokenAfterInteraction(tokenSelected);
        }
        currentTokenForToken = undefined;
        return wrapped(...args);
      }
      const isInReach = await TokensReach.globalInteractionDistance(tokenSelected, token);
      if (!doNotReselectIfGM) {
        reselectTokenAfterInteraction(tokenSelected);
      }
      if (!isInReach) {
        currentTokenForToken = undefined;
        return;
      } else {
        currentTokenForToken = undefined;
      }
    } else {
      currentTokenForToken = undefined;
    }
  } else {
    currentTokenForToken = undefined;
  }
  return wrapped(...args);
};

let currentTokenForNote = undefined;

export const NotePrototypeOnClickLeft1Handler = async function (wrapped, ...args) {
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableJournalsIntegration")) {
    const [target] = args;
    const note = this;
    let tokenSelected;

    tokenSelected = getFirstPlayerTokenSelected();
    if (!tokenSelected) {
      tokenSelected = getFirstPlayerToken();
    }
    currentTokenForNote = tokenSelected;
  }
  return wrapped(...args);
};

export const NotePrototypeOnClickLeft2Handler = async function (wrapped, ...args) {
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableJournalsIntegration")) {
    const [target] = args;
    const note = this;
    let tokenSelected;
    if (currentTokenForNote) {
      tokenSelected = currentTokenForNote;
      reselectTokenAfterInteraction(tokenSelected);
    } else {
      tokenSelected = getFirstPlayerTokenSelected();
      if (!tokenSelected) {
        tokenSelected = getFirstPlayerToken();
      }
    }
    // Check if no token is selected and you are the GM avoid the distance calculation
    let doNotReselectIfGM = false;
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
      (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnNotes") && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreachForNote(note)) {
      if (!doNotReselectIfGM) {
        reselectTokenAfterInteraction(tokenSelected);
      }
      currentTokenForNote = undefined;
      return wrapped(...args);
    }
    const isInReach = await NotesReach.globalInteractionDistance(tokenSelected, note);
    if (!doNotReselectIfGM) {
      reselectTokenAfterInteraction(tokenSelected);
    }
    if (!isInReach) {
      currentTokenForNote = undefined;
      return;
    }
    currentTokenForNote = undefined;
  } else {
    currentTokenForNote = undefined;
  }
  return wrapped(...args);
};

export const DoorControlPrototypeOnMouseDownHandler = async function (wrapped, ...args) {
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableDoorsIntegration")) {
    const doorControl = this;
    let tokenSelected;

    tokenSelected = getFirstPlayerTokenSelected();
    if (!tokenSelected) {
      tokenSelected = getFirstPlayerToken();
    }
    // Check if no token is selected and you are the GM avoid the distance calculation
    let doNotReselectIfGM = false;
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
      (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDoors") && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreachForWall(doorControl.wall)) {
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
      //@ts-ignore
      if (doorControl.wall.document.ds === CONST.WALL_DOOR_STATES.LOCKED) {
        if (game.settings.get(CONSTANTS.MODULE_ID, "disableDoorSound")) {
          return;
        }
        // TODO ADD INTEGRATION FOR V11 DISABLE SOUND FOR LOCKED DOOR
        // Door Lock
        /* REMOVED WITH v11
        const doorData = DoorsReach.defaultDoorData();
        const playpath = doorData.lockPath;
        const playVolume = doorData.lockLevel;
        const fixedPlayPath = playpath.replace("[data]", "").trim();
        AudioHelper.play({ src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false }, true);
        */
      }
      return;
    }
  }

  // YOU NEED THIS ANYWAY FOR A STRANGE BUG WITH OVERRIDE AND SOUND OF DOOR
  //if(game.settings.get(MODULE_ID, "enableAmbientDoor")) {
  //  AmbientDoors.onDoorMouseDownCheck(doorControl);
  //}
  // Call original method
  //return originalMethod.apply(this,arguments);
  return wrapped(...args);
};

export const DoorControlPrototypeOnRightDownHandler = async function (wrapped, ...args) {
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableDoorsIntegration")) {
    const doorControl = this; //evt.currentTarget;
    let tokenSelected;

    tokenSelected = getFirstPlayerTokenSelected();
    if (!tokenSelected) {
      tokenSelected = getFirstPlayerToken();
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
      (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
      (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDoors") && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreachForWall(doorControl.wall)) {
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
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableJournalsIntegration")) {
    const [target] = args;
    const light = this;
    let tokenSelected;

    tokenSelected = getFirstPlayerTokenSelected();
    if (!tokenSelected) {
      tokenSelected = getFirstPlayerToken();
    }
    // Check if no token is selected and you are the GM avoid the distance calculation
    let doNotReselectIfGM = false;
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
      (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnLights") && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreachForLight(light)) {
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
  if (game.settings.get(CONSTANTS.MODULE_ID, "enableSoundsIntegration")) {
    const [target] = args;
    const sound = this;
    let tokenSelected;

    tokenSelected = getFirstPlayerTokenSelected();
    if (!tokenSelected) {
      tokenSelected = getFirstPlayerToken();
    }
    // Check if no token is selected and you are the GM avoid the distance calculation
    let doNotReselectIfGM = false;
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
      (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnSounds") && game.user?.isGM)
    ) {
      doNotReselectIfGM = true;
    }
    if (taggerModuleActive && !checkTaggerForAmrsreachForSound(sound)) {
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
//   if (game.settings.get(CONSTANTS.MODULE_ID, 'enableDrawingsIntegration')) {
//     const [target] = args;
//     const drawing = this;
//     let tokenSelected;

//     tokenSelected = getFirstPlayerTokenSelected();
//     if (!tokenSelected) {
//       tokenSelected = getFirstPlayerToken();
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
//   if (game.settings.get(CONSTANTS.MODULE_ID, 'enableTilesIntegration')) {
//     const [target] = args;
//     const tile = this;
//     let tokenSelected;

//     tokenSelected = getFirstPlayerTokenSelected();
//     if (!tokenSelected) {
//       tokenSelected = getFirstPlayerToken();
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
