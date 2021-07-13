import { i18n, i18nFormat } from "../foundryvtt-arms-reach";
import { computeDistanceBetweenCoordinates, getCharacterName, getFirstPlayerToken, getFirstPlayerTokenSelected, getTokenCenter, iteractionFailNotification } from "./ArmsReach";
import { getCanvas, MODULE_NAME } from "./settings";

export const StairwaysReach = {

    globalInteractionDistance : function(stairway:SourceData,selectedTokenIds:string[],userId:String):Boolean{

      let isOwned:boolean = false;
      let character:Token = getFirstPlayerTokenSelected();
      if(selectedTokenIds){
        if(selectedTokenIds.length > 1){
          //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
          return false;
        }else{
          character = StairwaysReach.getTokenByTokenID(selectedTokenIds[0]);
        }
      }else {
        if(!character){
          character = getFirstPlayerToken();
          if(character){
            isOwned = true;
          }
        }
      }

      // Sets the global maximum interaction distance
      // Global interaction distance control. Replaces prototype function of DoorControl. Danger...
      if( game.settings.get(MODULE_NAME, "globalInteractionDistance") > 0 ) {

        // Check distance
        //let character:Token = getFirstPlayerToken();
        if( !game.user.isGM || (game.user.isGM && <boolean>game.settings.get(MODULE_NAME, "globalInteractionDistanceForGM"))) {
          if( !character ) {
            iteractionFailNotification(i18n("foundryvtt-arms-reach.noCharacterSelected"));
            return false;
          }else{

            //let dist = getManhattanBetween(StairwaysReach.getStairwaysCenter(stairway), getTokenCenter(character));
            let dist = computeDistanceBetweenCoordinates(StairwaysReach.getStairwaysCenter(stairway), character);
            let gridSize = getCanvas().dimensions.size;
            let isNotNearEnough = (dist / gridSize) > <number>game.settings.get(MODULE_NAME, "globalInteractionDistance");
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

        } else if(game.user.isGM) {
          // DO NOTHING
        }

      }
      // If settings is true do not deselect the current select token
      if(<boolean>game.settings.get(MODULE_NAME, "forceReSelection")) {
        // Make sense only if use owned is false beacuse there is no way to check what
        // owned token is get from the array
        if(!isOwned) {
          //let character:Token = getFirstPlayerToken();
          if( !character ) {
            // DO NOTHING
          }else{
            const observable = getCanvas().tokens.placeables.filter(t => t.id === character.id);
            if (observable !== undefined){
                observable[0].control();
            }
          }
        }
      }
    },

    getTokenByTokenID : function(id) {
      // return await game.scenes.active.data.tokens.find( x => {return x.id === id});
      return getCanvas().tokens.placeables.find( x => {return x.id === id});
    },

    getTokenByTokenName : function(name) {
        // return await game.scenes.active.data.tokens.find( x => {return x._name === name});
        return getCanvas().tokens.placeables.find( x => { return x.name == name});
        // return getCanvas().tokens.placeables.find( x => { return x.id == game.user.id});
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
