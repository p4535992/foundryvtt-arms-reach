![](https://img.shields.io/badge/Foundry-v0.6.2-informational)

# Foundry VTT Arms Reach

This is a fork of the project made by Psyny, for avoid incompatibilites with foundryvtt 0.8.X :

* **Author**: Psyny#0677  (Discord)
* **Version**: 1.0.1
* **Foundry VTT Compatibility**: 0.6.2
* **System Compatibility**: Any
* **Link**: https://github.com/psyny/FoundryVTT/tree/master/ArmsReach

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

### Disclaimer

This features of this module was first part of my (Cozy Player)[https://github.com/psyny/FoundryVTT/tree/master/CozyPlayer] module. I've decided to make this a separate module to make it work with other systems beyond Dungeons And Dragons.

If FVTT adds windows and other interactibles I plan to update this module to support it.

# Installation

It's always better and easier to install modules through in in app browser.

To install this module manually:
1. Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2. Click "Install Module"
3. In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-arms-reach/master/src/module.json`
4. Click 'Install' and wait for installation to complete
5. Don't forget to enable the module in game using the "Manage Module" button

## Usage

The iteraction distance is measure by the distance between a token and the door. So, to iteract with a door, the player need to have a token selected (or own a token).

## Features

* Enable the GM to select the maximum distancce that players can interact with a door (needs a token selected) (DM bypass this limitation)
* Pressing 'e' opens/closes a door nearest of current selected token
* Holding 'e' centers the camera on current selected token
* Double tapping movement on the direction of a door will interact with it

## Known issues
None up until now.

## License
This Foundry VTT module is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).

## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.