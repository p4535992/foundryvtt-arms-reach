
/******************************************************************************************


RESET DOORS AND FOG BUTTONS


 ******************************************************************************************/

import { log } from "../foundryvtt-arms-reach";
import { getCanvas, getGame } from "./settings";

export const ResetDoorsAndFog = {

//Just a parent function for both sub functions. Kept functionality separate in case I want to detangle them later.
resetDoorsAndFog : async function (scene){
    let isCurrentScene = scene.data._id == getCanvas().scene?.data._id;
    await this.resetDoors(isCurrentScene,scene.data._id);
    await this.resetFog(isCurrentScene,scene.data._id);
},
/******** RESET DOOR **************/

resetDoors : async function (isCurrentScene,id){
    if(isCurrentScene){
        await getCanvas().walls?.doors.filter((item) => item.data.ds == 1).forEach((item)=> item.update({ds:0},{}));
    }else{
        if(id){
            log(getGame().scenes?.get(id)?.data.walls.filter((item)=> item.door != 0))
            await getGame().scenes?.get(id)?.data.walls.filter((item)=> item.door != 0).forEach((x) => x.ds = 0);
        }
    }
    ui.notifications?.info(`Doors have been shut.`);
},

/**********************************/

/******** RESET FOG **************/

resetFog : async function (isCurrentScene,id=null){
    if(isCurrentScene){
      getCanvas().sight?.resetFog();
    }else{
      //@ts-ignore
      const response = await SocketInterface.dispatch("modifyDocument", {
          type: "FogExploration",
          action: "delete",
          data: {scene:id},
          options: {reset: true},
          //parentId: "",
          //parentType: ""
      });
      ui.notifications?.info(`Fog of War exploration progress was reset.`);
    }

},
/**********************************/
//Credit to Winks' Everybody Look Here for the code to add menu option to Scene Nav
getContextOption2 : function (idField) {
    return {
        name: "Reset Doors & Fog",
        icon: '<i class="fas fa-dungeon"></i>',
        condition: li => getGame().user?.isGM,
        callback: li => {
            let scene = getGame().scenes?.get(li.data(idField));
            ResetDoorsAndFog.resetDoorsAndFog(scene)
        }
    };
}

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

}
/*********************************************************************************/
