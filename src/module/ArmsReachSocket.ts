import { warn } from '../foundryvtt-arms-reach';
import { ARMS_REACH_MODULE_NAME, getCanvas, getGame } from './settings';

export let socket;

export function recalculate(tokens) {
  socket.executeForEveryone(_socketRecalculate, tokens ? tokens.map((token) => token.id) : undefined);
}

export function _socketRecalculate(tokenIds) {
  // DO NOTHING JUST REGISTER THE SOCKET FOR A STRANGE BUG WITH SOCKETLIB ?
  //@ts-ignore
  // return getCanvas().controls?.ruler?.dragRulerRecalculate(tokenIds);
}
