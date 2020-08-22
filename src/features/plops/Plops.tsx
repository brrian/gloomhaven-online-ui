import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { usePlopsStore } from '../../store';
import Asset from '../scenario/Asset';

const Plops: FC = () => {
  const { plops } = usePlopsStore();

  return (
    <div>
      {Object.values(plops).map(plop => (
        <Asset key={plop.id} {...plop} />
      ))}
    </div>
  );
};

export default observer(Plops);
