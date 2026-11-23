export type ValueType = {
  id: string;
  timestamp: Date;
  name: string;
  serde: string;
};

export type Value = {
  id: string;
  timestamp: Date;
  entity: string;
  type: string;
  value: string;
};

export type LinkType = {
  id: string;
  timestamp: Date;
  description: string;
};

export type Link = {
  id: string;
  timestamp: Date;
  type: string;
  a: string;
  b: string;
};

export type Tombstone = {
  id: string;
  timestamp: Date;
};
