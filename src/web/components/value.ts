import { v7 as uuidV7 } from 'uuid';

import { Value, ValueID } from '../../db/types/types';
import type { AppState } from './appState';

type ValueComponents = {
  entity?: string;
  type: string;
  value: unknown;
};

export function newValue(state: AppState, { entity, type, value }: ValueComponents): Value {
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

  const currentState = state.get();
  currentState.database.putValue(newVal);
  state.notify();

  return newVal;
}

export function deleteValue(state: AppState, id: ValueID): void {
  const currentState = state.get();
  currentState.database.deleteValue(id);
  state.notify();
}
