import { warn, error, debug, i18n } from "../foundryvtt-arms-reach";
import { ArmsReachVariables } from "./ArmsReachVariables";
import { MODULE_NAME } from './settings';

import { getFirstPlayerToken, iteractionFailNotification, getManhattanBetween, getTokenCenter, getCharacterName  } from './InteractWithDorrHelper';

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
    let originalMethod = DoorControl.prototype._onMouseDown;
    //@ts-ignore
    DoorControl.prototype._onMouseDown = function(event) {
      // Check distance
      if( !game.user.isGM ) {
        let character = getFirstPlayerToken();

        if( !character ) {
          iteractionFailNotification("No character is selected to interact with a door");
          return;
        }

        let dist = getManhattanBetween(this, getTokenCenter(character));
        let gridSize = canvas.dimensions.size;

        if ( (dist / gridSize) > game.settings.get(MODULE_NAME, "globalInteractionDistance") ) {
          var tokenName = getCharacterName(character);
          if (tokenName) iteractionFailNotification("Door not within " + tokenName + "'s reach" );
          else iteractionFailNotification("Door not in reach" );
          return;
        }
      }

      // Call original method
      return originalMethod.apply(this,arguments);
    };
  }

}
