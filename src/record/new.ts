import { v4 as uuid } from "uuid";
import { Entity, Link, TypeEntity, TypeLink, TypeValue, Value } from "./types";
import { binaryTimeNow } from "@seannyphoenix/binarytime";
import { JSONType } from "zod";

export function newEntity(): Entity {
  const record: Entity = {
    t: TypeEntity,
    id: uuid(),
    ts: binaryTimeNow(),
  };

  return record;
}

export function newValue(value: JSONType): Value {
  const record: Value = {
    t: TypeValue,
    id: uuid(),
    ts: binaryTimeNow(),
    v: btoa(JSON.stringify(value)),
  };

  return record;
}

export function newLink(a: string, b: string): Link {
  const record: Link = {
    t: TypeLink,
    id: uuid(),
    ts: binaryTimeNow(),
    l: {
      a,
      b,
    },
  };

  return record;
}
