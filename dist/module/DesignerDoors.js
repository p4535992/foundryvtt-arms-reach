import { log } from "../foundryvtt-arms-reach.js";
// import { Cloneable } from "./libs/Clonable";
import { MODULE_NAME } from "./settings.js";
// // Global function to cache default textures
// const cacheTex = ((key) => {
//   const defaultPath = <string>game.settings.get(MODULE_NAME, key);
//   TextureLoader.loader.loadTexture(defaultPath.replace("[data]", "").trim());
// });
export const DesignerDoors = {
    // Global function to cache default textures
    cacheTex: (key) => {
        const defaultPath = String(game.settings.get(MODULE_NAME, key)).replace("[data]", "").trim();
        TextureLoader.loader.loadTexture(defaultPath);
    },
    init: function () {
        // Cache default icons on setup of world
        log(`Loading ${MODULE_NAME} default door textures`);
        DesignerDoors.cacheTex('doorClosedDefault');
        DesignerDoors.cacheTex('doorOpenDefault');
        DesignerDoors.cacheTex('doorLockedDefault');
        log(`${MODULE_NAME} texture loading complete`);
    },
    // Override of the original getTexture method.
    // Adds additional logic for checking which icon to return
    getTextureOverride: async function (doorControl) {
        if (doorControl.wall.getFlag(MODULE_NAME, 'doorIcon') === undefined) {
            let s = doorControl.wall.data.ds;
            const ds = CONST.WALL_DOOR_STATES;
            if (!game.user.isGM && s === ds.LOCKED)
                s = ds.CLOSED;
            const textures = {
                [ds.LOCKED]: String(game.settings.get(MODULE_NAME, 'doorLockedDefault')).replace("[data]", "").trim(),
                [ds.CLOSED]: String(game.settings.get(MODULE_NAME, 'doorClosedDefault')).replace("[data]", "").trim(),
                [ds.OPEN]: String(game.settings.get(MODULE_NAME, 'doorOpenDefault')).replace("[data]", "").trim(),
            };
            return await getTexture(textures[s].replace("[data]", "").trim() || ds.CLOSED);
        }
        let s = doorControl.wall.data.ds;
        const ds = CONST.WALL_DOOR_STATES;
        if (!game.user.isGM && s === ds.LOCKED) {
            s = ds.CLOSED;
        }
        const wallPaths = doorControl.wall.getFlag(MODULE_NAME, 'doorIcon');
        const textures = {
            [ds.LOCKED]: wallPaths.doorLockedPath,
            [ds.CLOSED]: wallPaths.doorClosedPath,
            [ds.OPEN]: wallPaths.doorOpenPath,
        };
        // {
        //   "doorClosedPath": "modules/foundryvtt-arms-reach/assets/icons/door-closed.svg",
        //   "doorOpenPath": "modules/foundryvtt-arms-reach/assets/icons/door-exit.svg",
        //   "doorLockedPath": "modules/foundryvtt-arms-reach/assets/icons/padlock.svg"
        // }
        // return await getTexture(textures[s].replace("[data]", "").trim() || ds.CLOSED);
        return await DesignerDoors.getTextureBugFixKeyOverride(textures[s].replace("[data]", "").trim() || ds.CLOSED, s, textures[s].replace("[data]", "").trim());
    },
    /**
    * Get a single texture from the cache
    * TODO WHY I NEED THIS ???? The method TextLoader seem to lose the data ????
    * @param {string} src
    * @return {PIXI.Texture}
    */
    getTextureBugFixKeyOverride: function (src, dss, correctvalue) {
        let cached = TextureLoader.loader.getCache(src);
        if (!cached || !cached.valid) {
            //let cachedDefault = null;
            if (dss == CONST.WALL_DOOR_STATES.CLOSED || dss == String(game.settings.get(MODULE_NAME, 'doorClosedDefault')).replace("[data]", "").trim()) {
                if (!TextureLoader.loader.getCache(correctvalue)) {
                    let cachedDefault1 = TextureLoader.loader.getCache(String(game.settings.get(MODULE_NAME, 'doorClosedDefault')).replace("[data]", "").trim());
                    let cachedClone1 = new PIXI.Texture(PIXI.BaseTexture.from(correctvalue)); //Cloneable.clone(cachedDefault1);//Object.assign([], cachedDefault1);
                    //cachedClone1.baseTexture = PIXI.BaseTexture.from(correctvalue);
                    TextureLoader.loader.cache.set(correctvalue, cachedClone1);
                }
                cached = TextureLoader.loader.getCache(src);
                return cached;
                // cachedDefault.baseTexture = PIXI.BaseTexture.from(correctvalue);
                // return cachedDefault;
            }
            else if (dss == CONST.WALL_DOOR_STATES.OPEN || dss == String(game.settings.get(MODULE_NAME, 'doorOpenDefault')).replace("[data]", "").trim()) {
                if (!TextureLoader.loader.getCache(correctvalue)) {
                    let cachedDefault2 = TextureLoader.loader.getCache(String(game.settings.get(MODULE_NAME, 'doorOpenDefault')).replace("[data]", "").trim());
                    let cachedClone2 = new PIXI.Texture(PIXI.BaseTexture.from(correctvalue)); //Cloneable.clone(cachedDefault2);//Object.assign([], cachedDefault2);
                    //cachedClone2.baseTexture = PIXI.BaseTexture.from(correctvalue);
                    TextureLoader.loader.cache.set(correctvalue, cachedClone2);
                }
                cached = TextureLoader.loader.getCache(src);
                return cached;
                // cachedDefault.baseTexture = PIXI.BaseTexture.from(correctvalue);
                // return cachedDefault;
            }
            else if (dss == CONST.WALL_DOOR_STATES.LOCKED || dss == String(game.settings.get(MODULE_NAME, 'doorLockedDefault')).replace("[data]", "").trim()) {
                if (!TextureLoader.loader.getCache(correctvalue)) {
                    let cachedDefault3 = TextureLoader.loader.getCache(String(game.settings.get(MODULE_NAME, 'doorLockedDefault')).replace("[data]", "").trim());
                    let cachedClone3 = new PIXI.Texture(PIXI.BaseTexture.from(correctvalue)); //Cloneable.clone(cachedDefault3);//Object.assign([], cachedDefault3);
                    //cachedClone3.baseTexture = PIXI.BaseTexture.from(correctvalue);
                    TextureLoader.loader.cache.set(correctvalue, cachedClone3);
                }
                cached = TextureLoader.loader.getCache(src);
                return cached;
                // cachedDefault.baseTexture = PIXI.BaseTexture.from(correctvalue);
                // return cachedDefault;
            }
            else {
                return null;
            }
        }
        return cached;
    },
    // Wall Config extension. Allows each door to have individual icons
    renderWallConfigHandler: function (app, html, data) {
        // If the wall is not a door, break out of this script.
        // This will stop Designer Doors being added to the wall config form
        if (data.object.door === 0) {
            app.setPosition({
                height: 270,
                width: 400,
            });
            return;
        }
        // If the wall is a door, extend the size of the wall config form
        app.setPosition({
            height: 700,
            width: 400,
        });
        let thisDoor; // Object containing closed, open and locked paths as parameters
        // Flag logic.
        // Check for initial flag. If not present set default values.
        if (app.object.getFlag(MODULE_NAME, 'doorIcon') === undefined) {
            // If wall has no flag, populate thisDoor from default settings
            thisDoor = {
                doorClosedPath: String(game.settings.get(MODULE_NAME, 'doorClosedDefault')).replace("[data]", "").trim(),
                doorOpenPath: String(game.settings.get(MODULE_NAME, 'doorOpenDefault')).replace("[data]", "").trim(),
                doorLockedPath: String(game.settings.get(MODULE_NAME, 'doorLockedDefault')).replace("[data]", "").trim(),
            };
            // Then set flag with contents of thisDoor
            app.object.setFlag(MODULE_NAME, 'doorIcon', thisDoor);
        }
        else {
            // If the flag already exist, populate thisDoor with the flag
            thisDoor = app.object.getFlag(MODULE_NAME, 'doorIcon');
        }
        const doorClosedFlag = thisDoor.doorClosedPath;
        const doorOpenFlag = thisDoor.doorOpenPath;
        const doorLockedFlag = thisDoor.doorLockedPath;
        // html to extend Wall Config form
        const message = `<div class="form-group">
        <label>Door Icons</label>
        <p class="notes">File paths to icons representing various door states.</p>
        </div>

    <div class="form-group">
		<label>Door Close</label>
		<div class="form-fields">
			<button type="button" class="file-picker" data-type="img" data-target="flags.${MODULE_NAME}.doorIcon.doorClosedPath" title="Browse Files" tabindex="-1">
			    <i class="fas fa-file-import fa-fw"></i>
			</button>
			<input class="img" type="text" name="flags.${MODULE_NAME}.doorIcon.doorClosedPath" value="${doorClosedFlag ? doorClosedFlag : ``}" placeholder="Closed Door Icon Path" data-dtype="String" />
		</div>
	</div>

    <div class="form-group">
		<label>Door Open</label>
		<div class='form-fields'>
			<button type='button' class='file-picker' data-type='img' data-target='flags.${MODULE_NAME}.doorIcon.doorOpenPath' title='Browse Files' tabindex='-1'>
				<i class='fas fa-file-import fa-fw'></i>
			</button>
			<input class='img' type='text' name='flags.${MODULE_NAME}.doorIcon.doorOpenPath' value='${doorOpenFlag ? doorOpenFlag : ``}' placeholder='Open Door Icon Path' data-dtype='String' />
	    </div>
	</div>

    <div class='form-group'>
		<label>Door Locked</label>
		<div class='form-fields'>
			<button type='button' class='file-picker' data-type='img' data-target='flags.${MODULE_NAME}.doorIcon.doorLockedPath' title='Browse Files' tabindex='-1'>
			    <i class='fas fa-file-import fa-fw'></i>
			</button>
			<input class='img' type='text' name='flags.${MODULE_NAME}.doorIcon.doorLockedPath' value='${doorLockedFlag ? doorLockedFlag : ``}' placeholder='Locked Door Icon Path' data-dtype='String' />
        </div>
	</div>
    `;
        // Thanks to Calego#0914 on the League of Extraordinary FoundryVTT Developers
        // Discord server for the jQuery assistance here.
        // Adds form-group and buttons to the correct position on the Wall Config
        html.find('.form-group').last().after(message);
        // File Picker buttons
        const button1 = html.find(`button[data-target="flags.${MODULE_NAME}.doorIcon.doorClosedPath"]`)[0];
        const button2 = html.find(`button[data-target="flags.${MODULE_NAME}.doorIcon.doorOpenPath"]`)[0];
        const button3 = html.find(`button[data-target="flags.${MODULE_NAME}.doorIcon.doorLockedPath"]`)[0];
        app._activateFilePicker(button1);
        app._activateFilePicker(button2);
        app._activateFilePicker(button3);
        // On submitting the Wall Config form, requested textures are added to the cache
        const form = document.getElementById('wall-config');
        form.addEventListener('submit', (e) => {
            const nameDefCP = `flags.${MODULE_NAME}.doorIcon.doorClosedPath`;
            const nameDefOP = `flags.${MODULE_NAME}.doorIcon.doorOpenPath`;
            const nameDefLP = `flags.${MODULE_NAME}.doorIcon.doorLockedPath`;
            //@ts-ignore
            const wallConfDCD = document.getElementsByName(nameDefCP)[0].value; // TODO HTMLElement property value not mapped
            //@ts-ignore
            const wallConfDOD = document.getElementsByName(nameDefOP)[0].value; // TODO HTMLElement property value not mapped
            //@ts-ignore
            const wallConfDLD = document.getElementsByName(nameDefLP)[0].value; // TODO HTMLElement property value not mapped
            e.preventDefault();
            TextureLoader.loader.loadTexture(wallConfDCD.replace("[data]", "").trim());
            TextureLoader.loader.loadTexture(wallConfDOD.replace("[data]", "").trim());
            TextureLoader.loader.loadTexture(wallConfDLD.replace("[data]", "").trim());
            if (!TextureLoader.loader.getCache(wallConfDCD.replace("[data]", "").trim())) {
                let cachedDefault1 = TextureLoader.loader.getCache(String(game.settings.get(MODULE_NAME, 'doorClosedDefault')).replace("[data]", "").trim());
                let cachedClone1 = new PIXI.Texture(PIXI.BaseTexture.from(wallConfDCD.replace("[data]", "").trim())); //Cloneable.clone(cachedDefault1);//Object.assign([], cachedDefault1);
                //cachedClone1.baseTexture = PIXI.BaseTexture.from(wallConfDCD.replace("[data]", "").trim());
                TextureLoader.loader.cache.set(wallConfDCD.replace("[data]", "").trim(), cachedClone1);
            }
            if (!TextureLoader.loader.getCache(wallConfDOD.replace("[data]", "").trim())) {
                let cachedDefault2 = TextureLoader.loader.getCache(String(game.settings.get(MODULE_NAME, 'doorOpenDefault')).replace("[data]", "").trim());
                let cachedClone2 = new PIXI.Texture(PIXI.BaseTexture.from(wallConfDOD.replace("[data]", "").trim())); //Cloneable.clone(cachedDefault2);//Object.assign([], cachedDefault2);
                //cachedClone2.baseTexture = PIXI.BaseTexture.from(wallConfDOD.replace("[data]", "").trim());
                TextureLoader.loader.cache.set(wallConfDOD.replace("[data]", "").trim(), cachedClone2);
            }
            if (!TextureLoader.loader.getCache(wallConfDLD.replace("[data]", "").trim())) {
                let cachedDefault3 = TextureLoader.loader.getCache(String(game.settings.get(MODULE_NAME, 'doorLockedDefault')).replace("[data]", "").trim());
                let cachedClone3 = new PIXI.Texture(PIXI.BaseTexture.from(wallConfDLD.replace("[data]", "").trim())); //Cloneable.clone(cachedDefault3);//Object.assign([], cachedDefault3);
                //cachedClone3.baseTexture = PIXI.BaseTexture.from(wallConfDLD.replace("[data]", "").trim());
                TextureLoader.loader.cache.set(wallConfDLD.replace("[data]", "").trim(), cachedClone3);
            }
            // Update flags
            // // If wall has no flag, populate thisDoor from default settings
            // thisDoor = {
            //   doorClosedPath: wallConfDCD.replace("[data]", "").trim(),
            //   doorOpenPath: wallConfDOD.replace("[data]", "").trim(),
            //   doorLockedPath: wallConfDLD.replace("[data]", "").trim(),
            // };
            // // Then set flag with contents of thisDoor
            // app.object.setFlag(MODULE_NAME, 'doorIcon',thisDoor);
        });
    },
    // // Cache default textures on submitting Settings Config
    // // Only really needed if default textures are changed, but as I haven't
    // // yet figured out how to only run on changes, it will just run on every
    // // submission of the settings form.
    // renderSettingsConfigHandler: function(app, html, user){
    //   const form = document.getElementById('client-settings');
    //   form.addEventListener('submit', (e) => {
    //       const setDefCD = document.getElementsByName(`${MODULE_NAME}.doorClosedDefault`);
    //       const setDefOD = document.getElementsByName(`${MODULE_NAME}.doorOpenDefault`);
    //       const setDefLD = document.getElementsByName(`${MODULE_NAME}.doorLockedDefault`);
    //       e.preventDefault();
    //       //@ts-ignore
    //       TextureLoader.loader.loadTexture(setDefCD[0].value.replace("[data]", "").trim()); // TODO HTMLElement property value not mapped
    //       //@ts-ignore
    //       TextureLoader.loader.loadTexture(setDefOD[0].value.replace("[data]", "").trim()); // TODO HTMLElement property value not mapped
    //       //@ts-ignore
    //       TextureLoader.loader.loadTexture(setDefLD[0].value.replace("[data]", "").trim()); // TODO HTMLElement property value not mapped
    //   });
    // },
    // On scene change, scan for doors and cache textures
    canvasInitHandler: function () {
        // List of all walls in scene
        const sceneWalls = game.scenes.viewed.data.walls;
        for (let i = 0; i < sceneWalls.length; i++) {
            // Check wall for designerdoors flag
            if (MODULE_NAME in sceneWalls[i].flags) {
                const wall = sceneWalls[i];
                // If flag found, extract three paths and add files to cache
                // const wcCD = wall.flags.designerdoors.doorIcon.doorClosedPath;
                // const wcOD = wall.flags.designerdoors.doorIcon.doorOpenPath;
                // const wcLD = wall.flags.designerdoors.doorIcon.doorLockedPath;
                const wcCD = wall.flags[MODULE_NAME]['doorIcon'].doorClosedPath;
                const wcOD = wall.flags[MODULE_NAME]['doorIcon'].doorOpenPath;
                const wcLD = wall.flags[MODULE_NAME]['doorIcon'].doorLockedPath;
                TextureLoader.loader.loadTexture(wcCD.replace("[data]", "").trim());
                TextureLoader.loader.loadTexture(wcOD.replace("[data]", "").trim());
                TextureLoader.loader.loadTexture(wcLD.replace("[data]", "").trim());
                if (!TextureLoader.loader.getCache(wcCD.replace("[data]", "").trim())) {
                    let cachedDefault1 = TextureLoader.loader.getCache(String(game.settings.get(MODULE_NAME, 'doorClosedDefault')).replace("[data]", "").trim());
                    let cachedClone1 = new PIXI.Texture(PIXI.BaseTexture.from(wcCD.replace("[data]", "").trim())); //Cloneable.clone(cachedDefault1);//Object.assign([], cachedDefault1);
                    //cachedClone1.baseTexture = PIXI.BaseTexture.from(wcCD.replace("[data]", "").trim());
                    TextureLoader.loader.cache.set(wcCD.replace("[data]", "").trim(), cachedClone1);
                }
                if (!TextureLoader.loader.getCache(wcOD.replace("[data]", "").trim())) {
                    let cachedDefault2 = TextureLoader.loader.getCache(String(game.settings.get(MODULE_NAME, 'doorOpenDefault')).replace("[data]", "").trim());
                    let cachedClone2 = new PIXI.Texture(PIXI.BaseTexture.from(wcOD.replace("[data]", "").trim())); //Cloneable.clone(cachedDefault2);//Object.assign([], cachedDefault2);
                    //cachedClone2.baseTexture = PIXI.BaseTexture.from(wcOD.replace("[data]", "").trim());
                    TextureLoader.loader.cache.set(wcOD.replace("[data]", "").trim(), cachedClone2);
                }
                if (!TextureLoader.loader.getCache(wcLD.replace("[data]", "").trim())) {
                    let cachedDefault3 = TextureLoader.loader.getCache(String(game.settings.get(MODULE_NAME, 'doorLockedDefault')).replace("[data]", "").trim());
                    let cachedClone3 = new PIXI.Texture(PIXI.BaseTexture.from(wcLD.replace("[data]", "").trim())); //Cloneable.clone(cachedDefault3);//Object.assign([], cachedDefault3);
                    //cachedClone3.baseTexture = PIXI.BaseTexture.from(wcLD.replace("[data]", "").trim());
                    TextureLoader.loader.cache.set(wcLD.replace("[data]", "").trim(), cachedClone3);
                }
            }
        }
        // Cache default icons on scene change
        log(`Loading ${MODULE_NAME} default door textures`);
        DesignerDoors.cacheTex('doorClosedDefault');
        DesignerDoors.cacheTex('doorOpenDefault');
        DesignerDoors.cacheTex('doorLockedDefault');
        log(`${MODULE_NAME} texture loading complete`);
    },
    // /**
    //  * Draw the DoorControl icon, displaying it's icon texture and border
    //  * @return {Promise<DoorControl>}
    //  */
    // draw : async function(doorControl) {
    //   // Remove existing components
    //   doorControl.icon = doorControl.icon || doorControl.addChild(new PIXI.Sprite());
    //   doorControl.icon.width = doorControl.icon.height = 40;
    //   doorControl.icon.alpha = 0.6;
    //   //doorControl.icon.texture = await doorControl._getTexture();
    //   doorControl.icon.texture = await DesignerDoors.getTextureOverride(doorControl);
    //   // Background
    //   doorControl.bg = doorControl.bg || doorControl.addChild(new PIXI.Graphics());
    //   doorControl.bg.clear().beginFill(0x000000, 1.0).drawRoundedRect(-2, -2, 44, 44, 5).endFill();
    //   doorControl.bg.alpha = 0;
    //   // Border
    //   doorControl.border = doorControl.border || doorControl.addChild(new PIXI.Graphics());
    //   doorControl.border.clear().lineStyle(1, 0xFF5500, 0.8).drawRoundedRect(-2, -2, 44, 44, 5).endFill();
    //   doorControl.border.visible = false;
    //   // Add control interactivity
    //   doorControl.interactive = true;
    //   doorControl.interactiveChildren = false;
    //   doorControl.hitArea = new PIXI.Rectangle(-2, -2, 44, 44);
    //   // Set position
    //   doorControl.reposition();
    //   doorControl.alpha = 1.0;
    //   // Activate listeners
    //   doorControl.removeAllListeners();
    //   doorControl.on("mouseover", doorControl._onMouseOver)
    //       .on("mouseout", doorControl._onMouseOut)
    //       .on("mousedown", doorControl._onMouseDown)
    //       .on('rightdown', doorControl._onRightDown);
    //   // Return the control icon
    //   return doorControl;
    // }
};
