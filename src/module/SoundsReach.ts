import { i18n, i18nFormat } from './lib/lib';
import {
  computeDistanceBetweenCoordinates,
  getCharacterName,
  getFirstPlayerToken,
  getPlaceableCenter,
  iteractionFailNotification,
} from './ArmsReachHelper';
import { ARMS_REACH_MODULE_NAME } from './settings';
import { canvas, game } from './settings';

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
      (<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM)
    ) {
      return true;
    }
    if (<number>canvas.tokens?.controlled?.length > 1) {
      iteractionFailNotification(i18n('foundryvtt-arms-reach.warningNoSelectMoreThanOneToken'));
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
    let globalInteraction = <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
    if (globalInteraction <= 0) {
      globalInteraction = <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
    }
    // Global interaction distance control. Replaces prototype function of Stairways. Danger...
    if (globalInteraction > 0) {
      // Check distance
      //let character:Token = getFirstPlayerToken();
      if (
        !game.user?.isGM ||
        (game.user?.isGM && <boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistanceForGM'))
      ) {
        if (!character) {
          iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.noCharacterSelectedForSound`));
          return false;
        } else {
          let isNotNearEnough = false;
          // OLD SETTING
          if (<number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance') > 0 || useGrid) {
            const maxDist =
              maxDistance && maxDistance > 0
                ? maxDistance
                : <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
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
                : <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
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
              iteractionFailNotification(
                i18nFormat(`${ARMS_REACH_MODULE_NAME}.soundsNotInReachFor`, { tokenName: tokenName }),
              );
            } else {
              iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.soundsNotInReach`));
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
