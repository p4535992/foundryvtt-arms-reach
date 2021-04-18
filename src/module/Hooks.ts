import { warn, error, debug, i18n } from "../foundryvtt-arms-reach";
import { ArmsReachVariables } from "./ArmsReachVariables";
import { getCanvas, MODULE_NAME } from './settings';

export let readyHooks = async () => {
  // initialazideTab = true;
}

export let initHooks = () => {
  warn("Init Hooks processing");

  // setup all the hooks

  // Register custom sheets (if any)

  // Sets the global maximum interaction distance
  // Global interaction distance control. Replaces prototype function of DoorControl. Danger...
  if( game.settings.get(MODULE_NAME, "globalInteractionDistance") > 0 ) {

    //@ts-ignore
    //libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onMouseOver', DoorControlPrototypeOnMouseOverHandler, 'WRAPPER');   
    
    //@ts-ignore
    libWrapper.register(MODULE_NAME, 'DoorControl.prototype._onMouseDown', DoorControlPrototypeOnMouseDownHandler, 'OVERRIDE');   
    // let originalMethod = DoorControl.prototype._onMouseDown;
    // DoorControl.prototype._onMouseDown = function(event) {
    //   // Check distance
    //   if( !game.user.isGM ) {
    //     let character = getFirstPlayerToken();
        
    //     if( !character ) {
    //       iteractionFailNotification("No character is selected to interact with a door");
    //       return;
    //     }
        
    //     let dist = getManhattanBetween(this, getTokenCenter(character));
    //     let gridSize = getCanvas().dimensions.size;
    
    //     if ( (dist / gridSize) > game.settings.get(MODULE_NAME, "globalInteractionDistance") ) {
    //       var tokenName = getCharacterName(character);
    //       if (tokenName) iteractionFailNotification("Door not within " + tokenName + "'s reach" );
    //       else iteractionFailNotification("Door not in reach" );
    //       return;
    //     }
    //   }
    //   // Call original method
    //   return originalMethod.apply(this,arguments);
    // };
  } 

}

export const DoorControlPrototypeOnMouseDownHandler = async function () { //function (wrapped, ...args) {
  // Check distance
  let character:Token = getFirstPlayerToken();
  if( !game.user.isGM || (game.user.isGM && <boolean>game.settings.get(MODULE_NAME, "globalInteractionDistanceForGM"))) {
    if( !character ) {
      iteractionFailNotification("No character is selected to interact with a door");
      //return;
    }else{
    
      let dist = getManhattanBetween(this, getTokenCenter(character));
      let gridSize = getCanvas().dimensions.size;
      let isNotNearEnough = (dist / gridSize) > <number>game.settings.get(MODULE_NAME, "globalInteractionDistance");
      if (isNotNearEnough) {
        var tokenName = getCharacterName(character);
        if (tokenName){
          iteractionFailNotification("Door not within " + tokenName + "'s reach" );
        }
        else {
          iteractionFailNotification("Door not in reach" );
        }
        //return;
        // MOD 4535992 MAKE SURE THE DOOR REMAIN CLOSED/OPEN AFTER CLICK ONLY WITH WRAPPER AND MIXED
        /*
        const [t] = args;
        const doorControl = t.currentTarget;
        let wall:Wall = getCanvas().walls.get(doorControl.wall.data._id); 
        if(wall){
          if(wall.data.ds==0)
          {
            await getCanvas().walls.get(doorControl.wall.data._id).update({
                ds : 1
            });
          }else if(wall.data.ds==1){
            await getCanvas().walls.get(doorControl.wall.data._id).update({
                ds : 0
            });
          }else{
            error("No 'ds' property found for value '"+wall.data.ds+"' for id : " + doorControl.wall.data._id );
          }
        }else{
          error("No wall found for id : " + doorControl.wall.data._id);
        }
        */
        // TODO If is a secret door we can do somethig
        /*
        if(wall.data.door === 2){
          wall.update(
            {"door" : 1} // From secret door to normal door
          );
          let sent_message = `You have spotted a hidden door!`;
          let chatData = {
            user: game.user._id,
            content: sent_message,
            whisper : ChatMessage.getWhisperRecipients(getCharacterName(character)),
            speaker: ChatMessage.getSpeaker({alias: "Door"})
          };
          ChatMessage.create(chatData, {});
        }else if(wall.data.door === 1){
          wall.update(
            {"door" : 0}
          );
        }
        */
      }else{
        // Congratulations you are in reach
        // MOD 4535992 MAKE SURE THE DOOR REMAIN CLOSED/OPEN AFTER CLICK ONLY WITH OVERRIDE
        const doorControl = this;
        let wall:Wall = getCanvas().walls.get(doorControl.wall.data._id); 
        if(wall){
          if(wall.data.ds==0)
          {
            await getCanvas().walls.get(doorControl.wall.data._id).update({
                ds : 1
            });
          }else if(wall.data.ds==1){
            await getCanvas().walls.get(doorControl.wall.data._id).update({
                ds : 0
            });
          }else{
            error("No 'ds' property found for value '"+wall.data.ds+"' for id : " + doorControl.wall.data._id );
          }
        }else{
          error("No wall found for id : " + doorControl.wall.data._id);
        }
      }
      // END MOD ABD 4535992
    }

  } else if(game.user.isGM) {
    const doorControl = this;
    let wall:Wall = getCanvas().walls.get(doorControl.wall.data._id); 
    if(wall){
      if(wall.data.ds==0)
      {
        await getCanvas().walls.get(doorControl.wall.data._id).update({
            ds : 1
        });
      }else if(wall.data.ds==1){
        await getCanvas().walls.get(doorControl.wall.data._id).update({
            ds : 0
        });
      }else{
        error("No 'ds' property found for value '"+wall.data.ds+"' for id : " + doorControl.wall.data._id );
      }
    }else{
      error("No wall found for id : " + doorControl.wall.data._id);
    }
  }

  // If settings is true do not deselect the current select token
  if(<boolean>game.settings.get(MODULE_NAME, "forceReSelection")) {
    if( !character ) {
      iteractionFailNotification("No character is selected to interact with a door");
      //return;
    }else{
      const observable = getCanvas().tokens.placeables.filter(t => t.id === character.id);
      if (observable !== undefined){
          observable[0].control();
      }
    }
  }

    // Call original method
    //return originalMethod.apply(this,arguments);
    //return wrapped(...args);
}

