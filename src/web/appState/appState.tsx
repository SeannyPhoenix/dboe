import { DBIndex } from '../../db/DBIndex/DBIndex';
import { Database } from '../../db/localStorage/database';
import { createReactive, type Reactive } from '../reactive/reactive';

export type AppStateData = {
  database: Database;
  index: DBIndex;
};

export type AppState = Reactive<AppStateData>;

function initAppState(): AppState {
  const legacyDB = new Database();
  const index = new DBIndex();

  index.addTombstones([]);
  index.addValueTypes(legacyDB.getAllValueTypes());
  index.addValues(legacyDB.getAllValues());
  index.log();

  const stateData: AppStateData = {
    database: legacyDB,
    index,
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
