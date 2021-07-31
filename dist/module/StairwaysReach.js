import { i18n, i18nFormat } from "../foundryvtt-arms-reach.js";
import { computeDistanceBetweenCoordinates, getCharacterName, getFirstPlayerToken, getFirstPlayerTokenSelected, iteractionFailNotification } from "./ArmsReach.js";
import { getCanvas, ARMS_REACH_MODULE_NAME, getGame } from "./settings.js";
export const StairwaysReach = {
    globalInteractionDistance: function (stairway, selectedTokenIds, userId) {
        let isOwned = false;
        let character = getFirstPlayerTokenSelected();
        if (selectedTokenIds) {
            if (selectedTokenIds.length > 1) {
                //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
                return false;
            }
            else {
                character = StairwaysReach.getTokenByTokenID(selectedTokenIds[0]);
            }
        }
        else {
            if (!character) {
                character = getFirstPlayerToken();
                if (character) {
                    isOwned = true;
                }
            }
        }
        // Sets the global maximum interaction distance
        // Global interaction distance control. Replaces prototype function of DoorControl. Danger...
        if (getGame().settings?.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance") > 0) {
            // Check distance
            //let character:Token = getFirstPlayerToken();
            if (!getGame().user?.isGM || (getGame().user?.isGM && getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistanceForGM"))) {
                if (!character) {
                    iteractionFailNotification(i18n("foundryvtt-arms-reach.noCharacterSelected"));
                    return false;
                }
                else {
                    //let dist = getManhattanBetween(StairwaysReach.getStairwaysCenter(stairway), getTokenCenter(character));
                    let dist = computeDistanceBetweenCoordinates(StairwaysReach.getStairwaysCenter(stairway), character);
                    let gridSize = getCanvas().dimensions?.size;
                    let isNotNearEnough = (dist / gridSize) > getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
                    if (isNotNearEnough) {
                        var tokenName = getCharacterName(character);
                        if (tokenName) {
                            iteractionFailNotification(i18nFormat("foundryvtt-arms-reach.stairwaysNotInReachFor", { tokenName: tokenName }));
                        }
                        else {
                            iteractionFailNotification(i18n("foundryvtt-arms-reach.stairwaysNotInReach"));
                        }
                        return false;
                    }
                    else {
                        return true;
                    }
                    // END MOD ABD 4535992
                }
            }
            else if (getGame().user?.isGM) {
                // DO NOTHING
            }
        }
        return false;
    },
    getTokenByTokenID: function (id) {
        // return await getGame().scenes.active.data.tokens.find( x => {return x.id === id});
        return getCanvas().tokens?.placeables.find(x => { return x.id === id; });
    },
    getTokenByTokenName: function (name) {
        // return await getGame().scenes.active.data.tokens.find( x => {return x._name === name});
        return getCanvas().tokens?.placeables.find(x => { return x.name == name; });
        // return getCanvas().tokens.placeables.find( x => { return x.id == getGame().user.id});
    },
    getStairwaysCenter: function (token) {
        let tokenCenter = { x: token.x, y: token.y };
        return tokenCenter;
    }
};
export class Data {
}
/// WARNING: internal data - do not use if possible
export class TargetData {
}
/// WARNING: internal data - do not use if possible
export class SourceData {
}
