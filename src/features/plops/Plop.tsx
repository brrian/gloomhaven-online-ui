import React, { FC } from 'react';
import { Ploppable } from './models';
import styles from './Plop.module.scss';

type PlopProps = Ploppable;

const Plop: FC<PlopProps> = ({ asset, rotation, name, type, x, y }) => {
  return (
    <div
      className={styles.plop}
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
      }}
    >
      <img alt={name} src={`/assets/${type}s/${asset}.png`} />
    </div>
  );
};

export default Plop;
