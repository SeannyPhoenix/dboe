import { State, subscribe } from './state';
import { newValueType, deleteValueType } from './valuetype';

export default function ValueTypes({ state }: { state: State }) {
  const container = document.createElement('div');

  function render() {
    container.innerHTML = '';

    container.append(
      <>
        <button
          onclick={() => {
            newValueType(state, { description: `type-${Date.now()}`, serde: 'string' });
          }}
        >
          Add New Value Type
        </button>

        <div>
          {state.valuetypes.map((vt, index) => (
            <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <p>
                <strong>ID:</strong> {vt.id}
              </p>
              <p>
                <strong>Description:</strong> {vt.description}
              </p>
              <p>
                <strong>SerDe:</strong> {vt.serde}
              </p>
              <button
                onclick={() => {
                  deleteValueType(state, index);
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
