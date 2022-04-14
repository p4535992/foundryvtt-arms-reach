import { debug, warn } from './lib/lib';
import API from './api';
import { setSocket } from '../foundryvtt-arms-reach';

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: 'callHook',

  /**
   * Item pile sockets
   */

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */
};

export let armsReachSocket;

export function registerSocket() {
  debug('Registered armsReachSocket');
  if (armsReachSocket) {
    return armsReachSocket;
  }
  //@ts-ignore
  armsReachSocket = socketlib.registerModule(CONSTANTS.MODULE_NAME);

  /**
   * Generic socket
   */
  armsReachSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

  /**
   * Automated Polymorpher sockets
   */
  armsReachSocket.register('isReachable', (...args) => API.isReachableArr(...args));
  armsReachSocket.register('isReachableByTag', (...args) => API.isReachableByTagArr(...args));
  armsReachSocket.register('isReachableById', (...args) => API.isReachableByIdArr(...args));
  armsReachSocket.register('isReachableByIdOrName', (...args) => API.isReachableByIdOrNameArr(...args));

  /**
   * UI sockets
   */

  /**
   * Item & attribute sockets
   */

  /**
   * Effects
   */

  // Basic

  setSocket(armsReachSocket);
  return armsReachSocket;
}

async function callHook(inHookName, ...args) {
  const newArgs: any[] = [];
  for (let arg of args) {
    if (typeof arg === 'string') {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(inHookName, ...newArgs);
}

// export function _socketIsReachable(
//   token: Token,
//   placeableObject: PlaceableObject,
//   maxDistance?: number,
//   useGrid?: boolean,
//   userId?: string,
// ): boolean {
//   return API.isReachable(token, placeableObject, maxDistance, useGrid, userId);
// }

// export function _socketIsReachableByTag(
//   token: Token,
//   tag: string,
//   maxDistance?: number,
//   useGrid?: boolean,
//   userId?: string,
// ): boolean {
//   return API.isReachableByTag(token, tag, maxDistance, useGrid, userId);
// }

// export function _socketIsReachableById(
//   token: Token,
//   placeableObjectId: string,
//   maxDistance?: number,
//   useGrid?: boolean,
//   userId?: string,
// ): boolean {
//   return API.isReachableById(token, placeableObjectId, maxDistance, useGrid, userId);
// }

// export function _socketIsReachableByIdOrName(
//   token: Token,
//   placeableObjectIdOrName: string,
//   maxDistance?: number,
//   useGrid?: boolean,
//   userId?: string,
// ): boolean {
//   return API.isReachableByIdOrName(token, placeableObjectIdOrName, maxDistance, useGrid, userId);
// }

// export function isReachable(
//   token: Token,
//   placeableObject: PlaceableObject,
//   maxDistance?: number,
//   useGrid?: boolean,
//   userId?: string,
// ): boolean {
//   return armsReachSocket
//     .executeAsGM(_socketIsReachable, token, placeableObject, maxDistance, useGrid, userId)
//     .then((reachable) => reachable);
// }

// export function isReachableByTag(
//   token: Token,
//   tag: string,
//   maxDistance?: number,
//   useGrid?: boolean,
//   userId?: string,
// ): boolean {
//   return armsReachSocket
//     .executeAsGM(_socketIsReachableByTag, token, tag, maxDistance, useGrid, userId)
//     .then((reachable) => reachable);
// }

// export function isReachableById(
//   token: Token,
//   placeableObjectId: string,
//   maxDistance?: number,
//   useGrid?: boolean,
//   userId?: string,
// ): boolean {
//   return armsReachSocket
//     .executeAsGM(_socketIsReachableById, token, placeableObjectId, maxDistance, useGrid, userId)
//     .then((reachable) => reachable);
// }

// export function isReachableByIdOrName(
//   token: Token,
//   placeableObjectIdOrName: string,
//   maxDistance?: number,
//   useGrid?: boolean,
//   userId?: string,
// ): boolean {
//   return armsReachSocket
//     .executeAsGM(_socketIsReachableByIdOrName, token, placeableObjectIdOrName, maxDistance, useGrid, userId)
//     .then((reachable) => reachable);
// }
