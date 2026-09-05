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

        <div class="vt-list">
          {state.valuetypes.map((vt, index) => (
            <div class="vt-row">
              <div class="vt-serde">
                <strong>SerDe:</strong> {vt.serde}
              </div>
              <div class="vt-desc">
                <strong>Description:</strong> {vt.description}
              </div>
              <button
                class="vt-btn"
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
