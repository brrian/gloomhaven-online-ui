import cc from 'classcat';
import React, { FC } from 'react';
import { Asset as IAsset } from '../session/models';
import styles from './Asset.module.scss';

interface AssetProps {
  asset: IAsset;
  className?: string;
  onDoubleClick?: (asset: IAsset) => void;
}

const Asset: FC<AssetProps> = ({ asset, className, onDoubleClick }) => {
  const { assetId, name, rotation, type, x, y } = asset;

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
    <div
      className={cc([styles.asset, className])}
      data-type={type}
      onDoubleClick={onDoubleClick ? () => onDoubleClick(asset) : undefined}
      style={{ transform }}
    >
      <img alt={name} src={`/assets/${type}/${assetId}${orientation}.png`} />
    </div>
  );
};

export default Asset;
