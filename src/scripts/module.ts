import { warn, error, debug, i18n, i18nFormat } from "./lib/lib";
import { StairwaysReach } from "./StairwaysReach";
import { ResetDoorsAndFog } from "./resetdoorsandfog";
import {
	checkTaggerForAmrsreach,
	getFirstPlayerToken,
	getFirstPlayerTokenSelected,
	getMousePosition,
	getPlaceablesAt,
	reselectTokenAfterInteraction,
} from "./ArmsReachHelper";
import { ArmsReachVariables, DoorsReach } from "./DoorsReach";
import { NotesReach } from "./NotesReach";
import { TokensReach } from "./TokensReach";
import { LightsReach } from "./LightsReach";
import { DrawingsReach } from "./DrawingsReach";
import { TilesReach } from "./TilesReach";
import { SoundsReach } from "./SoundsReach";
import { WallsReach } from "./WallsReach";
import CONSTANTS from "./constants";
import API from "./api";
import { setApi } from "../foundryvtt-arms-reach";
import { registerSocket } from "./socket";
import { Overlay } from "./apps/range_overlay/overlay";
import { keyboard } from "./apps/range_overlay/keyboard";
import { mouse } from "./apps/range_overlay/mouse";
import { TOGGLE_BUTTON, _toggleButtonClick } from "./apps/range_overlay/controls";
import { canvasTokensGet } from "./apps/range_overlay/utility";
import { TokenInfo, updateLocation, updateMeasureFrom } from "./apps/range_overlay/tokenInfo";

let taggerModuleActive;

export const initHooks = () => {
	warn("Init Hooks processing");
	Hooks.once("socketlib.ready", registerSocket);

	taggerModuleActive =
		<boolean>game.modules.get(CONSTANTS.TAGGER_MODULE_NAME)?.active &&
		<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableTaggerIntegration");

	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableArmsReach")) {
		if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableDoorsIntegration")) {
			DoorsReach.init();

			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"DoorControl.prototype._onMouseDown",
				DoorControlPrototypeOnMouseDownHandler,
				"MIXED"
			);
			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"DoorControl.prototype._onRightDown",
				DoorControlPrototypeOnRightDownHandler,
				"MIXED"
			);
		}

		if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableJournalsIntegration")) {
			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"Note.prototype._onClickLeft",
				NotePrototypeOnClickLeft1Handler,
				"MIXED"
			);

			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"Note.prototype._onClickLeft2",
				NotePrototypeOnClickLeft2Handler,
				"MIXED"
			);
		}

		if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableTokensIntegration")) {
			// //@ts-ignore
			// libWrapper.register(
			//   CONSTANTS.MODULE_NAME,
			//   'Token.prototype._onClickLeft',
			//   TokenPrototypeOnClickLeftHandler,
			//   'MIXED'
			// );
			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"Token.prototype._onClickLeft2",
				TokenPrototypeOnClickLeftHandler,
				"MIXED"
			);
		}

		if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableLightsIntegration")) {
			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"AmbientLight.prototype._onClickRight",
				AmbientLightPrototypeOnClickRightHandler,
				"MIXED"
			);
		}

		if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableSoundsIntegration")) {
			//@ts-ignore
			libWrapper.register(
				CONSTANTS.MODULE_NAME,
				"AmbientSound.prototype._onClickRight",
				AmbientSoundPrototypeOnClickRightHandler,
				"MIXED"
			);
		}

		// if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'enableDrawingsIntegration')) {
		//   //@ts-ignore
		//   libWrapper.register(
		//     CONSTANTS.MODULE_NAME,
		//     'Drawing.prototype._onHandleMouseDown',
		//     // 'Drawing.prototype._onClickLeft',
		//     DrawingPrototypeOnClickLeftHandler,
		//     'MIXED',
		//   );
		// }

		// if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'enableTilesIntegration')) {
		//   //@ts-ignore
		//   libWrapper.register(
		//     CONSTANTS.MODULE_NAME,
		//     // 'Tile.prototype._onClickLeft',
		//     'Tile.prototype._onHandleMouseDown',
		//     TilePrototypeOnClickLeftHandler,
		//     'MIXED',
		//   );
		// }
	}
};

