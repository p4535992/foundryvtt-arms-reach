import { warn } from '../foundryvtt-arms-reach';
import { ArmsReach } from './ArmsReach';
import { ARMS_REACH_MODULE_NAME, getAPI, getCanvas, getGame } from './settings';

export let socket;

if(!getGame().modules.get('socketlib')?.active){
  Hooks.once('socketlib.ready', () => {
    //@ts-ignore
    socket = socketlib.registerModule(ARMS_REACH_MODULE_NAME);
    socket.register('isReachable', _socketIsReachable);
  });
}

export function _socketIsReachable(token:Token, placeableObject:PlaceableObject, user:User):boolean {
  return getAPI().isReachable(token, placeableObject, user);
}

export function isReachable(token:Token, placeableObject:PlaceableObject, user:User):boolean {
  return socket.executeAsGM(_socketIsReachable, token, placeableObject, user).then((reachable) => reachable);
}
