import { i18n, i18nFormat } from "../foundryvtt-arms-reach";
import { computeDistanceBetweenCoordinates, computeDistanceBetweenCoordinatesOLD, getCharacterName, getFirstPlayerToken, getFirstPlayerTokenSelected, getTokenCenter, iteractionFailNotification } from "./ArmsReach";
import { getCanvas, ARMS_REACH_MODULE_NAME, getGame } from "./settings";

export const StairwaysReach = {

    globalInteractionDistance : function(stairway:SourceData,selectedTokenIds:string[],userId:String):boolean{

      let isOwned:boolean = false;
      let character:Token = <Token>getFirstPlayerTokenSelected();
      if(selectedTokenIds){
        if(selectedTokenIds.length > 1){
          //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
          return false;
        }else{
          character = <Token>StairwaysReach.getTokenByTokenID(selectedTokenIds[0]);
        }
      }else {
        if(!character){
          character = <Token>getFirstPlayerToken();
          if(character){
            isOwned = true;
          }
        }
      }
      
      // Sets the global maximum interaction distance
      // OLD SETTING
      let globalInteraction = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
      if(globalInteraction <= 0){
        globalInteraction = <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionMeasurement");
      }
      // Global interaction distance control. Replaces prototype function of DoorControl. Danger...
      if( globalInteraction > 0 ) {

        // Check distance
        //let character:Token = getFirstPlayerToken();
        if( !getGame().user?.isGM || (getGame().user?.isGM && <boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistanceForGM"))) {
          if( !character ) {
            iteractionFailNotification(i18n("foundryvtt-arms-reach.noCharacterSelected"));
            return false;
          }else{
            let isNotNearEnough = false;
            // OLD SETTING
            if(<number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance") > 0){
              let dist = computeDistanceBetweenCoordinatesOLD(StairwaysReach.getStairwaysCenter(stairway), character);
              isNotNearEnough = dist > <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionDistance");
            }else{
              let dist = computeDistanceBetweenCoordinates(StairwaysReach.getStairwaysCenter(stairway), character);
              isNotNearEnough = dist < <number>getGame().settings.get(ARMS_REACH_MODULE_NAME, "globalInteractionMeasurement");
            }
            if (isNotNearEnough) {
              var tokenName = getCharacterName(character);
              if (tokenName){
                iteractionFailNotification(i18nFormat("foundryvtt-arms-reach.stairwaysNotInReachFor",{tokenName : tokenName}));
              }
              else {
                iteractionFailNotification(i18n("foundryvtt-arms-reach.stairwaysNotInReach"));
              }
              return false;
            }else{
              return true;
            }
            // END MOD ABD 4535992
          }

        } else if(getGame().user?.isGM) {
          // DO NOTHING
        }

      }
      
      return false;
    },

    getTokenByTokenID : function(id) {
      // return await getGame().scenes.active.data.tokens.find( x => {return x.id === id});
      return getCanvas().tokens?.placeables.find( x => {return x.id === id});
    },

    getTokenByTokenName : function(name) {
        // return await getGame().scenes.active.data.tokens.find( x => {return x._name === name});
        return getCanvas().tokens?.placeables.find( x => { return x.name == name});
        // return getCanvas().tokens.placeables.find( x => { return x.id == getGame().user.id});
    },

    getStairwaysCenter : function(token) {
        let tokenCenter = { x: token.x, y: token.y }
        return tokenCenter;
    }

}

export class Data {
    /// scene id of the stairway used (source scene of teleport)
    sourceSceneId:string;
    /// stairway data of the source stairway (WARNING: this data may change in the future)
    sourceData:SourceData;
    /// id's of all selected token (tokens beeing teleported)
    selectedTokenIds:string[];
    /// target scene id of the stairway or `null` (target scene of the teleport of `null` if current scene)
    targetSceneId:string;
    /// stairway data of the target stairway (WARNING: this data may change in the future)
    targetData:TargetData;
    /// id of the user using the stairway (current user)
    userId:string;
}

/// WARNING: internal data - do not use if possible
export class TargetData {
    /// target (partner) scene id or `null` if current scene
    scene:Scene;
    /// stairway name (id for connection)
    name:string;
    /// stairway label or `null` for none
    label:string;
    /// stairway icon (image path) or `null` for default
    icon:string;
    /// disabled (locked on `true`)
    disabled:boolean;
    /// hide from players (hidden on `true`)
    hidden:boolean;
    /// animate movement within scene (animate on `true`)
    animate:boolean;
    /// x position of target stairway
    x:number;
    /// y position of target stairway
    y:number;
}

/// WARNING: internal data - do not use if possible
export class SourceData {
  /// target (partner) scene id or `null` if current scene
  scene:Scene;
  /// stairway name (id for connection)
  name:string;
  /// stairway label or `null` for none
  label:string;
  /// stairway icon (image path) or `null` for default
  icon:string;
  /// disabled (locked on `true`)
  disabled:boolean;
  /// hide from players (hidden on `true`)
  hidden:boolean;
  /// animate movement within scene (animate on `true`)
  animate:boolean;
  /// x position of target stairway
  x:number;
  /// y position of target stairway
  y:number;
}
