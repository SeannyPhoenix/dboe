import { JSONType } from "zod";
import { binaryTimeNow } from "@seannyphoenix/binarytime";
import { Database } from "../database/types";
import { writeRecord } from "../database/database";
import { Link, Value } from "./types";

export function updateValueRecord(
  db: Database,
  record: Value,
  newValue: JSONType,
): Value {
  const updated = {
    id: record.id,
    t: binaryTimeNow(),
    v: newValue,
  };

  writeRecord(db, updated);

  return updated;
}

export function updateLinkRecord(
  db: Database,
  record: Link,
  a: string,
  b: string,
): Link {
  const updated = {
    id: record.id,
    t: binaryTimeNow(),
    a,
    b,
  };

  writeRecord(db, updated);

  return updated;
}
