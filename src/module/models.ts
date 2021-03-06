export class DoorData {
  /// door data of the source door (WARNING: this data may change in the future)
  sourceData:DoorSourceData;
  /// id's of all selected token (tokens beeing teleported)
  selectedOrOwnedTokenId:string;
  /// door data of the target door (WARNING: this data may change in the future)
  targetData:DoorTargetData;
  /// id of the user using the door (current user)
  userId:string;
}


/// WARNING: internal data - do not use if possible
export class DoorTargetData {
  /// target (partner) scene id or `null` if current scene
  scene:Scene;
  /// door name (id for connection)
  name:string;
  /// door label or `null` for none
  label:string;
  /// door icon (image path) or `null` for default
  icon:string;
  /// disabled (locked on `true`)
  disabled:boolean;
  /// hide from players (hidden on `true`)
  hidden:boolean;
  /// animate movement within scene (animate on `true`)
  animate:boolean;
  /// x position of target door
  x:number;
  /// y position of target door
  y:number;
}

/// WARNING: internal data - do not use if possible
export class DoorSourceData {
  /// target (partner) scene id or `null` if current scene
  scene:Scene;
  /// door name (id for connection)
  name:string;
  /// door label or `null` for none
  label:string;
  /// door icon (image path) or `null` for default
  icon:string;
  /// disabled (locked on `true`)
  disabled:boolean;
  /// hide from players (hidden on `true`)
  hidden:boolean;
  /// animate movement within scene (animate on `true`)
  animate:boolean;
  /// x position of target door
  x:number;
  /// y position of target door
  y:number;
}
