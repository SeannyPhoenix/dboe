import { Database } from '../../db/localStorage/database';
import { createReactive, type Reactive } from '../reactive/reactive';

export type AppStateData = {
  database: Database;
};

export type AppState = Reactive<AppStateData>;

function initAppState(): AppState {
  const stateData: AppStateData = {
    database: new Database(),
  };
  const state = createReactive(stateData);
  state.subscribe(() => state.get().database.save());
  return state;
}

const appState = initAppState();

export function getAppState(): AppState {
  return appState;
}

export function exportDatabase() {
  const state = getAppState();
  const data = JSON.stringify(state.get().database.getData());
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const name = `DBOE ${new Date().toISOString()}.json`;
  const a = (<a href={url} download={name} />) as HTMLAnchorElement;
  a.click();
  URL.revokeObjectURL(url);
}
