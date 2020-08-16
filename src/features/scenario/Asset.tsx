import React, { FC } from 'react';
import { Ploppable } from '../plops/models';

type AssetProps = Ploppable;

const Asset: FC<AssetProps> = ({ asset, name, rotation, type, x, y }) => {
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

export default Asset;
