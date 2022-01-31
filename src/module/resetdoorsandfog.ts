/******************************************************************************************


RESET DOORS AND FOG BUTTONS


 ******************************************************************************************/

import { log } from '../foundryvtt-arms-reach';
import { canvas, game } from './settings';

export const ResetDoorsAndFog = {
  //Just a parent function for both sub functions. Kept functionality separate in case I want to detangle them later.
  resetDoorsAndFog: async function (scene) {
    const isCurrentScene = scene.data._id == canvas.scene?.data._id;
    await this.resetDoors(isCurrentScene, scene.data._id);
    await this.resetFog(isCurrentScene, scene.data._id);
  },
  /******** RESET DOOR **************/

  resetDoors: async function (isCurrentScene, id) {
    if (isCurrentScene) {
      await canvas.walls?.doors
        .filter((item: Wall) => item.data.ds == 1)
        .forEach((item: Wall) => item.document.update({ ds: 0 }, {}));
    } else {
      if (id) {
        log(game.scenes?.get(id)?.data.walls.filter((item: WallDocument) => item.data.door != 0));
        await game.scenes
          ?.get(id)
          ?.data.walls.filter((item: WallDocument) => item.data.door != 0)
          .forEach((x) => (x.data.ds = 0));
      }
    }
    ui.notifications?.info(`Doors have been shut.`);
  },

  /**********************************/

  /******** RESET FOG **************/

  resetFog: async function (isCurrentScene, id = null) {
    if (isCurrentScene) {
      canvas.sight?.resetFog();
    } else {
      //@ts-ignore
      const response = await SocketInterface.dispatch('modifyDocument', {
        type: 'FogExploration',
        action: 'delete',
        data: { scene: id },
        options: { reset: true },
        //parentId: "",
        //parentType: ""
      });
      ui.notifications?.info(`Fog of War exploration progress was reset.`);
    }
  },
  /**********************************/
  //Credit to Winks' Everybody Look Here for the code to add menu option to Scene Nav
  getContextOption2: function (idField) {
    return {
      name: 'Reset Doors & Fog',
      icon: '<i class="fas fa-dungeon"></i>',
      condition: (li) => game.user?.isGM,
      callback: (li) => {
        const scene = game.scenes?.get(li.data(idField));
        ResetDoorsAndFog.resetDoorsAndFog(scene);
      },
    };
  },

  // ===============================================
  // HOOKS
  // ===============================================

  // //Adds menu option to Scene Nav and Directory
  // Hooks.on("getSceneNavigationContext", (html, contextOptions) => {
  //     contextOptions.push(ResetDoorsAndFog.getContextOption2('sceneId'));
  // });

  // Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) => {
  //     contextOptions.push(ResetDoorsAndFog.getContextOption2('entityId'));
  // });

  // //Adds Shut All Doors button to Walls Control Layer
  // Hooks.on("getSceneControlButtons", function(controls){

  //     controls[4].tools.splice(controls[4].tools.length-2,0,{
  //         name: "close",
  //         title: "Close Open Doors",
  //         icon: "fas fa-door-closed",
  //         onClick: () => {
  //             ResetDoorsAndFog.resetDoors(true);
  //         },
  //         button: true
  //     })
  //     return controls;

  // })
};
/*********************************************************************************/
