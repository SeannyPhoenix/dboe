import { getAppState } from '../../appState/appState';
import EntityDisplay from './EntityDisplay';

export default function EntityList() {
  const { index } = getAppState().get();

  const entities = index.getAllEntities();

  return (
    <div class="entity-list">
      {entities.map((entity) => <EntityDisplay entity={entity} />).toArray()}
    </div>
  );
}