export const setupHooks = () => {
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableArmsReach")) {
		if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableJournalsIntegration")) {
			game.settings.set("core", "notesDisplayToggle", true);
		}
	}

	setApi(API);
};

export const readyHooks = async () => {
	// setup all the hooks
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableArmsReach")) {
		Hooks.on("preUpdateWall", async (object, updateData, diff, userID) => {
			// THIS IS ONLY A BUG FIXING FOR THE SOUND DISABLE FOR THE lib-wrapper override
			if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableDoorsIntegration")) {
				// if ambient door is present and active dont' do this
				if (!game.modules.get("ambientdoors")?.active) {
					DoorsReach.preUpdateWallBugFixSoundHandler(object, updateData, diff, userID);
				}
			}
		});

		// Management of the Stairways module
		if (game.modules.get("stairways")?.active) {
			Hooks.on("PreStairwayTeleport", (data: any) => {
				if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableStairwaysIntegration")) {
					const { sourceSceneId, sourceData, selectedTokenIds, targetSceneId, targetData, userId } = data;
					let tokenSelected;

					tokenSelected = <Token>getFirstPlayerTokenSelected();
					if (!tokenSelected) {
						tokenSelected = <Token>getFirstPlayerToken();
					}
					// Check if no token is selected and you are the GM avoid the distance calculation
					let doNotReselectIfGM = false;
					if (
						(!canvas.tokens?.controlled && game.user?.isGM) ||
						(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
						(!(<boolean>(
							game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnStairways")
						)) &&
							game.user?.isGM)
					) {
						doNotReselectIfGM = true;
					}

					const result = StairwaysReach.globalInteractionDistance(sourceData, selectedTokenIds, userId);
					if (!doNotReselectIfGM) {
						reselectTokenAfterInteraction(tokenSelected);
					}
					return result;
				} else {
					return true;
				}
			});
		}

		// Adds menu option to Scene Nav and Directory
		Hooks.on("getSceneNavigationContext", (html, contextOptions) => {
			if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableResetDoorsAndFog")) {
				contextOptions.push(<any>ResetDoorsAndFog.getContextOption("sceneId"));
			}
		});

		Hooks.on("getSceneDirectoryEntryContext", (html, contextOptions) => {
			if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableResetDoorsAndFog")) {
				contextOptions.push(ResetDoorsAndFog.getContextOption(undefined));
			}
		});

		// Adds Shut All Doors button to Walls Control Layer
		Hooks.on("getSceneControlButtons", (controls: any) => {
			if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableResetDoorsAndFog")) {
				controls[4]?.tools.splice(controls[4].tools.length - 2, 0, {
					name: "close",
					title: "Close Open Doors",
					icon: "fas fa-door-closed",
					onClick: () => {
						ResetDoorsAndFog.resetDoors(true, <string>game.scenes?.current?.id);
					},
					button: true,
				});
				return controls;
			}
		});

		// Hooks.on('canvasReady',function (canvas: Canvas) {
		// const [target] = args;
		// const canvas = this as Canvas;
		canvas?.stage?.on("mousedown", async (event) => {
			const position = getMousePosition(canvas, event);

			const clickWalls: PlaceableObject[] = getPlaceablesAt(canvas?.walls?.placeables, position) || [];
			// const clickNotes:PlaceableObject[] = getPlaceablesAt(canvas?.notes?.placeables, position) || [];
			// const clickTokens:PlaceableObject[] = getPlaceablesAt(canvas?.tokens?.placeables, position) || [];
			// const clickLights:PlaceableObject[] = getPlaceablesAt(canvas?.lighting?.placeables, position) || [];
			// const clickSounds:PlaceableObject[] = getPlaceablesAt(canvas?.lighting?.placeables, position) || [];
			const clickDrawings: PlaceableObject[] = getPlaceablesAt(canvas?.drawings?.placeables, position) || [];
			const clickTiles: PlaceableObject[] = getPlaceablesAt(canvas.background?.placeables, position) || [];
			// const clickTemplates:PlaceableObject[] = getPlaceablesAt(canvas?.templates?.placeables, position) || [];

			const downTriggers: PlaceableObject[] = [];
			downTriggers.push(...clickWalls);
			// downTriggers.push(...clickLights);
			// downTriggers.push(...clickSounds);
			downTriggers.push(...clickDrawings);
			downTriggers.push(...clickTiles);
			// downTriggers.push(...clickTemplates);
			if (downTriggers.length === 0) {
				return;
			}
			if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableDrawingsIntegration")) {
				if (clickDrawings.length > 0) {
					const drawing = clickDrawings[0] as Drawing;
					let tokenSelected;

					tokenSelected = <Token>getFirstPlayerTokenSelected();
					if (!tokenSelected) {
						tokenSelected = <Token>getFirstPlayerToken();
					}
					// Check if no token is selected and you are the GM avoid the distance calculation
					let doNotReselectIfGM = false;
					if (
						(!canvas.tokens?.controlled && game.user?.isGM) ||
						(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
						(!(<boolean>(
							game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnDrawings")
						)) &&
							game.user?.isGM)
					) {
						doNotReselectIfGM = true;
					}
					if (taggerModuleActive && !checkTaggerForAmrsreach(drawing)) {
						if (!doNotReselectIfGM) {
							reselectTokenAfterInteraction(tokenSelected);
						}
						return;
					}
					const isInReach = await DrawingsReach.globalInteractionDistance(tokenSelected, drawing);
					if (!doNotReselectIfGM) {
						reselectTokenAfterInteraction(tokenSelected);
					}
					if (!isInReach) {
						return;
					}
				}
			}
			if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableTilesIntegration")) {
				if (clickTiles.length > 0) {
					const tile = clickTiles[0] as Tile;
					let tokenSelected;

					tokenSelected = <Token>getFirstPlayerTokenSelected();
					if (!tokenSelected) {
						tokenSelected = <Token>getFirstPlayerToken();
					}
					// Check if no token is selected and you are the GM avoid the distance calculation
					let doNotReselectIfGM = false;
					if (
						(!canvas.tokens?.controlled && game.user?.isGM) ||
						(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
						(!(<boolean>(
							game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnTiles")
						)) &&
							game.user?.isGM)
					) {
						doNotReselectIfGM = true;
					}
					if (taggerModuleActive && !checkTaggerForAmrsreach(tile)) {
						if (!doNotReselectIfGM) {
							reselectTokenAfterInteraction(tokenSelected);
						}
						return;
					}
					const isInReach = await TilesReach.globalInteractionDistance(tokenSelected, tile);
					if (!doNotReselectIfGM) {
						reselectTokenAfterInteraction(tokenSelected);
					}
					if (!isInReach) {
						return;
					}
				}
			}
			if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableWallsIntegration")) {
				if (clickWalls.length > 0) {
					const wall = clickWalls[0] as Wall;
					let tokenSelected;

					tokenSelected = <Token>getFirstPlayerTokenSelected();
					if (!tokenSelected) {
						tokenSelected = <Token>getFirstPlayerToken();
					}
					// Check if no token is selected and you are the GM avoid the distance calculation
					let doNotReselectIfGM = false;
					if (
						(!canvas.tokens?.controlled && game.user?.isGM) ||
						(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
						(!(<boolean>(
							game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnWalls")
						)) &&
							game.user?.isGM)
					) {
						doNotReselectIfGM = true;
					}
					if (taggerModuleActive && !checkTaggerForAmrsreach(wall)) {
						if (!doNotReselectIfGM) {
							reselectTokenAfterInteraction(tokenSelected);
						}
						return;
					}
					const isInReach = await WallsReach.globalInteractionDistance(tokenSelected, wall);
					if (!doNotReselectIfGM) {
						reselectTokenAfterInteraction(tokenSelected);
					}
					if (!isInReach) {
						return;
					}
				}
			}
		});

		// });
	}

	// [EXPERIMENTAL] Range Overlay Integration
	/*
  if (game.settings.get(CONSTANTS.MODULE_NAME, 'enableRangeOverlay')) {
    Hooks.on('getSceneControlButtons', (controls: SceneControl[]) => {
      if (!game.settings.get(CONSTANTS.MODULE_NAME, 'enableRangeOverlay')) {
        return;
      }
      const tokenButton = controls.find((b) => b.name == 'token');

      if (tokenButton) {
        tokenButton.tools.push({
          name: TOGGLE_BUTTON,
          title: `${CONSTANTS.MODULE_NAME}.controlButton`,
          icon: 'fas fa-people-arrows',
          toggle: true,
          active: <boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'is-active'),
          onClick: (toggled) => _toggleButtonClick(toggled, controls),
          visible: true, // TODO: Figure out how to disable this from Settings
          // onClick: (value) => {
          //   game.settings.set(TRIGGER_HAPPY_MODULE_NAME, 'enableTriggers', value);
          //   if (game.triggers) game.triggers._parseJournals.bind(game.triggers)();
          // },
        });
      }
    });

    //@ts-ignore
    libWrapper.ignore_conflicts(
      CONSTANTS.MODULE_NAME,
      ['drag-ruler', 'enhanced-terrain-layer'],
      ['Token.prototype._onDragLeftStart', 'Token.prototype._onDragLeftDrop', 'Token.prototype._onDragLeftCancel'],
    );

    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'Token.prototype._onDragLeftStart',
      mouse._dragStartWrapper.bind(mouse),
      'WRAPPER',
    );

    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'Token.prototype._onDragLeftDrop',
      mouse._dragDropWrapper.bind(mouse),
      'WRAPPER',
    );

    //@ts-ignore
    libWrapper.register(
      CONSTANTS.MODULE_NAME,
      'Token.prototype._onDragLeftCancel',
      mouse._dragCancelWrapper.bind(mouse),
      'WRAPPER',
    );

    const instance = new Overlay();
    API.combatRangeOverlay = {
      instance,
      showNumericMovementCost: false,
      showPathLines: false,
      roundNumericMovementCost: true,
    };
    instance.registerHooks();
    keyboard.addHook('Alt', instance.altKeyHandler.bind(instance));
    mouse.addHook(instance.dragHandler.bind(instance));

    // noinspection JSUnusedLocalSymbols
    Hooks.on('createCombatant', (combatant, options, someId) => {
      if (!game.settings.get(CONSTANTS.MODULE_NAME, 'enableRangeOverlay')) {
        return;
      }
      const token = canvasTokensGet(combatant.token.id);
      updateMeasureFrom(token, undefined);
      API.combatRangeOverlay.instance.fullRefresh();
    });

    // noinspection JSUnusedLocalSymbols
    Hooks.on('deleteCombatant', (combatant, options, someId) => {
      if (!game.settings.get(CONSTANTS.MODULE_NAME, 'enableRangeOverlay')) {
        return;
      }
      const token = canvasTokensGet(combatant.token.id);
      updateMeasureFrom(token, undefined);
      API.combatRangeOverlay.instance.fullRefresh();
    });

    // noinspection JSUnusedLocalSymbols
    Hooks.on('updateCombat', (combat, turnInfo, diff, someId) => {
      if (!game.settings.get(CONSTANTS.MODULE_NAME, 'enableRangeOverlay')) {
        return;
      }
      if (combat?.previous?.tokenId) {
        const token = canvasTokensGet(combat.previous.tokenId);
        updateMeasureFrom(token, undefined);
      }
      API.combatRangeOverlay.instance.fullRefresh();
    });

    // noinspection JSUnusedLocalSymbols
    Hooks.on('updateToken', (tokenDocument, updateData, options, someId) => {
      if (!game.settings.get(CONSTANTS.MODULE_NAME, 'enableRangeOverlay')) {
        return;
      }
      const tokenId = tokenDocument.id;
      const realToken = <Token>canvasTokensGet(tokenId); // Get the real token
      updateLocation(realToken, updateData);
      if (!realToken.inCombat) {
        updateMeasureFrom(realToken, updateData);
      }
      API.combatRangeOverlay.instance.fullRefresh();
    });

    Hooks.on('controlToken', (token, boolFlag) => {
      if (!game.settings.get(CONSTANTS.MODULE_NAME, 'enableRangeOverlay')) {
        return;
      }
      if (boolFlag && TokenInfo.current.speed === 0 && TokenInfo.current.getSpeedFromAttributes() === 0) {
        if (game.user?.isGM) {
          warn(i18n(`${CONSTANTS.MODULE_NAME}.token-speed-warning-gm`), true);
        } else {
          warn(i18n(`${CONSTANTS.MODULE_NAME}.token-speed-warning-player`), true);
        }
      }
    });
  }
  */
};

