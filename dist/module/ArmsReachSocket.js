import { getCanvas } from "./settings.js";
export let socket;
export function recalculate(tokens) {
    socket.executeForEveryone(_socketRecalculate, tokens ? tokens.map((token) => token.id) : undefined);
}
export function _socketRecalculate(tokenIds) {
    //@ts-ignore
    return getCanvas().controls?.ruler?.dragRulerRecalculate(tokenIds);
}
