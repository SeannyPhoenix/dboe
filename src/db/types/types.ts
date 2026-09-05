import { z } from 'zod';

// IDs
const zValueID = z.uuid();
type ValueID = z.infer<typeof zValueID>;

const zEntityID = z.uuid();
type EntityID = z.infer<typeof zEntityID>;

const zValueTypeID = z.uuid();
type ValueTypeID = z.infer<typeof zValueTypeID>;

const zLinkTypeID = z.uuid();
type LinkTypeID = z.infer<typeof zLinkTypeID>;

const zLinkID = z.uuid();
type LinkID = z.infer<typeof zLinkID>;

const zTombstoneID = z.union([zEntityID, zValueTypeID, zValueID, zLinkTypeID, zLinkID]);
type TombstoneID = z.infer<typeof zTombstoneID>;

export { zValueID, zEntityID, zValueTypeID, zLinkTypeID, zLinkID, zTombstoneID };
export type { ValueID, EntityID, ValueTypeID, LinkTypeID, LinkID, TombstoneID };

// Schemas
export const zSerDe = z.enum(['string', 'number', 'boolean']);
export const validSerDes = zSerDe.options;
export type SerDe = z.infer<typeof zSerDe>;

const ValueTypeSchema = z.object({
  id: zValueTypeID,
  timestamp: z.coerce.date().optional(),
  description: z.string(),
  serde: zSerDe,
});
type ValueType = z.infer<typeof ValueTypeSchema>;

const ValueSchema = z.object({
  id: zValueID,
  timestamp: z.coerce.date(),
  entity: zEntityID,
  type: zValueTypeID,
  value: z.unknown(),
});
type Value = z.infer<typeof ValueSchema>;

const LinkTypeSchema = z.object({
  id: zLinkTypeID,
  timestamp: z.coerce.date().optional(),
  description: z.string(),
});
type LinkType = z.infer<typeof LinkTypeSchema>;

const LinkSchema = z.object({
  id: zLinkID,
  timestamp: z.coerce.date(),
  type: zLinkTypeID,
  a: zEntityID,
  b: zEntityID,
});
type Link = z.infer<typeof LinkSchema>;

const TombstoneSchema = z.object({
  id: zTombstoneID,
  timestamp: z.coerce.date(),
});
type Tombstone = z.infer<typeof TombstoneSchema>;

const AnyEntrySchema = z.union([
  ValueSchema,
  ValueTypeSchema,
  LinkSchema,
  LinkTypeSchema,
  TombstoneSchema,
]);
type AnyEntry = z.infer<typeof AnyEntrySchema>;

export {
  ValueTypeSchema,
  ValueSchema,
  LinkTypeSchema,
  LinkSchema,
  TombstoneSchema,
  AnyEntrySchema,
};
export type { ValueType, Value, LinkType, Link, Tombstone, AnyEntry };
