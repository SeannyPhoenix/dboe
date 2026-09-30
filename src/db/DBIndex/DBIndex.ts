import type { Link, LinkType, Tombstone, Value, ValueType } from '../types/types';
import type {
  DBITombstone,
  DBIValueType,
  DBILinkType,
  DBIValue,
  DBILink,
  DBIEntity,
} from './types';

function newEntity(id: string): DBIEntity {
  return {
    id,
    atob: new Map(),
    btoa: new Map(),
    values: new Map(),
  };
}

export class DBIndex {
  private tombstones: Map<string, DBITombstone> = new Map();
  private valueTypes: Map<string, DBIValueType> = new Map();
  private linkTypes: Map<string, DBILinkType> = new Map();
  private entities: Map<string, DBIEntity> = new Map();

  addTombstone(t: Tombstone) {
    if (this.isTombstoned(t.id)) {
      return;
    }

    this.tombstones.set(t.id, {
      id: t.id,
      timestamp: t.timestamp,
    });
  }

  addTombstones(ts: Tombstone[]) {
    for (const t of ts) {
      this.addTombstone(t);
    }
  }

  addValueType(vt: ValueType) {
    if (this.isTombstoned(vt.id)) {
      return;
    }

    if (this.valueTypes.has(vt.id)) {
      const curr = this.valueTypes.get(vt.id)!;
      if (curr.timestamp >= vt.timestamp) {
        return;
      }
    }

    const valueType: DBIValueType = {
      id: vt.id,
      timestamp: vt.timestamp,
      description: vt.description,
      serde: vt.serde,
      values: new Map(),
    };
    this.valueTypes.set(vt.id, valueType);
  }

  addValueTypes(vts: ValueType[]) {
    for (const vt of vts) {
      this.addValueType(vt);
    }
  }

  addLinkType(lt: LinkType) {
    if (this.isTombstoned(lt.id)) {
      return;
    }

    if (this.linkTypes.has(lt.id)) {
      const curr = this.linkTypes.get(lt.id)!;
      if (curr.timestamp >= lt.timestamp) {
        return;
      }
    }

    const linkType: DBILinkType = {
      id: lt.id,
      timestamp: lt.timestamp,
      description: lt.description,
      links: new Map(),
    };
    this.linkTypes.set(lt.id, linkType);
  }

  addLinkTypes(lts: LinkType[]) {
    for (const lt of lts) {
      this.addLinkType(lt);
    }
  }

  addValue(v: Value) {
    if (this.isTombstoned(v.id)) {
      return;
    }

    const type = this.valueTypes.get(v.type);
    if (!type) {
      throw new Error(`Value has unknown valueType ${v.type}`);
    }

    if (!this.entities.has(v.entity)) {
      this.entities.set(v.entity, newEntity(v.entity));
    }
    const entity = this.entities.get(v.entity)!;

    if (type.values.has(v.id)) {
      const curr = type.values.get(v.id)!;
      if (curr.timestamp >= v.timestamp) {
        return;
      }
    }

    const value: DBIValue = {
      id: v.id,
      entity,
      timestamp: v.timestamp,
      type,
      value: v.value,
    };
    entity.values.set(v.id, value);
    type.values.set(v.id, value);
  }

  addValues(vs: Value[]) {
    for (const v of vs) {
      this.addValue(v);
    }
  }

  addLink(l: Link) {
    if (this.isTombstoned(l.id)) {
      return;
    }

    const type = this.linkTypes.get(l.type);
    if (!type) {
      throw new Error(`Link has unknown linkType ${l.type}`);
    }

    if (!this.entities.has(l.a)) {
      this.entities.set(l.a, newEntity(l.a));
    }
    const a = this.entities.get(l.a)!;

    if (!this.entities.has(l.b)) {
      this.entities.set(l.b, newEntity(l.b));
    }
    const b = this.entities.get(l.b)!;

    if (type.links.has(l.id)) {
      const curr = type.links.get(l.id)!;
      if (curr.timestamp >= l.timestamp) {
        return;
      }
    }

    const link: DBILink = {
      id: l.id,
      type,
      timestamp: l.timestamp,
      a,
      b,
    };
    a.btoa.set(l.id, link);
    b.atob.set(l.id, link);
    type.links.set(l.id, link);
  }

  addLinks(ls: Link[]) {
    for (const l of ls) {
      this.addLink(l);
    }
  }

  isTombstoned(id: string): boolean {
    return this.tombstones.has(id);
  }

  deleteValue(value: DBIValue) {
    if (!this.entities.has(value.entity.id)) {
      return;
    }

    const tombstone: DBITombstone = {
      id: value.id,
      timestamp: new Date(),
    };
    this.tombstones.set(value.id, tombstone);

    const { entity } = value;
    entity.values.delete(value.id);
    value.type.values.delete(value.id);
    this.pruneIfEmpty(entity);
  }

  deleteLink(link: DBILink) {
    if (!this.entities.has(link.a.id) || !this.entities.has(link.b.id)) {
      return;
    }

    const tombstone: DBITombstone = {
      id: link.id,
      timestamp: new Date(),
    };
    this.tombstones.set(link.id, tombstone);

    const { a, b } = link;
    a.btoa.delete(link.id);
    b.atob.delete(link.id);
    link.type.links.delete(link.id);
    this.pruneIfEmpty(a);
    this.pruneIfEmpty(b);
  }

  private pruneIfEmpty(e: DBIEntity) {
    if (!this.entities.has(e.id)) {
      return;
    }

    if (!e.values.size && !e.btoa.size && !e.atob.size) {
      this.entities.delete(e.id);
    }
  }

  private reset() {
    this.tombstones.clear();
    this.valueTypes.clear();
    this.linkTypes.clear();
    this.entities.clear();
  }

  log() {
    console.log(this);
  }

  getAllEntities(): DBIEntity[] {
    return Array.from(this.entities.values());
  }
}
