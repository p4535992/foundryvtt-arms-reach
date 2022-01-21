import { warn } from '../foundryvtt-arms-reach';
import { ArmsReach } from './ArmsReachApi';
import { ARMS_REACH_MODULE_NAME, getAPI } from './settings';
import { canvas, game } from './settings';

export let armsReachSocket;

Hooks.once('ready', async () => {
  if (!game.modules.get('socketlib')?.active) {
    Hooks.once('socketlib.ready', () => {
      //@ts-ignore
      armsReachSocket = socketlib.registerModule(ARMS_REACH_MODULE_NAME);
      armsReachSocket.register('isReachable', _socketIsReachable);
      armsReachSocket.register('isReachableByTag', _socketIsReachableByTag);
      armsReachSocket.register('isReachableById', _socketIsReachableById);
      armsReachSocket.register('isReachableByIdOrName', _socketIsReachableByIdOrName);
    });
  }
});

export function _socketIsReachable(
  token: Token,
  placeableObject: PlaceableObject,
  maxDistance?: number,
  useGrid?: boolean,
  userId?: string,
): boolean {
  return getAPI().isReachable(token, placeableObject, maxDistance, useGrid, userId);
}

export function _socketIsReachableByTag(
  token: Token,
  tag: string,
  maxDistance?: number,
  useGrid?: boolean,
  userId?: string,
): boolean {
  return getAPI().isReachableByTag(token, tag, maxDistance, useGrid, userId);
}

export function _socketIsReachableById(
  token: Token,
  placeableObjectId: string,
  maxDistance?: number,
  useGrid?: boolean,
  userId?: string,
): boolean {
  return getAPI().isReachableById(token, placeableObjectId, maxDistance, useGrid, userId);
}

export function _socketIsReachableByIdOrName(
  token: Token,
  placeableObjectIdOrName: string,
  maxDistance?: number,
  useGrid?: boolean,
  userId?: string,
): boolean {
  return getAPI().isReachableByIdOrName(token, placeableObjectIdOrName, maxDistance, useGrid, userId);
}

export function isReachable(
  token: Token,
  placeableObject: PlaceableObject,
  maxDistance?: number,
  useGrid?: boolean,
  userId?: string,
): boolean {
  return armsReachSocket
    .executeAsGM(_socketIsReachable, token, placeableObject, maxDistance, useGrid, userId)
    .then((reachable) => reachable);
}

export function isReachableByTag(
  token: Token,
  tag: string,
  maxDistance?: number,
  useGrid?: boolean,
  userId?: string,
): boolean {
  return armsReachSocket
    .executeAsGM(_socketIsReachableByTag, token, tag, maxDistance, useGrid, userId)
    .then((reachable) => reachable);
}

export function isReachableById(
  token: Token,
  placeableObjectId: string,
  maxDistance?: number,
  useGrid?: boolean,
  userId?: string,
): boolean {
  return armsReachSocket
    .executeAsGM(_socketIsReachableById, token, placeableObjectId, maxDistance, useGrid, userId)
    .then((reachable) => reachable);
}

export function isReachableByIdOrName(
  token: Token,
  placeableObjectIdOrName: string,
  maxDistance?: number,
  useGrid?: boolean,
  userId?: string,
): boolean {
  return armsReachSocket
    .executeAsGM(_socketIsReachableByIdOrName, token, placeableObjectIdOrName, maxDistance, useGrid, userId)
    .then((reachable) => reachable);
}
