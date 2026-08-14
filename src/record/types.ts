import { zBinaryTime } from "@seannyphoenix/binarytime";
import * as z from "zod";

export const TypeEntity = 1;
export const TypeValue = 2;
export const TypeLink = 3;
export const TypeTombstone = 4;

// An Entity has no additional fields
const zEntity = z.strictObject({
  t: z.literal(TypeEntity),
  id: z.uuid(),
  ts: zBinaryTime,
});
export type Entity = z.infer<typeof zEntity>;

// A Value has a single additional field "v" with base64-encoded bytes
const encoder = new TextEncoder();
const zByteArray = z.codec(z.string(), z.instanceof(Uint8Array), {
  decode: (s) => encoder.encode(s),
  encode: (b) => new TextDecoder().decode(b),
});
const zValue = z.strictObject({
  t: z.literal(TypeValue),
  id: z.uuid(),
  ts: zBinaryTime,
  v: zByteArray,
});
export type Value = z.infer<typeof zValue>;

// A Link has two additional UUIDs
const zLink = z.strictObject({
  t: z.literal(TypeLink),
  id: z.uuid(),
  ts: zBinaryTime,
  a: z.uuid(),
  b: z.uuid(),
});
export type Link = z.infer<typeof zLink>;

// A Tombstone has no additional fields
export const zTombstone = z.strictObject({
  t: z.literal(TypeTombstone),
  id: z.uuid(),
  ts: zBinaryTime,
});
export type Tombstone = z.infer<typeof zTombstone>;

export const zAnyRecord = z.union([zEntity, zValue, zLink, zTombstone]);
export type AnyRecord = z.infer<typeof zAnyRecord>;
