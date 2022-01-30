import { ARMS_REACH_MODULE_NAME, ARMS_REACH_TAGGER_FLAG } from './settings';
import { error, warn } from '../foundryvtt-arms-reach';
import { canvas, game } from './settings';
import { tokenToString } from 'typescript';
import { ArmsreachData } from './ArmsReachModels';

/**
 * Function for calcuate the distance in grid units
 * @href https://stackoverflow.com/questions/30368632/calculate-distance-on-a-grid-between-2-points
 * @param doorControl or placeable
 * @param charCenter
 * @returns
 */
export const computeDistanceBetweenCoordinatesOLD = function (placeable: any, character: Token): number {
  const charCenter = getTokenCenter(character);
  //@ts-ignore
  const xMinA = character._validPosition?.x ? character._validPosition?.x : charCenter.x;
  //@ts-ignore
  const yMinA = character._validPosition?.y ? character._validPosition?.y : charCenter.y;
  //@ts-ignore
  const xMaxA = xMinA + (character.hitArea?.width ? character.hitArea?.width : 0);
  //@ts-ignore
  const yMaxA = yMinA + (character.hitArea?.height ? character.hitArea?.height : 0);

  const xMinB = placeable._validPosition?.x ? placeable._validPosition?.x : placeable.x;
  const yMinB = placeable._validPosition?.y ? placeable._validPosition?.y : placeable.y;
  const xMaxB = xMinB + (placeable.hitArea?.width ? placeable.hitArea?.width : 0);
  const yMaxB = yMinB + (placeable.hitArea?.height ? placeable.hitArea?.height : 0);

  const delta = <number>canvas.dimensions?.size / <number>canvas.dimensions?.distance || 20;
  const deltaBeneath = (xMinB - xMaxA) / delta;
  const deltaLeft = (xMinA - xMaxB) / delta;
  const deltaAbove = (yMinB - yMaxA) / delta;
  const deltaRight = (yMinA - yMaxB) / delta;
  //@ts-ignore
  const unitSize = <number>canvas.dimensions?.distance || 5;
  let dist = Math.max(deltaBeneath, deltaLeft, deltaAbove, deltaRight);
  dist = dist / unitSize;
  return dist;
};

/**
 * @href https://stackoverflow.com/questions/30368632/calculate-distance-on-a-grid-between-2-points
 * @param doorControl or placeable
 * @param charCenter
 * @returns
 */
