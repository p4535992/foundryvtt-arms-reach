import CONSTANTS from "../constants.js";

// =============================
// Module Generic function
// =============================

export function isGMConnected() {
    return Array.from(game.users).find((user) => user.isGM && user.active) ? true : false;
}

export function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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
    return (
        ((token.losHeight ?? token.document.elevation + 0.00001) - token.document.elevation) /
        canvas.scene.dimensions.distance
    );
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

export function isRealNumber(inNumber) {
    return !isNaN(inNumber) && typeof inNumber === "number" && isFinite(inNumber);
}
