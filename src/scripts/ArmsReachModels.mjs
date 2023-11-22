export class DoorData {
  /// DoorSourceData: door data of the source door (WARNING: this data may change in the future)
  sourceData;
  /// string: id's of all selected token (tokens beeing teleported)
  selectedOrOwnedTokenId;
  /// DoorTargetData: door data of the target door (WARNING: this data may change in the future)
  targetData;
  /// string: id of the user using the door (current user)
  userId;
}

/// WARNING: internal data - do not use if possible
export class DoorTargetData {
  /// Scene: target (partner) scene id or `null` if current scene
  scene;
  /// string: door name (id for connection)
  name;
  ///  string: door label or `null` for none
  label;
  ///  string: door icon (image path) or `null` for default
  icon;
  /// boolean: disabled (locked on `true`)
  disabled;
  /// boolean:  hide from players (hidden on `true`)
  hidden;
  /// boolean:  animate movement within scene (animate on `true`)
  animate;
  /// number: x position of target door
  x;
  /// number: y position of target door
  y;
}

/// WARNING: internal data - do not use if possible
export class DoorSourceData {
  /// Scene: target (partner) scene id or `null` if current scene
  scene = {};
  /// string: door name (id for connection)
  name = "";
  /// string: door label or `null` for none
  label = "";
  /// string: door icon (image path) or `null` for default
  icon = "";
  /// boolean: disabled (locked on `true`)
  disabled = false;
  /// boolean: hide from players (hidden on `true`)
  hidden = false;
  /// boolean: animate movement within scene (animate on `true`)
  animate = false;
  /// number: x position of target door
  x = 0;
  /// number: y position of target door
  y = 0;
}

export class ArmsreachData {
  /// number: x position of target
  x = 0;
  /// number: y position of target
  y = 0;
  /// number: w width of target
  w = 0;
  /// number: h height of target
  h = 0;
  /// document type
  documentName = "";
  /// string: id document
  id = "";
  // number:
  centerX = 0;
  // number:
  centerY = 0;
  // any:
  placeableObjectData = {};
}
