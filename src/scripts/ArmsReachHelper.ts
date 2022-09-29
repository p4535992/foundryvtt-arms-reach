import { checkElevation, error, getElevationPlaceableObject, warn } from "./lib/lib";
import type { ArmsreachData } from "./ArmsReachModels";
import CONSTANTS from "./constants";

/**
 * @href https://stackoverflow.com/questions/30368632/calculate-distance-on-a-grid-between-2-points
 * @param doorControl or placeable
 * @param charCenter
 * @returns
 */
export const computeDistanceBetweenCoordinates = function (
	placeable: ArmsreachData,
	selectedToken: Token,
	documentName: string,
	useGrids: boolean
): number {
	const xPlaceable = placeable.x; //placeable._validPosition?.x ? placeable._validPosition?.x : placeable.x;
	const yPlaceable = placeable.y; //placeable._validPosition?.y ? placeable._validPosition?.y : placeable.y;
	const wPlaceable = placeable.w;
	const hPlaceable = placeable.h;
	const centerX = placeable.centerX;
	const centerY = placeable.centerY;
	const placeableObjectData = placeable.placeableObjectData;
	//@ts-ignore
	const unitSize = <number>canvas.dimensions.distance; //<number>canvas.grid?.grid?.options.dimensions.distance;

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
export const getCenter = function (placeableObject: PlaceableObject, grid: any = {}): { x: number; y: number } {
	const data = placeableObject.document ? placeableObject.document : placeableObject;
	const placeableObjectDocument =
		placeableObject.document && placeableObject.document.documentName ? placeableObject.document : placeableObject;
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
function getTokenShape(token): any[] {
	if (token.scene.grid.type === CONST.GRID_TYPES.GRIDLESS) {
		return [{ x: 0, y: 0 }];
	} else if (token.scene.grid.type === CONST.GRID_TYPES.SQUARE) {
		const topOffset = -Math.floor(token.document.height / 2);
		const leftOffset = -Math.floor(token.document.width / 2);
		const shape: any[] = [];
		for (let y = 0; y < token.document.height; y++) {
			for (let x = 0; x < token.document.width; x++) {
				shape.push({ x: x + leftOffset, y: y + topOffset });
			}
		}
		return shape;
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
	if (!game.settings.get(CONSTANTS.MODULE_NAME, "notificationsInteractionFail")) {
		return;
	}
	warn(message, true);
};

/**
 * Returns the first selected token
 */
export const getFirstPlayerTokenSelected = function (): Token | null {
	// Get first token ownted by the player
	const selectedTokens = <Token[]>canvas.tokens?.controlled;
	if (selectedTokens.length > 1) {
		//iteractionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
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
	if (
		selectedTokens[0] &&
		<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableInteractionForTokenOwnedByUser")
	) {
		const isPlayerOwned = selectedTokens[0]?.document.isOwner;
		if (!isPlayerOwned) {
			return null;
		} else {
			return <Token>selectedTokens[0];
		}
	} else {
		return <Token>selectedTokens[0];
	}
};

/**
 * Returns the first selected token
 */
export const getFirstPlayerTokenSelectedNo = function (noToken: Token): Token | null {
	// Get first token ownted by the player
	const selectedTokens = <Token[]>canvas.tokens?.controlled;
	if (selectedTokens.length > 1) {
		//iteractionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
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
	if (
		selectedTokens[0] &&
		<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableInteractionForTokenOwnedByUser")
	) {
		const isPlayerOwned = selectedTokens[0]?.document.isOwner;
		if (!isPlayerOwned) {
			return null;
		} else {
			return <string>selectedTokens[0]?.id !== <string>noToken?.id ? <Token>selectedTokens[0] : null;
		}
	} else {
		return <string>selectedTokens[0]?.id !== <string>noToken?.id ? <Token>selectedTokens[0] : null;
	}
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
		//iteractionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
		return null;
	}
	// If exactly one token is selected, take that
	token = <Token>controlled[0];
	if (!token) {
		if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "useOwnedTokenIfNoTokenIsSelected")) {
			if (!controlled.length || controlled.length === 0) {
				// If no token is selected use the token of the users character
				token = <
					Token //@ts-ignore
				>canvas.tokens?.placeables.find((token) => token.document.actorId === game.user?.character?.id);
			}
			// If no token is selected use the first owned token of the users character you found
			if (!token) {
				token = <Token>canvas.tokens?.ownedTokens[0];
			}
		}
	}
	if (token && <boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableInteractionForTokenOwnedByUser")) {
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
export const getFirstPlayerTokenNo = function (noToken: Token): Token | null {
	// Get controlled token
	let token: Token;
	const controlled: Token[] = <Token[]>canvas.tokens?.controlled;
	// Do nothing if multiple tokens are selected
	if (controlled.length && controlled.length > 1) {
		//iteractionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
		return null;
	}
	// If exactly one token is selected, take that
	token = <Token>controlled[0];
	if (!token) {
		if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "useOwnedTokenIfNoTokenIsSelected")) {
			if (!controlled.length || controlled.length === 0) {
				// If no token is selected use the token of the users character
				token = <Token>canvas.tokens?.placeables.find(
					(token) =>
						//@ts-ignore
						token.document.actorId === game.user?.character?.id && token.id !== noToken.id
				);
			}
			// If no token is selected use the first owned token of the users character you found
			if (!token) {
				for (const tok of <Token[]>canvas.tokens?.ownedTokens) {
					if (tok.id !== noToken.id) {
						token = tok;
						break;
					}
				}
				// token = <Token>canvas.tokens?.ownedTokens[0];
			}
		}
	}
	if (token && <boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableInteractionForTokenOwnedByUser")) {
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

export const reselectTokenAfterInteraction = function (character: Token): void {
	// If settings is true do not deselect the current select token
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "forceReSelection")) {
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
					(<Token>observable[0]).control();
				}
			}
		}
	}
};

