import { ARMS_REACH_MODULE_NAME, getCanvas, getGame } from './settings';
//@ts-ignore
// import { SpeedProvider } from '../../drag-ruler/src/speed_provider.js';
//@ts-ignore
// import { availableSpeedProviders, currentSpeedProvider } from '../../drag-ruler/src/api.js';
//@ts-ignore
//import { measureDistances } from '../../drag-ruler/src/compatibility.js';
//@ts-ignore
//import { getTokenShape } from '../../drag-ruler/src/util.js';
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
    const distancesRight = dragRuler.measureDistances(segmentsRight, character, shape);
    // Sum up the distances
    const distRight = distancesRight.reduce((acc, val) => acc + val, 0);

    const segmentsLeft = [{ ray: new Ray({ x: xToken, y: yToken }, { x: xPlaceable, y: yPlaceable }) }];
    //@ts-ignore
    const distancesLeft = dragRuler.measureDistances(segmentsLeft, character, shape);
    // Sum up the distances
    const distLeft = distancesLeft.reduce((acc, val) => acc + val, 0);

    const dist = Math.max(distRight, distLeft);

    return dist;
    
    /*
    // Track the total number of diagonals
    let nDiagonalRight = 0;
    const dRight = <Canvas.Dimensions>getCanvas().dimensions;

    const rayRight = new Ray({ x: xPlaceable, y: yPlaceable }, { x: xToken, y: yToken });
    const segmentsRight = [{ ray: rayRight }];

    // Determine the total distance traveled
    const nxRight = Math.abs(Math.ceil(rayRight.dx / dRight.size));
    const nyRight = Math.abs(Math.ceil(rayRight.dy / dRight.size));

    // Determine the number of straight and diagonal moves
    const ndRight = Math.min(nxRight, nyRight);
    const nsRight = Math.abs(nyRight - nxRight);
    nDiagonalRight += ndRight;

    // Alternative 5/10/5 Movement
    //const nd10Right = Math.floor(nDiagonalRight / 2) - Math.floor((nDiagonalRight - ndRight) / 2);
    //const spacesRight = (nd10Right * 2) + (ndRight - nd10Right) + nsRight;

    //@ts-ignore
    const distancesRight = dragRuler.measureDistances(segmentsRight, character, shape);
    // Sum up the distances
    const distRight = distancesRight.reduce((acc, val) => acc + val, 0);
    //const distRight = spacesRight * distancesRight.reduce((acc, val) => acc + val, 0);

    // Track the total number of diagonals
    let nDiagonalLeft = 0;
    const dLeft = <Canvas.Dimensions>getCanvas().dimensions;

    const rayLeft = new Ray({ x: xToken, y: yToken }, { x: xPlaceable, y: yPlaceable });
    const segmentsLeft = [{ ray: rayLeft }];

    // Determine the total distance traveled
    const nxLeft = Math.abs(Math.ceil(rayLeft.dx / dLeft.size));
    const nyLeft = Math.abs(Math.ceil(rayLeft.dy / dLeft.size));

    // Determine the number of straight and diagonal moves
    const ndLeft = Math.min(nxLeft, nyLeft);
    const nsLeft = Math.abs(nyLeft - nxLeft);
    nDiagonalLeft += ndLeft;

    // Alternative 5/10/5 Movement
    //const nd10Left = Math.floor(nDiagonalLeft / 2) - Math.floor((nDiagonalLeft - ndLeft) / 2);
    //const spacesLeft = (nd10Left * 2) + (ndLeft - nd10Left) + nsLeft;

    //@ts-ignore
    const distancesLeft = dragRuler.measureDistances(segmentsLeft, character, shape);
    // Sum up the distances
    const distLeft = distancesLeft.reduce((acc, val) => acc + val, 0) ;
    //const distLeft = spacesLeft * distancesLeft.reduce((acc, val) => acc + val, 0);
    let dist = 0;
    // if(distLeft > distRight){
    //   dist = distLeft + (distLeft == unitSize  ? (nDiagonalLeft * unitSize) : 0 )
    // } else if(distRight > distLeft){
    //   dist = distRight + (distRight == unitSize ? (nDiagonalRight * unitSize) : 0 )
    // } else{

      dist = Math.max(distRight, distLeft);
      if(distRight == unitSize && distLeft == unitSize && nDiagonalRight == 0 && nDiagonalLeft == 0) {
        dist = dist + unitSize;
      }

    // }
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
  if(shapes && shapes.length > 0){
    const shape0 = shapes[0];
    return { x: shape0.x, y: shape0.y }
  }
  const tokenCenter = { x: token.x + token.w / 2, y: token.y + token.h / 2 };
  return tokenCenter;
};

/**
 * Get token shape center
 */
function getTokenShape(token):any[] {
	if (token.scene.data.gridType === CONST.GRID_TYPES.GRIDLESS) {
		return [{x: 0, y: 0}]
	}
	else if (token.scene.data.gridType === CONST.GRID_TYPES.SQUARE) {
		const topOffset = -Math.floor(token.data.height / 2)
		const leftOffset = -Math.floor(token.data.width / 2)
		const shape:any[] = []
		for (let y = 0;y < token.data.height;y++) {
			for (let x = 0;x < token.data.width;x++) {
				shape.push({x: x + leftOffset, y: y + topOffset})
			}
		}
		return shape
	}
	else {
		// Hex grids
    //@ts-ignore
		if (getGame().modules.get("hex-size-support")?.active && CONFIG.hexSizeSupport.getAltSnappingFlag(token)) {
			const borderSize = token.data.flags["hex-size-support"].borderSize;
			let shape = [{x: 0, y: 0}];
			if (borderSize >= 2)
				shape = shape.concat([{x: 0, y: -1}, {x: -1, y: -1}]);
			if (borderSize >= 3)
				shape = shape.concat([{x: 0, y: 1}, {x: -1, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}]);
			if (borderSize >= 4)
				shape = shape.concat([{x: -2, y: -1}, {x: 1, y: -1}, {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2}])
      //@ts-ignore
			if (Boolean(CONFIG.hexSizeSupport.getAltOrientationFlag(token)) !== getCanvas().grid?.grid?.options.columns)
				shape.forEach(space => space.y *= -1);
			if (getCanvas().grid?.grid?.options.columns)
				shape = shape.map(space => {return {x: space.y, y: space.x}});
			return shape;
		}
		else {
			return [{x: 0, y: 0}];
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
