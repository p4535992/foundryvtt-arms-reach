import { checkElevation, error, getElevationPlaceableObject, getTokenHeightPatched, warn } from "./lib/lib.mjs";
import { ArmsreachData } from "./ArmsReachModels.mjs";
import CONSTANTS from "./constants.mjs";

/**
 * @href https://stackoverflow.com/questions/30368632/calculate-distance-on-a-grid-between-2-points
 * @param doorControl or placeable
 * @param charCenter
 * @returns
 */
export const computeDistanceBetweenCoordinates = function (armsreachData, selectedToken, documentName, useGrids) {
  const xPlaceable = armsreachData.x; //armsreachData._validPosition?.x ? armsreachData._validPosition?.x : armsreachData.x;
  const yPlaceable = armsreachData.y; //armsreachData._validPosition?.y ? armsreachData._validPosition?.y : armsreachData.y;
  const wPlaceable = armsreachData.w;
  const hPlaceable = armsreachData.h;
  const centerX = armsreachData.centerX;
  const centerY = armsreachData.centerY;
  const centerZ = armsreachData.centerZ;
  const placeableObjectData = armsreachData.placeableObjectData;

  const unitSize = canvas.dimensions.distance; //canvas.grid?.grid?.options.dimensions.distance;

  if (useGrids) {
    // const dist = computeDistanceBetweenCoordinatesOLD(armsreachData, character);
    const dist = _grids_between_token_and_placeable(selectedToken, armsreachData);
    return Math.floor(dist);
  } else {
    const dist = _units_between_token_and_placeable(selectedToken, {
      x: xPlaceable,
      y: yPlaceable,
      w: wPlaceable,
      h: hPlaceable,
      documentName: documentName,
      id: armsreachData.id,
      centerX: centerX,
      centerY: centerY,
      centerZ: centerZ ?? 0,
      placeableObjectData: placeableObjectData,
    });
    return Math.round(dist * 10) / 10; // Round to two decimal...
  }
};

/**
 * Get center from the tokenAttacher module
 */
export const getCenter = function (placeableObject, grid = {}) {
  const objData = placeableObject.document ? placeableObject.document : placeableObject;
  const placeableObjectDocument = placeableObject.document?.documentName ? placeableObject.document : placeableObject;

  let isGridSpace = false;

  if (placeableObjectDocument.documentName === TileDocument.documentName) {
    isGridSpace = false;
  } else if (placeableObjectDocument.documentName === DrawingDocument.documentName) {
    isGridSpace = false;
  } else {
    isGridSpace = true;
  }

  grid = mergeObject({ w: canvas.grid.w, h: canvas.grid.h }, grid);
  const [x, y] = [objData.x, objData.y];
  let center = { x: x, y: y };
  //Tokens, Tiles
  if (objData.width && objData.height && objData.width != null) {
    let [width, height] = [objData.width, objData.height];
    if (isGridSpace) {
      [width, height] = [width * grid.w, height * grid.h];
    }
    center = { x: x + Math.abs(width) / 2, y: y + Math.abs(height) / 2 };
  }
  //Drawings
  if (objData.shape?.width && objData.shape?.height && objData.shape?.width != null) {
    let [width, height] = [objData.shape.width, objData.shape.height];
    if (isGridSpace) {
      [width, height] = [width * grid.w, height * grid.h];
    }
    center = { x: x + Math.abs(width) / 2, y: y + Math.abs(height) / 2 };
  }
  //Walls
  if ("c" in objData) {
    center = { x: (objData.c[0] + objData.c[2]) / 2, y: (objData.c[1] + objData.c[3]) / 2 };
  }
  return center;
};

/**
 * Get token center
 */
export const getTokenCenter = function (token) {
  // const tokenCenter = { x: token.x + token.w / 2, y: token.y + token.h / 2 };
  const shapes = getTokenShape(token);
  if (shapes && shapes.length > 0) {
    const shape0 = shapes[0];
    return { x: shape0.x, y: shape0.y };
  }

  const tokenCenter = getCenter(token);
  return tokenCenter;
};

/**
 * Get token shape center from dragRuler module
 */
