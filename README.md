#  FoundryVTT Arms Reach 

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-arms-reach/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge) 

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffoundryvtt-arms-reach&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=foundryvtt-arms-reach) 

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-arms-reach%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibleCoreVersion&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-arms-reach%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ffoundryvtt-arms-reach%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/foundryvtt-arms-reach/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-arms-reach/total?style=for-the-badge)


Little Utilities, Arms Reach for door, journal, stairways, token, ecc.

This project is born like a upgrade of the project [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny), in preparation of foundry vtt 0.8.0, but after a while i put some feature here and there and now i got something a little more complex.

 I'll try to make this module system indipendent , but if anyone has some rule distance computation for a specific system i can put some more settings for manage that.

## NOTE: If you are a javascript developer and not a typescript developer, you can just use the javascript files under the dist folder

## Known issue/Limitation

- I know there is some measure distance issue expecially with diagonals, here some details [Can "reach" further to the east](https://github.com/p4535992/foundryvtt-arms-reach/issues/28) and [Not working well with Doors on Diagonal walls](https://github.com/p4535992/foundryvtt-arms-reach/issues/40), **this problem is limite donly to the Dorr interaction distance calculation, the current solution for this cases is push the "Shift" button to snap out from the grid movement and move the token these 2 px the distance claculation need to validate the interaction, these cases are so few that i will not spend more time on that, anyone is welcome to ope a PR about it**

- The module setting "Avoid deselects the controlled token" doesn't work well with the option "Release on left click" of foundry , if you own more than a token you will find yourself to manually reselect the token anyway

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-arms-reach/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

## Module compatibility

- [Ambient Door](https://github.com/EndlesNights/ambientdoors)
- [Designer Door](https://github.com/Exitalterego/designerdoors)
- [Smart Door](https://github.com/manuelVo/foundryvtt-smart-doors)
- [Door Color](https://github.com/jessev14/door-colors)


## API

A little api to use in macro cc. for check if the placeable object reachable with variant based on the string id or the string tag from the module `tagger`.

The api is reachable from the variable `game.armsReach` or from the socket libary `socketLib` if present and active.

#### isReachable(token: Token, placeableObject: PlaceableObject, maxDistance?: number, useGrid?: boolean, userId?: string):boolean ⇒ <code>boolean</code>

Calculate the distance between the source token and the target placeable objet
**Returns**: <code>boolean</code> - The boolean value for tell if the target is near enough to the source token 

| Param | Type | Description |
| --- | --- | --- |
| token | <code>Token</code> | The source token |
| placeableObject | <code>placeableObject</code> | The target placeable object |
| maxDistance | <code>number</code> | OPTIONAL: explicit distance (units or grid) to check |
| useGrid | <code>boolean</code> | OPTIONAL: if true it will explicit calculate the grid distance instead the unit distance |
| userID | <code>string</code> | OPTIONAL: user id for the distance checking |

**Example**:
`game.armsReach.isReachable(token: Token, placeableObject: PlaceableObject, maxDistance?: number, useGrid?: boolean, userId?: string):boolean`

#### isReachableByTag(token: Token, tag: string, maxDistance?: number, useGrid?: boolean, userId?: string):boolean ⇒ <code>boolean</code>

Calculate the distance between the source token and the first target placeable objet with a specific tag, the method 'isReachableByTag' need the [Tagger Module](https://github.com/Haxxer/FoundryVTT-Tagger) installed and active for work.
**Returns**: <code>boolean</code> - The boolean value for tell if the first target with the specific tag is near enough to the source token 

| Param | Type | Description |
| --- | --- | --- |
| token | <code>Token</code> | The source token |
| tag | <code>string</code> | The tag from the [Tagger Module](https://github.com/Haxxer/FoundryVTT-Tagger) to check for start the distance calculation |
| maxDistance | <code>number</code> | OPTIONAL: explicit distance (units or grid) to check |
| useGrid | <code>boolean</code> | OPTIONAL: if true it will explicit calculate the grid distance instead the unit distance |
| userID | <code>string</code> | OPTIONAL: user id for the distance checking |

**Example**:
`game.armsReach.isReachableByTag(token: Token, tag: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean` 

#### isReachableById(token: Token, placeableObjectId: string, maxDistance?: number, useGrid?: boolean, userId?: string):boolean ⇒ <code>boolean</code>

Calculate the distance between the source token and the target placeable objet
**Returns**: <code>boolean</code> - The boolean value for tell if the target is near enough to the source token 

| Param | Type | Description |
| --- | --- | --- |
| token | <code>Token</code> | The source token |
| placeableObjectId | <code>string</code> | The target placeable object id reference|
| maxDistance | <code>number</code> | OPTIONAL: explicit distance (units or grid) to check |
| useGrid | <code>boolean</code> | OPTIONAL: if true it will explicit calculate the grid distance instead the unit distance |
| userID | <code>string</code> | OPTIONAL: user id for the distance checking |

**Example**:
`game.armsReach.isReachableById(token: Token, placeableObjectId: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`

#### isReachableByIdOrName(token: Token, placeableObjectIdOrName: string, maxDistance?: number, useGrid?: boolean, userId?: string):boolean ⇒ <code>boolean</code>

Calculate the distance between the source token and the target placeable objet
**Returns**: <code>boolean</code> - The boolean value for tell if the target is near enough to the source token 

| Param | Type | Description |
| --- | --- | --- |
| token | <code>Token</code> | The source token |
| placeableObjectIdOrName | <code>placeableObject</code> | The target placeable object id or name or label or entry reference|
| maxDistance | <code>number</code> | OPTIONAL: explicit distance (units or grid) to check |
| useGrid | <code>boolean</code> | OPTIONAL: if true it will explicit calculate the grid distance instead the unit distance |
| userID | <code>string</code> | OPTIONAL: user id for the distance checking |

**Example**:
`game.armsReach.isReachableByIdOrName(token: Token, placeableObjectIdOrName: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`

#### isReachableUniversal(placeableObject: PlaceableObject, placeableObject: PlaceableObject, maxDistance?: number, useGrid?: boolean, userId?: string):boolean ⇒ <code>boolean</code>

Calculate the distance between the source token and the target placeable objet
**Returns**: <code>boolean</code> - The boolean value for tell if the target is near enough to the source token 

| Param | Type | Description |
| --- | --- | --- |
| token | <code>Token</code> | The source token |
| placeableObject | <code>placeableObject</code> | The target placeable object |
| maxDistance | <code>number</code> | OPTIONAL: explicit distance (units or grid) to check |
| useGrid | <code>boolean</code> | OPTIONAL: if true it will explicit calculate the grid distance instead the unit distance |
| userID | <code>string</code> | OPTIONAL: user id for the distance checking |

**Example**:
`game.armsReach.isReachableUniversal(placeableObject: PlaceableObject, placeableObject: PlaceableObject, maxDistance?: number, useGrid?: boolean, userId?: string):boolean`

#### isReachableByTagUniversal(placeableObject: PlaceableObject, tag: string, maxDistance?: number, useGrid?: boolean, userId?: string):boolean ⇒ <code>boolean</code>

Calculate the distance between the source token and the first target placeable objet with a specific tag, the method 'isReachableByTag' need the [Tagger Module](https://github.com/Haxxer/FoundryVTT-Tagger) installed and active for work.
**Returns**: <code>boolean</code> - The boolean value for tell if the first target with the specific tag is near enough to the source token 

| Param | Type | Description |
| --- | --- | --- |
| placeableObject | <code>placeableObject</code> | The source placeableobject |
| tag | <code>string</code> | The tag from the [Tagger Module](https://github.com/Haxxer/FoundryVTT-Tagger) to check for start the distance calculation |
| maxDistance | <code>number</code> | OPTIONAL: explicit distance (units or grid) to check |
| useGrid | <code>boolean</code> | OPTIONAL: if true it will explicit calculate the grid distance instead the unit distance |
| userID | <code>string</code> | OPTIONAL: user id for the distance checking |

**Example**:
`game.armsReach.isReachableByTagUniversal(placeableObject: PlaceableObject, tag: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean` 

#### isReachableByIdUniversal(placeableObject: PlaceableObject, placeableObjectId: string, maxDistance?: number, useGrid?: boolean, userId?: string):boolean ⇒ <code>boolean</code>

Calculate the distance between the source token and the target placeable objet
**Returns**: <code>boolean</code> - The boolean value for tell if the target is near enough to the source token 

| Param | Type | Description |
| --- | --- | --- |
| placeableObject | <code>placeableObject</code> | The source placeableobject |
| placeableObjectId | <code>string</code> | The target placeable object id reference|
| maxDistance | <code>number</code> | OPTIONAL: explicit distance (units or grid) to check |
| useGrid | <code>boolean</code> | OPTIONAL: if true it will explicit calculate the grid distance instead the unit distance |
| userID | <code>string</code> | OPTIONAL: user id for the distance checking |

**Example**:
`game.armsReach.isReachableByIdUniversal(placeableObject: PlaceableObject, placeableObjectId: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`

#### isReachableByIdOrNameUniversal(placeableObject: PlaceableObject, placeableObjectIdOrName: string, maxDistance?: number, useGrid?: boolean, userId?: string):boolean ⇒ <code>boolean</code>

Calculate the distance between the source token and the target placeable objet
**Returns**: <code>boolean</code> - The boolean value for tell if the target is near enough to the source token 

| Param | Type | Description |
| --- | --- | --- |
| placeableObject | <code>placeableObject</code> | The source placeableobject |
| placeableObjectIdOrName | <code>placeableObject</code> | The target placeable object id or name or label or entry reference|
| maxDistance | <code>number</code> | OPTIONAL: explicit distance (units or grid) to check |
| useGrid | <code>boolean</code> | OPTIONAL: if true it will explicit calculate the grid distance instead the unit distance |
| userID | <code>string</code> | OPTIONAL: user id for the distance checking |

**Example**:
`game.armsReach.isReachableByIdOrNameUniversal(placeableObject: PlaceableObject, placeableObjectIdOrName: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`


### Integration with Socketlib module

You can use the socketLib for call the same functions:

`await socket.executeAsGM('isReachable', token: Token, placeableObject: PlaceableObject, maxDistance?: number, useGrid?: boolean, userId?: string):Promise<boolean>`

`await socket.executeAsGM('isReachableByTag', token: Token, tag: string, maxDistance?: number, useGrid?: boolean, userId?: string): Promise<boolean>`

`await socket.executeAsGM('isReachableById', token: Token, placeableObjectId: string, maxDistance?: number, useGrid?: boolean, userId?: string): Promise<boolean>`

`await socket.executeAsGM('isReachableByIdOrName', token: Token, placeableObjectIdOrName: string, maxDistance?: number, useGrid?: boolean, userId?: string): Promise<boolean>`

**NOTE: for now the optional parameter 'userId' is not used from the api, i hope to add in the future some filter so a specific actor for a specific user has some limitation.**

## Features 

The interaction distance is measure by the distance between a token and a placeable object like door, journal, stairways, ecc.

To interact with a door, journal, ecc., the player need to have a token selected (or own a token) for make the calculation distance working well

### Door Feature

* Enable the GM to select the maximum distance that players can interact with a door (needs a token selected) (DM bypass this limitation)

* Pressing 'e' opens/closes a door nearest of current selected token

* Holding 'e' centers the camera on current selected token

* Double tapping movement on the direction of a door will interact with it

**NOTE: If no token is selected and you are a GM this feature is not activated**

### [Stairways](https://gitlab.com/SWW13/foundryvtt-stairways) Feature

* If the module 'stairways' is present and active and the module settings is true there is a distance check interaction when you click on the stairways icon.

### Note/Journal Feature

* Add distance calculation for note and journal on the canvas
* Automatically flag journal notes to show on the map without having to have your players turn it on themselves.

### Token Feature (Beta need feedback)

* Add distance calculation for owned source token and generic target token on the canvas for open the sheet and emulate a loot chest
* GM can't use this feature because they owned every token so you must set the explicit the source token on module setting
* This feature work with only one owned source token on the canvas at the time
* You must set the name of your source token (not the character name) on the module setting 
* If no source token is setted on the module setting the module take the first owned token of the player

### Light Feature (Beta need feedback)

* This feature make sense only with one of this module active [Lightswitch by theripper93](https://www.reddit.com/r/FoundryVTT/comments/pmu4z0/lightswitch_a_user_frendly_way_to_present/) (from [theripper93](https://www.patreon.com/theripper93) only patreon page) or [LightSwitch](https://github.com/zarmstrong/fvtt-lightswitch)
* Add distance calculation for light on the canvas

### Drawing Feature (Beta need feedback)

* Add distance calculation for drawings on the canvas

### Tile Feature (Beta need feedback)

* Add distance calculation for tiles on the canvas

### Sounds Feature (Beta need feedback)

* Add distance calculation for sounds on the canvas

### Templates Feature (On developing)

* Add distance calculation for templates on the canvas

### Wall Feature (On developing)

* Add distance calculation for walls on the canvas (door are a special case with specific rule)

### Tagger Feature

* Add integration with [Tagger Module](https://github.com/Haxxer/FoundryVTT-Tagger), you decide specifically for which placeable objects on the canvas the distance calculation should be triggered
* IMPORTANT: the tagger you must used for any placeable object is the string 'armsreach'

### Reset Doors and Fog feature Feature

**NOTE:** This feature remain for history, it will been updated, but is been "officially" transferred here [Sidebar Context](https://github.com/kandashi/sidebar-context) because make more sense on that module than this.

Adds a button to the Walls Menu to Shut all doors in the current scene. Also adds a menu to the context dropdown for the Scene Navigation and Scene Directory menus to shut all doors and delete fog in the selected scene to prepare it for a fresh visit from characters. I find it useful after QAing a new map for holes in walls/doors and checking lighting, etc.

Changes the functionality from closing ALL doors to closing ONLY opened doors. Doors that are currently locked remain locked, and are not closed.

# Build

## Install all packages

```bash
npm install
```
## npm build scripts

### build

will build the code and copy all necessary assets into the dist folder and make a symlink to install the result into your foundry data; create a
`foundryconfig.json` file with your Foundry Data path.

```json
{
  "dataPath": "~/.local/share/FoundryVTT/"
}
```

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run-script build
```

### NOTE:

You don't need to build the `foundryconfig.json` file you can just copy the content of the `dist` folder on the module folder under `modules` of Foundry

### build:watch

`build:watch` will build and watch for changes, rebuilding automatically.

```bash
npm run-script build:watch
```

### clean

`clean` will remove all contents in the dist folder (but keeps the link from build:install).

```bash
npm run-script clean
```
### lint and lintfix

`lint` launch the eslint process based on the configuration [here](./.eslintrc)

```bash
npm run-script lint
```

`lintfix` launch the eslint process with the fix argument

```bash
npm run-script lintfix
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

### package

`package` generates a zip file containing the contents of the dist folder generated previously with the `build` command. Useful for those who want to manually load the module or want to create their own release

```bash
npm run-script package
```

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-arms-reach/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- Foundry VTT discord community for always helping me out.

- [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny)
- [foundryvtt-stairways](https://gitlab.com/SWW13/foundryvtt-stairways) ty to [SWW13](https://gitlab.com/SWW13)
- [foundryvtt-rangefinder](https://github.com/manuelVo/foundryvtt-rangefinder/tree/master) ty to [manuelVo](https://github.com/manuelVo)
- [drag-ruler](https://github.com/manuelVo/foundryvtt-drag-ruler) ty to [manuelVo](https://github.com/manuelVo)

A very big thanks to [manuelVo](https://github.com/manuelVo), because i was to stupid to understand thing like measurement of Foundry by myself.


## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.


