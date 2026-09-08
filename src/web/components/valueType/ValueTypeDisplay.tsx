import { ValueType } from '../../../db/types/types';
import { reactiveComponent } from '../../reactive/component';
import { createReactive } from '../../reactive/reactive';
import { AppState } from '../appState';
import { InputText } from '../form/input/Input';
import { Select, SelectOption } from '../form/select/Select';
import { setValueType } from '../valuetype';
import { deleteValueType } from '../valuetype';

type Props = {
  state: AppState;
  valueType: ValueType;
  isDraft?: boolean;
  onSaveDraft?: () => void;
  onDiscardDraft?: () => void;
};

export function ValueTypeDisplay({
  state,
  valueType,
  isDraft = false,
  onSaveDraft,
  onDiscardDraft,
}: Props) {
  const shouldEdit = createReactive(isDraft);
  const currentValueType = createReactive(valueType);

  // Individual reactive fields for the form
  const descriptionState = createReactive(valueType.description);
  const serdeState = createReactive(valueType.serde);

  // Reset form state when entering edit mode
  shouldEdit.subscribe(() => {
    if (shouldEdit.get()) {
      const current = currentValueType.get();
      descriptionState.set(current.description);
      serdeState.set(current.serde);
    }
  });

  const serdeOptions: SelectOption[] = [
    { label: 'string', value: 'string' },
    { label: 'number', value: 'number' },
    { label: 'boolean', value: 'boolean' },
  ];

  const saveDeleteButton = (
    <button
      class="vt-btn"
      disabled={shouldEdit.get() && descriptionState.get().trim().length === 0}
      onclick={() => {
        switch (shouldEdit.get()) {
          case true:
            shouldEdit.set(false);
            const updated = {
              ...currentValueType.get(),
              description: descriptionState.get(),
              serde: serdeState.get(),
            };
            currentValueType.set(updated);
            setValueType(state, updated);
            if (isDraft && onSaveDraft) {
              onSaveDraft();
            }
            break;
          case false:
            deleteValueType(state, currentValueType.get().id);
            break;
        }
      }}
    >
      {shouldEdit.get() ? 'Save' : 'Delete'}
    </button>
  ) as HTMLButtonElement;

  descriptionState.subscribe(() => {
    const currentDesc = descriptionState.get();
    if (shouldEdit.get()) {
      const disabled = currentDesc.trim().length === 0;
      if (saveDeleteButton.disabled !== disabled) {
        saveDeleteButton.disabled = disabled;
      }
    }
  });
  shouldEdit.subscribe(() => {
    const label = shouldEdit.get() ? 'Save' : 'Delete';
    if (saveDeleteButton.innerText !== label) {
      saveDeleteButton.innerText = label;
    }
  });

  return reactiveComponent([state, shouldEdit], () => {
    const isEditing = shouldEdit.get();

    return (
      <div class="vt-row">
        <div class="vt-serde">
          {isEditing ? Select(serdeState, serdeOptions) : currentValueType.get().serde}
        </div>
        <div class="vt-desc">
          {isEditing ? InputText(descriptionState) : currentValueType.get().description}
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
