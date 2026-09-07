import { v7 as uuidV7 } from 'uuid';

import { Value } from '../../../db/types/types';
import { reactiveComponent } from '../../reactive/component';
import { createReactive } from '../../reactive/reactive';
import { AppState } from '../appState';
import { InputText, InputNumber, InputCheckbox } from '../form/input/Input';
import { Select, SelectOption } from '../form/select/Select';
import { updateValue, deleteValue, getAllEntities, getValueTypeSerDe } from '../value';

type Props = {
  state: AppState;
  value: Value;
  isDraft?: boolean;
  onSaveDraft?: () => void;
  onDiscardDraft?: () => void;
};

export function ValueDisplay({
  state,
  value,
  isDraft = false,
  onSaveDraft,
  onDiscardDraft,
}: Props) {
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
        label: vt.description || vt.id,
        value: vt.id,
      }));
  };

  // Helper to get all entities as options
  const getEntityOptions = (): SelectOption[] => {
    const entities = getAllEntities(state);
    const currentEntity = entityState.get();
    const options: SelectOption[] = entities
      .filter((e) => e !== currentEntity || !isDraft)
      .map((e) => ({
        label: e.substring(0, 8), // Show first 8 chars of UUID
        value: e,
      }));

    // Add "new" option at the beginning
    options.unshift({
      label: 'new',
      value: uuidV7(),
    });

    return options;
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

  const saveDeleteButton = (function () {
    const isEditing = shouldEdit.get();

    return (
      <button
        class="val-btn"
        onclick={() => {
          switch (isEditing) {
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
        {isEditing ? 'Save' : 'Delete'}
      </button>
    );
  })() as HTMLButtonElement;

  return reactiveComponent([state, shouldEdit], () => {
    const isEditing = shouldEdit.get();
    const current = currentValue.get();

    return (
      <div class="val-row">
        <div class="val-entity">
          {isEditing ? Select(entityState as any, getEntityOptions()) : current.entity.substring(0, 8)}
        </div>
        <div class="val-type">
          {isEditing ? (
            Select(typeState as any, getValueTypeOptions())
          ) : (
            <>
              {state.get().database.getValueType(current.type as any)?.description || current.type}
            </>
          )}
        </div>
        <div class="val-value">{isEditing ? renderValueInput() : String(current.value)}</div>
        <button
          class="val-btn"
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
