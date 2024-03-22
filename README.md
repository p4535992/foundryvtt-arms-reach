#  FoundryVTT Arms Reach

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-arms-reach/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Farms-reach&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=arms-reach)

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-arms-reach%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-arms-reach%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Farms-reach%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/arms-reach/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-arms-reach/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/arms-reach/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/arms-reach/)

Little Utilities, Arms Reach for door, journal, stairways, token, ecc.

This project is born like a upgrade of the project [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny), in preparation of foundry vtt 0.8.0, but after a while i put some feature here and there and now i got something a little more complex.

 I'll try to make this module system indipendent , but if anyone has some rule distance computation for a specific system i can put some more settings for manage that.

## Known issue/Limitation

- I know there is some measure distance issue expecially with diagonals, here some details [Can "reach" further to the east](https://github.com/p4535992/foundryvtt-arms-reach/issues/28) and [Not working well with Doors on Diagonal walls](https://github.com/p4535992/foundryvtt-arms-reach/issues/40), **this problem is limited only to the _Door interaction distance calculation_, the current solution for this cases is push the "Shift" button to snap out from the grid movement and move the token these 2 px the distance calculation need to validate the interaction, these cases are so few that i will not spend more time on that, anyone is welcome to ope a PR about it**
- The module setting "Avoid deselects the controlled token" doesn't work well with the option "Release on left click" of foundry , if you own more than a token you will find yourself to manually reselect the token anyway
- When you scale a placeable object the event (click, ecc.), are limited only to the original coordinates {x, y} and not the "scaled" image

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

- [Ambient Door](https://github.com/EndlesNights/ambientdoors) (verified on v10 not v11)
- [Designer Door](https://github.com/Exitalterego/designerdoors) (verified on v10 not v11)
- [Smart Door](https://github.com/manuelVo/foundryvtt-smart-doors) (verified on v10 not v11)
- [Door Color](https://github.com/jessev14/door-colors) (verified on v10 not v11)
- [Rideable](https://github.com/Saibot393/Rideable) (verified on v11)
- [Lock and Key](https://github.com/Saibot393/LocknKey) (verified on v11)

## API

A little api to use in macro cc. for check if the placeable object reachable with variant based on the string id or the string tag from the module `tagger`.

The api is reachable from the variable `game.modules.get('arms-reach').api` or from the socket libary `socketLib` on the variable `game.modules.get('arms-reach').socket` if present and active.

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
`game.modules.get('arms-reach').api.isReachable(token: Token, placeableObject: PlaceableObject, maxDistance?: number, useGrid?: boolean, userId?: string):boolean`

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
`game.modules.get('arms-reach').api.isReachableByTag(token: Token, tag: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`

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
`game.modules.get('arms-reach').api.isReachableById(token: Token, placeableObjectId: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`

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
`game.modules.get('arms-reach').api.isReachableByIdOrName(token: Token, placeableObjectIdOrName: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`

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
`game.modules.get('arms-reach').api.isReachableUniversal(placeableObject: PlaceableObject, placeableObject: PlaceableObject, maxDistance?: number, useGrid?: boolean, userId?: string):boolean`

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
`game.modules.get('arms-reach').api.isReachableByTagUniversal(placeableObject: PlaceableObject, tag: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`

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
`game.modules.get('arms-reach').api.isReachableByIdUniversal(placeableObject: PlaceableObject, placeableObjectId: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`

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
`game.modules.get('arms-reach').api.isReachableByIdOrNameUniversal(placeableObject: PlaceableObject, placeableObjectIdOrName: string, maxDistance?: number, useGrid?: boolean, userId?: string): boolean`


### Integration with Socketlib module

You can use the socketLib for call the same functions:

`await game.modules.get('arms-reach').socket.executeAsGM('isReachable', token: Token, placeableObject: PlaceableObject, maxDistance?: number, useGrid?: boolean, userId?: string):Promise`

`await game.modules.get('arms-reach').socket.executeAsGM('isReachableByTag', token: Token, tag: string, maxDistance?: number, useGrid?: boolean, userId?: string): Promise`

`await game.modules.get('arms-reach').socket.executeAsGM('isReachableById', token: Token, placeableObjectId: string, maxDistance?: number, useGrid?: boolean, userId?: string): Promise`

`await game.modules.get('arms-reach').socket.executeAsGM('isReachableByIdOrName', token: Token, placeableObjectIdOrName: string, maxDistance?: number, useGrid?: boolean, userId?: string): Promise`

**NOTE: for now the optional parameter 'userId' is not used from the api, i hope to add in the future some filter so a specific actor for a specific user has some limitation.**

## Features

The interaction distance is measure by the distance between a token and a placeable object like door, journal, stairways, ecc.

To interact with a door, journal, ecc., the player need to have a token selected (or own a token) for make the calculation distance working well

### Door Feature

* Enable the GM to select the maximum distance that players can interact with a door (needs a token selected) (DM bypass this limitation)

* Pressing 'e' opens/closes a door nearest of current selected token

**NOTE: If no token is selected and you are a GM this feature is not activated**

### [Stairways](https://gitlab.com/SWW13/foundryvtt-stairways) Feature

* If the module 'stairways' is present and active and the module settings is true there is a distance check interaction when you click on the stairways icon.

### Note/Journal Feature

* Add distance calculation for note and journal on the canvas
* Automatically flag journal notes to show on the map without having to have your players turn it on themselves.

### Token Feature

* Add distance calculation for owned source token and generic target token on the canvas for open the sheet and emulate a loot chest
* GM can use this feature but beware there is probably some glitch in some use case because they owned every token
* [OPTIONAL] You can set the name of your _explicit source token_ (not the character name) on the specific module setting
* If no _explicit source token_ is setted on the module setting the module take the first selected token of the player, if no selected token ias present it will try to get the first owwned token of the player
* It's advisable for this feature to use the [Tagger Module](https://github.com/Haxxer/FoundryVTT-Tagger) instead the name and sheet checker is more dinamic.

### Light Feature (Beta need feedback)

* This feature make sense only with one of this module active [Lightswitch by theripper93](https://www.reddit.com/r/FoundryVTT/comments/pmu4z0/lightswitch_a_user_frendly_way_to_present/) (from [theripper93](https://www.patreon.com/theripper93) only patreon page) or [LightSwitch](https://github.com/zarmstrong/fvtt-lightswitch)
* Add distance calculation for light on the canvas

### Drawing Feature (Beta it should be working but only on the API level)

* Add distance calculation for drawings on the canvas

### Tile Feature (Beta it should be working but only on the API level)

* Add distance calculation for tiles on the canvas

### Sounds Feature (Beta it should be working but only on the API level)

* Add distance calculation for sounds on the canvas

### Templates Feature (Beta it should be working but only on the API level)

* Add distance calculation for templates on the canvas

### Wall Feature (Beta it should be working but only on the API level)

* Add distance calculation for walls on the canvas (door are a special case with specific rule)

### Tagger Feature 

* Add integration with [Tagger Module](https://github.com/Haxxer/FoundryVTT-Tagger), you decide specifically for which placeable objects on the canvas the distance calculation should be triggered
* **IMPORTANT:** the tagger you must used for any placeable object is the string 'armsreach'
* From 2.2.11 this feature is been splitted for each category of placeable object (Wall, Token, Note, ecc.) for a better customization

### Customize the distance interaction in every placeable object Wall, Light, Stairway, ecc.

![](/wiki/images/flag_door.png)

![](/wiki/images/flag_stairway.png)

### Reset Doors and Fog feature Feature (deprecated and removed on v11)

~~Adds a button to the Walls Menu to Shut all doors in the current scene. Also adds a menu to the context dropdown for the Scene Navigation and Scene Directory menus to shut all doors and delete fog in the selected scene to prepare it for a fresh visit from characters. I find it useful after QAing a new map for holes in walls/doors and checking lighting, etc.~~

~~Changes the functionality from closing ALL doors to closing ONLY opened doors. Doors that are currently locked remain locked, and are not closed.~~

~~### [Experimental] Integration of [Combat Range Overlay](https://github.com/Nazrax/fvtt-combat-range-overlay)~~

~~[Here the documentation](./wiki/docs/combat-range-overlay.md)~~

# Build

## Install all packages

```bash
npm install
```

### dev

`dev` will let you develop you own code with hot reloading on the browser

```bash
npm run dev
```

## npm build scripts

### build

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run build
```

### build-watch

`build-watch` will build and watch for changes, rebuilding automatically.

```bash
npm run build-watch
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-arms-reach/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- Foundry VTT discord community for always helping me out.

- [Arms Reach Original](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny)
- [foundryvtt-stairways](https://gitlab.com/SWW13/foundryvtt-stairways) ty to [SWW13](https://gitlab.com/SWW13)
- [foundryvtt-rangefinder](https://github.com/manuelVo/foundryvtt-rangefinder/tree/master) ty to [manuelVo](https://github.com/manuelVo)
- [drag-ruler](https://github.com/manuelVo/foundryvtt-drag-ruler) ty to [manuelVo](https://github.com/manuelVo)
- [range-overlay](https://github.com/Nazrax/fvtt-combat-range-overlay) ty to [Nazrax](https://github.com/Nazrax/)
- [Rideable](https://github.com/Saibot393/Rideable) TY TO [Saibot393](https://github.com/Saibot393/)

A very big thanks to [manuelVo](https://github.com/manuelVo), because i was to stupid to understand thing like measurement of Foundry by myself.
A very big thanks to [Saibot393](https://github.com/Saibot393/), and his GeometricUtils class for token distance calculation.


## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.