function getTokenShape(token) {
  let scene = canvas.scene;
  if (scene.grid.type === CONST.GRID_TYPES.GRIDLESS) {
    return [{ x: 0, y: 0 }];
  } else if (scene.grid.type === CONST.GRID_TYPES.SQUARE) {
    const topOffset = -Math.floor(token.document.height / 2);
    const leftOffset = -Math.floor(token.document.width / 2);
    const shape = [];
    for (let y = 0; y < token.document.height; y++) {
      for (let x = 0; x < token.document.width; x++) {
        shape.push({ x: x + leftOffset, y: y + topOffset });
      }
    }
    return shape;
  } else {
    // Hex grids
    const size = _getHexTokenSize(token);
    let shape = [{ x: 0, y: 0 }];
    if (size >= 2)
      shape = shape.concat([
        { x: 0, y: -1 },
        { x: -1, y: -1 },
      ]);
    if (size >= 3)
      shape = shape.concat([
        { x: 0, y: 1 },
        { x: -1, y: 1 },
        { x: -1, y: 0 },
        { x: 1, y: 0 },
      ]);
    if (size >= 4)
      shape = shape.concat([
        { x: -2, y: -1 },
        { x: 1, y: -1 },
        { x: -1, y: -2 },
        { x: 0, y: -2 },
        { x: 1, y: -2 },
      ]);

    if (_getAltOrientationFlagForToken(token, size)) {
      shape.forEach((space) => (space.y *= -1));
    }
    if (canvas.grid.grid.columnar)
      shape = shape.map((space) => {
        return { x: space.y, y: space.x };
      });
    return shape;
  }
}
/**
 * Get token shape center from dragRuler module
 */
function _getHexTokenSize(token) {
  const size = token.document.width;
  if (token.document.height !== size) {
    return 1;
  }
  return size;
}
/**
 * Get token shape center from dragRuler module
 */
function _getAltOrientationFlagForToken(token, size) {
  const hexSizeSupport = game.modules.get("hex-size-support")?.api;
  if (hexSizeSupport) {
    return hexSizeSupport.isAltOrientation(token);
  }
  // In native foundry, tokens of size 2 are oriented like the "alt orientation" from hex-size-support
  // Tokens of size 4 are oriented like alt orientation wasn't set
  return size === 2;
}

/**
 * Interation fail messages
 */
export const interactionFailNotification = function (message) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "notificationsInteractionFail")) {
    return;
  }
  warn(message, true);
};

/**
 * Returns the first selected token
 */
export const getFirstPlayerTokenSelected = function () {
  // Get first token ownted by the player
  const selectedTokens = canvas.tokens?.controlled;
  if (selectedTokens.length > 1) {
    //iteractionFailNotification(i18n(`${CONSTANTS.MODULE_ID}.warningNoSelectMoreThanOneToken`));
    return null;
  }
  if (!selectedTokens || selectedTokens.length === 0) {
    //if(game.user.character.token){
    //
    //  return game.user.character.token;
    //}else{
    return null;
    //}
  }
  if (selectedTokens[0] && game.settings.get(CONSTANTS.MODULE_ID, "enableInteractionForTokenOwnedByUser")) {
    const isPlayerOwned = selectedTokens[0]?.document.isOwner;
    if (!isPlayerOwned) {
      return null;
    } else {
      return selectedTokens[0];
    }
  } else {
    return selectedTokens[0];
  }
};

/**
 * Returns the first selected token
 */
