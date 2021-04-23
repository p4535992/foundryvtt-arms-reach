// var superwall_id = '';
// var mod = "ambientdoors"; // our mod scope & name

import { MODULE_NAME } from "./settings";

export const AmbientDoors = {

  //Change Play to play ambient sound, add range value. If global range, play sound as is. Waiting  on Foundry 0.8.x

  // Hooks.once("init", () => {
  // 	//get the core doorMouse handler to be used in most cases
  // 	const doorMouseDownHandler = DoorControl.prototype._onMouseDown;
  // 	DoorControl.prototype._onMouseDown = function (event) {

  // 		//check to see if the door is locked, otherwise use normal handler
  // 		if(this.wall.data.ds === CONST.WALL_DOOR_STATES.LOCKED) {
  // 			// Call new handler first. Only allow the original handler to run if our new handler does not return ture
  // 			const eventLockJingle = onDoorMouseDown.call(this, event)
  // 			if (eventLockJingle) return
  // 		}
  // 		return doorMouseDownHandler.call(this, event)
  // 	}
  // });

  onDoorMouseDownCheck : function(doorControl){
    //check to see if the door is locked, otherwise use normal handler
    if(doorControl.wall.data.ds === CONST.WALL_DOOR_STATES.LOCKED) {
      //if(this.wall.data.ds === CONST.WALL_DOOR_STATES.LOCKED) {
      // Call new handler first. Only allow the original handler to run if our new handler does not return true
      //const eventLockJingle = onDoorMouseDown.call(this, event);
      // if (eventLockJingle){
      //   return;
      // }
      AmbientDoors.onDoorMouseDown.call(doorControl, this);

    }
  },

  onDoorMouseDown : function (doorControl) {
    const doorData = this.wall.data.flags[MODULE_NAME]?.doorData || AmbientDoors.defaultDoorData();
    const playpath = doorData.lockJinglePath === "DefaultSound"? game.settings.get(MODULE_NAME, "lockedDoorJinglePathDefault") : doorData.lockJinglePath;
    const playVolume = doorData.lockJingleLevel;

    if(playpath != "" && playpath != null) {
          let fixedPlayPath = playpath.replace("[data]", "").trim();
          AudioHelper.play({src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false}, true);
      }
    //return true here to block the normal handler wich will only play sound on a per player basis.
    return true;
  },

  //grab the default sounds from the config paths
  defaultDoorData : function () {
    return {
      closePath: game.settings.get(MODULE_NAME, "closeDoorPathDefault"),
      closeLevel: game.settings.get(MODULE_NAME, "closeDoorLevelDefault"),
      openPath: game.settings.get(MODULE_NAME, "openDoorPathDefault"),
      openLevel: game.settings.get(MODULE_NAME, "openDoorLevelDefault"),
      lockPath: game.settings.get(MODULE_NAME, "lockDoorPathDefault"),
      lockLevel: game.settings.get(MODULE_NAME, "lockDoorLevelDefault"),
      unlockPath: game.settings.get(MODULE_NAME, "unlockDoorPathDefault"),
      unlockLevel: game.settings.get(MODULE_NAME, "unlockDoorLevelDefault"),
      lockJinglePath: game.settings.get(MODULE_NAME, "lockedDoorJinglePathDefault"),
      lockJingleLevel: game.settings.get(MODULE_NAME, "lockedDoorJingleLevelDefault")
    }
  },

  preUpdateWallHandler : async function(scene, object, updateData, diff, userID){

    if(
          (
          (object.door == 0 || updateData.ds == null) //Exit early if not a door OR door state not updating
      ||
          game.data.users.find(x => x._id === userID )['role'] >= game.settings.get(MODULE_NAME, "stealthDoor")
          )
          && game.keyboard.isDown("Alt")) // Exit if Sneaky Door Opening Mode
    {
      return;
    }

    let doorData;
    try {
          doorData = object.flags[MODULE_NAME].doorData;
      } //If data is set us that
    catch(err) {
          doorData = AmbientDoors.defaultDoorData();
      } //If no data is set use default sounds.

    let playpath = "";
    let playVolume = 0.8;

    if(object.ds == 2) { // Door Unlocking
      playpath = doorData.unlockPath === "DefaultSound"? game.settings.get(MODULE_NAME, "unlockDoorPathDefault") : doorData.unlockPath;
      playVolume = doorData.unlockLevel;
    }
    else if(updateData.ds == 0) { //Door Close
      playpath = doorData.closePath === "DefaultSound"? game.settings.get(MODULE_NAME, "closeDoorPathDefault") : doorData.closePath;
      playVolume = doorData.closeLevel;
    }
    else if(updateData.ds == 1) {//Door Open
      playpath = doorData.openPath === "DefaultSound"? game.settings.get(MODULE_NAME, "openDoorPathDefault") : doorData.openPath;
      playVolume = doorData.openLevel;
    }
    else if(updateData.ds == 2) {// Door Lock
      playpath = doorData.lockPath === "DefaultSound"? game.settings.get(MODULE_NAME, "lockDoorPathDefault") : doorData.lockPath;
      playVolume = doorData.lockLevel;
    }

    if(playpath != "" && playpath != null) {
      let fixedPlayPath = playpath.replace("[data]", "").trim();
      AudioHelper.play({src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false}, true);
    }

  },

  renderWallConfigHandler : function(app, html, data) {

    if(data.object.door == 0) {// if it's not a door don't worry
      app.setPosition({
      height: 270,
      width: 400
      });
      return;
    }

    app.setPosition({
      height: 650,
      width: 520
    });

    let thisDoor;

    if(app.object.getFlag(MODULE_NAME, "doorData") == null) {
      // thisDoor = defaultDoorData();
      thisDoor = {
        closePath: "DefaultSound",
        closeLevel: game.settings.get(MODULE_NAME, "closeDoorLevelDefault"),
        openPath: "DefaultSound",
        openLevel: game.settings.get(MODULE_NAME, "openDoorLevelDefault"),
        lockPath: "DefaultSound",
        lockLevel: game.settings.get(MODULE_NAME, "lockDoorLevelDefault"),
        unlockPath: "DefaultSound",
        unlockLevel: game.settings.get(MODULE_NAME, "unlockDoorLevelDefault"),
        lockJinglePath: "DefaultSound",
        lockJingleLevel: game.settings.get(MODULE_NAME, "lockedDoorJingleLevelDefault")
      };
      app.object.setFlag(MODULE_NAME, "doorData", thisDoor);
    }
    else {
      thisDoor = app.object.getFlag(MODULE_NAME, "doorData");
    }

    let closeFlag = thisDoor.closePath;
    let openFlag = thisDoor.openPath;
    let lockFlag = thisDoor.lockPath;
    let unLockFlag = thisDoor.unlockPath;
    let lockJingleFlag = thisDoor.lockJinglePath;

    const message =`
    <div class="form-group">
      <label>Door Sound Effects</label>
      <p class="notes"> File pathway to the soundeffect that will be played whenever a doors state is changed. Leave the pathway blank, or turn the level to zero for no sound effect. </p>
    </div>

      <div class="form-group">
      <label>Door Close</label>
      <div class="form-fields">
        <button type="button" class="file-picker" data-type="sound" data-target="flags.${MODULE_NAME}.doorData.closePath" title="Browse Files" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
        <input class="sound" type="text" name="flags.${MODULE_NAME}.doorData.closePath" value="${closeFlag ? closeFlag : ``}" placeholder="Door Close Sound Path" data-dtype="String" />
      </div>
    </div>

    <div class="form-group">
      <label>Close Door Sound Level</label>
      <div class="form-fields">
        <input type="range" name="flags.${MODULE_NAME}.doorData.closeLevel" value=${thisDoor.closeLevel}  min=0 max=2 step=0.05 data-dtype="Number">
        <span class="range-value">${thisDoor.closeLevel}</span>
      </div>
    </div>

      <div class="form-group">
      <label>Door Open</label>
      <div class="form-fields">
        <button type="button" class="file-picker" data-type="sound" data-target="flags.${MODULE_NAME}.doorData.openPath" title="Browse Files" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
        <input class="sound" type="text" name="flags.${MODULE_NAME}.doorData.openPath" value="${openFlag ? openFlag : ``}" placeholder="Door Open Sound Path" data-dtype="String" />
      </div>
    </div>

    <div class="form-group">
      <label>Open Door Sound Level</label>
      <div class="form-fields">
        <input type="range" name="flags.${MODULE_NAME}.doorData.openLevel" value=${thisDoor.openLevel}  min=0 max=2 step=0.05 data-dtype="Number">
        <span class="range-value">${thisDoor.openLevel}</span>
      </div>
    </div>

    <div class="form-group">
      <label>Door Lock</label>
      <div class="form-fields">
        <button type="button" class="file-picker" data-type="sound" data-target="flags.${MODULE_NAME}.doorData.lockPath" title="Browse Files" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
        <input class="sound" type="text" name="flags.${MODULE_NAME}.doorData.lockPath" value="${lockFlag ? lockFlag : ``}" placeholder="Door Lock Sound Path" data-dtype="String" />
      </div>
    </div>

    <div class="form-group">
      <label>Lock Door Sound Level</label>
      <div class="form-fields">
        <input type="range" name="flags.${MODULE_NAME}.doorData.lockLevel" value=${thisDoor.lockLevel}  min=0 max=2 step=0.05 data-dtype="Number">
        <span class="range-value">${thisDoor.lockLevel}</span>
      </div>
    </div>

    <div class="form-group">
      <label>Door Unlock</label>
      <div class="form-fields">
        <button type="button" class="file-picker" data-type="sound" data-target="flags.${MODULE_NAME}.doorData.unlockPath" title="Browse Files" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
        <input class="sound" type="text" name="flags.${MODULE_NAME}.doorData.unlockPath" value="${unLockFlag ? unLockFlag : ``}" placeholder="Door Unlock Sound Path" data-dtype="String" />
      </div>
    </div>

    <div class="form-group">
      <label>Unlock Door Sound Level</label>
      <div class="form-fields">
        <input type="range" name="flags.${MODULE_NAME}.doorData.unlockLevel" value=${thisDoor.unlockLevel}  min=0 max=2 step=0.05 data-dtype="Number">
        <span class="range-value">${thisDoor.unlockLevel}</span>
      </div>
    </div>

      <div class="form-group">
      <label>Locked Door Jingle</label>
      <div class="form-fields">
        <button type="button" class="file-picker" data-type="sound" data-target="flags.${MODULE_NAME}.doorData.lockJinglePath" title="Browse Files" tabindex="-1">
          <i class="fas fa-file-import fa-fw"></i>
        </button>
        <input class="sound" type="text" name="flags.${MODULE_NAME}.doorData.lockJinglePath" value="${lockJingleFlag ? lockJingleFlag : ``}" placeholder="Locked Door Jingle Sound Path" data-dtype="String" />
      </div>
    </div>

    <div class="form-group">
      <label>Locked Door Jingle Sound Level</label>
      <div class="form-fields">
        <input type="range" name="flags.${MODULE_NAME}.doorData.lockJingleLevel" value=${thisDoor.lockJingleLevel}  min=0 max=2 step=0.05 data-dtype="Number">
        <span class="range-value">${thisDoor.lockJingleLevel}</span>
      </div>
    </div>
    `;

    html.find(".form-group").last().after(message);
    
    const button = html.find('button[data-target="flags.'+MODULE_NAME+'.doorData.closePath"]')[0];
    const button2 = html.find('button[data-target="flags.'+MODULE_NAME+'.doorData.openPath"]')[0];
    const button3 = html.find('button[data-target="flags.'+MODULE_NAME+'.doorData.lockPath"]')[0];
    const button4 = html.find('button[data-target="flags.'+MODULE_NAME+'.doorData.unlockPath"]')[0];
    const button5 = html.find('button[data-target="flags.'+MODULE_NAME+'.doorData.lockJinglePath"]')[0];

    app._activateFilePicker(button);
    app._activateFilePicker(button2);
    app._activateFilePicker(button3);
    app._activateFilePicker(button4);
    app._activateFilePicker(button5);
  }
}
