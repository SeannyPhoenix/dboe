import { Reactive } from '../../../reactive/reactive';

export type SelectOption = {
  label: string;
  value: string | number;
};

type Props = {
  state: Reactive<string | number>;
  options: SelectOption[];
};

export function Select({ state, options }: Props) {
  const select = (
    <select
      onchange={(e) => {
        const value = (e.target as HTMLSelectElement).value;
        // Try to parse as number if all option values are numbers
        const parsed = options.find((opt) => String(opt.value) === value)?.value;
        if (parsed !== undefined) {
          state.set(parsed);
        }
      }}
    >
      {options.map((option) => (
        <option value={String(option.value)}>{option.label}</option>
      ))}
    </select>
  ) as HTMLSelectElement;

  select.value = String(state.get());

  state.subscribe(() => {
    const currentValue = state.get();
    if (select.value !== String(currentValue)) {
      select.value = String(currentValue);
    }
  });

  return select;
}
