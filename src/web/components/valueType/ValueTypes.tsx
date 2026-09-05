import { reactiveComponent } from '../../reactive/component';
import { State } from '../state';
import { newValueType } from '../valuetype';
import { ValueTypeDisplay } from './ValueTypeDisplay';

export default function ValueTypes({ state }: { state: State }) {
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
          {state.get().valuetypes.map((vt) => (
            <ValueTypeDisplay state={state} valueType={vt} />
          ))}
        </div>
      </>
    );
  });
}
