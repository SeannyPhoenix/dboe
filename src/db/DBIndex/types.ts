export type DBITombstone = {
  id: string;
  timestamp: Date;
};

export type DBIValueType = {
  id: string;
  timestamp: Date;
  description: string;
  serde: string;
  values: Map<string, DBIValue>;
};

export type DBILinkType = {
  id: string;
  timestamp: Date;
  description: string;
  links: Map<string, DBILink>;
};

export type DBIValue = {
  id: string;
  entity: DBIEntity;
  type: DBIValueType;
  timestamp: Date;
  value: any;
};

export type DBILink = {
  id: string;
  type: DBILinkType;
  timestamp: Date;
  a: DBIEntity;
  b: DBIEntity;
};

export type DBIEntity = {
  id: string;
  atob: Map<string, DBILink>;
  btoa: Map<string, DBILink>;
  values: Map<string, DBIValue>;
};
