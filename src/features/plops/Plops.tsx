import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { usePlopsStore } from '../../store';
import Plop from './Plop';

const Plops: FC = () => {
  const { plops } = usePlopsStore();

  return (
    <div>
      {Object.values(plops).map(plop => (
        <Plop key={plop.id} {...plop} />
      ))}
    </div>
  );
};

export default observer(Plops);