export const getFirstPlayerTokenSelectedNo = function (noToken) {
  // Get first token ownted by the player
  const selectedTokens = canvas.tokens?.controlled;
  if (selectedTokens.length > 1) {
    //iteractionFailNotification(i18n(`${CONSTANTS.MODULE_ID}.warningNoSelectMoreThanOneToken`));
    return null;
  }
  if (!selectedTokens || selectedTokens.length === 0) {
    //if(game.user.character.token){
    //
    //  return game.user.character.token;
    //}else{
    return null;
    //}
  }
  if (selectedTokens[0] && game.settings.get(CONSTANTS.MODULE_ID, "enableInteractionForTokenOwnedByUser")) {
    const isPlayerOwned = selectedTokens[0]?.document.isOwner;
    if (!isPlayerOwned) {
      return null;
    } else {
      return selectedTokens[0]?.id !== noToken?.id ? selectedTokens[0] : null;
    }
  } else {
    return selectedTokens[0]?.id !== noToken?.id ? selectedTokens[0] : null;
  }
};

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
export const getFirstPlayerToken = function () {
  // Get controlled token
  let token;
  const controlledArray = canvas.tokens?.controlled;
  // Do nothing if multiple tokens are selected
  if (controlledArray.length && controlledArray.length > 1) {
    //iteractionFailNotification(i18n(`${CONSTANTS.MODULE_ID}.warningNoSelectMoreThanOneToken`));
    return null;
  }
  // If exactly one token is selected, take that
  token = controlledArray[0];
  if (!token) {
    if (game.settings.get(CONSTANTS.MODULE_ID, "useOwnedTokenIfNoTokenIsSelected")) {
      if (!controlledArray.length || controlledArray.length === 0) {
        // If no token is selected use the token of the users character
        token = canvas.tokens?.placeables.find((token) => token.document.actorId === game.user?.character?.id);
      }
      // If no token is selected use the first owned token of the users character you found
      if (!token) {
        token = canvas.tokens?.ownedTokens[0];
      }
    }
  }
  if (token && game.settings.get(CONSTANTS.MODULE_ID, "enableInteractionForTokenOwnedByUser")) {
    const isPlayerOwned = token.document.isOwner;
    if (!isPlayerOwned) {
      return null;
    } else {
      return token;
    }
  } else {
    return token;
  }
};

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
export const getFirstPlayerTokenNo = function (noToken) {
  // Get controlled token
  let token;
  const controlledArray = canvas.tokens?.controlled;
  // Do nothing if multiple tokens are selected
  if (controlledArray.length && controlledArray.length > 1) {
    //iteractionFailNotification(i18n(`${CONSTANTS.MODULE_ID}.warningNoSelectMoreThanOneToken`));
    return null;
  }
  // If exactly one token is selected, take that
  token = controlledArray[0];
  if (!token) {
    if (game.settings.get(CONSTANTS.MODULE_ID, "useOwnedTokenIfNoTokenIsSelected")) {
      if (!controlledArray.length || controlledArray.length === 0) {
        // If no token is selected use the token of the users character
        token = canvas.tokens?.placeables.find(
          (token) => token.document.actorId === game.user?.character?.id && token.id !== noToken.id
        );
      }
      // If no token is selected use the first owned token of the users character you found
      if (!token) {
        for (const tok of canvas.tokens?.ownedTokens) {
          if (tok.id !== noToken.id) {
            token = tok;
            break;
          }
        }
        // token = canvas.tokens?.ownedTokens[0];
      }
    }
  }
  if (token && game.settings.get(CONSTANTS.MODULE_ID, "enableInteractionForTokenOwnedByUser")) {
    const isPlayerOwned = token.document.isOwner;
    if (!isPlayerOwned) {
      return null;
    } else {
      return token;
    }
  } else {
    return token;
  }
};

/**
 * Check if active document is the canvas
 */
export const isFocusOnCanvas = function () {
  if (
    !document.activeElement ||
    !document.activeElement.attributes ||
    !document.activeElement.attributes["class"] ||
    document.activeElement.attributes["class"].value.substr(0, 8) !== "vtt game"
  ) {
    return false;
  } else {
    return true;
  }
};

export const reselectTokenAfterInteraction = function (character) {
  // If settings is true do not deselect the current select token
  if (game.settings.get(CONSTANTS.MODULE_ID, "forceReSelection")) {
    let isOwned = false;
    if (!character) {
      character = getFirstPlayerTokenSelected();
      if (!character) {
        character = getFirstPlayerToken();
        if (character) {
          isOwned = true;
        }
      }
      if (!character) {
        if (game.user?.isGM) {
          return;
        } else {
          // return false;
        }
      }
    }

    // Make sense only if use owned is false because there is no way to check what
    // owned token is get from the array
    if (!isOwned) {
      //let character:Token = getFirstPlayerToken();
      if (!character) {
        // DO NOTHING
      } else {
        const observable = canvas.tokens?.placeables.filter((t) => t.id === character.id);
        if (observable.length) {
          observable[0].control();
        }
      }
    }
  }
};

export const checkTaggerForAmrsreachForStairway = function (placeable) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerStairwayIntegration")) {
    return true;
  }

  const tags = Tagger?.getTags(placeable) || [];
  if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

export const checkTaggerForAmrsreachForToken = function (placeableToken) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerTokenIntegration")) {
    return true;
  }

  const tags = Tagger?.getTags(placeableToken) || [];
  if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

export const checkTaggerForAmrsreachForNote = function (placeableNote) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerNoteIntegration")) {
    return true;
  }

  const tags = Tagger?.getTags(placeableNote) || [];
  if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

