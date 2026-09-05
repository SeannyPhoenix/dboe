export type Listener = () => void;

export interface Reactive<T> {
  get(): T;
  set(value: T): void;
  update(fn: (state: T) => T): void;
  subscribe(listener: Listener): () => void;
  notify(): void;
}

export function createReactive<T>(initialState: T): Reactive<T> {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    get() {
      return state;
    },
    set(value: T) {
      state = value;
      this.notify();
    },
    update(fn: (s: T) => T) {
      state = fn(state);
      this.notify();
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    notify() {
      listeners.forEach((fn) => fn());
    },
  };
}
