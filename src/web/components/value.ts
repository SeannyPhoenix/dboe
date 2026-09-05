import { v7 as uuidV7 } from 'uuid';

import { State } from './state';
import { Value } from './types';

type ValueComponents = {
  entity?: string;
  type: string;
  value: unknown;
};

export function newValue(state: State, { entity, type, value }: ValueComponents): Value {
  if (!entity) {
    entity = uuidV7();
  }

  const newVal = {
    id: uuidV7(),
    timestamp: new Date(),
    entity,
    type,
    value,
  };

  state.items.push(newVal);
  state.notify();

  return newVal;
}

export function deleteValue(state: State, index: number): void {
  state.items.splice(index, 1);
  state.notify();
}