export const TokenPrototypeOnClickLeftHandler = async function (wrapped, ...args) {
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableTokensIntegration")) {
		const [target] = args;
		const token = this as Token;
		const prefixToCheck = <string>game.settings.get(CONSTANTS.MODULE_NAME, "tokensIntegrationByPrefix");
		const isTokenNameChecked = token.name?.startsWith(prefixToCheck);
		// lootsheetnpc5e/template/npc-sheet.html
		const isNPCLootSheet = token.document.actor?.sheet?.template.includes("lootsheetnpc5e/template/npc-sheet.html");
		const enableNPCLootSheet = <boolean>game.settings.get(CONSTANTS.MODULE_NAME, "tokensIntegrationWithLootSheet");
		if (isTokenNameChecked || (isNPCLootSheet && enableNPCLootSheet)) {
			const nameSourceToken = <string>game.settings.get(CONSTANTS.MODULE_NAME, "tokensIntegrationExplicitName");
			let tokenSelected;
			if (nameSourceToken) {
				tokenSelected = <Token>(
					canvas.tokens?.placeables.find((tokenTmp: Token) => tokenTmp.name === nameSourceToken)
				);
			} else {
				tokenSelected = <Token>getFirstPlayerTokenSelected();
				if (!tokenSelected) {
					tokenSelected = <Token>getFirstPlayerToken();
				}
			}
			// Check if no token is selected and you are the GM avoid the distance calculation
			let doNotReselectIfGM = false;
			if (
				(!canvas.tokens?.controlled && game.user?.isGM) ||
				(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
				(!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnTokens")) &&
					game.user?.isGM)
			) {
				doNotReselectIfGM = true;
			}
			if (taggerModuleActive && !checkTaggerForAmrsreach(token)) {
				if (!doNotReselectIfGM) {
					reselectTokenAfterInteraction(tokenSelected);
				}
				return wrapped(...args);
			}
			const isInReach = await TokensReach.globalInteractionDistance(tokenSelected, token);
			if (!doNotReselectIfGM) {
				reselectTokenAfterInteraction(tokenSelected);
			}
			if (!isInReach) {
				return;
			}
		}
	}
	return wrapped(...args);
};

