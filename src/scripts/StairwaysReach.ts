import { checkElevation, getCharacterName, getTokenByTokenID, i18n, i18nFormat, warn } from "./lib/lib";
import {
	computeDistanceBetweenCoordinates,
	getFirstPlayerToken,
	getFirstPlayerTokenSelected,
	getPlaceableCenter,
	interactionFailNotification
} from "./ArmsReachHelper";
import CONSTANTS from "./constants";

export const StairwaysReach = {
	globalInteractionDistance: function (stairway: SourceData, selectedTokenIds: string[], userId?: String): boolean {
		// Check if no token is selected and you are the GM avoid the distance calculation
		if (
			(!canvas.tokens?.controlled && game.user?.isGM) ||
			(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
			(!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnStairways")) &&
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
		let character: Token = <Token>getFirstPlayerTokenSelected();
		if (selectedTokenIds) {
			if (selectedTokenIds.length > 1) {
				//iteractionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.warningNoSelectMoreThanOneToken`));
				return false;
			} else {
				character = <Token>getTokenByTokenID(selectedTokenIds[0]);
			}
		} else {
			if (!character) {
				character = <Token>getFirstPlayerToken();
				// if (character) {
				// 	isOwned = true;
				// }
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
					<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnStairways"))
			) {
				if (!character) {
					interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.noCharacterSelectedForStairway`));
					return false;
				} else {
					let isNotNearEnough = false;
					if (game.settings.get(CONSTANTS.MODULE_NAME, "autoCheckElevationByDefault")) {
						const res = checkElevation(character, stairway);
						if (!res) {
							warn(
								`The token '${character.name}' is not on the elevation range of this placeable object`
							);
							return false;
						}
					}
					// OLD SETTING
					if (<number>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistance") > 0) {
						// const dist = computeDistanceBetweenCoordinatesOLD(StairwaysReach.getStairwaysCenter(stairway), character);
						const dist = computeDistanceBetweenCoordinates(
							StairwaysReach.getStairwaysCenter(stairway),
							character,
							"Stairway",
							true
						);
						isNotNearEnough =
							dist > <number>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistance");
					} else {
						const dist = computeDistanceBetweenCoordinates(
							StairwaysReach.getStairwaysCenter(stairway),
							character,
							"Stairway",
							false
						);
						isNotNearEnough =
							dist > <number>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionMeasurement");
					}
					if (isNotNearEnough) {
						const tokenName = getCharacterName(character);
						if (tokenName) {
							interactionFailNotification(
								i18nFormat(`${CONSTANTS.MODULE_NAME}.stairwaysNotInReachFor`, { tokenName: tokenName })
							);
						} else {
							interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.stairwaysNotInReach`));
						}
						return false;
					} else {
						return true;
					}
					// END MOD ABD 4535992
				}
			} else if (game.user?.isGM) {
				// DO NOTHING
				return true;
			}
		}

		return false;
	},

	getStairwaysCenter: function (stairway) {
		// const stairwayCenter = {
		//   x: stairway.x - <number>canvas.dimensions?.size / 2,
		//   y: stairway.y - <number>canvas.dimensions?.size / 2,
		//   w: stairway.width,
		//   h: stairway.height,
		// };
		// return stairwayCenter;
		return getPlaceableCenter(stairway);
	},

	globalInteractionDistanceSimple: function (
		selectedToken: Token,
		stairway: { x: number; y: number },
		maxDistance?: number,
		useGrid?: boolean,
		userId?: String
	): boolean {
		// Check if no token is selected and you are the GM avoid the distance calculation
		if (
			(!canvas.tokens?.controlled && game.user?.isGM) ||
			(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
			(!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnStairways")) &&
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
					<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnStairways"))
			) {
				if (!selectedToken) {
					interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.noCharacterSelectedForStairway`));
					return false;
				} else {
					let isNotNearEnough = false;
					if (game.settings.get(CONSTANTS.MODULE_NAME, "autoCheckElevationByDefault")) {
						const res = checkElevation(selectedToken, stairway);
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
						// const dist = computeDistanceBetweenCoordinatesOLD(StairwaysReach.getStairwaysCenter(stairway), character);
						const dist = computeDistanceBetweenCoordinates(
							StairwaysReach.getStairwaysCenter(stairway),
							selectedToken,
							"Stairway",
							true
						);
						isNotNearEnough = dist > maxDist;
					} else {
						const maxDist =
							maxDistance && maxDistance > 0
								? maxDistance
								: <number>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionMeasurement");
						const dist = computeDistanceBetweenCoordinates(
							StairwaysReach.getStairwaysCenter(stairway),
							selectedToken,
							"Stairway",
							false
						);
						isNotNearEnough = dist > maxDist;
					}
					if (isNotNearEnough) {
						const tokenName = getCharacterName(selectedToken);
						if (tokenName) {
							interactionFailNotification(
								i18nFormat(`${CONSTANTS.MODULE_NAME}.stairwaysNotInReachFor`, { tokenName: tokenName })
							);
						} else {
							interactionFailNotification(i18n(`${CONSTANTS.MODULE_NAME}.stairwaysNotInReach`));
						}
						return false;
					} else {
						return true;
					}
					// END MOD ABD 4535992
				}
			} else if (game.user?.isGM) {
				// DO NOTHING
				return true;
			}
		}

		return false;
	}
};

export class Data {
	/// scene id of the stairway used (source scene of teleport)
	sourceSceneId: string;
	/// stairway data of the source stairway (WARNING: this data may change in the future)
	sourceData: SourceData;
	/// id's of all selected token (tokens beeing teleported)
	selectedTokenIds: string[];
	/// target scene id of the stairway or `null` (target scene of the teleport of `null` if current scene)
	targetSceneId: string;
	/// stairway data of the target stairway (WARNING: this data may change in the future)
	targetData: TargetData;
	/// id of the user using the stairway (current user)
	userId: string;
}

/// WARNING: internal data - do not use if possible
export class TargetData {
	/// target (partner) scene id or `null` if current scene
	scene: Scene;
	/// stairway name (id for connection)
	name: string;
	/// stairway label or `null` for none
	label: string;
	/// stairway icon (image path) or `null` for default
	icon: string;
	/// disabled (locked on `true`)
	disabled: boolean;
	/// hide from players (hidden on `true`)
	hidden: boolean;
	/// animate movement within scene (animate on `true`)
	animate: boolean;
	/// x position of target stairway
	x: number;
	/// y position of target stairway
	y: number;
}

/// WARNING: internal data - do not use if possible
export class SourceData {
	/// target (partner) scene id or `null` if current scene
	scene: Scene;
	/// stairway name (id for connection)
	name: string;
	/// stairway label or `null` for none
	label: string;
	/// stairway icon (image path) or `null` for default
	icon: string;
	/// disabled (locked on `true`)
	disabled: boolean;
	/// hide from players (hidden on `true`)
	hidden: boolean;
	/// animate movement within scene (animate on `true`)
	animate: boolean;
	/// x position of target stairway
	x: number;
	/// y position of target stairway
	y: number;
}
