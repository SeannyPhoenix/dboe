import { Reactive } from '../../../reactive/reactive';

export function InputText(state: Reactive<string>) {
  const input = (
    <input
      type="text"
      placeholder="Enter text"
      value={state.get()}
      oninput={(e) => {
        state.set((e.target as HTMLInputElement).value);
      }}
    />
  ) as HTMLInputElement;

  state.subscribe(() => {
    const currentValue = state.get();
    if (input.value !== currentValue) {
      input.value = currentValue;
    }
  });

  return input;
}

export function InputCheckbox(state: Reactive<boolean>) {
  const input = (
    <input
      type="checkbox"
      checked={state.get()}
      oninput={(e) => {
        state.set((e.target as HTMLInputElement).checked);
      }}
    />
  ) as HTMLInputElement;

  state.subscribe(() => {
    const currentValue = state.get();
    if (input.checked !== currentValue) {
      input.checked = currentValue;
    }
  });

  return input;
}

export function InputNumber(state: Reactive<number>) {
  const input = (
    <input
      type="number"
      placeholder="Enter number"
      value={state.get().toString()}
      oninput={(e) => {
        const value = parseFloat((e.target as HTMLInputElement).value);
        if (!isNaN(value)) {
          state.set(value);
        }
      }}
    />
  ) as HTMLInputElement;

  state.subscribe(() => {
    const currentValue = state.get();
    if (parseFloat(input.value) !== currentValue) {
      input.value = currentValue.toString();
    }
  });

  return input;
}

export interface RadioOption {
  label: string;
  value: string | number;
}

export function InputRadio(state: Reactive<string | number>, options: RadioOption[]) {
  const container = document.createElement('fieldset');
  container.style.border = 'none';
  container.style.padding = '0';
  container.style.margin = '0';

  options.forEach((option) => {
    const label = document.createElement('label');
    label.style.marginRight = '1rem';
    label.style.cursor = 'pointer';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = Math.random().toString(36).substr(2, 9); // Unique group name
    input.value = String(option.value);
    input.checked = state.get() === option.value;

    input.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.checked) {
        state.set(option.value);
      }
    });

    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${option.label}`));
    container.appendChild(label);
  });

  state.subscribe(() => {
    const currentValue = state.get();
    const inputs = container.querySelectorAll('input[type="radio"]');
    inputs.forEach((input) => {
      (input as HTMLInputElement).checked =
        (input as HTMLInputElement).value === String(currentValue);
    });
  });

  return container;
}

export function InputDate(state: Reactive<Date>) {
  const input = (
    <input
      type="date"
      value={state.get().toISOString().split('T')[0]}
      oninput={(e) => {
        const dateString = (e.target as HTMLInputElement).value;
        if (dateString) {
          const date = new Date(dateString + 'T00:00:00');
          state.set(date);
        }
      }}
    />
  ) as HTMLInputElement;

  state.subscribe(() => {
    const currentValue = state.get();
    const isoString = currentValue.toISOString().split('T')[0];
    if (input.value !== isoString) {
      input.value = isoString;
    }
  });

  return input;
}

export function InputTextarea(state: Reactive<string>) {
  const textarea = (
    <textarea
      placeholder="Enter text"
      rows={4}
      cols={50}
      oninput={(e) => {
        state.set((e.target as HTMLTextAreaElement).value);
      }}
    />
  ) as HTMLTextAreaElement;

  textarea.value = state.get();

  state.subscribe(() => {
    const currentValue = state.get();
    if (textarea.value !== currentValue) {
      textarea.value = currentValue;
    }
  });

  return textarea;
}
