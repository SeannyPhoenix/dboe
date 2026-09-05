import { initAppState } from './appState';
import Values from './value/Values';
import ValueTypes from './valueType/ValueTypes';

export default function App() {
  const state = initAppState();

  return (
    <div class="portal">
      <div>The Database of Everything V3</div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: '1' }}>
          <h2>Value Types</h2>
          <ValueTypes state={state} />
        </div>
        <div style={{ flex: '1' }}>
          <h2>Values</h2>
          <Values state={state} />
        </div>
      </div>
    </div>
  );
}
