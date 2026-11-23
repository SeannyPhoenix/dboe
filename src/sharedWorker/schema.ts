import type { Link, LinkType, Tombstone, Value, ValueType } from "#dboe/types";
import { type DBSchema, type Store } from "#idb/types";

const valuetypes: Store<ValueType> = {
  keyPath: "id",
  uniqueIndexes: {
    id: { keyPath: "id", unique: true },
    idTimestamp: { keyPath: ["id", "timestamp"], unique: true },
  },
  type: {} as ValueType,
} as const;

const values: Store<Value> = {
  keyPath: "id",
  uniqueIndexes: {
    id: { keyPath: "id", unique: true },
    idTimestamp: { keyPath: ["id", "timestamp"], unique: true },
  },
  type: {} as Value,
} as const;

const linkTypes: Store<LinkType> = {
  keyPath: "id",
  uniqueIndexes: {
    id: { keyPath: "id", unique: true },
    idTimestamp: { keyPath: ["id", "timestamp"], unique: true },
  },
  type: {} as LinkType,
} as const;

const links: Store<Link> = {
  keyPath: "id",
  uniqueIndexes: {
    id: { keyPath: "id", unique: true },
    idTimestamp: { keyPath: ["id", "timestamp"], unique: true },
  },
  type: {} as Link,
} as const;

const tombstones: Store<Tombstone> = {
  keyPath: "id",
  uniqueIndexes: {
    id: { keyPath: "id", unique: true },
    idTimestamp: { keyPath: ["id", "timestamp"], unique: true },
  },
  type: {} as Tombstone,
} as const;

export const databaseSchema = {
  valuetypes,
  values,
  linkTypes,
  links,
  tombstones,
} as const satisfies DBSchema<any>;
