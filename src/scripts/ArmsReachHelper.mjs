import { checkElevation, error, getElevationPlaceableObject, warn } from "./lib/lib.mjs";
import { ArmsreachData } from "./ArmsReachModels.mjs";
import CONSTANTS from "./constants.mjs";

/**
 * @href https://stackoverflow.com/questions/30368632/calculate-distance-on-a-grid-between-2-points
 * @param doorControl or placeable
 * @param charCenter
 * @returns
 */
export const computeDistanceBetweenCoordinates = function (armsreachData, selectedToken, documentName, useGrids) {
  const xPlaceable = armsreachData.x; //placeable._validPosition?.x ? placeable._validPosition?.x : placeable.x;
  const yPlaceable = armsreachData.y; //placeable._validPosition?.y ? placeable._validPosition?.y : placeable.y;
  const wPlaceable = armsreachData.w;
  const hPlaceable = armsreachData.h;
  const centerX = armsreachData.centerX;
  const centerY = armsreachData.centerY;
  const placeableObjectData = armsreachData.placeableObjectData;
  //@ts-ignore
  const unitSize = canvas.dimensions.distance; //canvas.grid?.grid?.options.dimensions.distance;

  if (useGrids) {
    // const dist = computeDistanceBetweenCoordinatesOLD(placeable, character);
    const dist = grids_between_token_and_placeable(selectedToken, placeable);
    return dist;
  } else {
    const dist = units_between_token_and_placeable(selectedToken, {
      x: xPlaceable,
      y: yPlaceable,
      w: wPlaceable,
      h: hPlaceable,
      documentName: documentName,
      id: placeable.id,
      centerX: centerX,
      centerY: centerY,
      placeableObjectData: placeableObjectData,
    });
    return dist;
    // }
  }
};

/**
 * Get token center
 */
export const getTokenCenter = function (token) {
  /*
    let tokenCenter = {x: token.x , y: token.y };
    tokenCenter.x += -20 + ( token.w * 0.50 );
    tokenCenter.y += -20 + ( token.h * 0.50 );
    */
  const shapes = getTokenShape(token);
  if (shapes && shapes.length > 0) {
    const shape0 = shapes[0];
    return { x: shape0.x, y: shape0.y };
  }
  // const tokenCenter = { x: token.x + token.w / 2, y: token.y + token.h / 2 };
  const tokenCenter = getCenter(token);
  return tokenCenter;
};

/**
 * Get center
 * from tokenAttacher module
 */
export const getCenter = function (placeableObject, grid = {}) {
  const data = placeableObject.document ? placeableObject.document : placeableObject;
  const placeableObjectDocument = placeableObject.document?.documentName ? placeableObject.document : placeableObject;
  //getCenter(type, data, grid = {}){
  let isGridSpace = false;
  //@ts-ignore
  if (placeableObjectDocument.documentName === TileDocument.documentName) {
    isGridSpace = false;
    //@ts-ignore
  } else if (placeableObjectDocument.documentName === DrawingDocument.documentName) {
    isGridSpace = false;
  } else {
    isGridSpace = true;
  }
  grid = mergeObject({ w: canvas.grid?.w, h: canvas.grid?.h }, grid);
  //@ts-ignore
  const [x, y] = [data.x, data.y];
  let center = { x: x, y: y };
  //Tokens, Tiles
  if ("width" in data && "height" in data) {
    let [width, height] = [data.width, data.height];
    if (isGridSpace) {
      [width, height] = [width * grid.w, height * grid.h];
    }
    center = { x: x + Math.abs(width) / 2, y: y + Math.abs(height) / 2 };
  }
  //Walls
  if ("c" in data) {
    //@ts-ignore
    center = { x: (data.c[0] + data.c[2]) / 2, y: (data.c[1] + data.c[3]) / 2 };
  }
  return center;
};

/**
 * Get token shape center
 * from dragRuler module
 */
