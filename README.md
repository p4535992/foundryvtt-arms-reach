![](https://img.shields.io/badge/Foundry-v0.7.9-informational)

#  FoundryVTT Arms Reach

**I will probably change the name to 'FoundryVTT Door little Utilities' when i rewrite everything for the 0.8.X**

This is project is born like a upgrade of the project [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny), in preparation of foundry vtt 0.8.0, but after a while i put some feature here and there and now i got something a little more complex.

There are more than 300 modules in foundry vtt so the scope of this module is to reduce the number of modules on your game and integrate them with each other without some strange collision between modules.

You can still enable/disable every single feature from module settings.
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

Every feature can be enable/disable from module settings

**Arms Reach Feature**

The interaction distance is measure by the distance between a token and the door. So, to interact with a door, the player need to have a token selected (or own a token).

* Enable the GM to select the maximum distance that players can interact with a door (needs a token selected) (DM bypass this limitation)

* Pressing 'e' opens/closes a door nearest of current selected token

* Holding 'e' centers the camera on current selected token

* Double tapping movement on the direction of a door will interact with it

**Ambient Door Feature**

Embedded integration of Adds easily customized sounds effects that trigger for all user when interacting with doors. Just open up a doors configuration window to initialize the set up for that door, and you'll be able to enter in the sound file pathways that you wish to play when that door; is opened, is closed, is locked, or is unlocked.

If you do not wish for any sound effect to play when an certain action is taken, just leave that specific field blank. Some default sounds have been provided.

* Doors sound Paths can now be set to "DefaultSound", that door will always use the default sounds that are currently set in the configuration window."DefaultSound" is now the default that all new configured doors are set to.

* Added an option to customize the lock jingle sound effect that plays when attempting to open a locked door. Lock jingle sound effect now players for everyone instead of just the user attempting to open the door.

* Added Silent Door Open mode, with configurable permissions, if a valid user opens a door while holding down Alt, the doors audio will not play.

**Sound previewer Feature**

* Double click on any audio file within the file picker. Sound should stop playing once a different file is chosen, the file picker is closed, or navigation changed.

**Designer Doors Feature**

You can change the default door icons used to show closed, open and locked doors. These are set through the module settings panel and will be applied to all doors that DO NOT have their own custom icons.

* This may be useful to create door control icons more appropriate to a given setting or genre of game.
* Each door can also be assigned icons specific to that door only. These are assigned in the the wall control panel.
* This allows a GM to either give a particular door unique icons (perhaps a portal or teleporter would have different icons than a normal door), or to change the feel of a particular scene (a dungeon may use different icons than an inn).

## [Changelog](./changelog.md)

## Issues

- Users should report issues to the github issues. Reaching out on Discord is a good option as well, but please follow-up with a github issue
- Try clearing all tokens using the new button before selecting/targeting other tokens. this should resolve most issues.

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/eadorin/target-enhancements/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## Credit

Thanks to anyone who helps me with this code! I appreciate the user community's feedback on this project!

- Foundry VTT discord community for always helping me out.
- [Arms Reach](https://github.com/psyny/FoundryVTT/tree/master/ArmsReach) ty to [psyny](https://github.com/psyny)
- [Ambient Doors](https://github.com/EndlesNights/ambientdoors) ty to [EndlesNights](https://github.com/EndlesNights)
- [Sound Previewer](https://github.com/matthewswar/foundry-vtt-sound-previewer) ty to [matthewswar](https://github.com/matthewswar)
- [Designer Doors](https://github.com/Exitalterego/designerdoors) ty to [Exitalterego](https://github.com/Exitalterego)
- [Designer Windows](https://github.com/Exitalterego/designerwindows) ty to [Exitalterego](https://github.com/Exitalterego)
## License
This Foundry VTT module is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).
This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development v 0.1.6](http://foundryvtt.com/pages/license.html).

## Acknowledgements

Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Mad props to the 'League of Extraordinary FoundryVTT Developers' community which helped me figure out a lot.


