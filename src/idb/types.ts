type DBFieldName = string;
type DBRecord = Record<DBFieldName, unknown>;
type KeyPath<T extends DBRecord> = keyof T | (keyof T)[];

export type Store<T extends DBRecord> = {
  keyPath: KeyPath<T>;
  autoIncrement?: boolean;
  uniqueIndexes?: {
    [indexName: string]: {
      keyPath: KeyPath<T>;
      unique: true;
      multiEntry?: boolean;
    };
  };
  multiIndexes?: {
    [indexName: string]: {
      keyPath: KeyPath<T>;
      multiEntry?: boolean;
    };
  };
  type: T;
  keytype?: IDBValidKey;
};

export type Index<T extends DBRecord> = {
  keyPath: KeyPath<T>;
  unique: boolean;
  multiEntry?: boolean;
};

export type DBSchema<T extends DBRecord = DBRecord> = {
  [storeName: string]: Store<T>;
};
