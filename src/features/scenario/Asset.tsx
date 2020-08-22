import React, { FC } from 'react';
import { Ploppable } from '../plops/models';
import styles from './Asset.module.scss';

type AssetProps = Ploppable;

const Asset: FC<AssetProps> = ({ assetId, name, rotation, type, x, y }) => {
  let orientation = '';
  if (type === 'monsters') {
    orientation = rotation % 60 === 0 ? '-h' : '-v';
  }

  let transform = `translate(${x}px, ${y}px)`;
  if (type !== 'monsters') {
    transform += ` rotate(${rotation}deg)`;
  } else {
    transform += ' scale(.44)';
  }

  return (
    <div className={styles.asset} data-type={type} style={{ transform }}>
      <img alt={name} src={`/assets/${type}/${assetId}${orientation}.png`} />
    </div>
  );
};

export default Asset;