let currentTokenForNote: Token;

export const NotePrototypeOnClickLeft1Handler = async function (wrapped, ...args) {
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableJournalsIntegration")) {
		const [target] = args;
		const note = this as Note;
		let tokenSelected;

		tokenSelected = <Token>getFirstPlayerTokenSelected();
		if (!tokenSelected) {
			tokenSelected = <Token>getFirstPlayerToken();
		}
		currentTokenForNote = tokenSelected;
	}
	return wrapped(...args);
};

export const NotePrototypeOnClickLeft2Handler = async function (wrapped, ...args) {
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableJournalsIntegration")) {
		const [target] = args;
		const note = this as Note;
		let tokenSelected;
		if (currentTokenForNote) {
			tokenSelected = currentTokenForNote;
			reselectTokenAfterInteraction(tokenSelected);
		} else {
			tokenSelected = <Token>getFirstPlayerTokenSelected();
			if (!tokenSelected) {
				tokenSelected = <Token>getFirstPlayerToken();
			}
		}
		// Check if no token is selected and you are the GM avoid the distance calculation
		let doNotReselectIfGM = false;
		if (
			(!canvas.tokens?.controlled && game.user?.isGM) ||
			(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
			(!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnNotes")) &&
				game.user?.isGM)
		) {
			doNotReselectIfGM = true;
		}
		if (taggerModuleActive && !checkTaggerForAmrsreach(note)) {
			if (!doNotReselectIfGM) {
				reselectTokenAfterInteraction(tokenSelected);
			}
			return wrapped(...args);
		}
		const isInReach = await NotesReach.globalInteractionDistance(tokenSelected, note);
		if (!doNotReselectIfGM) {
			reselectTokenAfterInteraction(tokenSelected);
		}
		if (!isInReach) {
			return;
		}
	}
	return wrapped(...args);
};

