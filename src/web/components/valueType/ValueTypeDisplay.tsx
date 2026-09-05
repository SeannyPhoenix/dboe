import { reactiveComponent } from '../../reactive/component';
import { createReactive } from '../../reactive/reactive';
import { State } from '../state';
import { SerDe, ValueType } from '../types';
import { setValueType } from '../valuetype';
import { deleteValueType } from '../valuetype';

type Props = {
  state: State;
  valueType: ValueType;
};

export function ValueTypeDisplay({ state, valueType }: Props) {
  const shouldEdit = createReactive(false);
  const currentValueType = createReactive(valueType);

  return reactiveComponent([state, shouldEdit], () => {
    const isEditing = shouldEdit.get();
    const { description, serde } = currentValueType.get();

    return (
      <div class="vt-row">
        <>
          <div class="vt-serde">
            {isEditing
              ? (() => {
                const select = (
                  <select
                    onchange={(e) => {
                      const serde = (e.target as HTMLSelectElement).value as SerDe;
                      currentValueType.update((vt) => ({ ...vt, serde: serde }));
                    }}
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                  </select>
                ) as HTMLSelectElement;
                select.value = serde;
                return select;
              })()
              : serde}
          </div>
          <div class="vt-desc">
            {isEditing ? (
              <input
                type="text"
                value={description}
                placeholder="Description"
                oninput={(e) => {
                  const description = (e.target as HTMLInputElement).value;
                  currentValueType.update((vt) => ({ ...vt, description }));
                }}
              />
            ) : (
              description
            )}
          </div>
          {isEditing ? (
            <button
              class="vt-btn"
              onclick={() => {
                currentValueType.set(valueType);
                shouldEdit.set(false);
              }}
            >
              Cancel
            </button>
          ) : (
            <button
              class="vt-btn"
              onclick={() => {
                shouldEdit.set(true);
              }}
            >
              Edit
            </button>
          )}
          {isEditing ? (
            <button
              class="vt-btn"
              onclick={() => {
                shouldEdit.set(false);
                setValueType(state, currentValueType.get());
              }}
            >
              Save
            </button>
          ) : (
            <button
              class="vt-btn"
              onclick={() => {
                deleteValueType(state, currentValueType.get().id);
              }}
            >
              Delete
            </button>
          )}
        </>
      </div>
    );
  });
}