export const checkTaggerForAmrsreachForLight = function (placeableAmbientLight) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerLightIntegration")) {
    return true;
  }

  const tags = Tagger?.getTags(placeableAmbientLight) || [];
  if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

export const checkTaggerForAmrsreachForSound = function (placeableAmbientSound) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerSoundIntegration")) {
    return true;
  }

  const tags = Tagger?.getTags(placeableAmbientSound) || [];
  if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

export const checkTaggerForAmrsreachForDrawing = function (placeableDrawing) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerDrawingIntegration")) {
    return true;
  }

  const tags = Tagger?.getTags(placeableDrawing) || [];
  if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

export const checkTaggerForAmrsreachForTile = function (placeableTile) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerTileIntegration")) {
    return true;
  }

  const tags = Tagger?.getTags(placeableTile) || [];
  if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

export const checkTaggerForAmrsreachForWall = function (placeableWall) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, "enableTaggerWallIntegration")) {
    return true;
  }

  const tags = Tagger?.getTags(placeableWall) || [];
  if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

export const getMousePosition = function (canvas, event) {
  const position = canvas.app?.renderer.plugins.interaction.pointer.getLocalPosition(canvas.app.stage);
  return {
    x: position.x,
    y: position.y,
  };
};

// ====================================================================================================

export const getPlaceablesAt = function (placeables, position) {
  if (!placeables) {
    return [];
  }
  return placeables.filter((placeable) => placeableContains(placeable, position));
};

function placeableContains(placeable, position) {
  const center = placeable instanceof Token ? getTokenCenter(placeable) : getCenter(placeable);
  const x = center.x;
  const y = center.y;

  const w = getPlaceableWidth(placeable) || 0;
  const h = getPlaceableHeight(placeable) || 0;
  return Number.between(position.x, x, x + w) && Number.between(position.y, y, y + h);
}

export const getPlaceableDoorCenter = function (placeable) {
  const x = getPlaceableX(placeable);
  const y = getPlaceableY(placeable);
  const w = getPlaceableWidth(placeable) || 0;
  const h = getPlaceableHeight(placeable) || 0;
  const id = placeable?.wall.document ? placeable?.wall.document.id : placeable.id;
  const documentName = placeable?.wall.document ? placeable?.wall.document.documentName : placeable.documentName;
  const centerX = placeable.center ? placeable.center.x : x;
  const centerY = placeable.center ? placeable.center.y : y;
  const centerZ = placeable instanceof Token ? getTokenHeightPatched(placeable) : placeable.z;
  const placeableObjectData = placeable?.wall.document ? placeable?.wall.document : placeable;
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    documentName: documentName,
    id: id,
    centerX: centerX,
    centerY: centerY,
    centerZ: centerZ ?? 0,
    placeableObjectData: placeableObjectData,
  };
};

export const getPlaceableCenter = function (placeable) {
  // const x = getPlaceableX(placeable);
  // const y = getPlaceableY(placeable);

  const center = placeable instanceof Token ? getTokenCenter(placeable) : getCenter(placeable);
  const x = center.x;
  const y = center.y;

  const w = getPlaceableWidth(placeable) || 0;
  const h = getPlaceableHeight(placeable) || 0;
  const id = placeable?.document ? placeable?.document.id : placeable.id;
  const documentName = placeable?.document ? placeable?.document.documentName : placeable.documentName;
  const centerX = placeable.center ? placeable.center.x : x;
  const centerY = placeable.center ? placeable.center.y : y;
  const centerZ = placeable instanceof Token ? getTokenHeightPatched(placeable) : placeable.z;
  const placeableObjectData = placeable.document ? placeable.document : placeable;
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    documentName: documentName,
    id: id,
    centerX: centerX,
    centerY: centerY,
    centerZ: centerZ ?? 0,
    placeableObjectData: placeableObjectData,
  };
};

const getPlaceableWidth = function (placeable) {
  let w = placeable.w || placeable.width;
  if (placeable?.object) {
    w = placeable?.object?.w || placeable?.object?.width || w;
  }
  return w;
};

const getPlaceableHeight = function (placeable) {
  let h = placeable.h || placeable.height;
  if (placeable?.object) {
    h = placeable?.object?.h || placeable?.object?.height || h;
  }
  return h;
};

