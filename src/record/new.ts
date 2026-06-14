import { v4 } from "uuid";
import { Entity, Link, Value } from "./types";
import { binaryTimeNow } from "@seannyphoenix/binarytime";
import { JSONType } from "zod";
import { Database } from "../database/types";
import { writeRecord } from "../database/database";

export function newEntityRecord(db: Database): Entity {
  const record = {
    id: v4(),
    t: binaryTimeNow(),
  };

  writeRecord(db, record);

  return record;
}

export function newValueRecord(db: Database, value: JSONType): Value {
  const record = {
    id: v4(),
    t: binaryTimeNow(),
    v: value,
  };

  writeRecord(db, record);

  return record;
}

export function newLinkRecord(db: Database, a: string, b: string): Link {
  const record = {
    id: v4(),
    t: binaryTimeNow(),
    a,
    b,
  };

  writeRecord(db, record);

  return record;
}
