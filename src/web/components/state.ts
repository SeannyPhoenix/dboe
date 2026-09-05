import { v7 } from 'uuid';

import { Value, ValueType } from './types';
import { newValue } from './value';

export type StateListener = () => void;

export type State = {
  count: number;
  items: Value[];
  valuetypes: ValueType[];
  listeners: Set<StateListener>;
  notify(): void;
};

export function createState(): State {
  const state: State = {
    count: 0,
    items: [],
    valuetypes: [],
    listeners: new Set(),
    notify() {
      this.listeners.forEach((fn) => fn());
    },
  };
  newValue(state, { type: v7(), value: 'test' });
  state.notify();
  return state;
}

export function subscribe(state: State, listener: StateListener): () => void {
  state.listeners.add(listener);
  return () => state.listeners.delete(listener);
}
