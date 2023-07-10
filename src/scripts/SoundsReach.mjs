import { checkElevation, getCharacterName, i18n, i18nFormat, warn } from "./lib/lib.mjs";
import {
  computeDistanceBetweenCoordinates,
  getFirstPlayerToken,
  getPlaceableCenter,
  interactionFailNotification,
} from "./ArmsReachHelper.mjs";
import CONSTANTS from "./constants.mjs";

export const SoundsReach = {
  globalInteractionDistance: function (selectedToken, sound, maxDistance = 0, useGrid = false, userId = undefined) {
    // Check if no token is selected and you are the GM avoid the distance calculation
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
      (!game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnSounds") && game.user?.isGM)
    ) {
      return true;
    }
    if (canvas.tokens?.controlled?.length > 1) {
      if (game.user?.isGM) {
        return true;
      }
      interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
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
    let globalInteraction = game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistance");
    if (globalInteraction <= 0) {
      globalInteraction = game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionMeasurement");
    }
    // Global interaction distance control. Replaces prototype function of Stairways. Danger...
    if (globalInteraction > 0) {
      // Check distance
      //let character:Token = getFirstPlayerToken();
      if (
        !game.user?.isGM ||
        (game.user?.isGM &&
          // && game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistanceForGM')
          game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnSounds"))
      ) {
        if (!selectedToken) {
          interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.noCharacterSelectedForSound`));
          return false;
        } else {
          let isNotNearEnough = false;
          if (game.settings.get(CONSTANTS.MODULE_NAME, "autoCheckElevationByDefault")) {
            const res = checkElevation(selectedToken, sound);
            if (!res) {
              warn(`The token '${selectedToken.name}' is not on the elevation range of this placeable object`);
              return false;
            }
          }
          // OLD SETTING
          if (game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistance") > 0 || useGrid) {
            const maxDist =
              maxDistance && maxDistance > 0
                ? maxDistance
                : game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistance");
            // const dist = computeDistanceBetweenCoordinatesOLD(SoundsReach.getSoundsCenter(sound), character);
            const dist = computeDistanceBetweenCoordinates(
              SoundsReach.getSoundsCenter(sound),
              selectedToken,
              AmbientSoundDocument.documentName,
              true
            );
            isNotNearEnough = dist > maxDist;
          } else {
            const maxDist =
              maxDistance && maxDistance > 0
                ? maxDistance
                : game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionMeasurement");
            const dist = computeDistanceBetweenCoordinates(
              SoundsReach.getSoundsCenter(sound),
              selectedToken,
              AmbientSoundDocument.documentName,
              false
            );
            isNotNearEnough = dist > maxDist;
          }
          if (isNotNearEnough) {
            const tokenName = getCharacterName(selectedToken);
            if (tokenName) {
              interactionFailNotification(
                i18nFormat(`${CONSTANTS.MODULE_NAME}.soundsNotInReachFor`, { tokenName: tokenName })
              );
            } else {
              interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.soundsNotInReach`));
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

  getSoundsCenter: function (sound) {
    // const soundCenter = { x: sound.x, y: sound.y };
    // return soundCenter;
    return getPlaceableCenter(sound);
  },
};
