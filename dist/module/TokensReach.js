import { i18n, i18nFormat } from "../foundryvtt-arms-reach.js";
import { computeDistanceBetweenCoordinates, computeDistanceBetweenCoordinatesOLD, getCharacterName, getFirstPlayerToken, iteractionFailNotification, } from "./ArmsReachhelper.js";
import { ARMS_REACH_MODULE_NAME, getGame } from "./settings.js";
export const TokensReach = {
    globalInteractionDistance: function (character, token) {
        // let character:Token = <Token>getFirstPlayerTokenSelected();
        let isOwned = false;
        if (!character) {
            character = getFirstPlayerToken();
            if (character) {
                isOwned = true;
            }
        }
        if (!character) {
            if (getGame().user?.isGM) {
                return true;
            }
            else {
                return false;
            }
        }
        // Sets the global maximum interaction distance
        // OLD SETTING
        let globalInteraction = getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
        if (globalInteraction <= 0) {
            globalInteraction = getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
        }
        // Global interaction distance control. Replaces prototype function of Stairways. Danger...
        if (globalInteraction > 0) {
            // Check distance
            //let character:Token = getFirstPlayerToken();
            if (!getGame().user?.isGM ||
                (getGame().user?.isGM &&
                    getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistanceForGM'))) {
                if (!character) {
                    iteractionFailNotification(i18n(ARMS_REACH_MODULE_NAME + '.noCharacterSelectedForJournal'));
                    return false;
                }
                else {
                    let isNotNearEnough = false;
                    // OLD SETTING
                    if (getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance') > 0) {
                        const dist = computeDistanceBetweenCoordinatesOLD(TokensReach.getTokensCenter(token), character);
                        isNotNearEnough =
                            dist > getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
                    }
                    else {
                        const dist = computeDistanceBetweenCoordinates(TokensReach.getTokensCenter(token), character);
                        isNotNearEnough =
                            dist > getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
                    }
                    if (isNotNearEnough) {
                        const tokenName = getCharacterName(character);
                        if (tokenName) {
                            iteractionFailNotification(i18nFormat(ARMS_REACH_MODULE_NAME + '.tokensNotInReachFor', { tokenName: tokenName }));
                        }
                        else {
                            iteractionFailNotification(i18n(ARMS_REACH_MODULE_NAME + '.tokensNotInReach'));
                        }
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
            else if (getGame().user?.isGM) {
                // DO NOTHING
                return true;
            }
        }
        return false;
    },
    getTokensCenter: function (token) {
        const tokenCenter = { x: token.x + token.width / 2, y: token.y + token.height / 2 };
        return tokenCenter;
    },
};
