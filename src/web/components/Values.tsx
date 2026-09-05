import { v7 as uuidV7 } from 'uuid';

import { State, subscribe } from './state';
import { newValue, deleteValue } from './value';

export default function Values({ state }: { state: State }) {
  const container = document.createElement('div');

  function render() {
    container.innerHTML = '';

    container.append(
      <>
        <button
          onclick={() => {
            newValue(state, { type: uuidV7(), value: `item-${Date.now()}` });
          }}
        >
          Add New Value
        </button>

        <div>
          {state.items.map((item, index) => (
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
                  deleteValue(state, index);
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </>,
    );
  }

  subscribe(state, render);
  render();

  return container;
}
