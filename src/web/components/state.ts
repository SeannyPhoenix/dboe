import { createReactive, type Reactive } from '../reactive/reactive';
import { Value, ValueType } from './types';

export type StateListener = () => void;

export type StateData = {
  items: Value[];
  valuetypes: ValueType[];
};

export type State = Reactive<StateData>;

const defaultState: StateData = {
  items: [],
  valuetypes: [],
};

export function initState(): State {
  const savedState: Partial<StateData> = loadState();
  const state = createReactive({ ...defaultState, ...savedState });
  state.subscribe(() => {
    persistState(state.get());
  });
  return state;
}

function loadState(): Partial<StateData> {
  const data = localStorage.getItem('appState');
  return data ? JSON.parse(data) : {};
}

export function persistState(state: StateData) {
  localStorage.setItem('appState', JSON.stringify(state));
}
