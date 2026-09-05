import { SerDe, ValueType } from '../../../db/types/types';
import { reactiveComponent } from '../../reactive/component';
import { createReactive } from '../../reactive/reactive';
import { DB } from '../appState';
import { setValueType } from '../valuetype';
import { deleteValueType } from '../valuetype';

type Props = {
  state: DB;
  valueType: ValueType;
};

export function ValueTypeDisplay({ state, valueType }: Props) {
  const shouldEdit = createReactive(false);
  const currentValueType = createReactive(valueType);
  const formState = createReactive({
    description: valueType.description,
    serde: valueType.serde as SerDe,
  });

  // Manually manage form state sync when entering edit mode
  shouldEdit.subscribe(() => {
    if (shouldEdit.get()) {
      const current = currentValueType.get();
      formState.set({
        description: current.description,
        serde: current.serde,
      });
    }
  });

  return reactiveComponent([state, shouldEdit], () => {
    const isEditing = shouldEdit.get();
    const { description, serde } = formState.get();

    return (
      <div class="vt-row">
        <div class="vt-serde">
          {isEditing
            ? (() => {
                const select = (
                  <select
                    onchange={(e) => {
                      formState.update((f) => ({
                        ...f,
                        serde: (e.target as HTMLSelectElement).value as SerDe,
                      }));
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
            : currentValueType.get().serde}
        </div>
        <div class="vt-desc">
          {isEditing ? (
            <input
              type="text"
              value={description}
              placeholder="Description"
              oninput={(e) => {
                formState.update((f) => ({
                  ...f,
                  description: (e.target as HTMLInputElement).value,
                }));
              }}
            />
          ) : (
            currentValueType.get().description
          )}
        </div>
        {isEditing ? (
          <button
            class="vt-btn"
            onclick={() => {
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
              const formValues = formState.get();
              currentValueType.set({
                ...currentValueType.get(),
                ...formValues,
              });
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
      </div>
    );
  });
}
