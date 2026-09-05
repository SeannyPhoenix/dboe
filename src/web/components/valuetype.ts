import { v7 as uuidV7 } from 'uuid';

import { State } from './state';
import { ValueType } from './types';
export function newValueType(
  state: State,
  { description, serde }: Omit<ValueType, 'id'>,
): ValueType {
  const newVT = {
    id: uuidV7(),
    description,
    serde,
  };

  state.valuetypes.push(newVT);
  state.notify();

  return newVT;
}

export function deleteValueType(state: State, index: number): void {
  state.valuetypes.splice(index, 1);
  state.notify();
}
