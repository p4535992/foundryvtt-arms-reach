import { warn } from "../foundryvtt-arms-reach.js";
import { getCanvas, ARMS_REACH_MODULE_NAME, getGame } from "./settings.js";
import { StairwaysReach } from "./StairwaysReach.js";
import { ResetDoorsAndFog } from "./resetdoorsandfog.js";
import { getFirstPlayerToken, getFirstPlayerTokenSelected, reselectTokenAfterInteraction } from "./ArmsReachhelper.js";
import { DoorsReach } from "./DoorsReach.js";
import { JournalsReach } from "./JournalsReach.js";
import { TokensReach } from "./TokensReach.js";
import { socket, _socketRecalculate } from "./ArmsReachSocket.js";
//@ts-ignore
// import { KeybindLib } from "/modules/keybind-lib/keybind-lib.js";
// const previewer = new SoundPreviewerApplication();
export const readyHooks = async () => {
    // setup all the hooks
    if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableArmsReach')) {
        Hooks.once('socketlib.ready', () => {
            //@ts-ignore
            socket = socketlib.registerModule(ARMS_REACH_MODULE_NAME);
            socket.register('recalculate', _socketRecalculate);
        });
        Hooks.on('preUpdateWall', async (object, updateData, diff, userID) => {
            // THIS IS ONLY A BUG FIXING FOR THE SOUND DISABLE FOR THE lib-wrapper override
            if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableDoorsIntegration')) {
                // if ambient door is present and active dont' do this
                if (!getGame().modules.get('ambientdoors')?.active) {
                    DoorsReach.preUpdateWallBugFixSoundHandler(object, updateData, diff, userID);
                }
            }
        });
        // Management of the Stairways module
        if (getGame().modules.get('stairways')?.active) {
            Hooks.on('PreStairwayTeleport', (data) => {
                if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableStairwaysIntegration')) {
                    const { sourceSceneId, sourceData, selectedTokenIds, targetSceneId, targetData, userId } = data;
                    let tokenSelected;
                    // if (<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'forceReSelection')) {
                    tokenSelected = getFirstPlayerTokenSelected();
                    if (!tokenSelected) {
                        tokenSelected = getFirstPlayerToken();
                    }
                    // }
                    const result = StairwaysReach.globalInteractionDistance(sourceData, selectedTokenIds, userId);
                    reselectTokenAfterInteraction(tokenSelected);
                    return result;
                }
            });
        }
        // Adds menu option to Scene Nav and Directory
        Hooks.on('getSceneNavigationContext', (html, contextOptions) => {
            if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableResetDoorsAndFog')) {
                contextOptions.push(ResetDoorsAndFog.getContextOption2('sceneId'));
            }
        });
        Hooks.on('getSceneDirectoryEntryContext', (html, contextOptions) => {
            if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableResetDoorsAndFog')) {
                contextOptions.push(ResetDoorsAndFog.getContextOption2('entityId'));
            }
        });
        // Adds Shut All Doors button to Walls Control Layer
        Hooks.on('getSceneControlButtons', function (controls) {
            if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableResetDoorsAndFog')) {
                controls[4].tools.splice(controls[4].tools.length - 2, 0, {
                    name: 'close',
                    title: 'Close Open Doors',
                    icon: 'fas fa-door-closed',
                    onClick: () => {
                        ResetDoorsAndFog.resetDoors(true, null);
                    },
                    button: true,
                });
                return controls;
            }
        });
        // Hooks.on("renderJournalSheet", (app, html:JQuery<HTMLElement>, journalSheet:JournalSheet, render) => {
        //   let test = false;
        //   let journalEntry = <JournalEntry>getGame().journal?.getName(journalSheet.title);
        //   let seneNotes = <Note>journalEntry.sceneNote;
        //   return test;
        // })
        // Register custom sheets (if any)
    }
};
export const setupHooks = () => {
    if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableArmsReach')) {
        if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableJournalsIntegration')) {
            getGame().settings.set('core', 'notesDisplayToggle', true);
        }
    }
};
export const initHooks = () => {
    warn('Init Hooks processing');
    if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableArmsReach')) {
        if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableDoorsIntegration')) {
            DoorsReach.init();
            //@ts-ignore
            libWrapper.register(ARMS_REACH_MODULE_NAME, 'DoorControl.prototype._onMouseDown', DoorControlPrototypeOnMouseDownHandler, 'MIXED');
            //@ts-ignore
            libWrapper.register(ARMS_REACH_MODULE_NAME, 'DoorControl.prototype._onRightDown', DoorControlPrototypeOnRightDownHandler, 'MIXED');
        }
        if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableJournalsIntegration')) {
            //@ts-ignore
            // libWrapper.register(ARMS_REACH_MODULE_NAME, 'Note.prototype._onClickLeft', NotePrototypeOnClickLeftHandler, 'MIXED');
            //@ts-ignore
            libWrapper.register(ARMS_REACH_MODULE_NAME, 'Note.prototype._onClickLeft2', NotePrototypeOnClickLeftHandler, 'MIXED');
        }
        if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableTokensIntegration')) {
            // //@ts-ignore
            // libWrapper.register(
            //   ARMS_REACH_MODULE_NAME,
            //   'Token.prototype._onClickLeft',
            //   TokenPrototypeOnClickLeftHandler,
            //   'MIXED'
            // );
            //@ts-ignore
            libWrapper.register(ARMS_REACH_MODULE_NAME, 'Token.prototype._onClickLeft2', TokenPrototypeOnClickLeftHandler, 'MIXED');
        }
    }
};
export const TokenPrototypeOnClickLeftHandler = async function (wrapped, ...args) {
    if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableTokensIntegration')) {
        const [target] = args;
        const token = this;
        const prefixToCheck = getGame().settings.get(ARMS_REACH_MODULE_NAME, 'tokensIntegrationByPrefix');
        const isTokenNameChecked = token.name?.startsWith(prefixToCheck);
        // lootsheetnpc5e/template/npc-sheet.html
        const isNPCLootSheet = token.document.actor?.sheet?.template.includes('lootsheetnpc5e/template/npc-sheet.html');
        const enableNPCLootSheet = (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'tokensIntegrationWithLootSheet'));
        if (isTokenNameChecked || (isNPCLootSheet && enableNPCLootSheet)) {
            const nameSourceToken = getGame().settings.get(ARMS_REACH_MODULE_NAME, 'tokensIntegrationExplicitName');
            let tokenSelected;
            if (nameSourceToken) {
                tokenSelected = (getCanvas().tokens?.placeables.find((tokenTmp) => tokenTmp.name === nameSourceToken));
            }
            else {
                // if (<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'forceReSelection')) {
                tokenSelected = getFirstPlayerTokenSelected();
                if (!tokenSelected) {
                    tokenSelected = getFirstPlayerToken();
                }
                // }
            }
            const isInReach = await TokensReach.globalInteractionDistance(tokenSelected, token);
            reselectTokenAfterInteraction(tokenSelected);
            if (!isInReach) {
                return;
            }
        }
    }
    return wrapped(...args);
};
export const NotePrototypeOnClickLeftHandler = async function (wrapped, ...args) {
    if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableJournalsIntegration')) {
        const [target] = args;
        const note = this;
        let tokenSelected;
        // if (<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'forceReSelection')) {
        tokenSelected = getFirstPlayerTokenSelected();
        if (!tokenSelected) {
            tokenSelected = getFirstPlayerToken();
        }
        // }
        const isInReach = await JournalsReach.globalInteractionDistance(tokenSelected, note);
        reselectTokenAfterInteraction(tokenSelected);
        if (!isInReach) {
            return;
        }
    }
    return wrapped(...args);
};
export const DoorControlPrototypeOnMouseDownHandler = async function (wrapped, ...args) {
    if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableDoorsIntegration')) {
        const doorControl = this;
        let tokenSelected;
        // if (<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'forceReSelection')) {
        tokenSelected = getFirstPlayerTokenSelected();
        if (!tokenSelected) {
            tokenSelected = getFirstPlayerToken();
        }
        // }
        const isInReach = await DoorsReach.globalInteractionDistance(doorControl, false);
        reselectTokenAfterInteraction(tokenSelected);
        if (!isInReach) {
            // Bug fix not sure why i need to do this
            if (doorControl.wall.data.ds == CONST.WALL_DOOR_STATES.LOCKED) {
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
    //if(<boolean>getGame().settings.get(MODULE_NAME, "enableAmbientDoor")) {
    //  AmbientDoors.onDoorMouseDownCheck(doorControl);
    //}
    // Call original method
    //return originalMethod.apply(this,arguments);
    return wrapped(...args);
};
export const DoorControlPrototypeOnRightDownHandler = async function (wrapped, ...args) {
    if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'enableDoorsIntegration')) {
        const doorControl = this; //evt.currentTarget;
        let character = getFirstPlayerTokenSelected();
        let isOwned = false;
        if (!character) {
            character = getFirstPlayerToken();
            if (character) {
                isOwned = true;
            }
        }
        if (!character) {
            if (getGame().user?.isGM) {
                return wrapped(...args);
            }
            else {
                return;
            }
        }
        const isInReach = await DoorsReach.globalInteractionDistance(doorControl, true);
        reselectTokenAfterInteraction(character);
        if (!isInReach) {
            return;
        }
    }
    return wrapped(...args);
};
