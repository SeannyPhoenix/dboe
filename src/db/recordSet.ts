import { Temporal } from "temporal-polyfill";

import { ValueType, Value, LinkType, Link, Tombstone } from "./types/types";

export type RecordSet = {
  valueTypes: ValueType[];
  values: Value[];
  linkTypes: LinkType[];
  links: Link[];
  tombstones: Tombstone[];
};

export function newRecordSet(from?: RecordSet) {
  const rs: RecordSet = {
    valueTypes: [],
    values: [],
    linkTypes: [],
    links: [],
    tombstones: [],
  };

  if (from) {
    rs.valueTypes = [...from.valueTypes];
    rs.values = [...from.values];
    rs.linkTypes = [...from.linkTypes];
    rs.links = [...from.links];
    rs.tombstones = [...from.tombstones];
  }

  return rs;
}

export function sortRecordSet(rs: RecordSet) {
  function byTimestamp<T extends { timestamp: Temporal.Instant }>(a: T, b: T) {
    return Temporal.Instant.compare(a.timestamp, b.timestamp);
  }

  rs.valueTypes.sort(byTimestamp);
  rs.values.sort(byTimestamp);
  rs.linkTypes.sort(byTimestamp);
  rs.links.sort(byTimestamp);
  rs.tombstones.sort(byTimestamp);

  return rs;
}
