import { AnyRecord, zAnyRecord } from "../record/types";
import * as z from "zod";
import { Database } from "./types";

export function loadDatabase(rawDb: string): Database {
  const db: Database = {
    data: [],
    index: new Map(),
  };

  if (!rawDb.length) {
    const cause = { line: { index: 0, value: "" } };
    throw new Error("Malformed database: empty input", { cause });
  }

  const lines = rawDb.split("\n");
  let eof = false;
  for (let i = 0; i < lines.length; i++) {
    const value = lines[i];
    try {
      const cause = { line: { index: i + 1, value } };
      if (eof) {
        throw new Error("Malformed database: data after trailing newline", {
          cause,
        });
      }

      if (value === "") {
        eof = true;
        continue;
      }

      if (!value.startsWith("{") || !value.endsWith("}")) {
        throw new Error("Malformed database: line is not a JSON object", {
          cause,
        });
      }

      const parsed = JSON.parse(value);
      const record = z.parse(zAnyRecord, parsed);
      writeRecord(db, record);
    } catch (error) {
      const cause = { line: { index: i + 1, value }, error };

      if (error instanceof SyntaxError) {
        throw new Error(`Malformed JSON: ${value}.`, { cause });
      }

      if (error instanceof z.ZodError) {
        throw new Error(`Malformed record: ${value}.`, { cause });
      }

      throw error;
    }
  }

  if (!eof) {
    const cause = { line: { index: lines.length, value: "" } };
    throw new Error("Malformed database: missing trailing newline", { cause });
  }

  return db;
}

export function dumpDatabase(db: Database): string {
  const records: string[] = [];

  if (!db.data.length) {
    throw new Error("Database is empty: no records to dump.");
  }

  for (let index = 0; index < db.data.length; index++) {
    const record = db.data[index];
    try {
      const out = z.encode(zAnyRecord, record);
      records.push(JSON.stringify(out));
    } catch (error) {
      const cause = { record: { index, record }, error };
      if (error instanceof z.ZodError) {
        throw new Error("Failed to encode database records.", { cause });
      }
      if (error instanceof TypeError) {
        throw new Error("Failed to encode database records.", { cause });
      }
      throw new Error("Failed to encode database records.", { cause });
    }
  }

  return `${records.join("\n")}\n`;
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
