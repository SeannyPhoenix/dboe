import { v7 as uuidV7 } from 'uuid';

import { Value, ValueID, EntityID } from '../../db/types/types';
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

export function updateValue(state: AppState, updatedValue: Value): void {
  const currentState = state.get();
  currentState.database.putValue(updatedValue);
  state.notify();
}

export function deleteValue(state: AppState, id: ValueID): void {
  const currentState = state.get();
  currentState.database.deleteValue(id);
  state.notify();
}

export function getAllEntities(state: AppState): EntityID[] {
  const values = state.get().database.getAllValues();
  const entitySet = new Set(values.map((v) => v.entity));
  return Array.from(entitySet) as EntityID[];
}

export function getValueTypeSerDe(state: AppState, typeId: string): string | undefined {
  const valueType = state.get().database.getValueType(typeId as any);
  return valueType?.serde;
}
