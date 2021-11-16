import { i18n, i18nFormat } from '../foundryvtt-arms-reach';
import {
  computeDistanceBetweenCoordinates,
  computeDistanceBetweenCoordinatesOLD,
  getCharacterName,
  getFirstPlayerToken,
  getFirstPlayerTokenSelected,
  getTokenByTokenID,
  iteractionFailNotification,
} from './ArmsReachHelper';
import { getCanvas, ARMS_REACH_MODULE_NAME, getGame } from './settings';

export const TemplatesReach = {
  globalInteractionDistance: function (character: Token, template: MeasuredTemplate, userId?: String): boolean {
    let isOwned = false;
    if (!character) {
      character = <Token>getFirstPlayerToken();
      if (character) {
        isOwned = true;
      }
    }
    if (!character) {
      if (getGame().user?.isGM) {
        return true;
      } else {
        return false;
      }
    }

    // Sets the global maximum interaction distance
    // OLD SETTING
    let globalInteraction = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
    if (globalInteraction <= 0) {
      globalInteraction = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
    }
    // Global interaction distance control. Replaces prototype function of Stairways. Danger...
    if (globalInteraction > 0) {
      // Check distance
      //let character:Token = getFirstPlayerToken();
      if (
        !getGame().user?.isGM ||
        (getGame().user?.isGM &&
          <boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistanceForGM'))
      ) {
        if (!character) {
          iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.noCharacterSelectedForTemplate`));
          return false;
        } else {
          let isNotNearEnough = false;
          // OLD SETTING
          if (<number>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance') > 0) {
            const dist = computeDistanceBetweenCoordinatesOLD(TemplatesReach.getTemplatesCenter(template), character);
            isNotNearEnough =
              dist > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
          } else {
            const dist = computeDistanceBetweenCoordinates(TemplatesReach.getTemplatesCenter(template), character);
            isNotNearEnough =
              dist > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
          }
          if (isNotNearEnough) {
            const tokenName = getCharacterName(character);
            if (tokenName) {
              iteractionFailNotification(
                i18nFormat(`${ARMS_REACH_MODULE_NAME}.templatesNotInReachFor`, { tokenName: tokenName }),
              );
            } else {
              iteractionFailNotification(i18n(`${ARMS_REACH_MODULE_NAME}.templatesNotInReach`));
            }
            return false;
          } else {
            return true;
          }
        }
      } else if (getGame().user?.isGM) {
        // DO NOTHING
        return true;
      }
    }

    return false;
  },

  getTemplatesCenter: function (template: MeasuredTemplate) {
    const drawCenter = { x: template.x, y: template.y };
    return drawCenter;
  },
};
