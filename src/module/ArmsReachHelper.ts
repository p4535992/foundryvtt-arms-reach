import { ARMS_REACH_MODULE_NAME, ARMS_REACH_TAGGER_FLAG, getCanvas, getGame } from './settings';
import { error, warn } from '../foundryvtt-arms-reach';

/**
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

  const delta = <number>getCanvas().dimensions?.size / <number>getCanvas().dimensions?.distance || 20;
  const deltaBeneath = (xMinB - xMaxA) / delta;
  const deltaLeft = (xMinA - xMaxB) / delta;
  const deltaAbove = (yMinB - yMaxA) / delta;
  const deltaRight = (yMinA - yMaxB) / delta;
  //@ts-ignore
  const unitSize = <number>getCanvas().dimensions?.distance || 5;
  //return unitSize + Math.max(deltaBeneath, deltaLeft, deltaAbove, deltaRight);
  let dist = Math.max(deltaBeneath, deltaLeft, deltaAbove, deltaRight);
  dist = dist / unitSize;
  //let gridSize = <number>getCanvas().dimensions?.distance;
  //dist = (dist / gridSize);
  return dist;
  /*
    const SQRT_2 = Math.sqrt(2);
    const charCenter = getTokenCenter(character);
    const x1 = placeable.x;
    const y1 = placeable.y;
    const x2 = charCenter.x;
    const y2 = charCenter.y;
    const  dx = Math.abs(x2 - x1);
    const  dy = Math.abs(y2 - y1);

    const  min = Math.min(dx, dy);
    const  max = Math.max(dx, dy);

    const  diagonalSteps = min;
    const  straightSteps = max - min;

    return (SQRT_2 * diagonalSteps + straightSteps) - <number>getCanvas().dimensions?.size;
    */
  //return Math.sqrt(getCanvas().dimensions.size) * diagonalSteps + straightSteps;
  //return getManhattanBetween(doorControl, charCenter);
};

/**
 * @href https://stackoverflow.com/questions/30368632/calculate-distance-on-a-grid-between-2-points
 * @param doorControl or placeable
 * @param charCenter
 * @returns
 */
