import { getCharacterName, i18n, i18nFormat } from './lib/lib';
import {
  computeDistanceBetweenCoordinates,
  getFirstPlayerToken,
  getPlaceableCenter,
  iteractionFailNotification,
} from './ArmsReachHelper';
import { canvas, game } from './settings';
import CONSTANTS from './constants';

export const DrawingsReach = {
  globalInteractionDistance: function (
    character: Token,
    drawing: Drawing,
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
      iteractionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
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
        (game.user?.isGM && <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistanceForGM'))
      ) {
        if (!character) {
          iteractionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.noCharacterSelectedForDrawing`));
          return false;
        } else {
          let isNotNearEnough = false;
          // OLD SETTING
          if (<number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistance') > 0 || useGrid) {
            const maxDist =
              maxDistance && maxDistance > 0
                ? maxDistance
                : <number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistance');
            // const dist = computeDistanceBetweenCoordinatesOLD(DrawingsReach.getDrawingsCenter(drawing), character);
            const dist = computeDistanceBetweenCoordinates(
              DrawingsReach.getDrawingsCenter(drawing),
              character,
              DrawingDocument.documentName,
              true,
            );
            isNotNearEnough = dist > maxDist;
          } else {
            const maxDist =
              maxDistance && maxDistance > 0
                ? maxDistance
                : <number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionMeasurement');
            const dist = computeDistanceBetweenCoordinates(
              DrawingsReach.getDrawingsCenter(drawing),
              character,
              DrawingDocument.documentName,
              false,
            );
            isNotNearEnough = dist > maxDist;
          }
          if (isNotNearEnough) {
            const tokenName = getCharacterName(character);
            if (tokenName) {
              iteractionFailNotification(
                i18nFormat(`${CONSTANTS.MODULE_NAME}.drawingsNotInReachFor`, { tokenName: tokenName }),
              );
            } else {
              iteractionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.drawingsNotInReach`));
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

  getDrawingsCenter: function (drawing: Drawing) {
    // const drawCenter = {
    //   x: drawing.x,
    //   y: drawing.y,
    //   w: drawing.width,
    //   h: drawing.height
    // };
    // return drawCenter;
    return getPlaceableCenter(drawing);
  },
};
