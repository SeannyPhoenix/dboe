import { Temporal } from 'temporal-polyfill';
import { v7 as uuidV7 } from 'uuid';

import { Value } from '../../../db/types/types';
import { getAppState } from '../../appState/appState';
import { reactiveComponent } from '../../reactive/component';
import { createReactive } from '../../reactive/reactive';
import ValueDisplay from './ValueDisplay';

export default function Values() {
  const state = getAppState();

  const draftValue = createReactive<Value | null>(null);

  return reactiveComponent([state, draftValue], () => {
    const draft = draftValue.get();
    const valueTypes = state.get().database.getAllValueTypes();
    const firstValueType = valueTypes.length > 0 ? valueTypes[0].id : '';

    return (
      <>
        <button
          onclick={() => {
            const newDraftValue: Value = {
              id: uuidV7(),
              entity: uuidV7(),
              type: firstValueType,
              value: '',
              timestamp: Temporal.Now.instant(),
            };
            draftValue.set(newDraftValue);
          }}
        >
          Add New Value
        </button>

        <div class="vt-list">
          {draft && (
            <ValueDisplay
              value={draft}
              isDraft={true}
              onSaveDraft={() => {
                draftValue.set(null);
              }}
              onDiscardDraft={() => {
                draftValue.set(null);
              }}
            />
          )}
          {state
            .get()
            .database.getAllValues()
            .sort((a, b) => a.entity.localeCompare(b.entity))
            .map((val) => (
              <ValueDisplay value={val} />
            ))}
        </div>
      </>
    );
  });
}
