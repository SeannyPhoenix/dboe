import { Temporal } from 'temporal-polyfill';

export type ID = string;

export const serDes = ['string', 'number', 'boolean'] as const;

export type ValueType = {
  id: ID;
  timestamp: Temporal.Instant;
  description: string;
  serde: string;
};

export type Value = {
  id: ID;
  timestamp: Temporal.Instant;
  entity: ID;
  type: ID;
  value: unknown;
};

export type LinkType = {
  id: ID;
  timestamp: Temporal.Instant;
  description: string;
};

export type Link = {
  id: ID;
  timestamp: Temporal.Instant;
  type: ID;
  a: ID;
  b: ID;
};

export type Tombstone = {
  id: ID;
  timestamp: Temporal.Instant;
};