export const computeDistanceBetweenCoordinates = function (placeable: any, character: Token): number {
  const xPlaceable = placeable._validPosition?.x ? placeable._validPosition?.x : placeable.x;
  const yPlaceable = placeable._validPosition?.y ? placeable._validPosition?.y : placeable.y;
  //@ts-ignore
  const xToken = character._validPosition?.x ? character._validPosition?.x : character.x;
  //@ts-ignore
  const yToken = character._validPosition?.y ? character._validPosition?.y : character.y;
  const shape = getTokenCenter(character);
  //@ts-ignore
  const unitSize = <number>getCanvas().dimensions.distance; //<number>getCanvas().grid?.grid?.options.dimensions.distance;

  if (!xPlaceable || !yPlaceable || !xToken || !yToken) {
    error(
      '[xPlaceable=' + xPlaceable + ', yPlaceable=' + yPlaceable + ', xToken=' + xToken + ', yToken=' + yToken + ']',
    );
    return computeDistanceBetweenCoordinatesOLD(placeable, character);
  } else {
    const segmentsRight = [{ ray: new Ray({ x: xPlaceable, y: yPlaceable }, { x: xToken, y: yToken }) }];
    //@ts-ignore
    const distancesRight = measureDistancesInternal(segmentsRight, character, shape);
    // Sum up the distances
    const distRight = distancesRight.reduce((acc, val) => acc + val, 0);

    const segmentsLeft = [{ ray: new Ray({ x: xToken, y: yToken }, { x: xPlaceable, y: yPlaceable }) }];
    //@ts-ignore
    const distancesLeft = measureDistancesInternal(segmentsLeft, character, shape);
    // Sum up the distances
    const distLeft = distancesLeft.reduce((acc, val) => acc + val, 0);

    const dist = Math.max(distRight, distLeft);

    return dist;

    /*
    // Track the total number of diagonals
    let nDiagonalRight = 0;


    const rayRight = new Ray({ x: xPlaceable, y: yPlaceable }, { x: xToken, y: yToken });
    const segmentsRight = [{ ray: rayRight }];

    // const dRight = <Canvas.Dimensions>getCanvas().dimensions;
    // Determine the total distance traveled
    // const nxRight = Math.abs(Math.ceil(rayRight.dx / dRight.size));
    // const nyRight = Math.abs(Math.ceil(rayRight.dy / dRight.size));

    // Determine the number of straight and diagonal moves
    // const ndRight = Math.min(nxRight, nyRight);
    // const nsRight = Math.abs(nyRight - nxRight);
    // nDiagonalRight += ndRight;

    const ndRight = Math.min(rayRight.dx, rayRight.dy);
    nDiagonalRight += Math.sqrt(2) * ndRight;

    //@ts-ignore
    const distancesRight = measureDistancesInternal(segmentsRight, character, shape);
    // Sum up the distances
    const distRight = distancesRight.reduce((acc, val) => acc + val, 0);
    //const distRight = spacesRight * distancesRight.reduce((acc, val) => acc + val, 0);

    // Track the total number of diagonals
    let nDiagonalLeft = 0;

    const rayLeft = new Ray({ x: xToken, y: yToken }, { x: xPlaceable, y: yPlaceable });
    const segmentsLeft = [{ ray: rayLeft }];

    // const dLeft = <Canvas.Dimensions>getCanvas().dimensions;
    // Determine the total distance traveled
    // const nxLeft = Math.abs(Math.ceil(rayLeft.dx / dLeft.size));
    // const nyLeft = Math.abs(Math.ceil(rayLeft.dy / dLeft.size));

    // Determine the number of straight and diagonal moves
    // const ndLeft = Math.min(nxLeft, nyLeft);
    // const nsLeft = Math.abs(nyLeft - nxLeft);
    // nDiagonalLeft += ndLeft;
    
    const ndLeft = Math.min(rayLeft.dx, rayLeft.dy);
    nDiagonalLeft += Math.sqrt(2) * ndLeft;

    //@ts-ignore
    const distancesLeft = measureDistancesInternal(segmentsLeft, character, shape);
    // Sum up the distances
    const distLeft = distancesLeft.reduce((acc, val) => acc + val, 0) ;
    //const distLeft = spacesLeft * distancesLeft.reduce((acc, val) => acc + val, 0);
    let dist = 0;
    if(distLeft > distRight){
      dist = distLeft + (distLeft == unitSize  ? (nDiagonalLeft * unitSize) : 0 )
    } else if(distRight > distLeft){
      dist = distRight + (distRight == unitSize ? (nDiagonalRight * unitSize) : 0 )
    } else{

      dist = Math.max(distRight, distLeft);
      if(distRight == unitSize && distLeft == unitSize && nDiagonalRight == 0 && nDiagonalLeft == 0) {
        dist = dist + unitSize;
      }
    }
    //const dist = Math.max(distRight, distLeft);
    return dist;
    */
  }
};

export function getTokenByTokenID(id) {
  // return await getGame().scenes.active.data.tokens.find( x => {return x.id === id});
  return getCanvas().tokens?.placeables.find((x) => {
    return x.id === id;
  });
}

export function getTokenByTokenName(name) {
  // return await getGame().scenes.active.data.tokens.find( x => {return x._name === name});
  return getCanvas().tokens?.placeables.find((x) => {
    return x.name == name;
  });
  // return getCanvas().tokens.placeables.find( x => { return x.id == getGame().user.id});
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
  const tokenCenter = { x: token.x + token.w / 2, y: token.y + token.h / 2 };
  return tokenCenter;
};

