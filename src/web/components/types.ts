const validSerDe = ['string', 'number', 'boolean'] as const;
type SerDe = (typeof validSerDe)[number];

type EntityID = string;
type ValueTypeID = string;
type ValueID = string;
type LinkTypeID = string;
type LinkID = string;

export type ValueType = {
  id: ValueTypeID;
  description: string;
  serde: SerDe;
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
  description: string;
};

export type Link = {
  id: LinkID;
  timestamp: Date;
  type: LinkTypeID;
  a: EntityID;
  b: EntityID;
};
