


/* ------------------------------------ */
/* When ready							*/

import { getCanvas, MODULE_NAME } from "./settings";

export const ShowDoorIcons = {

  controlsLayerPrototypeDrawDoorsHandler : async function (controlsLayer) {
    // Create the container
    if ( controlsLayer.doors ) {
      controlsLayer.doors.destroy({children: true});
      controlsLayer.doors = null;
    }
    const doors = new PIXI.Container();

    // Iterate over all walls, selecting the doors
    for ( let w of getCanvas().walls.placeables ) {
      if ( w.data.door === CONST.WALL_DOOR_TYPES.NONE ) {
        continue;
      }
      if ( (w.data.door === CONST.WALL_DOOR_TYPES.SECRET) && !game.user.isGM ){
        continue;
      }
      let dc = doors.addChild(new DoorControl(w));
      if(<boolean>game.settings.get(MODULE_NAME, "enabledShowDoorIcons")) {
        dc.visible = true;
      }else {
        dc.visible = false; // Start door controls as initially not visible and reveal them later
      }

      if(dc.transform.scale){
        await dc.draw();
      }
    }
    controlsLayer.doors = controlsLayer.addChild(doors);

    // Toggle visibility for the set of door control icons
    if(<boolean>game.settings.get(MODULE_NAME, "enabledShowDoorIcons")) {
      controlsLayer.doors.visible = !getCanvas().walls._active;
    }
  },

  // THERE IS SOME STRANGE NOT RESOLVABLE ERROR BUT IT?S SEEMS NOT NEEDED FOR THE SCOPE OF THE MODULE
  wallPrototypeOnModifyWallHandler : async function (state) {
    if(getCanvas()){
      //const state = args[0];
      //@ts-ignore
      getCanvas().addPendingOperation("ControlsLayer.drawDoors", getCanvas().controls.drawDoors, getCanvas().controls);
      if ( state ) {
        await getCanvas().sight.initialize(); // This needs to happen first to rebuild FOV/LOS polygons
        //getCanvas().lighting.initialize();
        
        getCanvas().lighting.releaseAll();
        getCanvas().sounds.initialize();
      }
      getCanvas().triggerPendingOperations();
    }
  },

  //Overwrite Activate call to prevent doors from going invisible.
  wallsLayerPrototypeActivateHandler : function () {
    if(getCanvas()){
      //PlaceablesLayer.prototype.activate.call(this)
      //Force Show Doors is set to True
      if (getCanvas().controls){
        getCanvas().controls.doors.visible = false;
      }
    }
  }
}
