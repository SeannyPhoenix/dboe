import { testIndex } from '../../../db/localStorage';
import { exportDatabase } from '../appState';

export default function Options() {
  return (
    <div class="options">
      <button onclick={exportDatabase}>Export</button>
      <button onclick={testIndex}>Test Index</button>
    </div>
  );
}
