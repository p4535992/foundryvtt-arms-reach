import { i18n, i18nFormat } from '../foundryvtt-arms-reach';
import {
  computeDistanceBetweenCoordinates,
  computeDistanceBetweenCoordinatesOLD,
  getCharacterName,
  getFirstPlayerToken,
  getPlaceableCenter,
  iteractionFailNotification,
} from './ArmsReachHelper';
import { ARMS_REACH_MODULE_NAME } from './settings';
import { canvas, game } from './settings';

export const TokensReach = {
  globalInteractionDistance: function (
    character: Token,
    token: Token,
    maxDistance?: number,
    useGrid?: boolean,
    userId?: String,
  ): boolean {
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
          iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.noCharacterSelectedForJournal`));
          return false;
        } else {
          let isNotNearEnough = false;
          // OLD SETTING
          if (<number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance') > 0 || useGrid) {
            const maxDist =
              maxDistance && maxDistance > 0
                ? maxDistance
                : <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
            // const dist = computeDistanceBetweenCoordinatesOLD(TokensReach.getTokensCenter(token), character);
            const dist = computeDistanceBetweenCoordinates(
              TokensReach.getTokensCenter(token),
              character,
              TokenDocument.documentName,
              true
            );
            isNotNearEnough = dist > maxDist;
          } else {
            const maxDist =
              maxDistance && maxDistance > 0
                ? maxDistance
                : <number>game.settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
            const dist = computeDistanceBetweenCoordinates(
              TokensReach.getTokensCenter(token),
              character,
              TokenDocument.documentName,
              false
            );
            isNotNearEnough = dist > maxDist;
          }
          if (isNotNearEnough) {
            const tokenName = getCharacterName(character);
            if (tokenName) {
              iteractionFailNotification(
                i18nFormat(`${ARMS_REACH_MODULE_NAME}.tokensNotInReachFor`, { tokenName: tokenName }),
              );
            } else {
              iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.tokensNotInReach`));
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

  getTokensCenter: function (token: Token) {
    // const tokenCenter = { x: token.x + token.width / 2, y: token.y + token.height / 2 };
    // return tokenCenter;
    return getPlaceableCenter(token);
  },
};
