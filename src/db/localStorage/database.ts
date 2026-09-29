import { Value, ID, ValueType, Tombstone } from '../types/types';

type DB = {
  values: Record<ID, Value>;
  valueTypes: Record<ID, ValueType>;
  history: Array<Value | ValueType | Tombstone>;
};

const emptyDatabase: DB = {
  values: {},
  valueTypes: {},
  history: [],
};

export class Database {
  private data: DB;

  constructor() {
    this.data = { ...emptyDatabase };
    this.load();
  }

  getValue(valueId: ID): Value | undefined {
    return this.data.values[valueId];
  }

  putValue(value: Value): void {
    if (!this.data.valueTypes[value.type]) {
      throw new Error(`ValueType "${value.type}" not found`);
    }
    this.data.values[value.id] = value;
    this.data.history.push(value);
  }

  deleteValue(valueId: ID): void {
    const entry = this.data.values[valueId];
    if (!entry) {
      throw new Error(`Value "${valueId}" not found`);
    }
    delete this.data.values[valueId];
    const tombstone: Tombstone = {
      id: entry.id,
      timestamp: new Date(),
    };
    this.data.history.push(tombstone);
  }

  getValuesByType(typeId: ID): Value[] {
    return Object.values(this.data.values).filter((v) => v.type === typeId);
  }

  getValueType(typeId: ID): ValueType | undefined {
    return this.data.valueTypes[typeId];
  }

  putValueType(valueType: ValueType): void {
    this.data.valueTypes[valueType.id] = valueType;
    this.data.history.push(valueType);
  }

  deleteValueType(typeId: ID): void {
    const usedByValues = this.getValuesByType(typeId);
    if (usedByValues.length) {
      throw new Error(
        `Cannot delete ValueType "${typeId}": ${usedByValues.length} value(s) still reference it`,
      );
    }
    const entry = this.data.valueTypes[typeId];
    if (!entry) {
      throw new Error(`ValueType "${typeId}" not found`);
    }
    delete this.data.valueTypes[typeId];
    const tombstone: Tombstone = {
      id: entry.id,
      timestamp: new Date(),
    };
    this.data.history.push(tombstone);
  }

  getAllValueTypes(): ValueType[] {
    return Object.values(this.data.valueTypes);
  }

  getAllValues(): Value[] {
    return Object.values(this.data.values);
  }

  getData(): DB {
    return this.data;
  }

  isValid(): boolean {
    return Object.values(this.data.values).every((v) => this.data.valueTypes[v.type]);
  }

  load(): void {
    const data = localStorage.getItem('database');
    if (data) {
      try {
        this.data = JSON.parse(data);
      } catch (error) {
        console.error('Failed to load database from localStorage:', error);
      }
    }
  }

  save(): void {
    localStorage.setItem('database', JSON.stringify(this.data));
  }
}
