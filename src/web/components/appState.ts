import { Database } from '../../db/localStorage/database';
import { createReactive, type Reactive } from '../reactive/reactive';

export type AppStateData = {
  database: Database;
};

export type AppState = Reactive<AppStateData>;

export function initAppState(): AppState {
  const stateData: AppStateData = {
    database: new Database(),
  };
  const state = createReactive(stateData);
  state.subscribe(() => state.get().database.save());
  return state;
}
