const validSerDe = ['string', 'number', 'boolean'] as const;
export type SerDe = (typeof validSerDe)[number];

export type EntityID = string;
export type ValueTypeID = string;
export type ValueID = string;
export type LinkTypeID = string;
export type LinkID = string;

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
