import { Temporal } from 'temporal-polyfill';

import { Value, ValueType, Link, LinkType, Tombstone } from '../types/types';

export function writeValueTypes(valueTypes: ValueType[]) {
  localStorage.setItem('valueTypes', JSON.stringify(valueTypes));
}

export function readValueTypes(): ValueType[] {
  const data = localStorage.getItem('valueTypes');
  if (!data) {
    throw new Error('No valueTypes found in localStorage');
  }
  const raw = JSON.parse(data);
  return raw.map((item: Record<string, string>) => ({
    ...item,
    timestamp: Temporal.Instant.from(item.timestamp),
  }));
}

export function writeLinkTypes(linkTypes: LinkType[]) {
  localStorage.setItem('linkTypes', JSON.stringify(linkTypes));
}

export function readLinkTypes(): LinkType[] {
  const data = localStorage.getItem('linkTypes');
  if (!data) {
    throw new Error('No linkTypes found in localStorage');
  }
  const raw = JSON.parse(data);
  return raw.map((item: Record<string, string>) => ({
    ...item,
    timestamp: Temporal.Instant.from(item.timestamp),
  }));
}

export function writeValues(values: Value[]) {
  localStorage.setItem('values', JSON.stringify(values));
}

export function readValues(): Value[] {
  const data = localStorage.getItem('values');
  if (!data) {
    throw new Error('No values found in localStorage');
  }
  const raw = JSON.parse(data);
  return raw.map((item: Record<string, string>) => ({
    ...item,
    timestamp: Temporal.Instant.from(item.timestamp),
  }));
}

export function writeLinks(links: Link[]) {
  localStorage.setItem('links', JSON.stringify(links));
}

export function readLinks(): Link[] {
  const data = localStorage.getItem('links');
  if (!data) {
    throw new Error('No links found in localStorage');
  }
  const raw = JSON.parse(data);
  return raw.map((item: Record<string, string>) => ({
    ...item,
    timestamp: Temporal.Instant.from(item.timestamp),
  }));
}

export function writeTombstones(tombstones: Tombstone[]) {
  localStorage.setItem('tombstones', JSON.stringify(tombstones));
}

export function readTombstones(): Tombstone[] {
  const data = localStorage.getItem('tombstones');
  if (!data) {
    throw new Error('No tombstones found in localStorage');
  }
  const raw = JSON.parse(data);
  return raw.map((item: Record<string, string>) => ({
    ...item,
    timestamp: Temporal.Instant.from(item.timestamp),
  }));
}
