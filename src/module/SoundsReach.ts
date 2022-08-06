import { getCharacterName, i18n, i18nFormat } from './lib/lib';
import {
  computeDistanceBetweenCoordinates,
  getFirstPlayerToken,
  getPlaceableCenter,
  interactionFailNotification,
} from './ArmsReachHelper';
import CONSTANTS from './constants';

export const SoundsReach = {
  globalInteractionDistance: function (
    character: Token,
    sound: AmbientSound,
    maxDistance?: number,
    useGrid?: boolean,
    userId?: String,
  ): boolean {
    // Check if no token is selected and you are the GM avoid the distance calculation
    if (
      (!canvas.tokens?.controlled && game.user?.isGM) ||
      (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
      (!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistanceForGMOnSounds')) &&
        game.user?.isGM)
    ) {
      return true;
    }
    if (<number>canvas.tokens?.controlled?.length > 1) {
      if (game.user?.isGM) {
        return true;
      }
      interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
      return false;
    }
    let isOwned = false;
    if (!character) {
      character = <Token>getFirstPlayerToken();
      if (character) {
        isOwned = true;
      }
    }
    if (!character) {
      if (game.user?.isGM) {
        return true;
      } else {
        return false;
      }
    }

    // Sets the global maximum interaction distance
    // OLD SETTING
    let globalInteraction = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistance');
    if (globalInteraction <= 0) {
      globalInteraction = <number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionMeasurement');
    }
    // Global interaction distance control. Replaces prototype function of Stairways. Danger...
    if (globalInteraction > 0) {
      // Check distance
      //let character:Token = getFirstPlayerToken();
      if (
        !game.user?.isGM ||
        (game.user?.isGM &&
          // && <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistanceForGM')
          <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistanceForGMOnSounds'))
      ) {
        if (!character) {
          interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.noCharacterSelectedForSound`));
          return false;
        } else {
          let isNotNearEnough = false;
          // OLD SETTING
          if (<number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistance') > 0 || useGrid) {
            const maxDist =
              maxDistance && maxDistance > 0
                ? maxDistance
                : <number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistance');
            // const dist = computeDistanceBetweenCoordinatesOLD(SoundsReach.getSoundsCenter(sound), character);
            const dist = computeDistanceBetweenCoordinates(
              SoundsReach.getSoundsCenter(sound),
              character,
              AmbientSoundDocument.documentName,
              true,
            );
            isNotNearEnough = dist > maxDist;
          } else {
            const maxDist =
              maxDistance && maxDistance > 0
                ? maxDistance
                : <number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionMeasurement');
            const dist = computeDistanceBetweenCoordinates(
              SoundsReach.getSoundsCenter(sound),
              character,
              AmbientSoundDocument.documentName,
              false,
            );
            isNotNearEnough = dist > maxDist;
          }
          if (isNotNearEnough) {
            const tokenName = getCharacterName(character);
            if (tokenName) {
              interactionFailNotification(
                i18nFormat(`${CONSTANTS.MODULE_NAME}.soundsNotInReachFor`, { tokenName: tokenName }),
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

  getSoundsCenter: function (sound: AmbientSound) {
    // const soundCenter = { x: sound.x, y: sound.y };
    // return soundCenter;
    return getPlaceableCenter(sound);
  },
};
