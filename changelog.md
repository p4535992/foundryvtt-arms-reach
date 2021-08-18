# CHANGELOG

# 2.0.4

- Bug fix module json 

# 2.0.3

- Bug fix Journal/Note reach support

# 2.0.2

- Start Journal/Note reach support

# 2.0.1

- Some bug fix

# 2.0.0 [BREAKING CHANGES]

- Integration with [drag-ruler](https://github.com/manuelVo/foundryvtt-drag-ruler) ty to [manuelVo](https://github.com/manuelVo) version 1.8.1
- Many bug fix
- Clean up of the code

# 1.2.6

- Bug fox settig get selected token

# 1.2.5

- Upgrade to library typescript 0.8.8

# 1.2.4

- Bug fix wrong code updated to release [Fails on computeDistanceBetweenCoordinates as placeable has not _validPosition parameter](https://github.com/p4535992/foundryvtt-arms-reach/issues/22)
# 1.2.3

- Removed annoying warning [Multiple annoying warning messages when moving multiple tokens](https://github.com/p4535992/foundryvtt-arms-reach/issues/21)

# 1.2.2

- Bug fix module.json

# 1.2.1

- Bug fix [Uncaught TypeError: Cannot read property 'melee' of undefined](https://github.com/p4535992/foundryvtt-arms-reach/issues/20)
- Try to solved [As a GM, unable to lock/unlock doors](https://github.com/p4535992/foundryvtt-arms-reach/issues/19)

# 1.2.0

- Finally add some hook for external integration

# 1.1.9 [BREAKING CHANGES]

- Clean up code
- Add hooks for set a customized formula for computing the distance (for all these system i'm not supporting)
- Possible (i'm not sure 100%) bug fix of [As a GM, unable to lock/unlock doors](https://github.com/p4535992/foundryvtt-arms-reach/issues/19)
# 1.1.8

- Bug fix [Can't interact with doors when unrelated option is disabled](https://github.com/p4535992/foundryvtt-arms-reach/issues/18)

# 1.1.7

- Bug fix when a scene has no token

# 1.1.6

- Bug fixing and clean up code

# 1.1.5

- Bug fix [No sound when iunteracting with locked doors](https://github.com/p4535992/foundryvtt-arms-reach/issues/17)

# 1.1.4

- Integration of a better math formula for compute the distance

# 1.1.3

- Bug fix [Warning Msg when Ambient Doors/Designer Doors together with Arms Reach](https://github.com/p4535992/foundryvtt-arms-reach/issues/16)
- Bug fix [Bug or Feature Suggestion? - Door sounds](https://github.com/p4535992/foundryvtt-arms-reach/issues/15)

# 1.1.2

- Removed  [Ambient Doors](https://github.com/EndlesNights/ambientdoors) ty to [EndlesNights](https://github.com/EndlesNights)
- Removed  [Sound Previewer](https://github.com/matthewswar/foundry-vtt-sound-previewer) ty to [matthewswar](https://github.com/matthewswar)
- Removed  [Designer Windows](https://github.com/Exitalterego/designerwindows) ty to [Exitalterego](https://github.com/Exitalterego)
- Removed [showdooricons](https://github.com/wsaunders1014/showdooricons) ty to [wsaunders1014](https://github.com/wsaunders1014)

# 1.1.1

- Some minor fix

# 1.1.0 [BREAKING CHANGES]

- Compatibility for foundryvtt 0.8.6
- Removed desinger doors implementation use instead [Designer Doors](https://github.com/Exitalterego/designerdoors) ty to [Exitalterego](https://github.com/Exitalterego)
- 

# 1.0.14

- Convert libWrapper hook for DoorControl.prototype._onMouseDown from 'OVERRIDE' to 'MIXED' ty to Stäbchenfisch suggestion

# 1.0.13

- Bug fix [issue 8](https://github.com/p4535992/foundryvtt-arms-reach/issues/8)

# 1.0.12

- Hotfix module.json (why i'm so stupid ?)

# 1.0.11

- FInalized first integrations with [foundryvtt-stairways](https://gitlab.com/SWW13/foundryvtt-stairways)

# 1.0.10

- (Experimental) Integrations with [foundryvtt-stairways](https://gitlab.com/SWW13/foundryvtt-stairways)

# 1.0.9

- Solved [issue 5](https://github.com/p4535992/foundryvtt-arms-reach/issues/5)
- Add more Internationalization
- Add Lock Picking Sound

# 1.0.8 (Breaking Version)

- Add filepicker for Song of Ambient Door
- Add a customize (rewrite almost everything) version of the project [Designer Doors](https://github.com/Exitalterego/designerdoors) ty to [Exitalterego](https://github.com/Exitalterego)
- Bug fix: If Ambient door is disable and Arm reach is enable the sound is Broken ???
- Bug fix: Add more internationalization (not finished yet)
- Add new checkin for manage multi feature all togheter
- Add filepicker for Image of Designer Doors
- Add a customized version of the project [Sound Previewer](https://github.com/matthewswar/foundry-vtt-sound-previewer) ty to [matthewswar](https://github.com/matthewswar)
- Add a mechanism of hide and seek for on module settings when feature are enabled or disabled
- Try to integrate a customize version of module [ShowDoorIcons](https://github.com/p4535992/ShowDoorIcons) by myself

# 1.0.7

- Add preview to sound file [Sound Previewer](https://github.com/matthewswar/foundry-vtt-sound-previewer) ty to [matthewswar](https://github.com/matthewswar)

# 1.0.6

- Hot fix Add new settings for use the owned tokens if no tokens is selected, if no token is selected i will try to get a owned token, you can disable this feature on the module settings if you like the old behaviour.

# 1.0.5 

- Bug fixing for 'e' keyboard event
- Add Internationalization
- The sound of the door is bugged i solved by integratig the module [Ambient Doors](https://github.com/EndlesNights/ambientdoors) ty to [EndlesNights](https://github.com/EndlesNights)

# 1.0.4

- Remove shim.js of lib-wrapper, just use the module
- Bug fix for [BUG: If out of reach, door still opens, revealing vision](https://github.com/p4535992/foundryvtt-arms-reach/issues/1)
- Add new settings for avoid deselects the controlled token when open/close the door

# 1.0.3

- Converted the project on typescript and Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).
- Some minor bug fix

# 1.0.2

- Some bug fix

# 1.0.0

- Original project by Psyny
