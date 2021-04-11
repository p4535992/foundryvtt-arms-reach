import { ArmsReachVariables } from "./ArmsReachVariables";
import { getCanvas, MODULE_NAME } from './settings';
// Door interaction
document.addEventListener('keydown', evt => {
	if (evt.key === 'e') {
    if(!game.settings.get(MODULE_NAME, "hotkeyDoorInteractionCenter")) { 
      return; 
    }
    if(ArmsReachVariables.door_interaction_cameraCentered) { 
      return; 
    }

    if( !isFocusOnCanvas() ) { 
      return; 
    }

    if( ArmsReachVariables.door_interaction_keydown == false ) {
      ArmsReachVariables.door_interaction_lastTime = Date.now();
      ArmsReachVariables.door_interaction_keydown = true;
    } else {
      // Center camera on character (if  key was pressed for a time)
      let diff = Date.now() - ArmsReachVariables.door_interaction_lastTime;
      if( diff > 500 ) {
        ArmsReachVariables.door_interaction_lastTime = Date.now();
        let character = getFirstPlayerToken();
        if( !character ) {
          iteractionFailNotification("No character is selected to center camera on.");
          return;
        }

        ArmsReachVariables.door_interaction_cameraCentered = true;
        getCanvas().animatePan({x: character.x, y: character.y});
      }
    }
  }
});

document.addEventListener('keyup', evt => {
	if (evt.key === 'e') {
    ArmsReachVariables.door_interaction_keydown = false;

    if(ArmsReachVariables.door_interaction_cameraCentered) {
      ArmsReachVariables.door_interaction_cameraCentered = false;
      return;
    }

    if( !isFocusOnCanvas() ) { return; }

    if (!game.settings.get(MODULE_NAME, "hotkeyDoorInteraction")) return;

    // Get first token ownted by the player
    let character = getFirstPlayerToken();

    if( !character ) {
      iteractionFailNotification("No character is selected to interact with a door.");
      return;
    }

    interactWithNearestDoor(character,0,0);
	}
});

// Double Tap to open nearest door -------------------------------------------------
document.addEventListener('keyup', evt => {
	if (evt.key === 'ArrowUp' || evt.key === 'w') {
    if(game.settings.get(MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) { 
      return; 
    }
    ifStuckInteract('up', 0, -0.5);
  }

	if (evt.key === 'ArrowDown' || evt.key === 's') {
    if(game.settings.get(MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) { 
      return; 
    }
    ifStuckInteract('down', 0, +0.5);
  }

	if (evt.key === 'ArrowRight' || evt.key === 'd') {
    if(game.settings.get(MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) { 
      return; 
    }
    ifStuckInteract('right', +0.5, 0);
  }

	if (evt.key === 'ArrowLeft' || evt.key === 'a') {
    if(game.settings.get(MODULE_NAME, "hotkeyDoorInteractionDelay") == 0) { 
      return; 
    }
    ifStuckInteract('left', -0.5, 0);
  }
});

function ifStuckInteract(key, offsetx, offsety) {
  let character = getFirstPlayerToken();
  if(!character) return;

  if( Date.now() - ArmsReachVariables.lastData[key] > game.settings.get(MODULE_NAME, "hotkeyDoorInteractionDelay") ) {
    ArmsReachVariables.lastData.x = character.x;
    ArmsReachVariables.lastData.y = character.y;
    ArmsReachVariables.lastData[key] = Date.now();
    return;
  }

  // See if character is stuck
  if(character.x == ArmsReachVariables.lastData.x && character.y == ArmsReachVariables.lastData.y) {
    interactWithNearestDoor(character, offsetx, offsety);
  }
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

      if (tokenName){
        iteractionFailNotification("No door was found within " + tokenName + "'s reach" );
      }
      else {
        iteractionFailNotification("No door was found within reach" );
      }
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
    if(!selectedTokens || selectedTokens.length == 0) return null;
    return selectedTokens[0];
}

// Returns a list of selected (or owned, if no token is selected)
export const getSelectedOrOwnedTokens = function()
{
  var controlled = getCanvas().tokens.controlled;
  if( controlled.length == 0 ) controlled = getCanvas().tokens.ownedTokens;
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