export const computeDistanceBetweenCoordinates = function (
  placeable: ArmsreachData,
  character: Token,
  documentName: string,
): number {
  const xPlaceable = placeable.x; //placeable._validPosition?.x ? placeable._validPosition?.x : placeable.x;
  const yPlaceable = placeable.y; //placeable._validPosition?.y ? placeable._validPosition?.y : placeable.y;
  const wPlaceable = placeable.w;
  const hPlaceable = placeable.h;

  //@ts-ignore
  // let xToken = character._validPosition?.x ? character._validPosition?.x : character.x;
  // //@ts-ignore
  // let yToken = character._validPosition?.y ? character._validPosition?.y : character.y;
  //const shape = getTokenCenter(character);
  // const shape = { x: character.x + character.w / 2, y: character.y + character.h / 2 };
  // const tokendoc = character.document;
  // //@ts-ignore
  // const tokenWidth = (tokendoc.parent?.dimensions.size * tokendoc.data.width) / 2;
  // //@ts-ignore
  // const tokenHeight = (tokendoc.parent?.dimensions.size * tokendoc.data.height) / 2;
  // const shape = {
  //   x: tokendoc.data.x + tokenWidth,
  //   y: tokendoc.data.y + tokenHeight,
  // };
  // xToken = shape.x;
  // yToken = shape.y;
  //@ts-ignore
  const unitSize = <number>canvas.dimensions.distance; //<number>canvas.grid?.grid?.options.dimensions.distance;

  if (!xPlaceable || !yPlaceable || !character.x || !character.y) {
    error(
      '[xPlaceable=' +
        xPlaceable +
        ', yPlaceable=' +
        yPlaceable +
        ', xToken=' +
        character.x +
        ', yToken=' +
        character.y +
        ']',
    );
    // const dist = computeDistanceBetweenCoordinatesOLD(placeable, character);
    const dist = grids_between_token_and_placeable(character, placeable);
    return dist;
  } else {
    // if (documentName == 'Stairway') {
    //   // const dist = grids_between_token_and_placeable(character, { x: xPlaceable, y: yPlaceable, w: wPlaceable, h: hPlaceable });
    //   // return dist;
    //   const dist = units_between_token_and_placeableOLD(character, {
    //     x: xPlaceable,
    //     y: yPlaceable,
    //     w: wPlaceable,
    //     h: hPlaceable,
    //   });
    //   return dist;
    // } else if (documentName == NoteDocument.documentName) {
    //   // const dist = units_between_token_and_placeableOLD(character, { x: xPlaceable, y: yPlaceable, w: wPlaceable, h: hPlaceable });
    //   // return dist;
    //   // let dist = grids_between_token_and_placeable(character,placeable);
    //   // dist = dist * unitSize;
    //   const dist = units_between_token_and_placeableOLD(character, {
    //     x: xPlaceable,
    //     y: yPlaceable,
    //     w: wPlaceable,
    //     h: hPlaceable,
    //   });
    //   return dist;
    // } else {
    const dist = units_between_token_and_placeable(character, {
      x: xPlaceable,
      y: yPlaceable,
      w: wPlaceable,
      h: hPlaceable,
      documentName: documentName,
    });
    return dist;
    // }
  }
};

export function getTokenByTokenID(id) {
  // return await game.scenes.active.data.tokens.find( x => {return x.id === id});
  return canvas.tokens?.placeables.find((x) => {
    return x.id === id;
  });
}

export function getTokenByTokenName(name) {
  // return await game.scenes.active.data.tokens.find( x => {return x._name === name});
  return canvas.tokens?.placeables.find((x) => {
    return x.name == name;
  });
  // return canvas.tokens.placeables.find( x => { return x.id == game.user.id});
}

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
export const getCenter = function (placeableObject: PlaceableObject, grid: any = {}): { x: number; y: number } {
  const data = placeableObject.data ? placeableObject.data : placeableObject;
  //getCenter(type, data, grid = {}){
  let isGridSpace = false;
  if (placeableObject.document.documentName == TileDocument.documentName) {
    isGridSpace = false;
  } else if (placeableObject.document.documentName == DrawingDocument.documentName) {
    isGridSpace = false;
  } else {
    isGridSpace = true;
  }
  grid = mergeObject({ w: canvas.grid?.w, h: canvas.grid?.h }, grid);
  const [x, y] = [data.x, data.y];
  let center = { x: x, y: y };
  //Tokens, Tiles
  if ('width' in data && 'height' in data) {
    let [width, height] = [data.width, data.height];
    if (isGridSpace) {
      [width, height] = [width * grid.w, height * grid.h];
    }
    center = { x: x + Math.abs(width) / 2, y: y + Math.abs(height) / 2 };
  }
  //Walls
  if ('c' in data) {
    //@ts-ignore
    center = { x: (data.c[0] + data.c[2]) / 2, y: (data.c[1] + data.c[3]) / 2 };
  }
  return center;
};

/**
 * Get token shape center
 * from dragRuler module
 */
