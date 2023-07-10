export default async function registerTypes(register) {
  fetch("modules/arms-reach/typings/types.d.ts")
    .then((response) => response.text())
    .then((content) => register("arms-reach/types.d.ts", content));
}
