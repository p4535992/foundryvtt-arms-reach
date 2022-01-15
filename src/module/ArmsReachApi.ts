import { isReachable } from './ArmsReachSocket';
import { DoorsReach } from './DoorsReach';
import { DrawingsReach } from './DrawingsReach';
import { LightsReach } from './LightsReach';
import { NotesReach } from './NotesReach';
import { ARMS_REACH_MODULE_NAME, ARMS_REACH_TAGGER_MODULE_NAME } from './settings';
import { SoundsReach } from './SoundsReach';
import { StairwaysReach } from './StairwaysReach';
import { TilesReach } from './TilesReach';
import { TokensReach } from './TokensReach';
import { canvas, game } from './settings';

export class ArmsReach {
  static API = 'armsReach';

  isReachableByTag(token: Token, tag: string, userId?: string): boolean {
    //@ts-ignore
    if (!(<boolean>game.modules.get(ARMS_REACH_TAGGER_MODULE_NAME)?.active)) {
      ui.notifications?.warn(
        `${ARMS_REACH_MODULE_NAME} | The module '${ARMS_REACH_TAGGER_MODULE_NAME}' is not active can't use the API 'isReachableByTag'`,
      );
      return false;
    } else {
      const placeableObjects =
        //@ts-ignore
        <PlaceableObject[]>Tagger?.getByTag(tag, { caseInsensitive: true }) || undefined;
      if (!placeableObjects) {
        return false;
      }
      return this.isReachable(token, placeableObjects[0], userId);
    }
  }

  isReachableById(token: Token, placeableObjectId: string, userId?: string): boolean {
    // const sceneId = game.scenes?.current?.id;
    const objects = this._getObjectsFromScene(<Scene>game.scenes?.current);
    const object = objects.filter((obj: any) => {
      obj.id === placeableObjectId;
    })[0];
    if (!object) {
      ui.notifications?.warn(
        `${ARMS_REACH_MODULE_NAME} | No placeable object find for the id '${placeableObjectId}' can't use the API 'isReachableById'`,
      );
      return false;
    }
    return this.isReachable(token, <any>object, userId);
  }

  isReachableByIdOrName(token: Token, placeableObjectIdOrName: string, userId?: string): boolean {
    // const sceneId = game.scenes?.current?.id;
    const objects = this._getObjectsFromScene(<Scene>game.scenes?.current);
    const object = this._retrieveFromIdOrName(objects, placeableObjectIdOrName);
    if (!object) {
      ui.notifications?.warn(
        `${ARMS_REACH_MODULE_NAME} | No placeable object find for the id '${placeableObjectIdOrName}' can't use the API 'isReachableByIdOrName'`,
      );
      return false;
    }
    return this.isReachable(token, <any>object, userId);
  }

  isReachable(token: Token, placeableObject: PlaceableObject, userId?: string): boolean {
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
      isInReach = TokensReach.globalInteractionDistance(token, tokenTarget, <string>userId);
    } else if (relevantDocument instanceof AmbientLightDocument) {
      const ambientLightTarget = <AmbientLight>canvas.lighting?.placeables?.find((x: AmbientLight) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = LightsReach.globalInteractionDistance(token, ambientLightTarget, <string>userId);
    } else if (relevantDocument instanceof AmbientSoundDocument) {
      const ambientSoundTarget = <AmbientSound>canvas.sounds?.placeables?.find((x: AmbientSound) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = SoundsReach.globalInteractionDistance(token, ambientSoundTarget, <string>userId);
      // } else if(relevantDocument instanceof MeasuredTemplateDocument){
      //   const measuredTarget = <MeasuredTemplate>canvas.templates?.placeables?.find((x:MeasuredTemplate) => {return x.id == <string>placeableObject.id;});
      //   isInReach = MeasuredsReach.globalInteractionDistance(token,ambientSoundTarget);
    } else if (relevantDocument instanceof TileDocument) {
      const tileTarget = <Tile>canvas.foreground?.placeables?.find((x: Tile) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = TilesReach.globalInteractionDistance(token, tileTarget, <string>userId);
    } else if (relevantDocument instanceof WallDocument) {
      const doorControlTarget: DoorControl = <DoorControl>canvas.controls?.doors?.children.find((x: DoorControl) => {
        return x.wall.id == <string>placeableObject.id;
      });
      // const wallTarget = <Wall>canvas.walls?.placeables?.find((x:Wall) => {return x.id == <string>placeableObject.id;});
      isInReach = DoorsReach.globalInteractionDistance(token, doorControlTarget, false, <string>userId);
    } else if (relevantDocument instanceof DrawingDocument) {
      const drawingTarget = <Drawing>canvas.drawings?.placeables?.find((x: Drawing) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = DrawingsReach.globalInteractionDistance(token, drawingTarget, <string>userId);
    } else if (relevantDocument instanceof NoteDocument) {
      const noteTarget = <Note>canvas.notes?.placeables?.find((x: Note) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = NotesReach.globalInteractionDistance(token, noteTarget, <string>userId);
    } else if (relevantDocument.name == 'Stairway') {
      //@ts-ignore
      const stairwayTarget = <Note>canvas.stairways?.placeables?.find((x: PlaceableObject) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = StairwaysReach.globalInteractionDistanceSimple(
        token,
        { x: stairwayTarget.x, y: stairwayTarget.y },
        userId,
      );
    } else {
      ui.notifications?.warn(
        `${ARMS_REACH_MODULE_NAME} | The document '${relevantDocument?.name}' is not supported from the API 'isReachable'`,
      );
    }
    return isInReach;
  }

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
  }

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
  }
}
