import { checkElevation, getCharacterName } from "./lib/lib.js";
import {
    computeDistanceBetweenCoordinates,
    getFirstPlayerToken,
    getPlaceableCenter,
    interactionFailNotification,
} from "./ArmsReachHelper.js";
import CONSTANTS from "./constants.js";
import Logger from "./lib/Logger.js";

export const NotesReach = {
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
            (!game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnNotes") && game.user?.isGM)
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
        let globalInteraction = game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionMeasurement");

        // Global interaction distance control. Replaces prototype function of Stairways. Danger...
        if (globalInteraction > 0) {
            // Check distance
            //let character:Token = getFirstPlayerToken();
            if (
                !game.user?.isGM ||
                (game.user?.isGM &&
                    // && game.settings.get(CONSTANTS.MODULE_ID, 'globalInteractionDistanceForGM')
                    game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionDistanceForGMOnNotes"))
            ) {
                if (!selectedToken) {
                    interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.noCharacterSelectedForNote`));
                    return false;
                } else {
                    let isNotNearEnough = false;
                    if (game.settings.get(CONSTANTS.MODULE_ID, "autoCheckElevationByDefault")) {
                        const res = checkElevation(selectedToken, targetPlaceableObject);
                        if (!res) {
                            Logger.warn(
                                `The token '${selectedToken.name}' is not on the elevation range of this placeable object`,
                            );
                            return false;
                        }
                    }

                    const maxDist =
                        maxDistance && maxDistance > 0
                            ? maxDistance
                            : game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionMeasurement");
                    const dist = computeDistanceBetweenCoordinates(
                        NotesReach.getNotesCenter(targetPlaceableObject),
                        selectedToken,
                        NoteDocument.documentName,
                        false,
                    );
                    isNotNearEnough = dist > maxDist;

                    if (isNotNearEnough) {
                        const tokenName = getCharacterName(selectedToken);
                        if (tokenName) {
                            interactionFailNotification(
                                Logger.i18nFormat(`${CONSTANTS.MODULE_ID}.notesNotInReachFor`, {
                                    tokenName: tokenName,
                                }),
                            );
                        } else {
                            interactionFailNotification(Logger.i18n(`${CONSTANTS.MODULE_ID}.notesNotInReach`));
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

    getNotesCenter: function (note) {
        // const noteCenter = {
        //   x: note.x - canvas.dimensions?.size / 2,
        //   y: note.y - canvas.dimensions?.size / 2,
        //   w: note.width,
        //   h: note.height,
        // };
        // return noteCenter;
        const noteCenter = getPlaceableCenter(note);
        // TODO i don't understand this w = 0, h = 0 seem to make the distnace right ?
        noteCenter.w = 0;
        noteCenter.h = 0;
        return noteCenter;
    },
};
