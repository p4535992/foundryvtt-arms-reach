import { i18n } from "../foundryvtt-arms-reach.js";
import { getFirstPlayerToken, getFirstPlayerTokenSelected, getTokenByTokenID, iteractionFailNotification } from "./ArmsReachhelper.js";
import { ARMS_REACH_MODULE_NAME, getGame } from "./settings.js";
export const JournalsReach = {
    globalInteractionDistance: function (journal, selectedTokenIds, userId) {
        let isOwned = false;
        let character = getFirstPlayerTokenSelected();
        if (selectedTokenIds) {
            if (selectedTokenIds.length > 1) {
                //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
                return false;
            }
            else {
                character = getTokenByTokenID(selectedTokenIds[0]);
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
        // OLD SETTING
        let globalInteraction = getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
        if (globalInteraction <= 0) {
            globalInteraction = getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionMeasurement");
        }
        // Global interaction distance control. Replaces prototype function of Stairways. Danger...
        if (globalInteraction > 0) {
            // Check distance
            //let character:Token = getFirstPlayerToken();
            if (!getGame().user?.isGM || (getGame().user?.isGM && getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistanceForGM"))) {
                if (!character) {
                    iteractionFailNotification(i18n("foundryvtt-arms-reach.noCharacterSelectedForStairway"));
                    return false;
                }
                else {
                    let isNotNearEnough = false;
                    // TODO
                    // // OLD SETTING
                    // if(<number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance") > 0){
                    //   let dist = computeDistanceBetweenCoordinatesOLD(StairwaysReach.getStairwaysCenter(journal), character);
                    //   isNotNearEnough = dist > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
                    // }else{
                    //   let dist = computeDistanceBetweenCoordinates(StairwaysReach.getStairwaysCenter(journal), character);
                    //   isNotNearEnough = dist > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionMeasurement");
                    // }
                    // if (isNotNearEnough) {
                    //   var tokenName = getCharacterName(character);
                    //   if (tokenName){
                    //     iteractionFailNotification(i18nFormat("foundryvtt-arms-reach.journalsNotInReachFor",{tokenName : tokenName}));
                    //   }
                    //   else {
                    //     iteractionFailNotification(i18n("foundryvtt-arms-reach.journalsNotInReach"));
                    //   }
                    //   return false;
                    // }else{
                    //   return true;
                    // }
                    // END MOD ABD 4535992
                }
            }
            else if (getGame().user?.isGM) {
                // DO NOTHING
            }
        }
        return false;
    },
    getJournaalCenter: function (token) {
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
