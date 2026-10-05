import { DBIValue } from '../../../db/DBIndex/types';
import { createReactive } from '../../reactive/reactive';

type Props = {
  value: DBIValue;
};

export default function Actions({ value }: Props) {
  const valueString = String(value.value);
  const buttonText = createReactive('Copy');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(valueString);
      buttonText.set('✓');
      setTimeout(() => buttonText.set('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      buttonText.set('x');
      setTimeout(() => buttonText.set('Copy'), 2000);
    }
  };

  const copyButton = (
    <button onclick={handleCopy}>{buttonText.get()}</button>
  ) as HTMLButtonElement;

  buttonText.subscribe(() => {
    copyButton.textContent = buttonText.get();
  });

  return (
    <div class="actions">
      {copyButton}
      <button>Edit</button>
      <button>Delete</button>
    </div>
  );
}