export const checkTaggerForAmrsreach = function (placeable: PlaceableObject) {
	//@ts-ignore
	const tags = <string[]>Tagger?.getTags(placeable) || [];
	if (tags.includes(CONSTANTS.TAGGER_FLAG)) {
		return true;
	} else {
		return false;
	}
};

export const getMousePosition = function (canvas: Canvas, event): { x: number; y: number } {
	// const transform = <PIXI.Matrix>canvas?.tokens?.worldTransform;
	// return {
	//   x: (event.global.x - transform?.tx) / <number>canvas?.stage?.scale?.x,
	//   y: (event.global.y - transform?.ty) / <number>canvas?.stage?.scale?.y,
	// };
	// NEW METHOD SEEM MORE PRECISE
	const position = canvas.app?.renderer.plugins.interaction.mouse.getLocalPosition(canvas.app.stage);
	return {
		x: position.x,
		y: position.y,
	};
};

// ====================================================================================================

export const getPlaceablesAt = function (placeables, position): PlaceableObject[] {
	if (!placeables) {
		return [];
	}
	return placeables.filter((placeable) => placeableContains(placeable, position));
};

function placeableContains(placeable, position): boolean {
	// const x = getPlaceableX(placeable);
	// const y = getPlaceableY(placeable);

	const center = getCenter(placeable);
	const x = center.x;
	const y = center.y;

	const w = getPlaceableWidth(placeable) || 0;
	const h = getPlaceableHeight(placeable) || 0;
	return Number.between(position.x, x, x + w) && Number.between(position.y, y, y + h);
}

