import CONSTANTS from "../constants.mjs";

// =============================
// Module Generic function
// =============================

export function isGMConnected() {
  return Array.from(game.users).find((user) => user.isGM && user.active) ? true : false;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ================================
// Logger utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, ...args) {
  try {
    if (
      game.settings.get(CONSTANTS.MODULE_ID, "debug") ||
      game.modules.get("_dev-mode")?.api?.getPackageDebugValue(CONSTANTS.MODULE_ID, "boolean")
    ) {
      console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, ...args);
    }
  } catch (e) {
    console.error(e.message);
  }
  return msg;
}

export function log(message, ...args) {
  try {
    message = `${CONSTANTS.MODULE_ID} | ${message}`;
    console.log(message.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return message;
}

export function notify(message, ...args) {
  try {
    message = `${CONSTANTS.MODULE_ID} | ${message}`;
    ui.notifications?.notify(message);
    console.log(message.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return message;
}

export function info(info, notify = false, ...args) {
  try {
    info = `${CONSTANTS.MODULE_ID} | ${info}`;
    if (notify) {
      ui.notifications?.info(info);
    }
    console.log(info.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return info;
}

export function warn(warning, notify = false, ...args) {
  try {
    warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
    if (notify) {
      ui.notifications?.warn(warning);
    }
    console.warn(warning.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return warning;
}

export function error(error, notify = true, ...args) {
  try {
    error = `${CONSTANTS.MODULE_ID} | ${error}`;
    if (notify) {
      ui.notifications?.error(error);
    }
    console.error(error.replace("<br>", "\n"), ...args);
  } catch (e) {
    console.error(e.message);
  }
  return new Error(error.replace("<br>", "\n"));
}

export function timelog(message) {
  warn(Date.now(), message);
}

export const i18n = (key) => {
  return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key, data = {}) => {
  return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
  return `<p class="${CONSTANTS.MODULE_ID}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_ID}</strong>
        <br><br>${message}
    </p>`;
}

// =========================================================================================

export function _getElevationRangePlaceableObject(placeableObject) {
  let base = placeableObject;
  base = base.document ?? base;
  // Integration with levels and wall height module
  let rangeElevation = { rangeBottom: -Infinity, rangeTop: Infinity };
  if (base instanceof WallDocument) {
    rangeElevation = {
      rangeBottom: base.flags?.["wall-height"]?.bottom ?? -Infinity,
      rangeTop: base.flags?.["wall-height"]?.top ?? Infinity,
    };
  } else if (base instanceof TokenDocument) {
    rangeElevation = {
      rangeBottom: base.elevation,
      rangeTop: base.elevation,
    };
  } else {
    const rangeBottom = base.flags?.levels?.rangeBottom ?? -Infinity;
    const rangeTop = base.flags?.levels?.rangeTop ?? Infinity;
    rangeElevation = { rangeBottom, rangeTop };
  }
  return rangeElevation;
}

export function getElevationPlaceableObject(placeableObject) {
  let rangeElevation = _getElevationRangePlaceableObject(placeableObject);
  return rangeElevation.rangeBottom;
}

export function checkElevation(documentOrPlaceableSource, documentOrPlaceableTarget) {
  let docSource = documentOrPlaceableSource?.document ?? documentOrPlaceableSource;
  let docTarget = documentOrPlaceableTarget?.document ?? documentOrPlaceableTarget;
  // TODO we really need this ?
  if (!docSource.object || !docTarget.object) {
    return false;
  }
  // TODO why i was using object before instead document ??
  const elevationSource = getElevationPlaceableObject(docSource);
  const elevationTarget = getElevationPlaceableObject(docTarget);
  // Levels module support
  if (game.modules.get("levels")?.active) {
    const elevationRangeTarget = _getElevationRangePlaceableObject(docTarget);
    const rangeBottom = elevationRangeTarget.rangeBottom ?? -Infinity;
    const rangeTop = elevationRangeTarget.rangeTop ?? Infinity;
    return elevationSource >= rangeBottom && elevationSource <= rangeTop;
  } else {
    return elevationSource >= elevationTarget;
  }
}

export function getTokenHeightPatched(token) {
    // Why i need to this with the levels module ???
    return ((token.losHeight ?? (token.document.elevation+0.00001))-token.document.elevation)/canvas.scene.dimensions.distance
}

// =============================
// Module specific function
// =============================

export function getTokenByTokenID(id) {
  // return await game.scenes.active.tokens.find( x => {return x.id === id});
  return canvas.tokens?.placeables.find((x) => {
    return x.id === id;
  });
}

export function getTokenByTokenName(name) {
  // return await game.scenes.active.tokens.find( x => {return x._name === name});
  return canvas.tokens?.placeables.find((x) => {
    return x.name === name;
  });
  // return canvas.tokens.placeables.find( x => { return x.id == game.user.id});
}

/**
 * Get chracter name from token
 */
export const getCharacterName = function (token) {
  let tokenName = "";
  if (token.actor && token.actor.name) {
    tokenName = token.actor.name;
  } else if (token.name) {
    tokenName = token.name;
  } else if (token.document.actorId) {
    tokenName = game.actors?.get(token.document.actorId).name;
  }
  return tokenName;
};

export function sceneof(pToken) {
  let vscene = pToken.scene;

  if (!vscene) {
    //for FVTT v10
    if (canvas.scene.tokens.get(pToken.id)) {
      return canvas.scene;
    } else {
      return game.scenes.find((vscene) => vscene.tokens.get(pToken.id));
    }
  }

  return vscene;
}
