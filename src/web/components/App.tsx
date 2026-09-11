import Options from './options/Options';
import Values from './value/Values';
import ValueTypes from './valueType/ValueTypes';

export default function App() {
  return (
    <div class="portal">
      <div>The Database of Everything</div>
      <Options />
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: '1' }}>
          <h2>Value Types</h2>
          <ValueTypes />
        </div>
        <div style={{ flex: '1' }}>
          <h2>Values</h2>
          <Values />
        </div>
      </div>
    </div>
  );
}
