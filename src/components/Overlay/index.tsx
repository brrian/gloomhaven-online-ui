import React, { FC } from 'react';
import styles from './styles.module.scss';
import { Ploppable } from '../Session/models';

type OverlayProps = Ploppable;

const Overlay: FC<OverlayProps> = ({ asset, rotation, name, type, x, y }) => {
  return (
    <div
      className={styles.overlay}
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
      }}
    >
      <img alt={name} src={`assets/${type}s/${asset}.png`} />
    </div>
  );
};

export default Overlay;
