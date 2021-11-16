import { placeableContains } from './ArmsReachHelper';
import { isReachable } from './ArmsReachSocket';
import { ARMS_REACH_MODULE_NAME, ARMS_REACH_TAGGER_MODULE_NAME, getCanvas, getGame } from "./settings";
import { TokensReach } from './TokensReach';

export class ArmsReach{

  static API = "armsReach";

    /**
     *
     * @param token the source token
     * @param placeableObject the target placeable object
     */
    async isReachableByTag(token:Token, tag:string, user:User):Promise<boolean>{
      if(<boolean>getGame().modules.get(ARMS_REACH_TAGGER_MODULE_NAME)?.active){
        ui.notifications?.warn(`${ARMS_REACH_MODULE_NAME} | The module '${ARMS_REACH_TAGGER_MODULE_NAME}' is not active can't use the API 'isReachableByTag'`);
        return false;
      }else{
        //@ts-ignore
        const placeableObjects = <PlaceableObject[]>await Tagger.getByTag(tag, { caseInsensitive: true });
        return isReachable(token,placeableObjects[0],user);
      }
    }

    async isReachableById(token:Token, id:string, user:User):Promise<boolean>{
      // const sceneId = getGame().scenes?.current?.id;
      const objects = this._getObjectsFromScene(<Scene>getGame().scenes?.current);
      const object = objects.filter(obj => obj.id === id)[0];
      isReachable(token,placeableObjects[0],user);
    }

  /**
   *
   * @param token the source token
   * @param placeableObject the target placeable object
   */
  isReachable(token:Token, placeableObject:PlaceableObject, user:User):boolean{
    if(!user){
      user = <User>getGame().user;
    }
    const relevantDocument = placeableObject?.document;

    if(relevantDocument instanceof TokenDocument){
      TokensReach.globalInteractionDistance(token, <Token>getCanvas().tokens?.placeables.find((x) => {return x.id == placeableObject.id;})[0])
    } else if(relevantDocument instanceof AmbientLightDocument){
    } else if(relevantDocument instanceof AmbientSoundDocument){
    } else if(relevantDocument instanceof MeasuredTemplateDocument){
    } else if(relevantDocument instanceof TileDocument){
    } else if(relevantDocument instanceof WallDocument){
    } else if(relevantDocument instanceof DrawingDocument){
    } else {
      ui.notifications?.warn(`${ARMS_REACH_MODULE_NAME} | The document '${relevantDocument.name}' is not supported from the API 'isReachable'`);
    }
  }

  _getObjectsFromScene(scene:Scene) {
    return [
        ...Array.from(scene.tokens),
        ...Array.from(scene.lights),
        ...Array.from(scene.sounds),
        ...Array.from(scene.templates),
        ...Array.from(scene.tiles),
        ...Array.from(scene.walls),
        ...Array.from(scene.drawings),
    ].deepFlatten().filter(Boolean)
  }

}
