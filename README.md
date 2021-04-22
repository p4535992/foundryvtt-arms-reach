![](https://img.shields.io/badge/Foundry-v0.7.9-informational)

# Foundry VTT Arms Reach

This is a fork of the project made by Psyny, for avoid incompatibilites with foundryvtt 0.8.X :

* **Author**: Psyny#0677  (Discord)
* **Version**: 1.0.2
* **Foundry VTT Compatibility**: 0.7.9
* **System Compatibility**: Any
* **Link**: https://github.com/psyny/FoundryVTT/tree/master/ArmsReach


## NOTE

This project is still in beta so there is likely some issue use at your own risk.

This is a upgrade of the project [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny), in preparation of foundry vtt 0.8.0.

### NOTE FROM PSYNY ABOUT 0.7.X and forks!

I have plans to update all my mods soon (in a month or so).
I know its a bit late, but anyone is allowed and welcome to fork or use my mods to create their own.

### Disclaimer

This features of this module was first part of my (Cozy Player)[https://github.com/psyny/FoundryVTT/tree/master/CozyPlayer] module. I've decided to make this a separate module to make it work with other systems beyond Dungeons And Dragons.

If FVTT adds windows and other interactibles I plan to update this module to support it.

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

## Usage

The iteraction distance is measure by the distance between a token and the door. So, to iteract with a door, the player need to have a token selected (or own a token).

## Features

* Enable the GM to select the maximum distance that players can interact with a door (needs a token selected) (DM bypass this limitation)
* Pressing 'e' opens/closes a door nearest of current selected token
* Holding 'e' centers the camera on current selected token
* Double tapping movement on the direction of a door will interact with it
* Embedded integration of Adds easily customized sounds effects that trigger for all user when interacting with doors. Just open up a doors configeration window to initilize the set up for that door, and you'll be able to enter in the sound file pathways that you wish to play when that door; is opened, is closed, is locked, or is unlocked. If you do not wish for any sound effect to play when an certain action is taken, just leave that spesific field blank. Some default sounds have been provided. 
* Double click on any audio file within the file picker. Sound should stop playing once a different file is chosen, the file picker is closed, or navigation changed.

## Issues

None up until now.
## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- Foundry VTT discord community for always helping me out.
- [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny)
- [Ambient Doors](https://github.com/EndlesNights/ambientdoors) ty to [EndlesNights](https://github.com/EndlesNights)
- [Sound Previewer](https://github.com/matthewswar/foundry-vtt-sound-previewer) ty to [matthewswar](https://github.com/matthewswar)
## License
This Foundry VTT module is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).

## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.