const getPlaceableX = function (placeable) {
  let x = placeable._validPosition?.x || placeable.x || placeable?.x;
  if (placeable?.object) {
    x = placeable?.object?.x || placeable?.object?.x || x;
  }
  return x;
};

const getPlaceableY = function (placeable) {
  let y = placeable._validPosition?.y || placeable?.y;
  if (placeable?.object) {
    y = placeable?.object?.y || placeable?.object?.y || y;
  }
  return y;
};

// ============================================================================================

function distance_between(a, b) {
  //return Math.max(new Ray(a, b).distance, new Ray(b, a).distance);
  // Is this better ?
  function _euclideanCalculation(p1, p2) {
    const unitsToPixel = canvas.dimensions.size / canvas.dimensions.distance;
    const d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2)) / unitsToPixel;
    return d;
  }
  const ray = new Ray({ x: a.x, y: a.z }, { x: b.x, y: b.z });
  const useEuclidean = Math.abs(a.y - b.y) > canvas.scene.dimensions.size / 2;
  const distance = useEuclidean
    ? _euclideanCalculation(a, b)
    : canvas.grid.measureDistances([{ ray }], {
        gridSpaces: true,
      });
  return distance;
}

function _grids_between_token_and_placeable(token, armsReachData) {
  //   return Math.floor(_distance_between_token_rect(token, armsReachData) / canvas.grid?.size) + 1;
  return _distance_between_token_rect(token, armsReachData);
}

function _units_between_token_and_placeable(token, armsReachData) {
  let dist = _distance_between_token_rect(token, armsReachData);
  const unitSize = canvas.dimensions?.distance || 5;
  const unitGridSize = canvas.grid?.size || 50;
  if (dist === 0) {
    // Special case for tile
    if (armsReachData.documentName === TileDocument.documentName) {
      dist = _getUnitTokenDist(token, armsReachData) - unitSize;
    }
    // Special case for lights
    if (armsReachData.documentName === AmbientLightDocument.documentName) {
      dist = _getUnitTokenDist(token, armsReachData) - unitSize;
    }
  } else {
    dist = _getUnitTokenDist(token, armsReachData);
    // TODO i don't understand this for manage the door control
    if (armsReachData.documentName !== WallDocument.documentName) {
      // dist = (Math.floor(dist) / unitGridSize) * unitSize;
      // if (armsReachData.documentName === TokenDocument.documentName) {
      // 	// const tokensSizeAdjust = (Math.min(armsReachData.w, armsReachData.h) || 0) / Math.SQRT2;
      // 	// const tokenScaleAdjust = tokensSizeAdjust / canvas.dimensions?.size;
      // 	// // dist = (dist * canvas.dimensions?.size) / canvas.dimensions?.distance - tokensSizeAdjust;
      // 	// dist = dist / canvas.dimensions?.distance;
      // 	const grids = grids_between_tokens(token, armsReachData);
      // 	dist = grids / (canvas.dimensions?.size / canvas.grid?.size);
      // }
    } else {
      const isDoor = canvas.controls?.doors?.children.find((x) => {
        return x.wall.id === armsReachData.id;
      });
      if (!isDoor) {
        // WHY ? is a wall but i need to multiply anyway for antoher unitsize
        // dist = (Math.floor(dist) / unitGridSize) * unitSize * unitSize;
      } else {
        const globalInteraction = game.settings.get(CONSTANTS.MODULE_ID, "globalInteractionMeasurement");
        if (globalInteraction > 5) {
          // WHY ? is a door but i need to multiply anyway for antoher unitsize
          // dist = (Math.floor(dist) / unitGridSize) * unitSize * unitSize;
        }
      }
    }
  }
  return dist;
}

// ================================================

export const globalInteractionDistanceUniversal = function (placeableObjectSource, placeableObjectTarget, useGrids) {
  const placeableSourceArmsReachData = getPlaceableCenter(placeableObjectSource);
  placeableSourceArmsReachData.documentName = placeableObjectSource.document.documentName;
  const placeableTargetArmsReachData = getPlaceableCenter(placeableObjectTarget);
  placeableTargetArmsReachData.documentName = placeableObjectTarget.document.documentName;

  if (useGrids) {
    const dist = _grids_between_placeable_and_placeable(placeableSourceArmsReachData, placeableTargetArmsReachData);
    return dist;
  } else {
    const dist = _units_between_placeable_and_placeable(placeableSourceArmsReachData, placeableTargetArmsReachData);
    return dist;
  }
};

