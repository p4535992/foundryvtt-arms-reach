import { warn } from '../foundryvtt-arms-reach';
import { ArmsReach } from './ArmsReach';
import { ARMS_REACH_MODULE_NAME, getAPI, getCanvas, getGame } from './settings';

export let socket;

Hooks.once('ready', async () => {
  if (!getGame().modules.get('socketlib')?.active) {
    Hooks.once('socketlib.ready', () => {
      //@ts-ignore
      socket = socketlib.registerModule(ARMS_REACH_MODULE_NAME);
      socket.register('isReachable', _socketIsReachable);
      socket.register('isReachableByTag', _socketIsReachableByTag);
      socket.register('isReachableById', _socketIsReachableById);
    });
  }
});

export function _socketIsReachable(token: Token, placeableObject: PlaceableObject, userId?: string): boolean {
  return getAPI().isReachable(token, placeableObject, userId);
}

export async function _socketIsReachableByTag(token: Token, tag: string, userId?: string): Promise<boolean> {
  return getAPI().isReachableByTag(token, tag, userId);
}

export function _socketIsReachableById(token: Token, placeableObjectId: string, userId?: string): boolean {
  return getAPI().isReachableById(token, placeableObjectId, userId);
}

export function isReachable(token: Token, placeableObject: PlaceableObject, userId: string): boolean {
  return socket.executeAsGM(_socketIsReachable, token, placeableObject, userId).then((reachable) => reachable);
}

export function isReachableByTag(token: Token, tag: string, userId: string): boolean {
  return socket.executeAsGM(_socketIsReachableByTag, token, tag, userId).then((reachable) => reachable);
}

export function isReachableById(token: Token, placeableObjectId: string, userId: string): boolean {
  return socket.executeAsGM(_socketIsReachableById, token, placeableObjectId, userId).then((reachable) => reachable);
}
