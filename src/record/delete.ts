import { binaryTimeNow } from "@seannyphoenix/binarytime";
import { AnyRecord, Tombstone,  } from "./types";
import { Database } from "../database/types";
import { writeRecord } from "../database/database";

export function deleteRecord(db: Database, record: AnyRecord): Tombstone {
  const deleted = {
    id: record.id,
    d: binaryTimeNow(),
  };

  writeRecord(db, deleted);

  return deleted;
}
