import { v7 as uuidV7 } from 'uuid';

import { ValueType } from '../../../db/types/types';
import { getAppState } from '../../appState/appState';
import { reactiveComponent } from '../../reactive/component';
import { createReactive } from '../../reactive/reactive';
import { ValueTypeDisplay } from './ValueTypeDisplay';

export default function ValueTypes() {
  const state = getAppState();

  const draftValueType = createReactive<ValueType | null>(null);

  return reactiveComponent([state, draftValueType], () => {
    const draft = draftValueType.get();

    return (
      <>
        <button
          onclick={() => {
            draftValueType.set({
              id: uuidV7(),
              timestamp: new Date(),
              description: '',
              serde: 'string',
            });
          }}
          // disabled={draft !== null}
        >
          New Value Type
        </button>

        <div class="vt-list">
          {draft && (
            <ValueTypeDisplay
              valueType={draft}
              isDraft={true}
              onSaveDraft={() => {
                draftValueType.set(null);
              }}
              onDiscardDraft={() => {
                draftValueType.set(null);
              }}
            />
          )}
          {state
            .get()
            .database.getAllValueTypes()
            .map((vt) => (
              <ValueTypeDisplay valueType={vt} />
            ))}
        </div>
      </>
    );
  });
}
