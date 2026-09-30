import type { DBIEntity } from '../../../db/DBIndex/types';
import { ValueDisplay } from '../value/ValueDisplay';

type Props = {
  entity: DBIEntity;
};

export default function EntityDisplay({ entity }: Props) {
  const values = entity.values.values().toArray();

  return (
    <div class="vt-row">
      <pre>
        {entity.id}
        {values.map((value) => (
          <ValueDisplay
            value={{
              id: value.id,
              entity: value.entity.id,
              timestamp: value.timestamp,
              type: value.type.id,
              value: value.value,
            }}
          />
        ))}
      </pre>
    </div>
  );
}
