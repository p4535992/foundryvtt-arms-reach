![](https://img.shields.io/badge/Foundry-v0.8.6-informational)

#  FoundryVTT Arms Reach

This is project is born like a upgrade of the project [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny), in preparation of foundry vtt 0.8.0, but after a while i put some feature here and there and now i got something a little more complex.


## Known issue/Limitation

- I know there is some measure distance issue, i'm trying to find a math formula for better manage the use cases
- Only Grid Square Maps are supported so Gridless and Hex map not work with the same logic (you can make it work by manipulating the module settings in some way) i will try in the future for 0.8.X to integrated this library [lib-find-the-path](https://github.com/dwonderley/lib-find-the-path/) for manage every type of map

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

## Features 

The interaction distance is measure by the distance between a token and the door. So, to interact with a door, the player need to have a token selected (or own a token).

* Enable the GM to select the maximum distance that players can interact with a door (needs a token selected) (DM bypass this limitation)

* Pressing 'e' opens/closes a door nearest of current selected token

* Holding 'e' centers the camera on current selected token

* Double tapping movement on the direction of a door will interact with it


**Integration with [Stairways Module]((https://gitlab.com/SWW13/foundryvtt-stairways))**

* If the module 'stairways' is present and active and the module settings is true there is a distance check interaction when you click on the stairways icon, ONLY WORK ON GRID SQUARE MAPS.

**Reset Doors and Fog feature Feature**

Adds a button to the Walls Menu to Shut all doors in the current scene. Also adds a menu to the context dropdown for the Scene Navigation and Scene Directory menus to shut all doors and delete fog in the selected scene to prepare it for a fresh visit from characters. I find it useful after QAing a new map for holes in walls/doors and checking lighting, etc.

REMASTERED

Remastered changes the functionality from closing ALL doors to closing ONLY opened doors. Doors that are currently locked remain locked, and are not closed.

## Hooks (on developing, but any feedback is more than welcome)

Hooks are only executed for the user using the door.

`PreArmsReachInteraction` is called before the interaction with a door is executed. When any of executed hooks return `false` the interaction is aborted.

`ReplaceArmsReachInteraction` is called like a replacement to the standard interaction with a door, so any system or GM can use a customized version.

### Door Data

```js
const doorData = {
    /// door data of the source door (WARNING: this data may change in the future)
    sourceData,
    /// id of the token (tokens interaction with the door)
    selectedOrOwnedTokenId,
    /// door data of the target data (WARNING: this data may change in the future)
    targetData,
    /// id of the user using the door (current user)
    userId
}

/// WARNING: internal data - do not use if possible
// sourceData and targetData schema is defined in: src/module/models.ts (or module/models.js)
```

### Example

```js

// DO SOME CHECK 'BEFORE' THE DEFAULT DISTANCE COMPUTATION

Hooks.call('ReplaceArmsReachInteraction', doorData);

// How you can use this....

Hooks.on('PreArmsReachInteraction', (doorData) => {
    const { sourceData, selectedOrOwnedTokenId, targetData, userId } = doorData

    // DO SOMETHING AND RETURN OR TRUE OR FALSE
})

// REPLACE THE DEFAULT DISTANCE COMPUTATION BECAUSE YOUR SUCK (Yea i know that)

const result = { status: 0 };
Hooks.call('ReplaceArmsReachInteraction', doorData, result);
// and then i'll do something with `result.status`

// How you can use this....

Hooks.on('ReplaceArmsReachInteraction', (doorData, result) => {
    const { sourceData, selectedTokenId, targetData, userId } = doorData

    result.status = ......

    // DO SOMETHING AND RETURN A NUMBER ON result.status
    
    // 0 : Custom compute distance fail but fallback to the standard compute distance
    // 1 : Custom compute success
    // 2 : Custom compute distance fail
    // x < 0 || x > 2 : something just go wrong it's a fail but fallback to the standard compute distance
    // undefined|null|Nan : Nothing to check ? than go on with the standard compute distance

    return result;
})

```

## NOTE

 I'll try to make this module system indipendent , but if anyone has some rule distance computation for a specific system i can put some more settings for manage that.

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-arms-reach/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- Foundry VTT discord community for always helping me out.
- [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny)
- [Ambient Doors](https://github.com/EndlesNights/ambientdoors) ty to [EndlesNights](https://github.com/EndlesNights)
- [Sound Previewer](https://github.com/matthewswar/foundry-vtt-sound-previewer) ty to [matthewswar](https://github.com/matthewswar)
- [Designer Doors](https://github.com/Exitalterego/designerdoors) ty to [Exitalterego](https://github.com/Exitalterego)
- [Designer Windows](https://github.com/Exitalterego/designerwindows) ty to [Exitalterego](https://github.com/Exitalterego)
- [showdooricons](https://github.com/wsaunders1014/showdooricons) ty to [wsaunders1014](https://github.com/wsaunders1014)
- [Arms Reach (for pathfinder 1e)](https://gitlab.com/mkah-fvtt/pf1/arms-reach) ty to [mkah-fvtt](https://gitlab.com/mkah-fvtt)
- [foundryvtt-stairways](https://gitlab.com/SWW13/foundryvtt-stairways) ty to [SWW13](https://gitlab.com/SWW13)
- [foundryvtt-rangefinder](https://github.com/manuelVo/foundryvtt-rangefinder/tree/master) ty to [manuelVo](https://github.com/manuelVo)
- [Reset Doors and Fog - Remastered](https://github.com/p4535992/resetdoorsandfog) ty to [yacklebeam](https://github.com/yacklebeam) and [wsaunders1014](https://github.com/wsaunders1014)

## License
This Foundry VTT module is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).

## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.


