import CONSTANTS from "../constants";

// =============================
// Module Generic function
// =============================

export function isGMConnected(): boolean {
	return Array.from(<Users>game.users).find((user) => user.isGM && user.active) ? true : false;
}

export function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// ================================
// Logger utility
// ================================

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = "") {
	if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")) {
		console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
	}
	return msg;
}

export function log(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function notify(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	ui.notifications?.notify(message);
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function info(info, notify = false) {
	info = `${CONSTANTS.MODULE_NAME} | ${info}`;
	if (notify) ui.notifications?.info(info);
	console.log(info.replace("<br>", "\n"));
	return info;
}

export function warn(warning, notify = false) {
	warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
	if (notify) ui.notifications?.warn(warning);
	console.warn(warning.replace("<br>", "\n"));
	return warning;
}

export function error(error, notify = true) {
	error = `${CONSTANTS.MODULE_NAME} | ${error}`;
	if (notify) ui.notifications?.error(error);
	return new Error(error.replace("<br>", "\n"));
}

export function timelog(message): void {
	warn(Date.now(), message);
}

export const i18n = (key: string): string => {
	return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key: string, data = {}): string => {
	return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
	return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}

// =========================================================================================

export function cleanUpString(stringToCleanUp: string) {
	// regex expression to match all non-alphanumeric characters in string
	const regex = /[^A-Za-z0-9]/g;
	if (stringToCleanUp) {
		return i18n(stringToCleanUp).replace(regex, "").toLowerCase();
	} else {
		return stringToCleanUp;
	}
}

export function isStringEquals(stringToCheck1: string, stringToCheck2: string, startsWith = false): boolean {
	if (stringToCheck1 && stringToCheck2) {
		const s1 = cleanUpString(stringToCheck1) ?? "";
		const s2 = cleanUpString(stringToCheck2) ?? "";
		if (startsWith) {
			return s1.startsWith(s2) || s2.startsWith(s1);
		} else {
			return s1 === s2;
		}
	} else {
		return stringToCheck1 === stringToCheck2;
	}
}

/**
 * The duplicate function of foundry keep converting my stirng value to "0"
 * i don't know why this methos is a brute force solution for avoid that problem
 */
export function duplicateExtended(obj: any): any {
	try {
		//@ts-ignore
		if (structuredClone) {
			//@ts-ignore
			return structuredClone(obj);
		} else {
			// Shallow copy
			// const newObject = jQuery.extend({}, oldObject);
			// Deep copy
			// const newObject = jQuery.extend(true, {}, oldObject);
			return jQuery.extend(true, {}, obj);
		}
	} catch (e) {
		return duplicate(obj);
	}
}

// =========================================================================================

/**
 *
 * @param obj Little helper for loop enum element on typescript
 * @href https://www.petermorlion.com/iterating-a-typescript-enum/
 * @returns
 */
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
	return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

/**
 * @href https://stackoverflow.com/questions/7146217/merge-2-arrays-of-objects
 * @param target
 * @param source
 * @param prop
 */
export function mergeByProperty(target: any[], source: any[], prop: any) {
	for (const sourceElement of source) {
		const targetElement = target.find((targetElement) => {
			return sourceElement[prop] === targetElement[prop];
		});
		targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
	}
	return target;
}

/**
 * Returns the first selected token
 */
export function getFirstPlayerTokenSelected(): Token | null {
	// Get first token ownted by the player
	const selectedTokens = <Token[]>canvas.tokens?.controlled;
	if (selectedTokens.length > 1) {
		//iteractionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
		return null;
	}
	if (!selectedTokens || selectedTokens.length === 0) {
		//if(game.user.character.data.token){
		//  //@ts-ignore
		//  return game.user.character.data.token;
		//}else{
		return null;
		//}
	}
	return <Token>selectedTokens[0];
}

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
export function getFirstPlayerToken(): Token | null {
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
		if (!controlled.length || controlled.length === 0) {
			// If no token is selected use the token of the users character
			token = <Token>canvas.tokens?.placeables.find((token) => token.id === game.user?.character?.data?._id);
		}
		// If no token is selected use the first owned token of the users character you found
		if (!token) {
			token = <Token>canvas.tokens?.ownedTokens[0];
		}
	}
	return token;
}

/**
 * Get the total LOS height for a token
 * @param {Object} token - a token object
 * @returns {Integer} returns token elevation plus the LOS height stored in the flags
 **/
function getTokenLOSheight(token) {
	if (game.modules.get("levels")?.active) {
		return token.losHeight;
	} else {
		return token.document.elevation;
	}
}

// function getElevationToken(token: Token): number {
//   const base = token.document.data;
//   return getElevationPlaceableObject(base);
// }

// function getElevationWall(wall: Wall): number {
//   const base = wall.document.data;
//   return getElevationPlaceableObject(base);
// }

export function getElevationPlaceableObject(placeableObject: any): number {
	let base = placeableObject;
	if (base.document) {
		base = base.document.data;
	}
	const base_elevation =
		//@ts-ignore
		typeof _levels !== "undefined" &&
		//@ts-ignore
		_levels?.advancedLOS &&
		(placeableObject instanceof Token || placeableObject instanceof TokenDocument)
			? getTokenLOSheight(placeableObject)
			: base.elevation ??
			  base.flags["levels"]?.elevation ??
			  base.flags["levels"]?.rangeBottom ??
			  base.flags["wallHeight"]?.wallHeightBottom ??
			  0;
	return base_elevation;
}

export function checkElevation(documentOrPlaceableSource, documentOrPlaceableTarget): boolean {
	let docSource = documentOrPlaceableSource;
	if (documentOrPlaceableSource.document) {
		docSource = documentOrPlaceableSource.document;
	}
	let docTarget = documentOrPlaceableTarget;
	if (documentOrPlaceableTarget.document) {
		docTarget = documentOrPlaceableTarget.document;
	}
	if (!docSource.object || !docTarget.object) {
		return false;
	}
	const elevationSource = getElevationPlaceableObject(docSource.object);
	const elevationTarget = getElevationPlaceableObject(docTarget.object);
	if (game.modules.get("levels")?.active) {
		const rangeTarget = getRangeForDocument(documentOrPlaceableTarget);
		return inRange(documentOrPlaceableSource, elevationSource, rangeTarget.rangeBottom, rangeTarget.rangeTop);
	} else {
		return elevationSource >= elevationTarget;
	}
}

export function inRange(document: any, elevation: number, rangeBottom: number, rangeTop: number): boolean {
	const rangeBottom1 = rangeBottom ?? -Infinity;
	const rangeTop1 = rangeTop ?? Infinity;
	return elevation >= rangeBottom1 && elevation <= rangeTop1;
}

export function getRangeForDocument(document): { rangeBottom: number; rangeTop: number } {
	if (document instanceof WallDocument) {
		return {
			//@ts-ignore
			rangeBottom: document.flags?.["wall-height"]?.bottom ?? -Infinity,
			//@ts-ignore
			rangeTop: document.flags?.["wall-height"]?.top ?? Infinity,
		};
	} else if (document instanceof TokenDocument) {
		return {
			//@ts-ignore
			rangeBottom: document.elevation,
			//@ts-ignore
			rangeTop: document.elevation,
		};
	}
	const rangeBottom = document.flags?.levels?.rangeBottom ?? -Infinity;
	const rangeTop = document.flags?.levels?.rangeTop ?? Infinity;
	return { rangeBottom, rangeTop };
}

// =============================
// Module specific function
// =============================

export function getTokenByTokenID(id) {
	// return await game.scenes.active.data.tokens.find( x => {return x.id === id});
	return canvas.tokens?.placeables.find((x) => {
		return x.id === id;
	});
}

export function getTokenByTokenName(name) {
	// return await game.scenes.active.data.tokens.find( x => {return x._name === name});
	return canvas.tokens?.placeables.find((x) => {
		return x.name === name;
	});
	// return canvas.tokens.placeables.find( x => { return x.id == game.user.id});
}

/**
 * Get chracter name from token
 */
export const getCharacterName = function (token: Token) {
	let tokenName = "";
	if (token.name) {
		tokenName = token.name;
	} else if (token.actor && token.actor.name) {
		tokenName = token.actor.name;
	}
	return tokenName;
};
