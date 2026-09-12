import { exportDatabase } from '../appState';

export default function Options() {
  return (
    <div class="options">
      <button onclick={exportDatabase}>Export</button>
    </div>
  );
}
