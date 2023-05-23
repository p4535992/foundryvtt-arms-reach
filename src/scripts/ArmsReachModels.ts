// import type { Overlay } from "./apps/range_overlay/overlay";

export class DoorData {
	/// door data of the source door (WARNING: this data may change in the future)
	sourceData: DoorSourceData;
	/// id's of all selected token (tokens beeing teleported)
	selectedOrOwnedTokenId: string;
	/// door data of the target door (WARNING: this data may change in the future)
	targetData: DoorTargetData;
	/// id of the user using the door (current user)
	userId: string;
}

/// WARNING: internal data - do not use if possible
export class DoorTargetData {
	/// target (partner) scene id or `null` if current scene
	scene: Scene;
	/// door name (id for connection)
	name: string;
	/// door label or `null` for none
	label: string;
	/// door icon (image path) or `null` for default
	icon: string;
	/// disabled (locked on `true`)
	disabled: boolean;
	/// hide from players (hidden on `true`)
	hidden: boolean;
	/// animate movement within scene (animate on `true`)
	animate: boolean;
	/// x position of target door
	x: number;
	/// y position of target door
	y: number;
}

/// WARNING: internal data - do not use if possible
export class DoorSourceData {
	/// target (partner) scene id or `null` if current scene
	scene: Scene;
	/// door name (id for connection)
	name: string;
	/// door label or `null` for none
	label: string;
	/// door icon (image path) or `null` for default
	icon: string;
	/// disabled (locked on `true`)
	disabled: boolean;
	/// hide from players (hidden on `true`)
	hidden: boolean;
	/// animate movement within scene (animate on `true`)
	animate: boolean;
	/// x position of target door
	x: number;
	/// y position of target door
	y: number;
}

export class ArmsreachData {
	/// x position of target
	x: number;
	/// y position of target
	y: number;
	/// w width of target
	w?: number;
	/// h height of target
	h?: number;
	/// document type
	documentName: string;
	/// id document
	id: string;
	centerX: number;
	centerY: number;
	placeableObjectData: any;
}

// export class combatRangeOverlay {
// 	instance: Overlay;
// 	showNumericMovementCost: boolean;
// 	showPathLines: boolean;
// 	roundNumericMovementCost: boolean;
// }

// export class overlaysData {
// 	distanceTexts: PIXI.Text[];
// 	tokenOverlays: PIXI.Graphics[];
// 	distanceOverlay: PIXI.Graphics | undefined;
// 	pathOverlay: PIXI.Graphics | undefined;
// 	turnOrderTexts: any[];
// 	potentialTargetOverlay: PIXI.Graphics | undefined;
// 	wallsOverlay: PIXI.Graphics | undefined;
// }
