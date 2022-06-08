import { DoorsReach } from './DoorsReach';
import { DrawingsReach } from './DrawingsReach';
import { LightsReach } from './LightsReach';
import { NotesReach } from './NotesReach';
import { SoundsReach } from './SoundsReach';
import { StairwaysReach } from './StairwaysReach';
import { TilesReach } from './TilesReach';
import { TokensReach } from './TokensReach';
import { WallsReach } from './WallsReach';
import { globalInteractionDistanceUniversal } from './ArmsReachHelper';
import { error, warn } from './lib/lib';
import CONSTANTS from './constants';
import type { Overlay } from './apps/range_overlay/overlay';
import type { combatRangeOverlay } from './ArmsReachModels';

const API = {
  combatRangeOverlay: <combatRangeOverlay>{},

  async isReachableArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('isReachable | inAttributes must be of type array');
    }
    const [token, placeableObject, maxDistance, useGrid, userId] = inAttributes;
    const result = await (this as typeof API).isReachable(token, placeableObject, maxDistance, useGrid, userId);
    return result;
  },

  async isReachableByTagArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('isReachableByTag | inAttributes must be of type array');
    }
    const [token, tag, maxDistance, useGrid, userId] = inAttributes;
    const result = await (this as typeof API).isReachableByTag(token, tag, maxDistance, useGrid, userId);
    return result;
  },

  async isReachableByIdArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('isReachableById | inAttributes must be of type array');
    }
    const [token, placeableObjectId, maxDistance, useGrid, userId] = inAttributes;
    const result = await (this as typeof API).isReachableById(token, placeableObjectId, maxDistance, useGrid, userId);
    return result;
  },

  async isReachableByIdOrNameArr(...inAttributes: any[]) {
    if (!Array.isArray(inAttributes)) {
      throw error('isReachableByIdOrName | inAttributes must be of type array');
    }
    const [token, placeableObjectIdOrName, maxDistance, useGrid, userId] = inAttributes;
    const result = await (this as typeof API).isReachableByIdOrName(
      token,
      placeableObjectIdOrName,
      maxDistance,
      useGrid,
      userId,
    );
    return result;
  },

  isReachableByTag(token: Token, tag: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean {
    //@ts-ignore
    if (!(<boolean>game.modules.get(CONSTANTS.TAGGER_MODULE_NAME)?.active)) {
      warn(`The module '${CONSTANTS.TAGGER_MODULE_NAME}' is not active can't use the API 'isReachableByTag'`, true);
      return false;
    } else {
      const placeableObjects =
        //@ts-ignore
        <PlaceableObject[]>Tagger?.getByTag(tag, { caseInsensitive: true }) || undefined;
      if (!placeableObjects) {
        return false;
      }
      return this.isReachable(token, placeableObjects[0], maxDistance, useGrid, userId);
    }
  },

  isReachableById(
    token: Token,
    placeableObjectId: string,
    maxDistance?: number,
    useGrid?: boolean,
    userId?: string,
  ): boolean {
    // const sceneId = game.scenes?.current?.id;
    const objects = this._getObjectsFromScene(<Scene>game.scenes?.current);
    const object = objects.filter((obj: any) => {
      obj.id === placeableObjectId;
    })[0];
    if (!object) {
      warn(`No placeable object find for the id '${placeableObjectId}' can't use the API 'isReachableById'`, true);
      return false;
    }
    return this.isReachable(token, <any>object, maxDistance, useGrid, userId);
  },

  isReachableByIdOrName(
    token: Token,
    placeableObjectIdOrName: string,
    maxDistance?: number,
    useGrid?: boolean,
    userId?: string,
  ): boolean {
    // const sceneId = game.scenes?.current?.id;
    const objects = this._getObjectsFromScene(<Scene>game.scenes?.current);
    const object = this._retrieveFromIdOrName(objects, placeableObjectIdOrName);
    if (!object) {
      warn(
        `No placeable object find for the id '${placeableObjectIdOrName}' can't use the API 'isReachableByIdOrName'`,
        true,
      );
      return false;
    }
    return this.isReachable(token, <any>object, maxDistance, useGrid, userId);
  },

  isReachable(
    token: Token,
    placeableObject: PlaceableObject,
    maxDistance?: number,
    useGrid?: boolean,
    userId?: string,
  ): boolean {
    // const userId = <string>game.users?.find((u:User) => return u.id = gameUserId)[0];
    let relevantDocument;
    if (placeableObject instanceof PlaceableObject) {
      relevantDocument = placeableObject?.document;
    } else {
      relevantDocument = placeableObject;
    }
    let isInReach = false;
    if (relevantDocument instanceof TokenDocument) {
      const tokenTarget = <Token>canvas.tokens?.placeables?.find((x: Token) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = TokensReach.globalInteractionDistance(token, tokenTarget, maxDistance, useGrid, <string>userId);
    } else if (relevantDocument instanceof AmbientLightDocument) {
      const ambientLightTarget = <AmbientLight>canvas.lighting?.placeables?.find((x: AmbientLight) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = LightsReach.globalInteractionDistance(
        token,
        ambientLightTarget,
        maxDistance,
        useGrid,
        <string>userId,
      );
    } else if (relevantDocument instanceof AmbientSoundDocument) {
      const ambientSoundTarget = <AmbientSound>canvas.sounds?.placeables?.find((x: AmbientSound) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = SoundsReach.globalInteractionDistance(
        token,
        ambientSoundTarget,
        maxDistance,
        useGrid,
        <string>userId,
      );
      // } else if(relevantDocument instanceof MeasuredTemplateDocument){
      //   const measuredTarget = <MeasuredTemplate>canvas.templates?.placeables?.find((x:MeasuredTemplate) => {return x.id == <string>placeableObject.id;});
      //   isInReach = MeasuredsReach.globalInteractionDistance(token,ambientSoundTarget);
    } else if (relevantDocument instanceof TileDocument) {
      const tileTarget = <Tile>canvas.foreground?.placeables?.find((x: Tile) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = TilesReach.globalInteractionDistance(token, tileTarget, maxDistance, useGrid, <string>userId);
    } else if (relevantDocument instanceof WallDocument) {
      const doorControlTarget: DoorControl = <DoorControl>canvas.controls?.doors?.children.find((x: DoorControl) => {
        return x.wall.id == <string>placeableObject.id;
      });
      if (doorControlTarget) {
        isInReach = DoorsReach.globalInteractionDistance(
          token,
          doorControlTarget,
          false,
          maxDistance,
          useGrid,
          <string>userId,
        );
      } else {
        const wallTarget = <Wall>canvas.walls?.placeables?.find((x: Wall) => {
          return x.id == <string>placeableObject.id;
        });
        isInReach = WallsReach.globalInteractionDistance(token, wallTarget, maxDistance, useGrid, <string>userId);
      }
    } else if (relevantDocument instanceof DrawingDocument) {
      const drawingTarget = <Drawing>canvas.drawings?.placeables?.find((x: Drawing) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = DrawingsReach.globalInteractionDistance(token, drawingTarget, maxDistance, useGrid, <string>userId);
    } else if (relevantDocument instanceof NoteDocument) {
      const noteTarget = <Note>canvas.notes?.placeables?.find((x: Note) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = NotesReach.globalInteractionDistance(token, noteTarget, maxDistance, useGrid, <string>userId);
    } else if (relevantDocument.name == 'Stairway') {
      //@ts-ignore
      const stairwayTarget = <Note>canvas.stairways?.placeables?.find((x: PlaceableObject) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = StairwaysReach.globalInteractionDistanceSimple(
        token,
        { x: stairwayTarget.x, y: stairwayTarget.y },
        maxDistance,
        useGrid,
        userId,
      );
    } else {
      warn(` The document '${relevantDocument?.name}' is not supported from the API 'isReachable'`, true);
    }
    return isInReach;
  },

  isReachableByTagUniversal(
    placeableObjectSource: PlaceableObject,
    tag: string,
    maxDistance?: number,
    useGrid?: boolean,
    userId?: string,
  ): boolean {
    //@ts-ignore
    if (!(<boolean>game.modules.get(CONSTANTS.TAGGER_MODULE_NAME)?.active)) {
      warn(
        `The module '${CONSTANTS.TAGGER_MODULE_NAME}' is not active can't use the API 'isReachableByTagUniversal'`,
        true,
      );
      return false;
    } else {
      const placeableObjects =
        //@ts-ignore
        <PlaceableObject[]>Tagger?.getByTag(tag, { caseInsensitive: true }) || undefined;
      if (!placeableObjects) {
        return false;
      }
      return this.isReachableUniversal(placeableObjectSource, placeableObjects[0], maxDistance, useGrid, userId);
    }
  },

  isReachableByIdUniversal(
    placeableObjectSource: PlaceableObject,
    placeableObjectId: string,
    maxDistance?: number,
    useGrid?: boolean,
    userId?: string,
  ): boolean {
    // const sceneId = game.scenes?.current?.id;
    const objects = this._getObjectsFromScene(<Scene>game.scenes?.current);
    const object = objects.filter((obj: any) => {
      obj.id === placeableObjectId;
    })[0];
    if (!object) {
      warn(
        `No placeable object find for the id '${placeableObjectId}' can't use the API 'isReachableByIdUniversal'`,
        true,
      );
      return false;
    }
    return this.isReachableUniversal(placeableObjectSource, <any>object, maxDistance, useGrid, userId);
  },

  isReachableByIdOrNameUniversal(
    placeableObjectSource: PlaceableObject,
    placeableObjectIdOrName: string,
    maxDistance?: number,
    useGrid?: boolean,
    userId?: string,
  ): boolean {
    // const sceneId = game.scenes?.current?.id;
    const objects = this._getObjectsFromScene(<Scene>game.scenes?.current);
    const object = this._retrieveFromIdOrName(objects, placeableObjectIdOrName);
    if (!object) {
      warn(
        `No placeable object find for the id '${placeableObjectIdOrName}' can't use the API 'isReachableByIdOrNameUniversal'`,
        true,
      );
      return false;
    }
    return this.isReachableUniversal(placeableObjectSource, <any>object, maxDistance, useGrid, userId);
  },

  isReachableUniversal(
    placeableObjectSource: PlaceableObject,
    placeableObjectTarget: PlaceableObject,
    maxDistance?: number,
    useGrid?: boolean,
    userId?: string,
  ): boolean {
    // const userId = <string>game.users?.find((u:User) => return u.id = gameUserId)[0];
    const dist = globalInteractionDistanceUniversal(placeableObjectSource, placeableObjectTarget, <boolean>useGrid);
    let isNotNearEnough = false;
    // OLD SETTING
    if (<number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistance') > 0 || useGrid) {
      const maxDist =
        maxDistance && maxDistance > 0
          ? maxDistance
          : <number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistance');
      isNotNearEnough = dist > maxDist;
    } else {
      const maxDist =
        maxDistance && maxDistance > 0
          ? maxDistance
          : <number>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionMeasurement');
      isNotNearEnough = dist > maxDist;
    }
    if (isNotNearEnough) {
      // TODO add a warning  dialog ?
      return false;
    } else {
      return true;
    }
  },

  // ==========================================
  // UTILITY
  // ==========================================

  _getObjectsFromScene(scene: Scene) {
    return [
      ...Array.from(scene.tokens),
      ...Array.from(scene.lights),
      ...Array.from(scene.sounds),
      ...Array.from(scene.templates),
      ...Array.from(scene.tiles),
      ...Array.from(scene.walls),
      ...Array.from(scene.drawings),
      //@ts-ignore
      ...Array.from(scene.stairways), // Add module stairways...
    ]
      .deepFlatten()
      .filter(Boolean);
  },

  _retrieveFromIdOrName(placeables, IdOrName): any {
    let target;
    if (!placeables || placeables.length == 0) {
      return target;
    }
    if (!IdOrName) {
      return target;
    }
    target = placeables?.find((x) => {
      return x && x.id?.toLowerCase() == IdOrName.toLowerCase();
    });
    if (!target) {
      target = placeables?.find((x) => {
        return x && x.name?.toLowerCase() == IdOrName.toLowerCase();
      });
    }
    if (!target) {
      target = placeables?.find((x) => {
        return x && x.label?.toLowerCase() == IdOrName.toLowerCase();
      });
    }
    if (!target) {
      target = placeables?.find((x) => {
        return x && x.data?.name?.toLowerCase() == IdOrName.toLowerCase();
      });
    }
    if (!target) {
      target = placeables?.find((x) => {
        return x && x.data?.text?.toLowerCase() == IdOrName.toLowerCase();
      });
    }
    if (!target) {
      target = placeables?.find((x) => {
        return x && x.data?.label?.toLowerCase() == IdOrName.toLowerCase();
      });
    }
    if (!target) {
      target = placeables?.find((x) => {
        return x && x.data?.entryId?.toLowerCase() == IdOrName.toLowerCase();
      });
    }
    return target;
  },
};

export default API;
