import { JSONType } from "zod";
import { binaryTimeNow } from "@seannyphoenix/binarytime";
import { TypeValue, Value } from "./types";

export function updateValueRecord(record: Value, newValue: JSONType): Value {
  const updated: Value = {
    t: TypeValue,
    id: record.id,
    ts: binaryTimeNow(),
    v: JSON.stringify(newValue),
  };

  return updated;
}
