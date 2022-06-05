import {getCurrentToken, getWeaponRanges} from "./utility.js"
import {keyboard} from "./keyboard.js";
import {TokenInfo} from "./tokenInfo.js";
import { debug, i18n, warn } from "../../lib/lib.js";
import CONSTANTS from "../../constants.js";
import API from "../../api.js";

export const TOGGLE_BUTTON = "combatRangeOverlayButton";

// noinspection JSUnusedLocalSymbols
async function _submitDialog(i, html) {
  debug("_submitDialog")// , i, html);
  const updateActor = html.find("[name=update-actor]")[0]?.checked;
  const speedOverride = html.find("[name=speed-override]")[0]?.value;
  const ignoreTerrain = html.find("[name=ignore-difficult-terrain]")[0]?.checked;
  await TokenInfo.current.setWeaponRange(i, updateActor);
  await TokenInfo.current.setSpeedOverride(speedOverride, updateActor);
  await TokenInfo.current.setIgnoreDifficultTerrain(ignoreTerrain, updateActor);
}

function _showRangeDialog() {
  const buttons = Object.fromEntries(getWeaponRanges()
    .map((i) =>
      [
        String(i),
          {
            icon: '',
            label: String(i),
            callback: (html) => _submitDialog(i, html)
          }
    ])
  );
  const defaultValue = String(getWeaponRanges()[0]);

  const speedOverride = TokenInfo.current.speedOverride ?? "";
  const ignoreDifficultTerrainChecked = TokenInfo.current.ignoreDifficultTerrain ? "checked" : "";
  const content:string[] = [];
  if (game.user?.isGM) {
    content.push(`<p>${i18n(`${CONSTANTS.MODULE_NAME}.quick-settings.update-actor-checkbox`)} <input name="update-actor" type="checkbox"/></p>`);
  }
  content.push(`<p>${i18n(`${CONSTANTS.MODULE_NAME}.quick-settings.ignore-difficult-terrain`)} <input name="ignore-difficult-terrain" type="checkbox" ${ignoreDifficultTerrainChecked}/></p>`);
  content.push(`<p>${i18n(`${CONSTANTS.MODULE_NAME}.quick-settings.speed-override`)} <input name="speed-override" type="text" value="${speedOverride}" size="3" style="width: 40px" maxlength="3"/>`);
  content.push(`<p>${i18n(`${CONSTANTS.MODULE_NAME}.quick-settings.weapon-range-header`)}</p>`);

  const d = new Dialog({
    title: i18n(`${CONSTANTS.MODULE_NAME}.quick-settings.title`),
    content: content.join("\n"),
    buttons: buttons,
    default: defaultValue
  }, {id: "croQuickSettingsDialog"});
  d.render(true);
}

export async function _toggleButtonClick(toggled, controls) {
  let isActive = game.settings.get(CONSTANTS.MODULE_NAME,'is-active');
  const wasActive = game.settings.get(CONSTANTS.MODULE_NAME,'is-active');

  if (keyboard.isDown("Shift")) {  // Pop quick settings
    const token = getCurrentToken();
    if (!token) {
      warn(i18n(`${CONSTANTS.MODULE_NAME}.controls.cant-open-no-selected-token`), true);
    } else {
      // Assume we want to activate if the user is opening the dialog
      isActive = true;

      _showRangeDialog();
    }
  } else if (keyboard.isDown("Control")) { // Reset measureFrom
    const token = getCurrentToken();
    if (!token) {
      warn(i18n(`${CONSTANTS.MODULE_NAME}.controls.cant-reset-no-token`), true);
    } else {
      TokenInfo.current.updateMeasureFrom();
      API.combatRangeOverlay.instance.fullRefresh();
    }
  } else {
    isActive = toggled;
    if (toggled) {
      API.combatRangeOverlay.instance.justActivated = true;
    }
  }

  // Ensure button matches active state
  // We _must_ set .active _before_ using await or the button will be drawn and we'll be too late
  controls.find(group => group.name === "token").tools.find(t => t.name === TOGGLE_BUTTON).active = isActive;
  await game.settings.set(CONSTANTS.MODULE_NAME,'is-active',isActive);

  if (!wasActive && isActive && TokenInfo.current && TokenInfo.current.speed === 0 && TokenInfo.current.getSpeedFromAttributes() == 0) {
    if (game.user?.isGM) {
      warn(i18n(`${CONSTANTS.MODULE_NAME}.token-speed-warning-gm`), true);
    } else {
      warn(i18n(`${CONSTANTS.MODULE_NAME}.token-speed-warning-player`), true);
      _showRangeDialog();
    }
  }
}

export let toggleButton;
// Hooks.on('getSceneControlButtons', (controls:SceneControl[]) => {
//   if (!toggleButton) {
//     toggleButton = {
//       name: TOGGLE_BUTTON,
//       title: `${CONSTANTS.MODULE_NAME}.controlButton`,
//       icon: "fas fa-people-arrows",
//       toggle: true,
//       active: game.settings.get(CONSTANTS.MODULE_NAME,'is-active'),
//       onClick: (toggled) => _toggleButtonClick(toggled, controls),
//       visible: true,  // TODO: Figure out how to disable this from Settings
//     }
//   }

//   const sceneControl = <SceneControl>controls.find((group:SceneControl) => group.name === "token");
//   if(sceneControl){
//     const tokenControls = sceneControl.tools;
//     tokenControls.push(toggleButton);
//   }
// });