// Interact with door ------------------------------------------------------------------
export const interactWithNearestDoor = function(token, offsetx = 0, offsety = 0) {
    // Max distance definition
    let gridSize = getCanvas().dimensions.size;
    let maxDistance = Infinity;
    let globalMaxDistance = <number>game.settings.get(MODULE_NAME, "globalInteractionDistance");
    if( globalMaxDistance > 0 ) {
      if( globalMaxDistance < maxDistance ){
         maxDistance = globalMaxDistance;
      }
    } else {
      maxDistance = <number>game.settings.get(MODULE_NAME, "doorInteractionDistance");
    }
      
    // Shortest dist
    let shortestDistance = Infinity;
    var closestDoor = null;

    // Find closest door
    let charCenter = getTokenCenter(token);
    charCenter.x += offsetx * gridSize;
    charCenter.y += offsety * gridSize;
    
    for( let i = 0; i < getCanvas().controls.doors.children.length ; i++ ) {
      let door = getCanvas().controls.doors.children[i];
      
      let dist = getManhattanBetween(door, charCenter);
      let distInGridUnits = (dist / gridSize) - 0.1;

      
      if ( distInGridUnits < maxDistance && dist < shortestDistance ) {
        closestDoor = door;
        shortestDistance = dist;
      }
    }
    
    // Operate the door
    if(closestDoor) {
      // Create a fake function... Ugly, but at same time take advantage of existing door interaction function of core FVTT
      let fakeEvent = { stopPropagation: event => {return;} };
      closestDoor._onMouseDown(fakeEvent);
    } else {
      
      var tokenName = getCharacterName(token);

      if (tokenName) iteractionFailNotification("No door was found within " + tokenName + "'s reach" );
      else iteractionFailNotification("No door was found within reach" );
      return;
    }
}

// Get token center
export const getTokenCenter = function(token) {
    let tokenCenter = {x: token.x , y: token.y };
    tokenCenter.x += -20 + ( token.w * 0.50 );
    tokenCenter.y += -20 + ( token.h * 0.50 );
    return tokenCenter;
}

// Get chracter name from token
export const getCharacterName = function(token) {
  var tokenName = null;
  if( token.name ) {
    tokenName = token.name;
  } else if (token.actor && token.actor.data && token.actor.data.name) {
    tokenName = token.actor.data.name;
  }
  return tokenName;
}

// Interation fail messages
export const iteractionFailNotification = function(message) {
  if( !game.settings.get(MODULE_NAME, "notificationsInteractionFail") ){
     return;
  }
  ui.notifications.warn(message);
}

// Returns the first selected token or owned token
export const getFirstPlayerToken = function() {
    // Get first token ownted by the player 
    let selectedTokens = getSelectedOrOwnedTokens();  
    if(!selectedTokens || selectedTokens.length == 0){
      return null;
    }
    return selectedTokens[0];  
}

// Returns a list of selected (or owned, if no token is selected)
export const getSelectedOrOwnedTokens = function() 
{
  let controlled = getCanvas().tokens.controlled;
  if (controlled.length > 1) {
      ui.notifications.warn("Please selected a single token");
      return;
  }
  // MOD 4535992 Removed not make sense
  // if(!controlled || controlled.length == 0 ){
  //   controlled = getCanvas().tokens.ownedTokens;
  // }
  return controlled;
}

// Simple Manhattan Distance between two objects that have x and y attrs.
export const getManhattanBetween = function(obj1, obj2)  {
  // console.log("[" + obj1.x + " , " + obj1.y + "],[" + obj2.x + " , " + obj2.y + "]"); // DEBUG
  return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y);
}

// Check if active document is the canvas
export const isFocusOnCanvas = function() {
  if(   !document.activeElement || 
        !document.activeElement.attributes ||
        !document.activeElement.attributes['class'] ||
        document.activeElement.attributes['class'].value.substr(0,8) !== "vtt game" 
    ) 
  { 
    return false;
  }
  else 
  { 
    return true;
  }
}
