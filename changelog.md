# CHANGELOG

### 2.1.23

- Update the distance calculation
- Better design pattern for the api and the socket
- Modify some setting for better interaction

### 2.1.22

- Update labels

### 2.1.21

- Update labels

### 2.1.20

- Bug fix [[BUG] Token unable to open door unless directly in front of it](https://github.com/p4535992/foundryvtt-arms-reach/issues/43)
- Bug fix [[BUG] GM cannot interact with doors when "Notifications for failed interactions even for GM" is checked](https://github.com/p4535992/foundryvtt-arms-reach/issues/42)

### 2.1.19

- Add new feature "If no token is selected and you are a GM this feature is not activated"
- Set module setting "Disable sound of the door if is not reachable (disableDoorSound)" default value from false to true
- Add warning for "No Select More Than One Token" for avoid strange distance calculation

### 2.1.18

- add a new settings (only for door feature), disable the default door sound if is not in reach.

### 2.1.17

- Better calculation, some clean up and add reset settings ty to Haxxer

### 2.1.16

- Bug fix [[BUG] Reset door and fog bug with token attacher ](https://github.com/p4535992/foundryvtt-arms-reach/issues/39)
- Bug fix [[BUG] Close Open Doors/ Reset Doors and Fog doesn't work if doors are open](https://github.com/p4535992/foundryvtt-arms-reach/issues/33)
- Bug fix [[BUG] "reset doors and fog" feature, the doors glitch and disappear.](https://github.com/p4535992/foundryvtt-arms-reach/issues/31)
### 2.1.15

- Add Walls Reach
- Add more API
- Add bug fix for [Not working well with Doors on Diagonal walls](https://github.com/p4535992/foundryvtt-arms-reach/issues/40)

### 2.1.14

- little update for the reset fog and door feature

### 2.1.13

- Update of the calculation distance again... i'm not good to this
- Bug fix [Distance calculation for Stairways incorrect (wrong center of stairways)](https://github.com/p4535992/foundryvtt-arms-reach/issues/38)

### 2.1.12

- Some little update

### 2.1.11

- Update API

### 2.1.10

- Little bug fixing on the old tiles grid
- Small fix on measure distance calculation

### 2.1.9

- Big update of the distance calculation, based on the work done from [Haxxer](https://github.com/fantasycalendar) on the module [Item Piles](https://github.com/fantasycalendar/FoundryVTT-ItemPiles)
- Bug fix [Can "reach" further to the east](https://github.com/p4535992/foundryvtt-arms-reach/issues/28)
- Bug fix [[BUG] Token centers and placeable centers not consistent in Foundry - needs to be adjusted in module](https://github.com/p4535992/foundryvtt-arms-reach/issues/35)

### 2.1.8

- Some little rewrite on the calculation of the distance

### 2.1.7

- Update module.json to foundry version 9

### 2.1.6

- Add [CHANGELOGS & CONFLICTS](https://github.com/theripper93/libChangelogs) hooks for better management of the conflicts
- add `isReachableByIdOrName` on the api

### 2.1.5

- Bug fix [[BUG] 'e' interraction not working to open doors](https://github.com/p4535992/foundryvtt-arms-reach/issues/32)
- Updated some label

### 2.1.4

- Update API syncronization with Tagger module version 1.2.0, getByTag is not async anymore

### 2.1.3

- Bug fix api themodule tagger return a promise dha!
- Little clean up

### 2.1.2

- Add first version api

### 2.1.1

- Some bug fx
- Preparation to drawings, tiles, sounds, measure templates

### 2.1.0 [BREAKING CHANGES]

- Removed dependency on drag-ruler
- Removed dependency on socketLib
- Change the calculation distance interaction
- Removed all the deprecated hooks
- Some clean up and performance of the code

### 2.0.13

- Update some label on internazionalization

### 2.0.12 (It should work)

- Add some performance check on the setting 'hotkeyDoorInteractionCenter','hotkeyDoorInteraction','hotkeyDoorInteractionDelay', avoid to add new listener
- Try to fix [Can "reach" further to the east](https://github.com/p4535992/foundryvtt-arms-reach/issues/28)
- Remove the old settings 'enableGridlessSupport' when click the 'e' hotkey
- Remove some comment to clean up on the next release

### 2.0.11

- Little bug fix on the socket listener
- Add the first beta version of the Light Reach feature

### 2.0.10

- Added github workflow

### 2.0.9

- Add socketlib reference for solve the issue https://github.com/p4535992/foundryvtt-arms-reach/issues/26 and https://github.com/p4535992/foundryvtt-arms-reach/issues/23

### 2.0.8

- Add some check and a bug fix on measure distance

### 2.0.7

- Little fix on Token Integration Distance

### 2.0.6

- Add Token Integration Distance

### 2.0.5

- Minor bug fix
- Add prettier plugin

### 2.0.4

- Bug fix module json 

### 2.0.3

- Bug fix Journal/Note reach support

### 2.0.2

- Start Journal/Note reach support

### 2.0.1

- Some bug fix

### 2.0.0 [BREAKING CHANGES]

- Integration with [drag-ruler](https://github.com/manuelVo/foundryvtt-drag-ruler) ty to [manuelVo](https://github.com/manuelVo) version 1.8.1
- Many bug fix
- Clean up of the code

### 1.2.6

- Bug fox settig get selected token

### 1.2.5

- Upgrade to library typescript 0.8.8

### 1.2.4

- Bug fix wrong code updated to release [Fails on computeDistanceBetweenCoordinates as placeable has not _validPosition parameter](https://github.com/p4535992/foundryvtt-arms-reach/issues/22)

### 1.2.3

- Removed annoying warning [Multiple annoying warning messages when moving multiple tokens](https://github.com/p4535992/foundryvtt-arms-reach/issues/21)

### 1.2.2

- Bug fix module.json

### 1.2.1

- Bug fix [Uncaught TypeError: Cannot read property 'melee' of undefined](https://github.com/p4535992/foundryvtt-arms-reach/issues/20)
- Try to solved [As a GM, unable to lock/unlock doors](https://github.com/p4535992/foundryvtt-arms-reach/issues/19)

### 1.2.0

- Finally add some hook for external integration

### 1.1.9 [BREAKING CHANGES]

- Clean up code
- Add hooks for set a customized formula for computing the distance (for all these system i'm not supporting)
- Possible (i'm not sure 100%) bug fix of [As a GM, unable to lock/unlock doors](https://github.com/p4535992/foundryvtt-arms-reach/issues/19)

### 1.1.8

- Bug fix [Can't interact with doors when unrelated option is disabled](https://github.com/p4535992/foundryvtt-arms-reach/issues/18)

### 1.1.7

- Bug fix when a scene has no token

### 1.1.6

- Bug fixing and clean up code

### 1.1.5

- Bug fix [No sound when iunteracting with locked doors](https://github.com/p4535992/foundryvtt-arms-reach/issues/17)

### 1.1.4

- Integration of a better math formula for compute the distance

### 1.1.3

- Bug fix [Warning Msg when Ambient Doors/Designer Doors together with Arms Reach](https://github.com/p4535992/foundryvtt-arms-reach/issues/16)
- Bug fix [Bug or Feature Suggestion? - Door sounds](https://github.com/p4535992/foundryvtt-arms-reach/issues/15)

### 1.1.2

- Removed  [Ambient Doors](https://github.com/EndlesNights/ambientdoors) ty to [EndlesNights](https://github.com/EndlesNights)
- Removed  [Sound Previewer](https://github.com/matthewswar/foundry-vtt-sound-previewer) ty to [matthewswar](https://github.com/matthewswar)
- Removed  [Designer Windows](https://github.com/Exitalterego/designerwindows) ty to [Exitalterego](https://github.com/Exitalterego)
- Removed [showdooricons](https://github.com/wsaunders1014/showdooricons) ty to [wsaunders1014](https://github.com/wsaunders1014)

### 1.1.1

- Some minor fix

### 1.1.0 [BREAKING CHANGES]

- Compatibility for foundryvtt 0.8.6
- Removed desinger doors implementation use instead [Designer Doors](https://github.com/Exitalterego/designerdoors) ty to [Exitalterego](https://github.com/Exitalterego)
- 

### 1.0.14

- Convert libWrapper hook for DoorControl.prototype._onMouseDown from 'OVERRIDE' to 'MIXED' ty to Stäbchenfisch suggestion

### 1.0.13

- Bug fix [issue 8](https://github.com/p4535992/foundryvtt-arms-reach/issues/8)

### 1.0.12

- Hotfix module.json (why i'm so stupid ?)

### 1.0.11

- FInalized first integrations with [foundryvtt-stairways](https://gitlab.com/SWW13/foundryvtt-stairways)

### 1.0.10

- (Experimental) Integrations with [foundryvtt-stairways](https://gitlab.com/SWW13/foundryvtt-stairways)

### 1.0.9

- Solved [issue 5](https://github.com/p4535992/foundryvtt-arms-reach/issues/5)
- Add more Internationalization
- Add Lock Picking Sound

### 1.0.8 (Breaking Version)

- Add filepicker for Song of Ambient Door
- Add a customize (rewrite almost everything) version of the project [Designer Doors](https://github.com/Exitalterego/designerdoors) ty to [Exitalterego](https://github.com/Exitalterego)
- Bug fix: If Ambient door is disable and Arm reach is enable the sound is Broken ???
- Bug fix: Add more internationalization (not finished yet)
- Add new checkin for manage multi feature all togheter
- Add filepicker for Image of Designer Doors
- Add a customized version of the project [Sound Previewer](https://github.com/matthewswar/foundry-vtt-sound-previewer) ty to [matthewswar](https://github.com/matthewswar)
- Add a mechanism of hide and seek for on module settings when feature are enabled or disabled
- Try to integrate a customize version of module [ShowDoorIcons](https://github.com/p4535992/ShowDoorIcons) by myself

### 1.0.7

- Add preview to sound file [Sound Previewer](https://github.com/matthewswar/foundry-vtt-sound-previewer) ty to [matthewswar](https://github.com/matthewswar)

### 1.0.6

- Hot fix Add new settings for use the owned tokens if no tokens is selected, if no token is selected i will try to get a owned token, you can disable this feature on the module settings if you like the old behaviour.

### 1.0.5 

- Bug fixing for 'e' keyboard event
- Add Internationalization
- The sound of the door is bugged i solved by integratig the module [Ambient Doors](https://github.com/EndlesNights/ambientdoors) ty to [EndlesNights](https://github.com/EndlesNights)

### 1.0.4

- Remove shim.js of lib-wrapper, just use the module
- Bug fix for [BUG: If out of reach, door still opens, revealing vision](https://github.com/p4535992/foundryvtt-arms-reach/issues/1)
- Add new settings for avoid deselects the controlled token when open/close the door

### 1.0.3

- Converted the project on typescript and Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).
- Some minor bug fix

### 1.0.2

- Some bug fix

### 1.0.0

- Original project by Psyny
