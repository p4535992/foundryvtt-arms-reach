import { checkElevation, getCharacterName, isRealNumber } from "./lib/lib.js";

import { getFirstPlayerToken, isFocusOnCanvas, interactionFailNotification } from "./ArmsReachHelper.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import DistanceTools from "./lib/DistanceTools.js";

export const DoorsReach = {
    globalInteractionDistance: function (
        selectedToken,
        targetPlaceableObject,
        isRightHanler = false,
        maxDistance = 0,
        useGrid = false,
    ) {
        // Check if no token is selected and you are the GM avoid the distance calculation
        if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
            (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDoors") && game.user?.isGM)
        ) {
            return true;
        }
        if (canvas.tokens?.controlled?.length > 1) {
            if (game.user?.isGM) {
                return true;
            }
            interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.warningNoSelectMoreThanOneToken`));
            return false;
        }

        if (!selectedToken) {
            selectedToken = getFirstPlayerToken();
        }
        if (!selectedToken) {
            if (game.user?.isGM) {
                return true;
            } else {
                return false;
            }
        }

        let globalInteraction =
            maxDistance && isRealNumber(maxDistance) && maxDistance > 0
                ? maxDistance
                : game.settings.get(CONSTANTS.MODULE_ID, "doorInteractionMeasurement");
        let range = getProperty(targetPlaceableObject, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.RANGE}`) || 0;
        globalInteraction = range > 0 ? range : globalInteraction;
        // Sets the global maximum interaction distance
        // Global interaction distance control. Replaces prototype function of DoorControl. Danger...
        // if (globalInteraction > 0) {
        // Check distance
        if (
            !game.user?.isGM ||
            (game.user?.isGM && game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnDoors"))
        ) {
            if (!selectedToken) {
                interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.noCharacterSelected`));
                return false;
            } else {
                if (game.user?.isGM && isRightHanler) {
                    return true;
                } else {
                    if (game.settings.get(CONSTANTS.MODULE_ID, "autoCheckElevationByDefault")) {
                        const res = checkElevation(selectedToken, targetPlaceableObject);
                        if (!res) {
                            Logger.warn(
                                `The token '${selectedToken.name}' is not on the elevation range of this placeable object`,
                            );
                            return false;
                        }
                    }
                    const canInteractB = DistanceTools.canInteract(
                        targetPlaceableObject,
                        selectedToken,
                        globalInteraction,
                        {
                            closestPoint: true,
                            includez: true,
                            useGrid: useGrid,
                        },
                    );
                    if (!canInteractB) {
                        const tokenName = getCharacterName(selectedToken);
                        if (tokenName) {
                            interactionFailNotification(
                                Logger.i18nFormat(`${CONSTANTS.MODULE_ID}.doorNotInReachFor`, {
                                    tokenName: tokenName,
                                }),
                            );
                        } else {
                            interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.doorNotInReach`));
                        }
                    }
                    return canInteractB;
                }
                // END MOD ABD 4535992
            }
        } else if (game.user?.isGM) {
            return true;
        }
        return false;
        // } else {
        //     return false;
        // }
    },

    ifStuckInteract: function (key, offsetx, offsety) {
        if (!isFocusOnCanvas()) {
            return;
        }
        const character = getFirstPlayerToken();
        if (!character) {
            return;
        }

        if (
            (Date.now() - ArmsReachVariables.lastData[key]) / 1000 >
            1
            // game.settings.get(CONSTANTS.MODULE_ID, "hotkeyDoorInteractionDelay")
        ) {
            ArmsReachVariables.lastData.x = character.x;
            ArmsReachVariables.lastData.y = character.y;
            ArmsReachVariables.lastData[key] = Date.now();
            return;
        }

        // See if character is stuck
        if (character.x === ArmsReachVariables.lastData.x && character.y === ArmsReachVariables.lastData.y) {
            DoorsReach.interactWithNearestDoor(character, offsetx, offsety);
        }
    },

    /**
     * Interact with door
     */
    interactWithNearestDoor: function (token) {
        if (!token) {
            token = getFirstPlayerToken();
        }
        if (!token) {
            return null;
        }
        // Max distance definition
        // const gridSize = canvas.dimensions?.size;

        // Shortest dist
        let closestDoor = null; // is a doorcontrol
        for (let i = 0; i < game.scenes?.current?.walls.contents.length; i++) {
            const wall = game.scenes?.current?.walls.contents[i];

            if (wall.door > 0) {
                const door = canvas.controls?.doors?.children.find((pixiDisplayObject) => {
                    return pixiDisplayObject.wall.id === wall.id;
                });
                // if (!door.visible) {
                //   continue;
                // }
                let globalInteraction =
                    maxDistance && isRealNumber(maxDistance) && maxDistance > 0
                        ? maxDistance
                        : game.settings.get(CONSTANTS.MODULE_ID, "doorInteractionMeasurement");
                let range = getProperty(door, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.RANGE}`) || 0;
                globalInteraction = range > 0 ? range : globalInteraction;

                if (game.settings.get(CONSTANTS.MODULE_ID, "autoCheckElevationByDefault")) {
                    const res = checkElevation(token, wall);
                    if (!res) {
                        Logger.warn(
                            `The token '${getCharacterName(token)}' is not on the elevation range of this placeable object`,
                        );
                        return false;
                    }
                }

                const canInteractB = DistanceTools.canInteract(door, token, globalInteraction, {
                    closestPoint: true,
                    includez: true,
                    useGrid: false,
                });
                if (canInteractB) {
                    closestDoor = door;
                    break;
                }
            }
        }

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

            closestDoor._onMouseDown(fakeEvent); // TODO NOT WORK ANYMORE
        } else {
            const tokenName = getCharacterName(token);

            if (tokenName) {
                interactionFailNotification(
                    Logger.i18nFormat(`${CONSTANTS.MODULE_ID}.doorNotFoundInReachFor`, { tokenName: tokenName }),
                );
            } else {
                interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.doorNotFoundInReach`));
            }
            return;
        }
        return;
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
        pixiDisplayObject: 0.0,
        y: 0.0,
        up: 0,
        down: 0,
        left: 0,
        right: 0,
    };
}
