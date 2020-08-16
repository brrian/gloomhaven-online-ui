import React, { FC } from 'react';
import { Ploppable } from '../Session/models';

type PlopProps = Ploppable;

const Plop: FC<PlopProps> = ({ asset, name, rotation, type, x, y }) => {
  return (
    <img
      alt={name}
      src={`assets/${type}s/${asset}.png`}
      style={{
        position: 'absolute',
        top: y,
        left: x,
        transform: `rotate(${rotation}deg)`,
      }}
    />
  );
};

export default Plop;