export const DoorControlPrototypeOnMouseDownHandler = async function (wrapped, ...args) {
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableDoorsIntegration")) {
		const doorControl = this as DoorControl;
		let tokenSelected;

		tokenSelected = <Token>getFirstPlayerTokenSelected();
		if (!tokenSelected) {
			tokenSelected = <Token>getFirstPlayerToken();
		}
		// Check if no token is selected and you are the GM avoid the distance calculation
		let doNotReselectIfGM = false;
		if (
			(!canvas.tokens?.controlled && game.user?.isGM) ||
			(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
			(!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnDoors")) &&
				game.user?.isGM)
		) {
			doNotReselectIfGM = true;
		}
		if (taggerModuleActive && !checkTaggerForAmrsreach(doorControl.wall)) {
			if (!doNotReselectIfGM) {
				reselectTokenAfterInteraction(tokenSelected);
			}
			return wrapped(...args);
		}
		const isInReach = await DoorsReach.globalInteractionDistance(tokenSelected, doorControl, false);
		if (!doNotReselectIfGM) {
			reselectTokenAfterInteraction(tokenSelected);
		}
		if (!isInReach) {
			// Bug fix not sure why i need to do this
			//@ts-ignore
			if (doorControl.wall.document.ds === CONST.WALL_DOOR_STATES.LOCKED) {
				if (game.settings.get(CONSTANTS.MODULE_NAME, "disableDoorSound")) {
					return;
				}
				// Door Lock
				const doorData = DoorsReach.defaultDoorData();
				const playpath = doorData.lockPath;
				const playVolume = doorData.lockLevel;
				const fixedPlayPath = playpath.replace("[data]", "").trim();
				AudioHelper.play({ src: fixedPlayPath, volume: playVolume, autoplay: true, loop: false }, true);
			}
			return;
		}
	}

	// YOU NEED THIS ANYWAY FOR A STRANGE BUG WITH OVERRIDE AND SOUND OF DOOR
	//if(<boolean>game.settings.get(MODULE_NAME, "enableAmbientDoor")) {
	//  AmbientDoors.onDoorMouseDownCheck(doorControl);
	//}
	// Call original method
	//return originalMethod.apply(this,arguments);
	return wrapped(...args);
};

