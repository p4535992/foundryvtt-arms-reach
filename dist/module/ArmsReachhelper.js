import { ARMS_REACH_MODULE_NAME, getCanvas, getGame } from "./settings.js";
//@ts-ignore
import { measureDistances } from '../../drag-ruler/src/compatibility.js';
//@ts-ignore
import { getTokenShape } from '../../drag-ruler/src/util.js';
/**
 * @href https://stackoverflow.com/questions/30368632/calculate-distance-on-a-grid-between-2-points
 * @param doorControl or placeable
 * @param charCenter
 * @returns
 */
export const computeDistanceBetweenCoordinatesOLD = function (placeable, character) {
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
    const delta = getCanvas().dimensions?.size / getCanvas().dimensions?.distance || 20;
    const deltaBeneath = ((xMinB - xMaxA) / delta);
    const deltaLeft = ((xMinA - xMaxB) / delta);
    const deltaAbove = ((yMinB - yMaxA) / delta);
    const deltaRight = ((yMinA - yMaxB) / delta);
    //@ts-ignore
    const unitSize = getCanvas().dimensions?.distance || 5;
    //return unitSize + Math.max(deltaBeneath, deltaLeft, deltaAbove, deltaRight);
    let dist = Math.max(deltaBeneath, deltaLeft, deltaAbove, deltaRight);
    dist = (dist / unitSize);
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
export const computeDistanceBetweenCoordinates = function (placeable, character) {
    const xPlaceable = placeable._validPosition?.x ? placeable._validPosition?.x : placeable.x;
    const yPlaceable = placeable._validPosition?.y ? placeable._validPosition?.y : placeable.y;
    //@ts-ignore
    const xToken = character._validPosition?.x ? character._validPosition?.x : character.x;
    //@ts-ignore
    const yToken = character._validPosition?.y ? character._validPosition?.y : character.y;
    const segments = [{ ray: new Ray({ x: xToken, y: yToken }, { x: xPlaceable, y: yPlaceable }) }];
    const shape = getTokenShape(character);
    const distances = measureDistances(segments, character, shape);
    // Sum up the distances
    //@ts-ignore
    const unitSize = getCanvas().grid?.grid?.options.dimensions.distance;
    return distances.reduce((acc, val) => acc + val, 0) - unitSize;
};
// export function measureDistances(segments, entity:Token, shape, options:any={}) {
// 	const opts = duplicate(options)
// 	if (opts.enableTerrainRuler || getGame().modules.get("terrain-ruler")?.active) {
// 		opts.gridSpaces = true;
// 		const firstNewSegmentIndex = segments.findIndex(segment => !segment.ray.dragRulerVisitedSpaces);
// 		const previousSegments = segments.slice(0, firstNewSegmentIndex);
// 		const newSegments = segments.slice(firstNewSegmentIndex);
// 		const distances = previousSegments.map(segment => segment.ray.dragRulerVisitedSpaces[segment.ray.dragRulerVisitedSpaces.length - 1].distance);
// 		previousSegments.forEach(segment => segment.ray.terrainRulerVisitedSpaces = duplicate(segment.ray.dragRulerVisitedSpaces));
// 		opts.costFunction = (x, y, costOptions={}) => {	
//         return getCostFromSpeedProvider(entity, getAreaFromPositionAndShape({x, y}, shape), costOptions); 
//         }
//         if (previousSegments.length > 0){
//             opts.terrainRulerInitialState = previousSegments[previousSegments.length - 1].ray.dragRulerFinalState;
//         }
//         //@ts-ignore
//         return distances.concat(terrainRuler.measureDistances(newSegments, opts));
// 	}
// 	else {
// 		// If another module wants to enable grid measurements but disable grid highlighting,
// 		// manually set the *duplicate* option's gridSpaces value to true for the Foundry logic to work properly
// 		if(!opts.ignoreGrid) {
// 			opts.gridSpaces = true;
// 		}
// 		return getCanvas().grid?.measureDistances(segments, opts);
// 	}
// }
// export function getAreaFromPositionAndShape(position, shape) {
// 	return shape.map(space => {
// 		let x = position.x + space.x;
// 		let y = position.y + space.y;
// 		if (getCanvas().grid?.isHex) {
//             let shiftedRow;
//             //@ts-ignore
//             if (getCanvas().grid?.grid?.options.even){
//                 shiftedRow = 1
//             }
//             else{
//                 shiftedRow = 0
//             }
//             //@ts-ignore
//             if (getCanvas().grid?.grid?.options.columns) {
//                 if (space.x % 2 !== 0 && position.x % 2 !== shiftedRow) {
//                     y += 1;
//                 }
//             }
//             else {
//                 if (space.y % 2 !== 0 && position.y % 2 !== shiftedRow) {
//                     x += 1;
//                 }
//             }
// 		}
// 		return {x, y}
// 	});
// }
// export function getTokenShape(token) {
// 	if (token.scene.data.gridType === CONST.GRID_TYPES.GRIDLESS) {
// 		return [{x: 0, y: 0}]
// 	}
// 	else if (token.scene.data.gridType === CONST.GRID_TYPES.SQUARE) {
// 		const topOffset = -Math.floor(token.data.height / 2)
// 		const leftOffset = -Math.floor(token.data.width / 2)
// 		const shape = []
// 		for (let y = 0;y < token.data.height;y++) {
// 			for (let x = 0;x < token.data.width;x++) {
// 				shape.push(<never>{x: x + leftOffset, y: y + topOffset})
// 			}
// 		}
// 		return shape
// 	}
// 	else {
// 		// Hex grids
//         //@ts-ignore
// 		if (getGame().modules.get("hex-size-support")?.active && CONFIG.hexSizeSupport.getAltSnappingFlag(token)) {
// 			const borderSize = token.data.flags["hex-size-support"].borderSize;
// 			let shape = [{x: 0, y: 0}];
// 			if (borderSize >= 2){
// 				shape = shape.concat([{x: 0, y: -1}, {x: -1, y: -1}]);
//             }
// 			if (borderSize >= 3){
// 				shape = shape.concat([{x: 0, y: 1}, {x: -1, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}]);
//             }
// 			if (borderSize >= 4){
// 				shape = shape.concat([{x: -2, y: -1}, {x: 1, y: -1}, {x: -1, y: -2}, {x: 0, y: -2}, {x: 1, y: -2}])
//             }
//             //@ts-ignore
// 			if (Boolean(CONFIG.hexSizeSupport.getAltOrientationFlag(token)) !== canvas.grid.grid.options.columns){
// 				shape.forEach(space => space.y *= -1);
//             }
//             //@ts-ignore
// 			if (getCanvas().grid?.grid?.options.columns){
// 				shape = shape.map(space => {return {x: space.y, y: space.x}});
//             }
// 			return shape;
// 		}
// 		else {
// 			return [{x: 0, y: 0}];
// 		}
// 	}
// }
// export function getCostFromSpeedProvider(token, area, options) {
// 	try {
// 		if (currentSpeedProvider instanceof Function) {
// 			return SpeedProvider.prototype.getCostForStep.call(undefined, token, area, options);
// 		}
// 		return currentSpeedProvider.getCostForStep(token, area, options);
// 	}
// 	catch (e) {
// 		console.error(e);
// 		return 1;
// 	}
// }
/**
 * Get token center
 */
export const getTokenCenter = function (token) {
    /*
    let tokenCenter = {x: token.x , y: token.y };
    tokenCenter.x += -20 + ( token.w * 0.50 );
    tokenCenter.y += -20 + ( token.h * 0.50 );
    */
    let tokenCenter = { x: token.x + token.w / 2, y: token.y + token.h / 2 };
    return tokenCenter;
};
/**
 * Get chracter name from token
 */
export const getCharacterName = function (token) {
    var tokenName = null;
    if (token.name) {
        tokenName = token.name;
    }
    else if (token.actor && token.actor.data && token.actor.data.name) {
        tokenName = token.actor.data.name;
    }
    return tokenName;
};
/**
 * Interation fail messages
 */
export const iteractionFailNotification = function (message) {
    if (!getGame().settings.get(ARMS_REACH_MODULE_NAME, "notificationsInteractionFail")) {
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
export const getFirstPlayerTokenSelected = function () {
    // Get first token ownted by the player
    let selectedTokens = getCanvas().tokens?.controlled;
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
export const getFirstPlayerToken = function () {
    // Get controlled token
    let token;
    let controlled = getCanvas().tokens?.controlled;
    // Do nothing if multiple tokens are selected
    if (controlled.length && controlled.length > 1) {
        //iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
        return null;
    }
    // If exactly one token is selected, take that
    token = controlled[0];
    if (!token) {
        if (getGame().settings.get(ARMS_REACH_MODULE_NAME, "useOwnedTokenIfNoTokenIsSelected")) {
            if (!controlled.length || controlled.length == 0) {
                // If no token is selected use the token of the users character
                token = getCanvas().tokens?.placeables.find(token => token.data._id === getGame().user?.character?.data?._id);
            }
            // If no token is selected use the first owned token of the users character you found
            if (!token) {
                token = getCanvas().tokens?.ownedTokens[0];
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
    if (!document.activeElement ||
        !document.activeElement.attributes ||
        !document.activeElement.attributes['class'] ||
        document.activeElement.attributes['class'].value.substr(0, 8) !== "vtt game") {
        return false;
    }
    else {
        return true;
    }
};
