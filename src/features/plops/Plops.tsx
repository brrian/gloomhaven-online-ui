import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { usePlopsStore } from '../../store';
import Asset from '../scenario/Asset';
import styles from './Plops.module.scss';

const Plops: FC = () => {
  const { plops } = usePlopsStore();

  return (
    <div>
      {Object.values(plops).map(plop => (
        <Asset asset={plop} className={styles.inTransit} key={plop.id} />
      ))}
    </div>
  );
};

export default observer(Plops);
