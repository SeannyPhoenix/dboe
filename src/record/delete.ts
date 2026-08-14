import { binaryTimeNow } from "@seannyphoenix/binarytime";
import { AnyRecord, TypeTombstone, Tombstone } from "./types";

export function deleteRecord(record: AnyRecord): Tombstone {
  const deleted: Tombstone = {
    t: TypeTombstone,
    id: record.id,
    ts: binaryTimeNow(),
  };

  return deleted;
}
