import { debug, warn } from "./lib/lib.mjs";
import API from "./api.mjs";
import { setSocket } from "../module.js";

export const SOCKET_HANDLERS = {
  /**
   * Generic sockets
   */
  CALL_HOOK: "callHook",

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
  debug("Registered armsReachSocket");
  if (armsReachSocket) {
    return armsReachSocket;
  }
  //@ts-ignore
  armsReachSocket = socketlib.registerModule(CONSTANTS.MODULE_ID);

  /**
   * Generic socket
   */
  armsReachSocket.register(SOCKET_HANDLERS.CALL_HOOK, (hook, ...args) => callHook(hook, ...args));

  /**
   * Automated Polymorpher sockets
   */
  armsReachSocket.register("isReachable", (...args) => API.isReachableArr(...args));
  armsReachSocket.register("isReachableByTag", (...args) => API.isReachableByTagArr(...args));
  armsReachSocket.register("isReachableById", (...args) => API.isReachableByIdArr(...args));
  armsReachSocket.register("isReachableByIdOrName", (...args) => API.isReachableByIdOrNameArr(...args));

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
  const newArgs = [];
  for (let arg of args) {
    if (typeof arg === "string") {
      const testArg = await fromUuid(arg);
      if (testArg) {
        arg = testArg;
      }
    }
    newArgs.push(arg);
  }
  return Hooks.callAll(inHookName, ...newArgs);
}
