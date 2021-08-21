import { i18n, i18nFormat } from '../foundryvtt-arms-reach';
import {
  computeDistanceBetweenCoordinates,
  computeDistanceBetweenCoordinatesOLD,
  getCharacterName,
  getFirstPlayerToken,
  getFirstPlayerTokenSelected,
  getTokenByTokenID,
  iteractionFailNotification,
} from './ArmsReachhelper';
import { getCanvas, ARMS_REACH_MODULE_NAME, getGame } from './settings';

export const JournalsReach = {
  globalInteractionDistance: function (character: Token, note: Note): boolean {
    // let character:Token = <Token>getFirstPlayerTokenSelected();
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
          iteractionFailNotification(i18n(ARMS_REACH_MODULE_NAME + '.noCharacterSelectedForJournal'));
          return false;
        } else {
          let isNotNearEnough = false;
          // OLD SETTING
          if (<number>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance') > 0) {
            const dist = computeDistanceBetweenCoordinatesOLD(JournalsReach.getJournalsCenter(note), character);
            isNotNearEnough =
              dist > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionDistance');
          } else {
            const dist = computeDistanceBetweenCoordinates(JournalsReach.getJournalsCenter(note), character);
            isNotNearEnough =
              dist > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'globalInteractionMeasurement');
          }
          if (isNotNearEnough) {
            const tokenName = getCharacterName(character);
            if (tokenName) {
              iteractionFailNotification(
                i18nFormat(ARMS_REACH_MODULE_NAME + '.journalsNotInReachFor', { tokenName: tokenName }),
              );
            } else {
              iteractionFailNotification(i18n(ARMS_REACH_MODULE_NAME + '.journalsNotInReach'));
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

  getJournalsCenter: function (token: Note) {
    const tokenCenter = { x: token.x, y: token.y };
    return tokenCenter;
  },
};

export class Data {
  /// scene id of the journal used (source scene of teleport)
  sourceSceneId: string;
  /// journal data of the source journal (WARNING: this data may change in the future)
  sourceData: SourceData;
  /// id's of all selected token (tokens beeing teleported)
  selectedTokenIds: string[];
  /// target scene id of the journal or `null` (target scene of the teleport of `null` if current scene)
  targetSceneId: string;
  /// journal data of the target journal (WARNING: this data may change in the future)
  targetData: TargetData;
  /// id of the user using the journal (current user)
  userId: string;
}

/// WARNING: internal data - do not use if possible
export class TargetData {
  /// target (partner) scene id or `null` if current scene
  scene: Scene;
  /// journal name (id for connection)
  name: string;
  /// journal label or `null` for none
  label: string;
  /// journal icon (image path) or `null` for default
  icon: string;
  /// disabled (locked on `true`)
  disabled: boolean;
  /// hide from players (hidden on `true`)
  hidden: boolean;
  /// animate movement within scene (animate on `true`)
  animate: boolean;
  /// x position of target journal
  x: number;
  /// y position of target journal
  y: number;
}

/// WARNING: internal data - do not use if possible
export class SourceData {
  /// target (partner) scene id or `null` if current scene
  scene: Scene;
  /// journal name (id for connection)
  name: string;
  /// journal label or `null` for none
  label: string;
  /// journal icon (image path) or `null` for default
  icon: string;
  /// disabled (locked on `true`)
  disabled: boolean;
  /// hide from players (hidden on `true`)
  hidden: boolean;
  /// animate movement within scene (animate on `true`)
  animate: boolean;
  /// x position of target journal
  x: number;
  /// y position of target journal
  y: number;
}
