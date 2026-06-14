import { zBinaryTime } from "@seannyphoenix/binarytime";
import * as z from "zod";

// An Entity has no additional fields
const zEntity = z.strictObject({
  t: zBinaryTime,
  id: z.uuid(),
});
export type Entity = z.infer<typeof zEntity>;

// A Value has a single additional field "v" that can be any JSON value
const zValue = z.strictObject({
  t: zBinaryTime,
  id: z.uuid(),
  v: z.json(),
});
export type Value = z.infer<typeof zValue>;

// A Link has two additional fields "a" and "b" that are UUIDs of other records
const zLink = z.strictObject({
  t: zBinaryTime,
  id: z.uuid(),
  a: z.uuid(),
  b: z.uuid(),
});
export type Link = z.infer<typeof zLink>;

// A Tombstone replaces "t" with "d" to indicate deletion, and has no additional fields
export const zTombstone = z.strictObject({
  d: zBinaryTime,
  id: z.uuid(),
});
export type Tombstone = z.infer<typeof zTombstone>;

export const zLiveRecord = z.union([zEntity, zValue, zLink]);
export type LiveRecord = z.infer<typeof zLiveRecord>;

export const zAnyRecord = z.union([zEntity, zValue, zLink, zTombstone]);
export type AnyRecord = z.infer<typeof zAnyRecord>;