export const DoorControlPrototypeOnRightDownHandler = async function (wrapped, ...args) {
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableDoorsIntegration")) {
		const doorControl = this as DoorControl; //evt.currentTarget;
		let tokenSelected;

		tokenSelected = <Token>getFirstPlayerTokenSelected();
		if (!tokenSelected) {
			tokenSelected = <Token>getFirstPlayerToken();
		}
		if (!tokenSelected) {
			if (game.user?.isGM) {
				return wrapped(...args);
			} else {
				return;
			}
		}
		// Check if no token is selected and you are the GM avoid the distance calculation
		let doNotReselectIfGM = false;
		if (
			(!canvas.tokens?.controlled && game.user?.isGM) ||
			(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
			(!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnDoors")) &&
				game.user?.isGM)
		) {
			doNotReselectIfGM = true;
		}
		if (taggerModuleActive && !checkTaggerForAmrsreach(doorControl.wall)) {
			if (!doNotReselectIfGM) {
				reselectTokenAfterInteraction(tokenSelected);
			}
			return wrapped(...args);
		}
		const isInReach = await DoorsReach.globalInteractionDistance(tokenSelected, doorControl, true);
		if (!doNotReselectIfGM) {
			reselectTokenAfterInteraction(tokenSelected);
		}
		if (!isInReach) {
			return;
		}
	}
	return wrapped(...args);
};

