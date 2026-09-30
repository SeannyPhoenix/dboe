import { v7 as uuidV7 } from 'uuid';

import { Value } from '../../../db/types/types';
import { getAppState } from '../../appState/appState';
import { reactiveComponent } from '../../reactive/component';
import { createReactive } from '../../reactive/reactive';
import { InputText, InputNumber, InputCheckbox } from '../form/input/Input';
import { Select, SelectOption } from '../form/select/Select';
import { updateValue, deleteValue, getAllEntities, getValueTypeSerDe } from '../value';

type Props = {
  value: Value;
  isDraft?: boolean;
  onSaveDraft?: () => void;
  onDiscardDraft?: () => void;
};

export function ValueDisplay({ value, isDraft = false, onSaveDraft, onDiscardDraft }: Props) {
  const state = getAppState();

  const shouldEdit = createReactive(isDraft);
  const currentValue = createReactive(value);

  // Individual reactive fields for the form
  const entityState = createReactive(value.entity);
  const typeState = createReactive(value.type);
  const valueState = createReactive<unknown>(value.value);

  // Reset form state when entering edit mode
  shouldEdit.subscribe(() => {
    if (shouldEdit.get()) {
      const current = currentValue.get();
      entityState.set(current.entity);
      typeState.set(current.type);
      valueState.set(current.value);
    }
  });

  // Helper to get all value types as options
  const getValueTypeOptions = (): SelectOption[] => {
    return state
      .get()
      .database.getAllValueTypes()
      .map((vt) => ({
        label: vt.description,
        value: vt.id,
      }));
  };


  // Helper to render the appropriate input based on SerDe type
  const renderValueInput = () => {
    const serde = getValueTypeSerDe(state, typeState.get());
    if (!serde) return <span>Select a type first</span>;

    switch (serde) {
      case 'string':
        return InputText(valueState as any);
      case 'number':
        return InputNumber(valueState as any);
      case 'boolean':
        return InputCheckbox(valueState as any);
      default:
        return <span>Unknown type: {serde}</span>;
    }
  };

  const saveDeleteButton = (
    <button
      class="vt-btn"
      onclick={function () {
        switch (shouldEdit.get()) {
          case true:
            shouldEdit.set(false);
            const updated = {
              ...currentValue.get(),
              entity: entityState.get(),
              type: typeState.get(),
              value: valueState.get(),
            };
            currentValue.set(updated);
            updateValue(state, updated);
            if (isDraft && onSaveDraft) {
              onSaveDraft();
            }
            break;
          case false:
            deleteValue(state, currentValue.get().id);
            break;
        }
      }}
    >
      {shouldEdit.get() ? 'Save' : 'Delete'}
    </button>
  ) as HTMLButtonElement;

  shouldEdit.subscribe(() => {
    const label = shouldEdit.get() ? 'Save' : 'Delete';
    if (saveDeleteButton.innerText !== label) {
      saveDeleteButton.innerText = label;
    }
  });

  return reactiveComponent([state, shouldEdit], () => {
    const isEditing = shouldEdit.get();
    const current = currentValue.get();

    return (
      <div class="vt-row">
        <div class="vt-type">
          {isEditing && isDraft
            ? Select(typeState, getValueTypeOptions())
            : state.get().database.getValueType(current.type)?.description || current.type}
        </div>
        <div class="vt-value">
          {isEditing ? renderValueInput() : String(current.value) || <i>empty</i>}
        </div>
        <button
          class="vt-btn"
          onclick={() => {
            if (isEditing && isDraft && onDiscardDraft) {
              onDiscardDraft();
            }
            shouldEdit.set(!isEditing);
          }}
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
        {saveDeleteButton}
      </div>
    );
  });
}
