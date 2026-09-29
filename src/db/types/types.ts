export type ID = string;

export const serDes = ['string', 'number', 'boolean'] as const;

export type ValueType = {
  id: ID;
  timestamp: Date;
  description: string;
  serde: string;
};

export type Value = {
  id: ID;
  timestamp: Date;
  entity: ID;
  type: ID;
  value: unknown;
};

export type LinkType = {
  id: ID;
  timestamp: Date;
  description: string;
};

export type Link = {
  id: ID;
  timestamp: Date;
  type: ID;
  a: ID;
  b: ID;
};

export type Tombstone = {
  id: ID;
  timestamp: Date;
};
