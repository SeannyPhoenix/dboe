import { v7 as uuidV7 } from 'uuid';

import { reactiveComponent } from '../../reactive/component';
import { AppState } from '../appState';
import { newValue, deleteValue } from '../value';

export default function Values({ state }: { state: AppState }) {
  return reactiveComponent([state], () => {
    return (
      <>
        <button
          onclick={() => {
            newValue(state, { type: "01a072b6-0ffb-758b-a6d9-4c4f4336be8a", value: `item-${Date.now()}` });
          }}
        >
          Add New Value
        </button>
        <div>
          {state.get().database.getAllValues().map((item) => (
            <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <p>
                <strong>Entity:</strong> {item.entity}
              </p>
              <p>
                <strong>Type:</strong> {item.type}
              </p>
              <p>
                <strong>Value:</strong> {String(item.value)}
              </p>
              <p>
                <strong>Timestamp:</strong> {item.timestamp.toString()}
              </p>
              <button
                onclick={() => {
                  deleteValue(state, item.id);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </>
    );
  });
}
