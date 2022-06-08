export const states = {
  DOWN: 'down',
  UP: 'up',
};

class Keyboard {
  _keyStates: Map<string, string>;
  _hooks: Map<string, Function[]>;
  _hookList: Map<string, Function[]>;

  constructor() {
    this._keyStates = new Map<string, string>();
    this._hooks = new Map<string, any[]>();
  }

  addHook(key: string, func: Function) {
    const hookList = <any[]>(this._hooks.has(key) ? this._hooks.get(key) : []);
    hookList.push(func);
    this._hooks.set(key, hookList);
  }

  clearHooks() {
    this._hookList = new Map<string, any[]>();
  }

  isDown(key) {
    return this._keyStates.has(key) && this._keyStates.get(key) === states.DOWN;
  }

  _keyDownListener(event) {
    this._keyStates.set(event.key, states.DOWN);
    if (this._hooks.has(event.key)) {
      for (const func of <Function[]>this._hooks.get(event.key)) {
        func(event, states.DOWN);
      }
    }
  }

  _keyUpListener(event) {
    this._keyStates.set(event.key, states.UP);
    if (this._hooks.has(event.key)) {
      for (const func of <Function[]>this._hooks.get(event.key)) {
        func(event, states.UP);
      }
    }
  }
}

export const keyboard = new Keyboard();

document.addEventListener('keydown', keyboard._keyDownListener.bind(keyboard));
document.addEventListener('keyup', keyboard._keyUpListener.bind(keyboard));
