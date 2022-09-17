import { checkElevation, getCharacterName, i18n, i18nFormat, warn } from "./lib/lib";
import {
	computeDistanceBetweenCoordinates,
	getFirstPlayerToken,
	getPlaceableCenter,
	interactionFailNotification,
} from "./ArmsReachHelper";
import CONSTANTS from "./constants";

export const DrawingsReach = {
	globalInteractionDistance: function (
		selectedToken: Token,
		drawing: Drawing,
		maxDistance?: number,
		useGrid?: boolean,
		userId?: String
	): boolean {
		// Check if no token is selected and you are the GM avoid the distance calculation
		if (
			(!canvas.tokens?.controlled && game.user?.isGM) ||
			(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
			(!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnDrawings")) &&
				game.user?.isGM)
		) {
			return true;
		}
		if (<number>canvas.tokens?.controlled?.length > 1) {
			if (game.user?.isGM) {
				return true;
			}
			interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
			return false;
		}
		// let isOwned = false;
		if (!selectedToken) {
			selectedToken = <Token>getFirstPlayerToken();
			// if (character) {
			// 	isOwned = true;
			// }
		}
		if (!selectedToken) {
			if (game.user?.isGM) {
				return true;
			} else {
				return false;
			}
		}

		// Sets the global maximum interaction distance
		// OLD SETTING
		let globalInteraction = <number>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistance");
		if (globalInteraction <= 0) {
			globalInteraction = <number>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionMeasurement");
		}
		// Global interaction distance control. Replaces prototype function of Stairways. Danger...
		if (globalInteraction > 0) {
			// Check distance
			//let character:Token = getFirstPlayerToken();
			if (
				!game.user?.isGM ||
				(game.user?.isGM &&
					// && <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'globalInteractionDistanceForGM')
					<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnDrawings"))
			) {
				if (!selectedToken) {
					interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.noCharacterSelectedForDrawing`));
					return false;
				} else {
					let isNotNearEnough = false;
					if (game.settings.get(CONSTANTS.MODULE_NAME, "autoCheckElevationByDefault")) {
						const res = checkElevation(selectedToken, drawing);
						if (!res) {
							warn(
								`The token '${selectedToken.name}' is not on the elevation range of this placeable object`
							);
							return false;
						}
					}
					// OLD SETTING
					if (<number>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistance") > 0 || useGrid) {
						const maxDist =
							maxDistance && maxDistance > 0
								? maxDistance
								: <number>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistance");
						// const dist = computeDistanceBetweenCoordinatesOLD(DrawingsReach.getDrawingsCenter(drawing), character);
						const dist = computeDistanceBetweenCoordinates(
							DrawingsReach.getDrawingsCenter(drawing),
							selectedToken,
							DrawingDocument.documentName,
							true
						);
						isNotNearEnough = dist > maxDist;
					} else {
						const maxDist =
							maxDistance && maxDistance > 0
								? maxDistance
								: <number>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionMeasurement");
						const dist = computeDistanceBetweenCoordinates(
							DrawingsReach.getDrawingsCenter(drawing),
							selectedToken,
							DrawingDocument.documentName,
							false
						);
						isNotNearEnough = dist > maxDist;
					}
					if (isNotNearEnough) {
						const tokenName = getCharacterName(selectedToken);
						if (tokenName) {
							interactionFailNotification(
								i18nFormat(`${CONSTANTS.MODULE_NAME}.drawingsNotInReachFor`, { tokenName: tokenName })
							);
						} else {
							interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.drawingsNotInReach`));
						}
						return false;
					} else {
						return true;
					}
				}
			} else if (game.user?.isGM) {
				// DO NOTHING
				return true;
			}
		}

		return false;
	},

	getDrawingsCenter: function (drawing: Drawing) {
		// const drawCenter = {
		//   x: drawing.x,
		//   y: drawing.y,
		//   w: drawing.width,
		//   h: drawing.height
		// };
		// return drawCenter;
		return getPlaceableCenter(drawing);
	},
};
