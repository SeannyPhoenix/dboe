import { Temporal } from 'temporal-polyfill';

import type { DBIEntity, DBIValue } from '../../../db/DBIndex/types';
import { createReactive } from '../../reactive/reactive';
import { Select, SelectOption } from '../form/select/Select';
import ValueDisplay from '../value/ValueDisplay';

const BY_TIMESTAMP = 'by timestamp';
const BY_TYPE_DESCRIPTION = 'by type description';
const BY_VALUE = 'by value';
type SortBy = typeof BY_TIMESTAMP | typeof BY_TYPE_DESCRIPTION | typeof BY_VALUE;

const sortBySelectorOptions: SelectOption[] = [
  { label: BY_TIMESTAMP, value: BY_TIMESTAMP },
  { label: BY_TYPE_DESCRIPTION, value: BY_TYPE_DESCRIPTION },
  { label: BY_VALUE, value: BY_VALUE },
];

function byTimestamp(a: DBIValue, b: DBIValue) {
  return Temporal.Instant.compare(a.timestamp, b.timestamp);
}

function byTypeDescription(a: DBIValue, b: DBIValue) {
  return a.type.description.localeCompare(b.type.description);
}

function byValue(a: DBIValue, b: DBIValue) {
  return String(a.value).localeCompare(String(b.value));
}

const sortFuncs: Record<SortBy, (a: DBIValue, b: DBIValue) => number> = {
  [BY_TIMESTAMP]: byTimestamp,
  [BY_TYPE_DESCRIPTION]: byTypeDescription,
  [BY_VALUE]: byValue,
};

type Props = {
  entity: DBIEntity;
};

export default function EntityDisplay({ entity }: Props) {
  const values = entity.values.values().toArray().sort(byTypeDescription);

  const sortBy = createReactive<SortBy>(BY_TIMESTAMP);
  function valueItems() {
    const sortFunc = sortFuncs[sortBy.get()] ?? byTimestamp;
    return (
      <>
        {values.sort(sortFunc).map((value) => (
          <ValueDisplay value={value} />
        ))}
      </>
    );
  }

  const table = (
    <table>
      <tbody>{valueItems()}</tbody>
    </table>
  ) as HTMLTableElement;

  sortBy.subscribe(() => {
    table.replaceChildren(valueItems());
  });

  return (
    <div class="entity">
      <pre class="entity-id">{entity.id}</pre>
      <Select state={sortBy} options={sortBySelectorOptions} />
      {table}
    </div>
  );
}
