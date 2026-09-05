import { v7 } from 'uuid';

import { createReactive, type Reactive } from '../reactive/reactive';
import { Value, ValueType } from './types';
import { newValue } from './value';

export type StateListener = () => void;

export type StateData = {
  count: number;
  items: Value[];
  valuetypes: ValueType[];
};

export type State = Reactive<StateData>;

export function createState(): State {
  return createReactive<StateData>({
    count: 0,
    items: [],
    valuetypes: [],
  });
}