function _grids_between_placeable_and_placeable(aArmsReachData, bArmsReachData) {
  // TODO not sure about this....
  return Math.floor(_distance_between_placeable_rect(aArmsReachData, bArmsReachData) / canvas.grid?.size) + 1;
}

function _distance_between_token_rect(token, armsReachData) {
  const armsReachDataBaseFromToken = getPlaceableCenter(token);
  return _distance_between_placeable_rect(armsReachDataBaseFromToken, armsReachData);
}

function _distance_between_placeable_rect(p1ArmsReachData, p2ArmsReachData) {
  const x1 = p1ArmsReachData.x;
  const y1 = p1ArmsReachData.y;
  const z1 = p1ArmsReachData.centerZ;
  const x1b = p1ArmsReachData.x + p1ArmsReachData.w;
  const y1b = p1ArmsReachData.y + p1ArmsReachData.h;

  const x2 = p2ArmsReachData.x;
  const y2 = p2ArmsReachData.y;
  const z2 = p2ArmsReachData.centerZ;
  const x2b = p2ArmsReachData.x + p2ArmsReachData.w;
  const y2b = p2ArmsReachData.y + p2ArmsReachData.h;

  const left = x2b < x1;
  const right = x1b < x2;
  const bottom = y2b < y1;
  const top = y1b < y2;

  if (top && left) {
    return distance_between({ x: x1, y: y1b, z: z1 }, { x: x2b, y: y2, z: z2 });
  } else if (left && bottom) {
    return distance_between({ x: x1, y: y1, z: z1 }, { x: x2b, y: y2b, z: z2 });
  } else if (bottom && right) {
    return distance_between({ x: x1b, y: y1, z: z1 }, { x: x2, y: y2b, z: z2 });
  } else if (right && top) {
    return distance_between({ x: x1b, y: y1b, z: z1 }, { x: x2, y: y2, z: z2 });
  } else if (left) {
    return x1 - x2b;
  } else if (right) {
    return x2 - x1b;
  } else if (bottom) {
    return y1 - y2b;
  } else if (top) {
    return y2 - y1b;
  }

  return 0;
}

function _units_between_placeable_and_placeable(aArmsReachData, bArmsReachData) {
  // const range = sourceToken.vision.radius;
  // if (range === 0) return false;
  // if (range === Infinity) return true;
  const tokensSizeAdjust =
    bArmsReachData instanceof Token ? (Math.min(bArmsReachData.w, bArmsReachData.h) || 0) / Math.SQRT2 : 0;
  const dist =
    (_getUnitTokenDistUniversal(aArmsReachData, bArmsReachData) * canvas.dimensions.size) / canvas.dimensions.distance -
    tokensSizeAdjust;
  // return dist <= range;
  // const unitSize = canvas.dimensions?.distance || 5;
  // const unitGridSize = canvas.grid?.size || 50;
  // dist = (Math.floor(dist) / unitGridSize) * unitSize;
  return dist;
}

function _getUnitTokenDist(token, placeableObjectTargetArmsReachData) {
  const armsReachDataBaseFromToken = getPlaceableCenter(token);
  return _getUnitTokenDistUniversal(armsReachDataBaseFromToken, placeableObjectTargetArmsReachData);
}

function _getUnitTokenDistUniversal(aArmsReachData, bArmsReachData) {
  const unitsToPixel = canvas.dimensions?.size / canvas.dimensions?.distance;
  const x1 = aArmsReachData.centerX;
  const y1 = aArmsReachData.centerY;
  const z1 = aArmsReachData.centerZ;
  const x2 = bArmsReachData.centerX;
  const y2 = bArmsReachData.centerY;
  const z2 = bArmsReachData.centerZ;
  // Add support for 3D Preview Model
  if (game.Levels3DPreview?._active) {
    const placeable1Vector = {
      x: x1,
      y: y1,
      z: z1 * unitsToPixel,
    };

    const placeable2Vector = {
      x: x2,
      y: y2,
      z: z2 * unitsToPixel,
    };
    const d = Math.hypot(
      placeable1Vector.x - placeable2Vector.x,
      placeable1Vector.y - placeable2Vector.y,
      placeable1Vector.z - placeable2Vector.z
    );
    return d;
  } else {
    const d =
      Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow((z2 - z1) * unitsToPixel, 2)) / unitsToPixel;
    return d;
  }
}
