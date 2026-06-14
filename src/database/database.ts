import { AnyRecord, zAnyRecord } from "../record/types";
import * as z from "zod";
import { Database } from "./types";

export function loadDatabase(raw: string): Database {
  const db: Database = {
    data: [],
    index: new Map(),
  };

  raw.split("\n").forEach((record) => {
    const res = z.safeDecode(zAnyRecord, JSON.parse(record));
    if (res.success) {
      writeRecord(db, res.data);
    } else {
      console.error("Failed to decode record:", res.error);
    }
  });

  return db;
}

export function dumpDatabase(db: Database): string {
  const records: string[] = [];

  for (const record of db.data) {
    const enc = z.safeEncode(zAnyRecord, record);
    if (!enc.success) {
      console.error("Failed to encode record:", enc.error);
      continue;
    }
    records.push(JSON.stringify(enc.data));
  }

  return records.join("\n");
}

export function lookupRecord(db: Database, id: string): AnyRecord | null {
  const entry = db.index.get(id);
  if (!entry) {
    return null;
  }
  return db.data[entry.i];
}

export function writeRecord(db: Database, record: AnyRecord): void {
  db.data.push(record);

  if ("d" in record) {
    db.index.delete(record.id);
  } else {
    db.index.set(record.id, {
      t: record.t,
      i: db.data.length - 1,
    });
  }
}
 