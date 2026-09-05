import { Value, ValueType, ValueID, ValueTypeID, AnyEntry, Tombstone } from '../types/types';

export type DatabaseData = {
  values: Record<ValueID, Value>;
  valueTypes: Record<ValueTypeID, ValueType>;
  history: Array<AnyEntry>;
};

const emptyDatabase: DatabaseData = {
  values: {},
  valueTypes: {},
  history: [],
};

export class Database {
  private data: DatabaseData;

  constructor() {
    this.data = { ...emptyDatabase };
    this.load();
  }

  getValue(valueId: ValueID): Value | undefined {
    return this.data.values[valueId];
  }

  putValue(value: Value): void {
    if (!this.data.valueTypes[value.type]) {
      throw new Error(`ValueType "${value.type}" not found`);
    }
    this.data.values[value.id] = value;
    this.data.history.push(value);
  }

  deleteValue(valueId: ValueID): void {
    const entry = this.data.values[valueId];
    if (!entry) {
      throw new Error(`Value "${valueId}" not found`);
    }
    delete this.data.values[valueId];
    if (entry) {
      const tombstone: Tombstone = {
        id: entry.id,
        timestamp: new Date(),
      };
      this.data.history.push(tombstone);
    }
  }

  getValuesByType(typeId: ValueTypeID): Value[] {
    return Object.values(this.data.values).filter((v) => v.type === typeId);
  }

  getValueType(typeId: ValueTypeID): ValueType | undefined {
    return this.data.valueTypes[typeId];
  }

  putValueType(valueType: ValueType): void {
    this.data.valueTypes[valueType.id] = valueType;
    this.data.history.push(valueType);
  }

  deleteValueType(typeId: ValueTypeID): void {
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
    if (entry) {
      const tombstone: Tombstone = {
        id: entry.id,
        timestamp: new Date(),
      };
      this.data.history.push(tombstone);
    }
  }

  getAllValueTypes(): ValueType[] {
    return Object.values(this.data.valueTypes);
  }

  getAllValues(): Value[] {
    return Object.values(this.data.values);
  }

  getData(): DatabaseData {
    return this.data;
  }

  isValid(): boolean {
    return Object.values(this.data.values).every((v) => this.data.valueTypes[v.type]);
  }

  load(): void {
    const data = localStorage.getItem('database');
    if (data) {
      this.data = JSON.parse(data);
    }
  }

  save(): void {
    localStorage.setItem('database', JSON.stringify(this.data));
  }
}
