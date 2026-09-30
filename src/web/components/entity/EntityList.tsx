import { getAppState } from '../../appState/appState';
import EntityDisplay from './EntityDisplay';

export default function EntityList() {
  const { index } = getAppState().get();

  const entities = index.getAllEntities();

  return (
    <div>
      {entities.map((entity) => (
        <EntityDisplay entity={entity} />
      ))}
    </div>
  );
}