export const AmbientLightPrototypeOnClickRightHandler = async function (wrapped, ...args) {
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableJournalsIntegration")) {
		const [target] = args;
		const light = this as AmbientLight;
		let tokenSelected;

		tokenSelected = <Token>getFirstPlayerTokenSelected();
		if (!tokenSelected) {
			tokenSelected = <Token>getFirstPlayerToken();
		}
		// Check if no token is selected and you are the GM avoid the distance calculation
		let doNotReselectIfGM = false;
		if (
			(!canvas.tokens?.controlled && game.user?.isGM) ||
			(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
			(!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnLights")) &&
				game.user?.isGM)
		) {
			doNotReselectIfGM = true;
		}
		if (taggerModuleActive && !checkTaggerForAmrsreach(light)) {
			if (!doNotReselectIfGM) {
				reselectTokenAfterInteraction(tokenSelected);
			}
			return wrapped(...args);
		}
		const isInReach = await LightsReach.globalInteractionDistance(tokenSelected, light);
		if (!doNotReselectIfGM) {
			reselectTokenAfterInteraction(tokenSelected);
		}
		if (!isInReach) {
			return;
		}
	}
	return wrapped(...args);
};

export const AmbientSoundPrototypeOnClickRightHandler = async function (wrapped, ...args) {
	if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "enableSoundsIntegration")) {
		const [target] = args;
		const sound = this as AmbientSound;
		let tokenSelected;

		tokenSelected = <Token>getFirstPlayerTokenSelected();
		if (!tokenSelected) {
			tokenSelected = <Token>getFirstPlayerToken();
		}
		// Check if no token is selected and you are the GM avoid the distance calculation
		let doNotReselectIfGM = false;
		if (
			(!canvas.tokens?.controlled && game.user?.isGM) ||
			(<number>canvas.tokens?.controlled?.length <= 0 && game.user?.isGM) ||
			(!(<boolean>game.settings.get(CONSTANTS.MODULE_NAME, "globalInteractionDistanceForGMOnSounds")) &&
				game.user?.isGM)
		) {
			doNotReselectIfGM = true;
		}
		if (taggerModuleActive && !checkTaggerForAmrsreach(sound)) {
			if (!doNotReselectIfGM) {
				reselectTokenAfterInteraction(tokenSelected);
			}
			return wrapped(...args);
		}
		const isInReach = await SoundsReach.globalInteractionDistance(tokenSelected, sound);
		if (!doNotReselectIfGM) {
			reselectTokenAfterInteraction(tokenSelected);
		}
		if (!isInReach) {
			return;
		}
	}
	return wrapped(...args);
};

// export const DrawingPrototypeOnClickLeftHandler = async function (wrapped, ...args) {
//   if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'enableDrawingsIntegration')) {
//     const [target] = args;
//     const drawing = this as Drawing;
//     let tokenSelected;

//     tokenSelected = <Token>getFirstPlayerTokenSelected();
//     if (!tokenSelected) {
//       tokenSelected = <Token>getFirstPlayerToken();
//     }

//     if(taggerModuleActive && !checkTaggerForAmrsreach(drawing)){
// if(!doNotReselectIfGM){
//   reselectTokenAfterInteraction(tokenSelected);
// }
//       return wrapped(...args);
//     }
//     const isInReach = await DrawingsReach.globalInteractionDistance(tokenSelected, drawing);
// if(!doNotReselectIfGM){
//   reselectTokenAfterInteraction(tokenSelected);
// }
//     if (!isInReach) {
//       return;
//     }
//   }
//   return wrapped(...args);
// };

// export const TilePrototypeOnClickLeftHandler = async function (wrapped, ...args) {
//   if (<boolean>game.settings.get(CONSTANTS.MODULE_NAME, 'enableTilesIntegration')) {
//     const [target] = args;
//     const tile = this as Tile;
//     let tokenSelected;

//     tokenSelected = <Token>getFirstPlayerTokenSelected();
//     if (!tokenSelected) {
//       tokenSelected = <Token>getFirstPlayerToken();
//     }

//     if(taggerModuleActive && !checkTaggerForAmrsreach(tile)){
// if(!doNotReselectIfGM){
//   reselectTokenAfterInteraction(tokenSelected);
// }
//       return wrapped(...args);
//     }
//     const isInReach = await TilesReach.globalInteractionDistance(tokenSelected, tile);
// if(!doNotReselectIfGM){
//   reselectTokenAfterInteraction(tokenSelected);
// }
//     if (!isInReach) {
//       return;
//     }
//   }
//   return wrapped(...args);
// };
