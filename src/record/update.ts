import { binaryTimeNow } from '@seannyphoenix/binarytime';

import { TypeValue, Value } from './types';

export function updateValueRecord(record: Value, newValue: Uint8Array<ArrayBuffer>): Value {
  const updated: Value = {
    t: TypeValue,
    id: record.id,
    ts: binaryTimeNow(),
    v: newValue,
  };

  return updated;
}
