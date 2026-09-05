import { v7 as uuidV7 } from 'uuid';

import {  ValueType, ValueTypeID } from '../../db/types/types';
import { AppState } from './appState';

export function newValueType(state: AppState): ValueType {
  const newVT: ValueType = {
    id: uuidV7(),
    description: '',
    serde: 'string',
  };

  const currentState = state.get();
  currentState.database.putValueType(newVT);
  state.notify();

  return newVT;
}

export function deleteValueType(state: AppState, id: ValueTypeID): void {
  const currentState = state.get();
  currentState.database.deleteValueType(id);
  state.notify();
}

export function setValueType(state: AppState, updatedValueType: ValueType): void {
  const currentState = state.get();
  currentState.database.putValueType(updatedValueType);
  state.notify();
}
