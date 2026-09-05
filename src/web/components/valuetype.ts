import { v7 as uuidV7 } from 'uuid';

import { State } from './state';
import { SerDe, ValueType, ValueTypeID } from './types';

export function newValueType(state: State): ValueType {
  const newVT: ValueType = {
    id: uuidV7(),
    description: '',
    serde: 'string',
  };

  const currentState = state.get();
  currentState.valuetypes.push(newVT);
  state.notify();

  return newVT;
}

export function deleteValueType(state: State, id: ValueTypeID): void {
  const currentState = state.get();
  const index = currentState.valuetypes.findIndex((vt) => vt.id === id);
  if (index !== -1) {
    currentState.valuetypes.splice(index, 1);
    state.notify();
  }
}

export function setValueType(state: State, updatedValueType: ValueType): void {
  const currentState = state.get();
  const index = currentState.valuetypes.findIndex((vt) => vt.id === updatedValueType.id);
  if (index !== -1) {
    currentState.valuetypes[index] = updatedValueType;
    state.notify();
  }
}