export const getPlaceableDoorCenter = function (placeable: any): ArmsreachData {
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

export const getPlaceableCenter = function (placeable: any): ArmsreachData {
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

const getPlaceableWidth = function (placeable: any): number {
	let w = placeable.w || placeable.width;
	if (placeable?.object) {
		w = placeable?.object?.w || placeable?.object?.width || w;
	}
	return w;
};

const getPlaceableHeight = function (placeable: any): number {
	let h = placeable.h || placeable.height;
	if (placeable?.object) {
		h = placeable?.object?.h || placeable?.object?.height || h;
	}
	return h;
};

const getPlaceableX = function (placeable: any): number {
	let x = placeable._validPosition?.x || placeable.x || placeable?.x;
	if (placeable?.object) {
		x = placeable?.object?.x || placeable?.object?.x || x;
	}
	return x;
};

const getPlaceableY = function (placeable: any): number {
	let y = placeable._validPosition?.y || placeable?.y;
	if (placeable?.object) {
		y = placeable?.object?.y || placeable?.object?.y || y;
	}
	return y;
};

// ============================================================================================

function distance_between_token_rect(p1: Token, p2: ArmsreachData) {
	//@ts-ignore
	const x1 = p1.x ? p1.x : p1.document.x;
	//@ts-ignore
	const y1 = p1.y ? p1.y : p1.document.y;
	const x1b = x1 + <number>p1.w;
	const y1b = y1 + <number>p1.h;

	//@ts-ignore
	const x2 = p2.x ? p2.x : p2.document.x;
	//@ts-ignore
	const y2 = p2.y ? p2.y : p2.document.y;
	const x2b = x2 + <number>p2.w;
	const y2b = y2 + <number>p2.h;

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
	return Math.floor(distance_between_token_rect(token, b) / <number>canvas.grid?.size) + 1;
}

function units_between_token_and_placeable(token: Token, b: ArmsreachData) {
	let dist = Math.floor(distance_between_token_rect(token, b));
	const unitSize = <number>canvas.dimensions?.distance || 5;
	const unitGridSize = <number>canvas.grid?.size || 50;
	if (dist === 0) {
		// Special case for tile
		if (b.documentName === TileDocument.documentName) {
			dist = getUnitTokenDist(token, b) - unitSize;
		}
		// Special case for lights
		if (b.documentName === AmbientLightDocument.documentName) {
			dist = getUnitTokenDist(token, b) - unitSize;
		}
	} else {
		dist = getUnitTokenDist(token, b);
		// TODO i don't understand this for manage the door control
		if (b.documentName !== WallDocument.documentName) {
			// dist = (Math.floor(dist) / unitGridSize) * unitSize;
			// if (b.documentName === TokenDocument.documentName) {
			// 	// const tokensSizeAdjust = (Math.min(<number>b.w, <number>b.h) || 0) / Math.SQRT2;
			// 	// const tokenScaleAdjust = tokensSizeAdjust / <number>canvas.dimensions?.size;
			// 	// // dist = (dist * <number>canvas.dimensions?.size) / <number>canvas.dimensions?.distance - tokensSizeAdjust;
			// 	// dist = dist / <number>canvas.dimensions?.distance;
			// 	const grids = grids_between_tokens(token, b);
			// 	dist = grids / (<number>canvas.dimensions?.size / <number>canvas.grid?.size);
			// }
		} else {
			//@ts-ignore
			const isDoor: DoorControl = <DoorControl>canvas.controls?.doors?.children.find((x: DoorControl) => {
				return x.wall.id === <string>b.id;
			});
			if (!isDoor) {
				// WHY ? is a wall but i need to multiply anyway for antoher unitsize
				// dist = (Math.floor(dist) / unitGridSize) * unitSize * unitSize;
			} else {
				const globalInteraction = <number>(
					game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionMeasurement")
				);
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

export const globalInteractionDistanceUniversal = function (
	placeableObjectSource: PlaceableObject,
	placeableObjectTarget: PlaceableObject,
	useGrids: boolean
) {
	const placeableSource = <ArmsreachData>getPlaceableCenter(placeableObjectSource);
	placeableSource.documentName = placeableObjectSource.document.documentName;
	const placeableTarget = <ArmsreachData>getPlaceableCenter(placeableObjectTarget);
	placeableTarget.documentName = placeableObjectTarget.document.documentName;

	if (useGrids) {
		const dist = grids_between_placeable_and_placeable(placeableSource, placeableTarget);
		return dist;
	} else {
		const dist = units_between_placeable_and_placeable(placeableSource, placeableTarget);
		return dist;
	}
};

function grids_between_placeable_and_placeable(a: ArmsreachData, b: ArmsreachData) {
	return Math.floor(distance_between_placeable_rect(a, b) / <number>canvas.grid?.size) + 1;
}

function distance_between_placeable_rect(p1: ArmsreachData, p2: ArmsreachData) {
	const x1 = p1.x;
	const y1 = p1.y;
	const x1b = p1.x + <number>p1.w;
	const y1b = p1.y + <number>p1.h;

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

function units_between_placeable_and_placeable(a: ArmsreachData, b: ArmsreachData) {
	// const range = canvas.lighting?.globalLight ? Infinity : sourceToken.vision.radius;
	// if (range === 0) return false;
	// if (range === Infinity) return true;
	const tokensSizeAdjust = (Math.min(<number>b.w, <number>b.h) || 0) / Math.SQRT2;
	let dist =
		(getUnitTokenDistUniversal(a, b) * <number>canvas.dimensions?.size) / <number>canvas.dimensions?.distance -
		tokensSizeAdjust;
	// return dist <= range;
	const unitSize = <number>canvas.dimensions?.distance || 5;
	const unitGridSize = <number>canvas.grid?.size || 50;
	dist = (Math.floor(dist) / unitGridSize) * unitSize;
	return dist;
}

function getUnitTokenDistUniversal(a: ArmsreachData, b: ArmsreachData) {
	const unitsToPixel = <number>canvas.dimensions?.size / <number>canvas.dimensions?.distance;
	const x1 = a.centerX;
	const y1 = a.centerY;
	const z1 = getElevationPlaceableObject(a.placeableObjectData) * unitsToPixel;
	const x2 = b.centerX;
	const y2 = b.centerY;
	const z2 = getElevationPlaceableObject(b.placeableObjectData) * unitsToPixel;
	const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)) / unitsToPixel;
	return d;
}

// ================================================

function getUnitTokenDist(token: Token, placeableObjectTarget: ArmsreachData) {
	const unitsToPixel = <number>canvas.dimensions?.size / <number>canvas.dimensions?.distance;
	const x1 = token.center.x;
	const y1 = token.center.y;
	const z1 = getElevationPlaceableObject(token) * unitsToPixel;
	const x2 = placeableObjectTarget.centerX;
	const y2 = placeableObjectTarget.centerY;
	const z2 = getElevationPlaceableObject(placeableObjectTarget.placeableObjectData) * unitsToPixel;
	const d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2)) / unitsToPixel;
	return d;
}

// function getUnitTokenDistOriginalLevels(token1, token2) {
// 	const unitsToPixel = <number>canvas.dimensions?.size / <number>canvas.dimensions?.distance;
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
 * @param {Object} objectTarget - a tile/drawing/light/note
 * @returns {Boolean} - true if in range, false if not
 **/
export function isTokenInRange(objectSource: PlaceableObject, objectTarget: PlaceableObject) {
	if (game.modules.get("levels")?.active) {
		let rangeTop = <number>objectTarget.document.getFlag("levels", "rangeTop");
		let rangeBottom = <number>objectTarget.document.getFlag("levels", "rangeBottom");
		if (!rangeTop && rangeTop !== 0) rangeTop = Infinity;
		if (!rangeBottom && rangeBottom !== 0) rangeBottom = -Infinity;
		const elevation = getElevationPlaceableObject(objectSource);
		return elevation <= rangeTop && elevation >= rangeBottom;
	} else {
		// TODO maybe some other integration
		return true;
	}
}
