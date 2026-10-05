import { Temporal } from 'temporal-polyfill';

export type DBITombstone = {
  id: string;
  timestamp: Temporal.Instant;
};

export type DBIValueType = {
  id: string;
  timestamp: Temporal.Instant;
  description: string;
  serde: string;
  values: Map<string, DBIValue>;
};

export type DBILinkType = {
  id: string;
  timestamp: Temporal.Instant;
  description: string;
  links: Map<string, DBILink>;
};

export type DBIValue = {
  id: string;
  entity: DBIEntity;
  type: DBIValueType;
  timestamp: Temporal.Instant;
  value: unknown;
};

export type DBILink = {
  id: string;
  type: DBILinkType;
  timestamp: Temporal.Instant;
  a: DBIEntity;
  b: DBIEntity;
};

export type DBIEntity = {
  id: string;
  atob: Map<string, DBILink>;
  btoa: Map<string, DBILink>;
  values: Map<string, DBIValue>;
};