function getTokenShape(token): any[] {
  if (token.scene.data.gridType === CONST.GRID_TYPES.GRIDLESS) {
    return [{ x: 0, y: 0 }];
  } else if (token.scene.data.gridType === CONST.GRID_TYPES.SQUARE) {
    const topOffset = -Math.floor(token.data.height / 2);
    const leftOffset = -Math.floor(token.data.width / 2);
    const shape: any[] = [];
    for (let y = 0; y < token.data.height; y++) {
      for (let x = 0; x < token.data.width; x++) {
        shape.push({ x: x + leftOffset, y: y + topOffset });
      }
    }
    return shape;
  } else {
    // Hex grids
    //@ts-ignore
    if (game.modules.get('hex-size-support')?.active && CONFIG.hexSizeSupport.getAltSnappingFlag(token)) {
      const borderSize = token.data.flags['hex-size-support'].borderSize;
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
 * Get chracter name from token
 */
export const getCharacterName = function (token: Token) {
  let tokenName = '';
  if (token.name) {
    tokenName = token.name;
  } else if (token.actor && token.actor.data && token.actor.data.name) {
    tokenName = token.actor.data.name;
  }
  return tokenName;
};

/**
 * Interation fail messages
 */
export const iteractionFailNotification = function (message) {
  if (!game.settings.get(ARMS_REACH_MODULE_NAME, 'notificationsInteractionFail')) {
    return;
  }
  ui.notifications?.warn(message);
};

/**
 * Returns the first selected token
 */
export const getFirstPlayerTokenSelected = function (): Token | null {
  // Get first token ownted by the player
  const selectedTokens = <Token[]>canvas.tokens?.controlled;
  if (selectedTokens.length > 1) {
    //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
    return null;
  }
  if (!selectedTokens || selectedTokens.length == 0) {
    //if(game.user.character.data.token){
    //  //@ts-ignore
    //  return game.user.character.data.token;
    //}else{
    return null;
    //}
  }
  return selectedTokens[0];
};

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
export const getFirstPlayerToken = function (): Token | null {
  // Get controlled token
  let token: Token;
  const controlled: Token[] = <Token[]>canvas.tokens?.controlled;
  // Do nothing if multiple tokens are selected
  if (controlled.length && controlled.length > 1) {
    //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
    return null;
  }
  // If exactly one token is selected, take that
  token = controlled[0];
  if (!token) {
    if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'useOwnedTokenIfNoTokenIsSelected')) {
      if (!controlled.length || controlled.length == 0) {
        // If no token is selected use the token of the users character
        token = <Token>canvas.tokens?.placeables.find((token) => token.data._id === game.user?.character?.data?._id);
      }
      // If no token is selected use the first owned token of the users character you found
      if (!token) {
        token = <Token>canvas.tokens?.ownedTokens[0];
      }
    }
  }
  return token;
};

/**
 * Check if active document is the canvas
 */
export const isFocusOnCanvas = function () {
  if (
    !document.activeElement ||
    !document.activeElement.attributes ||
    !document.activeElement.attributes['class'] ||
    document.activeElement.attributes['class'].value.substr(0, 8) !== 'vtt game'
  ) {
    return false;
  } else {
    return true;
  }
};

export const reselectTokenAfterInteraction = function (character: Token) {
  // If settings is true do not deselect the current select token
  if (<boolean>game.settings.get(ARMS_REACH_MODULE_NAME, 'forceReSelection')) {
    let isOwned = false;
    if (!character) {
      character = <Token>getFirstPlayerTokenSelected();
      if (!character) {
        character = <Token>getFirstPlayerToken();
        if (character) {
          isOwned = true;
        }
      }
      if (!character) {
        if (game.user?.isGM) {
          return true;
        } else {
          return false;
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

function measureDistancesInternal(segments, options = {}) {
  const opts = <any>duplicate(options);
  //@ts-ignore
  if (canvas.grid?.diagonalRule === 'EUCL') {
    opts.ignoreGrid = true;
    opts.gridSpaes = false;
  }
  if (opts.enableTerrainRuler) {
    opts.gridSpaces = true;
    const firstNewSegmentIndex = segments.findIndex((segment) => !segment.ray.dragRulerVisitedSpaces);
    const previousSegments = segments.slice(0, firstNewSegmentIndex);
    const newSegments = segments.slice(firstNewSegmentIndex);
    const distances = previousSegments.map(
      (segment) => segment.ray.dragRulerVisitedSpaces[segment.ray.dragRulerVisitedSpaces.length - 1].distance,
    );
    previousSegments.forEach(
      (segment) => (segment.ray.terrainRulerVisitedSpaces = duplicate(segment.ray.dragRulerVisitedSpaces)),
    );
    //opts.costFunction = (x, y, costOptions={}) => {	return getCostFromSpeedProvider(entity, getAreaFromPositionAndShape({x, y}, shape), costOptions); }
    if (previousSegments.length > 0) {
      opts.terrainRulerInitialState = previousSegments[previousSegments.length - 1].ray.dragRulerFinalState;
    }
    //@ts-ignore
    return distances.concat(terrainRuler.measureDistances(newSegments, opts));
  } else {
    // If another module wants to enable grid measurements but disable grid highlighting,
    // manually set the *duplicate* option's gridSpaces value to true for the Foundry logic to work properly
    if (!opts.ignoreGrid) {
      opts.gridSpaces = true;
    }
    return canvas.grid?.measureDistances(segments, opts);
    /*
    if (!opts.gridSpaces) return BaseGrid.prototype.measureDistances.call(this, segments, options);

    // Track the total number of diagonals
    let nDiagonal = 0;
    // const rule = canvas.parent.diagonalRule;
    const d = <Canvas.Dimensions>canvas.dimensions;

    // Iterate over measured segments
    return segments.map((s) => {
      const r: Ray = s.ray;

      // Determine the total distance traveled
      const nx = Math.abs(Math.ceil(r.dx / d.size));
      const ny = Math.abs(Math.ceil(r.dy / d.size));

      // Determine the number of straight and diagonal moves
      const nd = Math.min(nx, ny);
      const ns = Math.abs(ny - nx);

      nDiagonal += nd;

      const nd10 = Math.floor(nDiagonal / 2) - Math.floor((nDiagonal - nd) / 2);
      const spaces = nd10 * 2 + (nd - nd10) + ns;
      return spaces * <number>canvas.dimensions?.distance;
    });
    */
  }
}

export const checkTaggerForAmrsreach = function (placeable: PlaceableObject) {
  //@ts-ignore
  const tags = <string[]>Tagger?.getTags(placeable) || [];
  if (tags.includes(ARMS_REACH_TAGGER_FLAG)) {
    return true;
  } else {
    return false;
  }
};

export const getMousePosition = function (canvas: Canvas, event): { x: number; y: number } {
  // const transform = <PIXI.Matrix>canvas?.tokens?.worldTransform;
  // return {
  //   x: (event.data.global.x - transform?.tx) / <number>canvas?.stage?.scale?.x,
  //   y: (event.data.global.y - transform?.ty) / <number>canvas?.stage?.scale?.y,
  // };
  // NEW METHOD SEEM MORE PRECISE
  const position = canvas.app?.renderer.plugins.interaction.mouse.getLocalPosition(canvas.app.stage);
  return {
    x: position.x,
    y: position.y,
  };
};

export const getPlaceablesAt = function (placeables, position): PlaceableObject[] {
  return placeables.filter((placeable) => placeableContains(placeable, position));
};

export const placeableContains = function (placeable, position): boolean {
  // const x = getPlaceableX(placeable);
  // const y = getPlaceableY(placeable);

  const center = getCenter(placeable);
  const x = center.x;
  const y = center.y;

  const w = getPlaceableWidth(placeable) || 0;
  const h = getPlaceableHeight(placeable) || 0;
  return Number.between(position.x, x, x + w) && Number.between(position.y, y, y + h);
};

export const getPlaceableDoorCenter = function (placeable: any): any {
  const x = getPlaceableX(placeable);
  const y = getPlaceableY(placeable);

  // const center = getCenter(placeable);
  // const x = center.x;
  // const y = center.y;

  const w = getPlaceableWidth(placeable) || 0;
  const h = getPlaceableHeight(placeable) || 0;
  return { x: x, y: y, w: w, h: h };
};

export const getPlaceableCenter = function (placeable: any): any {
  // const x = getPlaceableX(placeable);
  // const y = getPlaceableY(placeable);

  const center = getCenter(placeable);
  const x = center.x;
  const y = center.y;

  const w = getPlaceableWidth(placeable) || 0;
  const h = getPlaceableHeight(placeable) || 0;
  return { x: x, y: y, w: w, h: h };
};

const getPlaceableWidth = function (placeable: any): number {
  let w = placeable.w || placeable.data?.width || placeable.width;
  if (placeable?.object) {
    w = placeable?.object?.w || placeable?.object?.data?.width || placeable?.object?.width || w;
  }
  return w;
};

const getPlaceableHeight = function (placeable: any): number {
  let h = placeable.h || placeable.data?.height || placeable.height;
  if (placeable?.object) {
    h = placeable?.object?.h || placeable?.object?.data?.height || placeable?.object?.height || h;
  }
  return h;
};

const getPlaceableX = function (placeable: any): number {
  let x = placeable._validPosition?.x || placeable.x || placeable?.data?.x;
  if (placeable?.object) {
    x = placeable?.object?.x || placeable?.object?.data?.x || x;
  }
  return x;
};

const getPlaceableY = function (placeable: any): number {
  let y = placeable._validPosition?.y || placeable?.y || placeable?.data?.y;
  if (placeable?.object) {
    y = placeable?.object?.y || placeable?.object?.data?.y || placeable?.object?.y || y;
  }
  return y;
};

function distance_between_rect(p1: Token, p2: ArmsreachData) {
  const x1 = p1.x;
  const y1 = p1.y;
  const x1b = p1.x + p1.w;
  const y1b = p1.y + p1.h;

  const x2 = p2.x;
  const y2 = p2.y;
  const x2b = p2.x + <number>p2.w;
  const y2b = p2.y + <number>p2.h;

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

function distance_between(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.max(new Ray(a, b).distance, new Ray(b, a).distance);
}

function grids_between_token_and_placeable(token: Token, b: ArmsreachData) {
  return Math.floor(distance_between_rect(token, b) / <number>canvas.grid?.size) + 1;
}

function units_between_token_and_placeable(token: Token, b: ArmsreachData) {
  let dist = Math.floor(distance_between_rect(token, b));
  if (dist == 0) {
    //
  } else {
    const unitSize = <number>canvas.dimensions?.distance || 5;
    const unitGridSize = <number>canvas.grid?.size || 50;
    // TODO i don't understand this
    if (b.documentName != WallDocument.documentName) {
      dist = (Math.floor(dist) / unitGridSize) * unitSize;
    }
  }
  return dist;
  // return Math.floor(distance_between_rect(token, b));
}

function units_between_token_and_placeableOLD(token: Token, b: ArmsreachData) {
  let dist = distance_between_rect(token, b);
  if (dist == 0) {
    const segmentsRight = [{ ray: new Ray({ x: b.x, y: b.y }, { x: token.x, y: token.y }) }];
    //@ts-ignore
    const distancesRight = measureDistancesInternal(segmentsRight); // , character, shape
    // Sum up the distances
    const distRight = distancesRight.reduce((acc, val) => acc + val, 0);

    const segmentsLeft = [{ ray: new Ray({ x: token.x, y: token.y }, { x: b.x, y: b.y }) }];
    //@ts-ignore
    const distancesLeft = measureDistancesInternal(segmentsLeft); // , character, shape
    // Sum up the distances
    const distLeft = distancesLeft.reduce((acc, val) => acc + val, 0);

    dist = Math.max(distRight, distLeft);
  } else {
    const unitSize = <number>canvas.dimensions?.distance || 5;
    const unitGridSize = <number>canvas.grid?.size || 50;
    dist = (Math.floor(dist) / unitGridSize) * unitSize;
  }
  return dist;
}

// function tokens_close_enough(a, b, maxDistance){
//   const distance = grids_between_token_and_placeable(a, b);
//   return maxDistance >= distance;
// }
