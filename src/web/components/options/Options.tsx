import { exportDatabase } from '../../appState/appState';

export default function Options() {
  return (
    <div class="options">
      <button onclick={exportDatabase}>Export</button>
    </div>
  );
}
