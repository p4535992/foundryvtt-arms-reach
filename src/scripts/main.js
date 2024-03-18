import { getCharacterName, getTokenByTokenID } from "./lib/lib.js";
import { StairwaysReach } from "./StairwaysReach.js";
// import { ResetDoorsAndFog } from "./resetdoorsandfog.js";
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
import { registerSocket } from "./socket";
import Logger from "./lib/Logger.js";

let taggerModuleActive;

export const initHooks = () => {
    Logger.warn("Init Hooks processing");
    Hooks.once("socketlib.ready", registerSocket);

    taggerModuleActive = game.modules.get(CONSTANTS.TAGGER_MODULE_ID)?.active;
    // game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerIntegration");

    if (game.settings.get(CONSTANTS.MODULE_ID, "enableArmsReach")) {
        if (game.settings.get(CONSTANTS.MODULE_ID, "enableDoorsIntegration")) {
            // DoorsReach.init();

            libWrapper.register(
                CONSTANTS.MODULE_ID,
                "DoorControl.prototype._onMouseDown",
                DoorControlPrototypeOnMouseDownHandler,
                "MIXED",
            );

            libWrapper.register(
                CONSTANTS.MODULE_ID,
                "DoorControl.prototype._onRightDown",
                DoorControlPrototypeOnRightDownHandler,
                "MIXED",
            );
        }

        if (game.settings.get(CONSTANTS.MODULE_ID, "enableJournalsIntegration")) {
            libWrapper.register(
                CONSTANTS.MODULE_ID,
                "Note.prototype._onClickLeft",
                NotePrototypeOnClickLeft1Handler,
                "MIXED",
            );

            libWrapper.register(
                CONSTANTS.MODULE_ID,
                "Note.prototype._onClickLeft2",
                NotePrototypeOnClickLeft2Handler,
                "MIXED",
            );
        }

        if (game.settings.get(CONSTANTS.MODULE_ID, "enableTokensIntegration")) {
            libWrapper.register(
                CONSTANTS.MODULE_ID,
                "Token.prototype._onClickLeft",
                TokenPrototypeOnClickLeftHandler,
                "MIXED",
            );

            libWrapper.register(
                CONSTANTS.MODULE_ID,
                "Token.prototype._onClickLeft2",
                TokenPrototypeOnClickLeft2Handler,
                "MIXED",
            );
        }

        if (game.settings.get(CONSTANTS.MODULE_ID, "enableLightsIntegration")) {
            libWrapper.register(
                CONSTANTS.MODULE_ID,
                "AmbientLight.prototype._onClickRight",
                AmbientLightPrototypeOnClickRightHandler,
                "MIXED",
            );
        }

        if (game.settings.get(CONSTANTS.MODULE_ID, "enableSoundsIntegration")) {
            libWrapper.register(
                CONSTANTS.MODULE_ID,
                "AmbientSound.prototype._onClickRight",
                AmbientSoundPrototypeOnClickRightHandler,
                "MIXED",
            );
        }

        // if (game.settings.get(CONSTANTS.MODULE_ID, 'enableDrawingsIntegration')) {
        //
        //   libWrapper.register(
        //     CONSTANTS.MODULE_ID,
        //     'Drawing.prototype._onHandleMouseDown',
        //     // 'Drawing.prototype._onClickLeft',
        //     DrawingPrototypeOnClickLeftHandler,
        //     'MIXED',
        //   );
        // }

        // if (game.settings.get(CONSTANTS.MODULE_ID, 'enableTilesIntegration')) {
        //
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

    const data = game.modules.get(CONSTANTS.MODULE_ID);
    data.api = API;
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
                        (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnStairways") &&
                            game.user?.isGM)
                    ) {
                        doNotReselectIfGM = true;
                    }

                    let characterToken = getFirstPlayerTokenSelected();
                    if (selectedTokenIds) {
                        if (selectedTokenIds.length > 1) {
                            //iteractionFailNotification(i18n(`${CONSTANTS.MODULE_ID}.warningNoSelectMoreThanOneToken`));
                            return false;
                        } else {
                            characterToken = getTokenByTokenID(selectedTokenIds[0]);
                        }
                    } else {
                        if (!characterToken) {
                            characterToken = getFirstPlayerToken();
                        }
                    }
                    const result = StairwaysReach.globalInteractionDistance(characterToken, sourceData, userId);
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
                        (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDrawings") &&
                            game.user?.isGM)
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
                        (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnTiles") &&
                            game.user?.isGM)
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
                        (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnWalls") &&
                            game.user?.isGM)
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
                    (tokenTmp) => tokenTmp.name === nameSourceToken || tokenTmp.document.name === nameSourceToken,
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
