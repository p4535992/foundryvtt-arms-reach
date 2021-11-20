import { placeableContains } from './ArmsReachHelper';
import { isReachable } from './ArmsReachSocket';
import { DoorsReach } from './DoorsReach';
import { DrawingsReach } from './DrawingsReach';
import { LightsReach } from './LightsReach';
import { NotesReach } from './NotesReach';
import { ARMS_REACH_MODULE_NAME, ARMS_REACH_TAGGER_MODULE_NAME, getCanvas, getGame } from './settings';
import { SoundsReach } from './SoundsReach';
import { StairwaysReach } from './StairwaysReach';
import { TilesReach } from './TilesReach';
import { TokensReach } from './TokensReach';

export class ArmsReach {
  static API = 'armsReach';

  async isReachableByTag(token: Token, tag: string, userId?: string): Promise<boolean> {
    //@ts-ignore
    if (!(<boolean>getGame().modules.get(ARMS_REACH_TAGGER_MODULE_NAME)?.active)) {
      ui.notifications?.warn(
        `${ARMS_REACH_MODULE_NAME} | The module '${ARMS_REACH_TAGGER_MODULE_NAME}' is not active can't use the API 'isReachableByTag'`,
      );
      return false;
    } else {
      const placeableObjects =
        //@ts-ignore
        (await (<PlaceableObject[]>Tagger?.getByTag(tag, { caseInsensitive: true }))) || undefined;
      if (!placeableObjects) {
        return false;
      }
      return this.isReachable(token, placeableObjects[0], userId);
    }
  }

  isReachableById(token: Token, placeableObjectId: string, userId?: string): boolean {
    // const sceneId = getGame().scenes?.current?.id;
    const objects = this._getObjectsFromScene(<Scene>getGame().scenes?.current);
    const object = objects.filter((obj) => obj.id === placeableObjectId)[0];
    if (!object) {
      ui.notifications?.warn(
        `${ARMS_REACH_MODULE_NAME} | No placeable object find for the id '${placeableObjectId}'can't use the API 'isReachableById'`,
      );
      return false;
    }
    return this.isReachable(token, <any>object, userId);
  }

  isReachable(token: Token, placeableObject: PlaceableObject, userId?: string): boolean {
    // const userId = <string>getGame().users?.find((u:User) => return u.id = gameUserId)[0];
    let relevantDocument;
    if (placeableObject instanceof PlaceableObject) {
      relevantDocument = placeableObject?.document;
    } else {
      relevantDocument = placeableObject;
    }
    let isInReach = false;
    if (relevantDocument instanceof TokenDocument) {
      const tokenTarget = <Token>getCanvas().tokens?.placeables?.find((x: Token) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = TokensReach.globalInteractionDistance(token, tokenTarget, <string>userId);
    } else if (relevantDocument instanceof AmbientLightDocument) {
      const ambientLightTarget = <AmbientLight>getCanvas().lighting?.placeables?.find((x: AmbientLight) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = LightsReach.globalInteractionDistance(token, ambientLightTarget, <string>userId);
    } else if (relevantDocument instanceof AmbientSoundDocument) {
      const ambientSoundTarget = <AmbientSound>getCanvas().sounds?.placeables?.find((x: AmbientSound) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = SoundsReach.globalInteractionDistance(token, ambientSoundTarget, <string>userId);
      // } else if(relevantDocument instanceof MeasuredTemplateDocument){
      //   const measuredTarget = <MeasuredTemplate>getCanvas().templates?.placeables?.find((x:MeasuredTemplate) => {return x.id == <string>placeableObject.id;});
      //   isInReach = MeasuredsReach.globalInteractionDistance(token,ambientSoundTarget);
    } else if (relevantDocument instanceof TileDocument) {
      const tileTarget = <Tile>getCanvas().foreground?.placeables?.find((x: Tile) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = TilesReach.globalInteractionDistance(token, tileTarget, <string>userId);
    } else if (relevantDocument instanceof WallDocument) {
      const doorControlTarget: DoorControl = <DoorControl>getCanvas().controls?.doors?.children.find(
        (x: DoorControl) => {
          return x.wall.id == <string>placeableObject.id;
        },
      );
      // const wallTarget = <Wall>getCanvas().walls?.placeables?.find((x:Wall) => {return x.id == <string>placeableObject.id;});
      isInReach = DoorsReach.globalInteractionDistance(token, doorControlTarget, false, <string>userId);
    } else if (relevantDocument instanceof DrawingDocument) {
      const drawingTarget = <Drawing>getCanvas().drawings?.placeables?.find((x: Drawing) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = DrawingsReach.globalInteractionDistance(token, drawingTarget, <string>userId);
    } else if (relevantDocument instanceof NoteDocument) {
      const noteTarget = <Note>getCanvas().notes?.placeables?.find((x: Note) => {
        return x.id == <string>placeableObject.id;
      });
      isInReach = NotesReach.globalInteractionDistance(token, noteTarget, <string>userId);
    } else if (relevantDocument.name == 'Stairway') {
      //@ts-ignore
      const stairwayTarget = <Note>getCanvas().stairways?.placeables?.find((x: PlaceableObject) => {
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
    ]
      .deepFlatten()
      .filter(Boolean);
  }
}