/**
 * Get token shape center
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
    if (getGame().modules.get('hex-size-support')?.active && CONFIG.hexSizeSupport.getAltSnappingFlag(token)) {
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
      if (Boolean(CONFIG.hexSizeSupport.getAltOrientationFlag(token)) !== getCanvas().grid?.grid?.options.columns)
        shape.forEach((space) => (space.y *= -1));
      if (getCanvas().grid?.grid?.options.columns)
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
  if (!getGame().settings.get(ARMS_REACH_MODULE_NAME, 'notificationsInteractionFail')) {
    return;
  }
  ui.notifications?.warn(message);
};

// /**
//  * Returns the first selected token or owned token
//  */
// export const getFirstPlayerToken = function() {
//     // Get first token ownted by the player
//     let selectedTokens = getSelectedOrOwnedTokens();
//     if(!selectedTokens || selectedTokens.length == 0){
//       return null;
//     }
//     return selectedTokens[0];
// }

/**
 * Returns the first selected token
 */
export const getFirstPlayerTokenSelected = function (): Token | null {
  // Get first token ownted by the player
  const selectedTokens = <Token[]>getCanvas().tokens?.controlled;
  if (selectedTokens.length > 1) {
    //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
    return null;
  }
  if (!selectedTokens || selectedTokens.length == 0) {
    //if(getGame().user.character.data.token){
    //  //@ts-ignore
    //  return getGame().user.character.data.token;
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
  const controlled: Token[] = <Token[]>getCanvas().tokens?.controlled;
  // Do nothing if multiple tokens are selected
  if (controlled.length && controlled.length > 1) {
    //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
    return null;
  }
  // If exactly one token is selected, take that
  token = controlled[0];
  if (!token) {
    if (<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'useOwnedTokenIfNoTokenIsSelected')) {
      if (!controlled.length || controlled.length == 0) {
        // If no token is selected use the token of the users character
        token = <Token>(
          getCanvas().tokens?.placeables.find((token) => token.data._id === getGame().user?.character?.data?._id)
        );
      }
      // If no token is selected use the first owned token of the users character you found
      if (!token) {
        token = <Token>getCanvas().tokens?.ownedTokens[0];
      }
    }
  }
  return token;
};

// /**
//  * Simple Manhattan Distance between two objects that have x and y attrs.
//  */
// export const getManhattanBetween = function(obj1, obj2)  {
//   // console.log("[" + obj1.x + " , " + obj1.y + "],[" + obj2.x + " , " + obj2.y + "]"); // DEBUG
//   return Math.abs(obj1.x - obj2.x) + Math.abs(obj1.y - obj2.y)-20; //The -20 seem to fix some calculation issue
// }

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
  if (<boolean>getGame().settings.get(ARMS_REACH_MODULE_NAME, 'forceReSelection')) {
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
        if (getGame().user?.isGM) {
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
        const observable = getCanvas().tokens?.placeables.filter((t) => t.id === character.id);
        if (observable !== undefined) {
          observable[0].control();
        }
      }
    }
  }
};

export const measureDistancesInternal = function (segments, entity, shape, options = {}) {
  const opts: any = duplicate(options);
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
    //return getCanvas().grid?.measureDistances(segments, opts);
    if (!opts.gridSpaces) return BaseGrid.prototype.measureDistances.call(this, segments, options);

    // Track the total number of diagonals
    let nDiagonal = 0;
    // const rule = getCanvas().parent.diagonalRule;
    const d = <Canvas.Dimensions>getCanvas().dimensions;

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
      return spaces * <number>getCanvas().dimensions?.distance;
    });
  }
};

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
  const transform = <PIXI.Matrix>canvas?.tokens?.worldTransform;
  return {
    x: (event.data.global.x - transform?.tx) / <number>canvas?.stage?.scale?.x,
    y: (event.data.global.y - transform?.ty) / <number>canvas?.stage?.scale?.y,
  };
};

export const getPlaceablesAt = function (placeables, position): PlaceableObject[] {
  return placeables.filter((placeable) => placeableContains(placeable, position));
};

export const placeableContains = function (placeable, position): boolean {
  // Tokens have getter (since width/height is in grid increments) but drawings use data.width/height directly
  const w = placeable.w || placeable.data.width || placeable.width;
  const h = placeable.h || placeable.data.height || placeable.height;
  return (
    Number.between(position.x, placeable.data.x, placeable.data.x + w) &&
    Number.between(position.y, placeable.data.y, placeable.data.y + h)
  );
};
