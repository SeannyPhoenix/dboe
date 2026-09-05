import { reactiveComponent } from '../../reactive/component';
import { AppState } from '../appState';
import { newValueType } from '../valuetype';
import { ValueTypeDisplay } from './ValueTypeDisplay';

export default function ValueTypes({ state }: { state: AppState }) {
  return reactiveComponent([state], () => {
    return (
      <>
        <button
          onclick={() => {
            newValueType(state);
          }}
        >
          New Value Type
        </button>

        <div class="vt-list">
          {state.get().database.getAllValueTypes().map((vt) => (
            <ValueTypeDisplay state={state} valueType={vt} />
          ))}
        </div>
      </>
    );
  });
}
