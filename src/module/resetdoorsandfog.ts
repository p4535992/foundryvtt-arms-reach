import { info } from './lib/lib';

export const ResetDoorsAndFog = {
  resetDoorsAndFog: async function (isCurrentScene: boolean, id: string) {
    await ResetDoorsAndFog.resetDoors(isCurrentScene, id);
    await ResetDoorsAndFog.resetFog(isCurrentScene, id);
  },

  resetDoors: async function (isCurrentScene: boolean, id: string) {
    const updates = <any[]>[];
    if (isCurrentScene) {
      canvas.walls?.doors.filter((item) => item.data.ds === 1).forEach((item) => updates.push({ _id: item.id, ds: 0 }));
      await canvas.scene?.updateEmbeddedDocuments('Wall', updates);
    } else {
      if (id) {
        const scene = <Scene>game.scenes?.get(id);
        scene.data.walls.filter((item) => item.data.ds === 1).forEach((x) => updates.push({ _id: x.id, ds: 0 }));
        await scene.updateEmbeddedDocuments('Wall', updates);
      }
    }
    info(`Doors have been shut.`, true);
  },

  resetFog: async function (isCurrentScene: boolean, id: string) {
    if (isCurrentScene) {
      canvas.sight?.resetFog();
    } else {
      if (id) {
        await SocketInterface.dispatch('modifyDocument', {
          type: 'FogExploration',
          action: 'delete',
          data: { scene: id },
          options: { reset: true },
          parentId: '',
          parentType: '',
        });
        info(`Fog of War exploration progress was reset.`, true);
      }
    }
  },

  getContextOption: function (idField) {
    return {
      name: 'Reset Doors & Fog',
      icon: '<i class="fas fa-dungeon"></i>',
      condition: (li) => {
        return game.user?.isGM;
      },
      callback: async (li) => {
        let scene;
        if (idField) {
          scene = game.scenes?.get(li.data(idField));
        } else {
          scene = game.scenes?.get(li.data('entityId'));
          if (!scene) {
            scene = game.scenes?.get(li.data('documentId'));
          }
        }
        if (!scene) {
          return;
        }
        const isCurrentScene = scene.data._id == canvas.scene?.data._id;
        await ResetDoorsAndFog.resetDoorsAndFog(isCurrentScene, scene.data._id);
      },
    };
  },
};
