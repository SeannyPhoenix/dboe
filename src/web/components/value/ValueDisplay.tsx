import { DBIValue } from '../../../db/DBIndex/types';
import Actions from './Actions';

type Props = {
  value: DBIValue;
};

export default function ValueDisplay({ value }: Props) {
  const valueString = String(value.value);

  return (
    <tr>
      <td>{value.type.description}</td>
      <td>{valueString}</td>
      <td>
        <Actions value={value} />
      </td>
    </tr>
  );
}
