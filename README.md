![](https://img.shields.io/badge/Foundry-v0.8.9-informational)

#  FoundryVTT Arms Reach 

Little Utilities, Arms Reach for door, journal, stairways, token, ecc.

This project is born like a upgrade of the project [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny), in preparation of foundry vtt 0.8.0, but after a while i put some feature here and there and now i got something a little more complex.

 I'll try to make this module system indipendent , but if anyone has some rule distance computation for a specific system i can put some more settings for manage that.

## NOTE: If you are a javascript developer and not a typescript developer, you can just use the javascript files under the dist folder

## Known issue/Limitation

- I know there is some measure distance issue expecially with diagonals, here some details [current issue](https://github.com/p4535992/foundryvtt-arms-reach/issues/28)
  
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

## Features 

The interaction distance is measure by the distance between a token and a placeable object like door, journal, stairways, ecc.

To interact with a door, journal, ecc., the player need to have a token selected (or own a token) for make the calculation distance working well

### Door Feature

* Enable the GM to select the maximum distance that players can interact with a door (needs a token selected) (DM bypass this limitation)

* Pressing 'e' opens/closes a door nearest of current selected token

* Holding 'e' centers the camera on current selected token

* Double tapping movement on the direction of a door will interact with it

### [Stairways]((https://gitlab.com/SWW13/foundryvtt-stairways)) Feature

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

### Drawing Feature (On developing, not sure if it's possible without hook on other module)

* Add distance calculation for drawings on the canvas

### Tile Feature (On developing, not sure if it's possible)

* Add distance calculation for tiles on the canvas

### Sounds Feature (Beta need feedback)

* Add distance calculation for sounds on the canvas

### Templates Feature (On developing)

* Add distance calculation for templates on the canvas

### Tagger Feature

* Add integration with [Tagger Module](https://github.com/Haxxer/FoundryVTT-Tagger), you decide specifically for which placeable objects on the canvas the distance calculation should be triggered

### Reset Doors and Fog feature Feature

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


