import { binaryTimeNow } from '@seannyphoenix/binarytime';
import { v4 as uuid } from 'uuid';

import { Entity, Link, TypeEntity, TypeLink, TypeValue, Value } from './types';

export function newEntity(): Entity {
  const record: Entity = {
    t: TypeEntity,
    id: uuid(),
    ts: binaryTimeNow(),
  };

  return record;
}

export function newValue(value: Uint8Array<ArrayBuffer>): Value {
  const record: Value = {
    t: TypeValue,
    id: uuid(),
    ts: binaryTimeNow(),
    v: value,
  };

  return record;
}

export function newLink(a: string, b: string): Link {
  const record: Link = {
    t: TypeLink,
    id: uuid(),
    ts: binaryTimeNow(),
    a,
    b,
  };

  return record;
}
