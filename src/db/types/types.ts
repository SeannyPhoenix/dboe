export type ValueID = string;
export type EntityID = string;
export type ValueTypeID = string;
export type LinkTypeID = string;
export type LinkID = string;
export type TombstoneID = EntityID | ValueTypeID | ValueID | LinkTypeID | LinkID;

export const serDes = ['string', 'number', 'boolean'] as const;
export type CoreSerDe = (typeof serDes)[number];

export type ValueType = {
  id: ValueTypeID;
  timestamp?: Date;
  description: string;
  serde: CoreSerDe;
};

export type Value = {
  id: ValueID;
  timestamp: Date;
  entity: EntityID;
  type: ValueTypeID;
  value: unknown;
};

export type LinkType = {
  id: LinkTypeID;
  timestamp: Date;
  description: string;
};

export type Link = {
  id: LinkID;
  timestamp: Date;
  type: LinkTypeID;
  a: EntityID;
  b: EntityID;
};

export type Tombstone = {
  id: TombstoneID;
  timestamp: Date;
};
