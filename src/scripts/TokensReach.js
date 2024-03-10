import { checkElevation, getCharacterName } from "./lib/lib.js";
import {
    computeDistanceBetweenCoordinates,
    getFirstPlayerToken,
    getPlaceableCenter,
    interactionFailNotification,
} from "./ArmsReachHelper.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";

export const TokensReach = {
    globalInteractionDistance: function (selectedToken, token, maxDistance = 0, useGrid = false, userId = undefined) {
        // Check if no token is selected and you are the GM avoid the distance calculation
        if (
            (!canvas.tokens?.controlled && game.user?.isGM) ||
            (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
            (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnTokens") && game.user?.isGM)
        ) {
            return true;
        }
        if (canvas.tokens?.controlled?.length > 1) {
            if (game.user?.isGM) {
                return true;
            }
            interactionFailNotification(i18n(`${CONSTANTS.MODULE_ID}.warningNoSelectMoreThanOneToken`));
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
        // OLD SETTING
        let globalInteraction = game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistance");
        if (globalInteraction <= 0) {
            globalInteraction = game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionMeasurement");
        }
        // Global interaction distance control. Replaces prototype function of Stairways. Danger...
        if (globalInteraction > 0) {
            // Check distance
            //let character:Token = getFirstPlayerToken();
            if (
                !game.user?.isGM ||
                (game.user?.isGM &&
                    // && game.settings.get(CONSTANTS.MODULE_ID, 'globalInteractionDistanceForGM')
                    game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnTokens"))
            ) {
                if (!selectedToken) {
                    interactionFailNotification(i18n(`${CONSTANTS.MODULE_ID}.noCharacterSelectedForJournal`));
                    return false;
                } else {
                    let isNotNearEnough = false;
                    if (game.settings.get(CONSTANTS.MODULE_ID, "autoCheckElevationByDefault")) {
                        const res = checkElevation(selectedToken, token);
                        if (!res) {
                            Logger.warn(
                                `The token '${selectedToken.name}' is not on the elevation range of this placeable object`,
                            );
                            return false;
                        }
                    }
                    // OLD SETTING
                    if (game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistance") > 0 || useGrid) {
                        const maxDist =
                            maxDistance && maxDistance > 0
                                ? maxDistance
                                : game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistance");
                        // const dist = computeDistanceBetweenCoordinatesOLD(TokensReach.getTokensCenter(token), character);
                        const dist = computeDistanceBetweenCoordinates(
                            TokensReach.getTokensCenter(token),
                            selectedToken,
                            TokenDocument.documentName,
                            true,
                        );
                        isNotNearEnough = dist > maxDist;
                    } else {
                        const maxDist =
                            maxDistance && maxDistance > 0
                                ? maxDistance
                                : game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionMeasurement");
                        const dist = computeDistanceBetweenCoordinates(
                            TokensReach.getTokensCenter(token),
                            selectedToken,
                            TokenDocument.documentName,
                            false,
                        );
                        isNotNearEnough = dist > maxDist;
                    }
                    if (isNotNearEnough) {
                        const tokenName = getCharacterName(selectedToken);
                        if (tokenName) {
                            interactionFailNotification(
                                Logger.i18nFormat(`${CONSTANTS.MODULE_ID}.tokensNotInReachFor`, {
                                    tokenName: tokenName,
                                }),
                            );
                        } else {
                            interactionFailNotification(i18n(`${CONSTANTS.MODULE_ID}.tokensNotInReach`));
                        }
                        return false;
                    } else {
                        return true;
                    }
                }
            } else if (game.user?.isGM) {
                // DO NOTHING
                return true;
            }
        }

        return false;
    },

    getTokensCenter: function (token) {
        // const tokenCenter = { x: token.x + token.width / 2, y: token.y + token.height / 2 };
        // return tokenCenter;
        return getPlaceableCenter(token);
    },
};
