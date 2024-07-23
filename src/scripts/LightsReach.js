import { checkElevation, getCharacterName, isRealNumber } from "./lib/lib.js";
import { getFirstPlayerToken, interactionFailNotification } from "./ArmsReachHelper.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import DistanceTools from "./lib/DistanceTools.js";

export const LightsReach = {
    globalInteractionDistance: function (
        selectedToken,
        targetPlaceableObject,
        maxDistance = 0,
        useGrid = false,
        userId = undefined,
    ) {
        // Check if no token is selected and you are the GM avoid the distance calculation
        if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
            (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnLights") && game.user?.isGM)
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
        // let isOwned = false;
        if (!selectedToken) {
            selectedToken = getFirstPlayerToken();
            // if (character) {
            // 	isOwned = true;
            // }
        }
        if (!selectedToken) {
            if (game.user?.isGM) {
                return true;
            } else {
                return false;
            }
        }

        // Sets the global maximum interaction distance
        let globalInteraction =
            maxDistance && isRealNumber(maxDistance) && maxDistance > 0
                ? maxDistance
                : game.settings.get(CONSTANTS.MODULE_ID, "lightInteractionMeasurement");
        let range =
            foundry.utils.getProperty(targetPlaceableObject, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.RANGE}`) ||
            0;
        globalInteraction = range > 0 ? range : globalInteraction;
        // Global interaction distance control. Replaces prototype function of Stairways. Danger...
        // if (globalInteraction > 0) {
        // Check distance
        //let character:Token = getFirstPlayerToken();
        if (
            !game.user?.isGM ||
            (game.user?.isGM &&
                // && game.settings.get(CONSTANTS.MODULE_ID, 'globalInteractionDistanceForGM')
                game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnLights"))
        ) {
            if (!selectedToken) {
                interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.noCharacterSelectedForLight`));
                return false;
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
                            Logger.i18nFormat(`${CONSTANTS.MODULE_ID}.lightsNotInReachFor`, {
                                tokenName: tokenName,
                            }),
                        );
                    } else {
                        interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.lightsNotInReach`));
                    }
                }
                return canInteractB;
            }
        } else if (game.user?.isGM) {
            // DO NOTHING
            return true;
        }
        return false;
        // } else {
        //     return false;
        // }
    },
};
