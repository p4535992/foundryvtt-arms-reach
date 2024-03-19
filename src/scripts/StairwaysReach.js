import { checkElevation, getCharacterName } from "./lib/lib.js";
import { getFirstPlayerToken, interactionFailNotification } from "./ArmsReachHelper.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";
import DistanceTools from "./lib/DistanceTools.js";

export const StairwaysReach = {
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
        // Sets the global maximum interaction distance
        let globalInteraction =
            maxDistance > 0 ? maxDistance : game.settings.get(CONSTANTS.MODULE_ID, "stairwayInteractionMeasurement");

        // Global interaction distance control. Replaces prototype function of Stairways. Danger...
        if (globalInteraction > 0) {
            // Check distance
            //let character:Token = getFirstPlayerToken();
            if (
                !game.user?.isGM ||
                (game.user?.isGM &&
                    // && game.settings.get(CONSTANTS.MODULE_ID, 'globalInteractionDistanceForGM')
                    game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnStairways"))
            ) {
                if (!selectedToken) {
                    interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.noCharacterSelectedForStairway`));
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
                        },
                    );
                    if (!canInteractB) {
                        const tokenName = getCharacterName(selectedToken);
                        if (tokenName) {
                            interactionFailNotification(
                                Logger.i18nFormat(`${CONSTANTS.MODULE_ID}.stairwaysNotInReachFor`, {
                                    tokenName: tokenName,
                                }),
                            );
                        } else {
                            interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.stairwaysNotInReach`));
                        }
                    }
                    return canInteractB;
                    // END MOD ABD 4535992
                }
            } else if (game.user?.isGM) {
                // DO NOTHING
                return true;
            }
        }

        return false;
    },
};

export class Data {
    /// string: scene id of the stairway used (source scene of teleport)
    sourceSceneId;
    /// SourceData: stairway data of the source stairway (WARNING: this data may change in the future)
    sourceData;
    /// string[]: id's of all selected token (tokens beeing teleported)
    selectedTokenId;
    /// string: target scene id of the stairway or `null` (target scene of the teleport of `null` if current scene)
    targetSceneId;
    /// TargetData: stairway data of the target stairway (WARNING: this data may change in the future)
    targetData;
    /// string: id of the user using the stairway (current user)
    userId;
}

/// WARNING: internal data - do not use if possible
export class TargetData {
    /// Scene: target (partner) scene id or `null` if current scene
    scene;
    /// string: stairway name (id for connection)
    name;
    /// string: stairway label or `null` for none
    label;
    /// string: stairway icon (image path) or `null` for default
    icon;
    /// boolean: disabled (locked on `true`)
    disabled;
    /// boolean: hide from players (hidden on `true`)
    hidden;
    /// boolean: animate movement within scene (animate on `true`)
    animate;
    /// number: x position of target stairway
    x;
    /// number: y position of target stairway
    y;
}

/// WARNING: internal data - do not use if possible
export class SourceData {
    /// Scene: target (partner) scene id or `null` if current scene
    scene;
    /// string: stairway name (id for connection)
    name;
    /// string: stairway label or `null` for none
    label;
    /// string: stairway icon (image path) or `null` for default
    icon;
    /// boolean: disabled (locked on `true`)
    disabled;
    /// boolean: hide from players (hidden on `true`)
    hidden;
    /// boolean: animate movement within scene (animate on `true`)
    animate;
    /// number: x position of target stairway
    x;
    /// number: y position of target stairway
    y;
}
