const CONSTANTS = {
  MODULE_NAME: 'foundryvtt-arms-reach',
  PATH: `modules/foundryvtt-arms-reach/`,
  TAGGER_MODULE_NAME: 'tagger',
  TAGGER_FLAG: 'armsreach',

  DEFAULT_WEAPON_RANGE: 5,
  DEFAULT_WEAPON_RANGES: "5,10,30,60,120",
  FLAG_NAMES: {
    WEAPON_RANGE: "weaponRange",
    SPEED_OVERRIDE: "speedOverride",
    IGNORE_DIFFICULT_TERRAIN: "ignoreDifficultTerrain"
  },
  MAX_DIST: 999,
  FEET_PER_TILE: 5,
  FUDGE: .1, // floating point fudge
  overlayVisibility: {
    ALWAYS: 'always',
    HOTKEYS: 'hotkeys',
    NEVER: 'never'
  },
  diagonals: {
    FIVE_TEN_FIVE: "fiveTenFive",
    TEN_FIVE_TEN: "tenFiveTen",
    FIVE: "five",
    TEN: "ten"
  }
};

CONSTANTS.PATH = `modules/${CONSTANTS.MODULE_NAME}/`;

export default CONSTANTS;