function getTokenShape(token) {
  if (token.scene.grid.type === CONST.GRID_TYPES.GRIDLESS) {
    return [{ x: 0, y: 0 }];
  } else if (token.scene.grid.type === CONST.GRID_TYPES.SQUARE) {
    const topOffset = -Math.floor(token.document.height / 2);
    const leftOffset = -Math.floor(token.document.width / 2);
    const shapeArray = [];
    for (let y = 0; y < token.document.height; y++) {
      for (let x = 0; x < token.document.width; x++) {
        shapeArray.push({ x: x + leftOffset, y: y + topOffset });
      }
    }
    return shapeArray;
  } else {
    // Hex grids
    //@ts-ignore
    if (game.modules.get("hex-size-support")?.active && CONFIG.hexSizeSupport.getAltSnappingFlag(token)) {
      const borderSize = token.document.flags["hex-size-support"].borderSize;
      let shape = [{ x: 0, y: 0 }];
      if (borderSize >= 2)
        shape = shape.concat([
          { x: 0, y: -1 },
          { x: -1, y: -1 },
        ]);
      if (borderSize >= 3)
        shape = shape.concat([
          { x: 0, y: 1 },
          { x: -1, y: 1 },
          { x: -1, y: 0 },
          { x: 1, y: 0 },
        ]);
      if (borderSize >= 4)
        shape = shape.concat([
          { x: -2, y: -1 },
          { x: 1, y: -1 },
          { x: -1, y: -2 },
          { x: 0, y: -2 },
          { x: 1, y: -2 },
        ]);
      //@ts-ignore
      if (Boolean(CONFIG.hexSizeSupport.getAltOrientationFlag(token)) !== canvas.grid?.grid?.options.columns)
        shape.forEach((space) => (space.y *= -1));
      if (canvas.grid?.grid?.options.columns)
        shape = shape.map((space) => {
          return { x: space.y, y: space.x };
        });
      return shape;
    } else {
      return [{ x: 0, y: 0 }];
    }
  }
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
    //  //@ts-ignore
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
    //  //@ts-ignore
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

    // Make sense only if use owned is false beacuse there is no way to check what
    // owned token is get from the array
    if (!isOwned) {
      //let character:Token = getFirstPlayerToken();
      if (!character) {
        // DO NOTHING
      } else {
        const observable = canvas.tokens?.placeables.filter((t) => t.id === character.id);
        if (observable !== undefined) {
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
  //@ts-ignore
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
  //@ts-ignore
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
  //@ts-ignore
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
  //@ts-ignore
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
  //@ts-ignore
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
  //@ts-ignore
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
  //@ts-ignore
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
  //@ts-ignore
  const tags = Tagger?.getTags(placeableWall) || [];
  if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

// export const checkTaggerForAmrsreach = function (placeable: PlaceableObject) {
// 	//@ts-ignore
// 	const tags = Tagger?.getTags(placeable) || [];
// 	if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
// 		return true;
// 	} else {
// 		return false;
// 	}
// };

export const getMousePosition = function (canvas, event) {
  // const transform = <PIXI.Matrix>canvas?.tokens?.worldTransform;
  // return {
  //   x: (event.global.x - transform?.tx) / canvas?.stage?.scale?.x,
  //   y: (event.global.y - transform?.ty) / canvas?.stage?.scale?.y,
  // };
  // NEW METHOD SEEM MORE PRECISE
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
  // const x = getPlaceableX(placeable);
  // const y = getPlaceableY(placeable);

  const center = getCenter(placeable);
  const x = center.x;
  const y = center.y;

  const w = getPlaceableWidth(placeable) || 0;
  const h = getPlaceableHeight(placeable) || 0;
  return Number.between(position.x, x, x + w) && Number.between(position.y, y, y + h);
}

export const getPlaceableDoorCenter = function (placeable) {
  const x = getPlaceableX(placeable);
  const y = getPlaceableY(placeable);

  // const center = getCenter(placeable);
  // const x = center.x;
  // const y = center.y;
  // const w = getPlaceableWidth(placeable) || 0;
  // const h = getPlaceableHeight(placeable) || 0;
  const w = getPlaceableWidth(placeable) || 0;
  const h = getPlaceableHeight(placeable) || 0;
  const id = placeable?.wall.document ? placeable?.wall.document.id : placeable.id;
  const documentName = placeable?.wall.document ? placeable?.wall.document.documentName : placeable.documentName;
  const centerX = placeable.center ? placeable.center.x : x;
  const centerY = placeable.center ? placeable.center.y : y;
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
    placeableObjectData: placeableObjectData,
  };
};

export const getPlaceableCenter = function (placeable) {
  // const x = getPlaceableX(placeable);
  // const y = getPlaceableY(placeable);

  const center = getCenter(placeable);
  const x = center.x;
  const y = center.y;

  const w = getPlaceableWidth(placeable) || 0;
  const h = getPlaceableHeight(placeable) || 0;
  const id = placeable?.document ? placeable?.document.id : placeable.id;
  const documentName = placeable?.document ? placeable?.document.documentName : placeable.documentName;
  const centerX = placeable.center ? placeable.center.x : x;
  const centerY = placeable.center ? placeable.center.y : y;
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
    placeableObjectData: placeableObjectData,
  };
};

const getPlaceableWidth = function (placeable) {
  let w = placeable.w || placeable.width;
  if (placeable?.object) {
    w = armsreachData?.object?.w || armsreachData?.object?.width || w;
  }
  return w;
};

const getPlaceableHeight = function (placeable) {
  let h = placeable.h || placeable.height;
  if (placeable?.object) {
    h = armsreachData?.object?.h || armsreachData?.object?.height || h;
  }
  return h;
};

const getPlaceableX = function (placeable) {
  let x = placeable._validPosition?.x || placeable.x || placeable?.x;
  if (placeable?.object) {
    x = armsreachData?.object?.x || armsreachData?.object?.x || x;
  }
  return x;
};

const getPlaceableY = function (placeable) {
  let y = placeable._validPosition?.y || placeable?.y;
  if (placeable?.object) {
    y = armsreachData?.object?.y || armsreachData?.object?.y || y;
  }
  return y;
};

// ============================================================================================

function distance_between_token_rect(p1, armsReachData) {
  //@ts-ignore
  const x1 = p1.x ? p1.x : p1.document.x;
  //@ts-ignore
  const y1 = p1.y ? p1.y : p1.document.y;
  const x1b = x1 + p1.w;
  const y1b = y1 + p1.h;

  //@ts-ignore
  const x2 = armsReachData.x ? armsReachData.x : armsReachData.document.x;
  //@ts-ignore
  const y2 = armsReachData.y ? armsReachData.y : armsReachData.document.y;
  const x2b = x2 + armsReachData.w;
  const y2b = y2 + armsReachData.h;

  const left = x2b < x1;
  const right = x1b < x2;
  const bottom = y2b < y1;
  const top = y1b < y2;

  if (top && left) {
    return distance_between({ x: x1, y: y1b }, { x: x2b, y: y2 });
  } else if (left && bottom) {
    return distance_between({ x: x1, y: y1 }, { x: x2b, y: y2b });
  } else if (bottom && right) {
    return distance_between({ x: x1b, y: y1 }, { x: x2, y: y2b });
  } else if (right && top) {
    return distance_between({ x: x1b, y: y1b }, { x: x2, y: y2 });
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

function distance_between(a, b) {
  return Math.max(new Ray(a, b).distance, new Ray(b, a).distance);
}

function grids_between_token_and_placeable(token, armsReachData) {
  return Math.floor(distance_between_token_rect(token, armsReachData) / canvas.grid?.size) + 1;
}

function units_between_token_and_placeable(token, armsReachData) {
  let dist = Math.floor(distance_between_token_rect(token, armsReachData));
  const unitSize = canvas.dimensions?.distance || 5;
  const unitGridSize = canvas.grid?.size || 50;
  if (dist === 0) {
    // Special case for tile
    if (armsReachData.documentName === TileDocument.documentName) {
      dist = getUnitTokenDist(token, armsReachData) - unitSize;
    }
    // Special case for lights
    if (armsReachData.documentName === AmbientLightDocument.documentName) {
      dist = getUnitTokenDist(token, armsReachData) - unitSize;
    }
  } else {
    dist = getUnitTokenDist(token, armsReachData);
    // TODO i don't understand this for manage the door control
    if (armsReachData.documentName !== WallDocument.documentName) {
      // dist = (Math.floor(dist) / unitGridSize) * unitSize;
      // if (b.documentName === TokenDocument.documentName) {
      // 	// const tokensSizeAdjust = (Math.min(b.w, b.h) || 0) / Math.SQRT2;
      // 	// const tokenScaleAdjust = tokensSizeAdjust / canvas.dimensions?.size;
      // 	// // dist = (dist * canvas.dimensions?.size) / canvas.dimensions?.distance - tokensSizeAdjust;
      // 	// dist = dist / canvas.dimensions?.distance;
      // 	const grids = grids_between_tokens(token, b);
      // 	dist = grids / (canvas.dimensions?.size / canvas.grid?.size);
      // }
    } else {
      //@ts-ignore
      const isDoor = canvas.controls?.doors?.children.find((x) => {
        return x.wall.id === b.id;
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
  // return Math.floor(distance_between_rect(token, b));
}

// ================================================

export const globalInteractionDistanceUniversal = function (placeableObjectSource, placeableObjectTarget, useGrids) {
  const placeableSourceArmsReachData = getPlaceableCenter(placeableObjectSource);
  placeableSourceArmsReachData.documentName = placeableObjectSource.document.documentName;
  const placeableTargetArmsReachData = getPlaceableCenter(placeableObjectTarget);
  placeableTargetArmsReachData.documentName = placeableObjectTarget.document.documentName;

  if (useGrids) {
    const dist = grids_between_placeable_and_placeable(placeableSourceArmsReachData, placeableTargetArmsReachData);
    return dist;
  } else {
    const dist = units_between_placeable_and_placeable(placeableSourceArmsReachData, placeableTargetArmsReachData);
    return dist;
  }
};

function grids_between_placeable_and_placeable(aArmsReachData, bArmsReachData) {
  return Math.floor(distance_between_placeable_rect(aArmsReachData, bArmsReachData) / canvas.grid?.size) + 1;
}

function distance_between_placeable_rect(p1ArmsReachData, p2ArmsReachData) {
  const x1 = p1ArmsReachData.x;
  const y1 = p1ArmsReachData.y;
  const x1b = p1ArmsReachData.x + p1ArmsReachData.w;
  const y1b = p1ArmsReachData.y + p1ArmsReachData.h;

  const x2 = p2ArmsReachData.x;
  const y2 = p2ArmsReachData.y;
  const x2b = p2ArmsReachData.x + p2ArmsReachData.w;
  const y2b = p2ArmsReachData.y + p2ArmsReachData.h;

  const left = x2b < x1;
  const right = x1b < x2;
  const bottom = y2b < y1;
  const top = y1b < y2;

  if (top && left) {
    return distance_between({ x: x1, y: y1b }, { x: x2b, y: y2 });
  } else if (left && bottom) {
    return distance_between({ x: x1, y: y1 }, { x: x2b, y: y2b });
  } else if (bottom && right) {
    return distance_between({ x: x1b, y: y1 }, { x: x2, y: y2b });
  } else if (right && top) {
    return distance_between({ x: x1b, y: y1b }, { x: x2, y: y2 });
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

function units_between_placeable_and_placeable(aArmsReachData, bArmsReachData) {
  // const range = canvas.lighting?.globalLight ? Infinity : sourceToken.vision.radius;
  // if (range === 0) return false;
  // if (range === Infinity) return true;
  const tokensSizeAdjust = (Math.min(bArmsReachData.w, bArmsReachData.h) || 0) / Math.SQRT2;
  let dist =
    (getUnitTokenDistUniversal(aArmsReachData, bArmsReachData) * canvas.dimensions?.size) /
      canvas.dimensions?.distance -
    tokensSizeAdjust;
  // return dist <= range;
  const unitSize = canvas.dimensions?.distance || 5;
  const unitGridSize = canvas.grid?.size || 50;
  dist = (Math.floor(dist) / unitGridSize) * unitSize;
  return dist;
}

function getUnitTokenDistUniversal(aArmsReachData, bArmsReachData) {
  const unitsToPixel = canvas.dimensions?.size / canvas.dimensions?.distance;
  const x1 = aArmsReachData.centerX;
  const y1 = aArmsReachData.centerY;
  const z1 = getElevationPlaceableObject(aArmsReachData.placeableObjectData) * unitsToPixel;
  const x2 = bArmsReachData.centerX;
  const y2 = bArmsReachData.centerY;
  const z2 = getElevationPlaceableObject(bArmsReachData.placeableObjectData) * unitsToPixel;
  const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)) / unitsToPixel;
  return d;
}

// ================================================

function getUnitTokenDist(token, placeableObjectTargetArmsReachData) {
  const unitsToPixel = canvas.dimensions?.size / canvas.dimensions?.distance;
  const x1 = token.center.x;
  const y1 = token.center.y;
  const z1 = getElevationPlaceableObject(token) * unitsToPixel;
  const x2 = placeableObjectTargetArmsReachData.centerX;
  const y2 = placeableObjectTargetArmsReachData.centerY;
  const z2 = getElevationPlaceableObject(placeableObjectTargetArmsReachData.placeableObjectData) * unitsToPixel;
  const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)) / unitsToPixel;
  return d;
}

// function getUnitTokenDistOriginalLevels(token1, token2) {
// 	const unitsToPixel = canvas.dimensions?.size / canvas.dimensions?.distance;
// 	const x1 = token1.center.x;
// 	const y1 = token1.center.y;
// 	const z1 = token1.losHeight * unitsToPixel;
// 	const x2 = token2.center.x;
// 	const y2 = token2.center.y;
// 	const z2 = token2.losHeight * unitsToPixel;

// 	const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)) / unitsToPixel;
// 	return d;
// }

/**
 * Find out if a token is in the range of a particular object
 * @param {Object} token - a token
 * @param {Object} objectTargetPlaceableObject - a tile/drawing/light/note
 * @returns {Boolean} - true if in range, false if not
 **/
export function isTokenInRange(objectSourcePlaceableObject, objectTargetPlaceableObject) {
  if (game.modules.get("levels")?.active) {
    let rangeTop = objectTargetPlaceableObject.document.getFlag("levels", "rangeTop");
    let rangeBottom = objectTargetPlaceableObject.document.getFlag("levels", "rangeBottom");
    if (!rangeTop && rangeTop !== 0) rangeTop = Infinity;
    if (!rangeBottom && rangeBottom !== 0) rangeBottom = -Infinity;
    const elevation = getElevationPlaceableObject(objectSourcePlaceableObject);
    return elevation <= rangeTop && elevation >= rangeBottom;
  } else {
    // TODO maybe some other integration
    return true;
  }
}
