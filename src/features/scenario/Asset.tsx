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
  const { assetId, meta, name, rotation, type, x, y } = asset;

  const dataAttrs = meta
    ? Object.entries(meta).reduce(
        (accAttrs, [key, value]) => ({ ...accAttrs, [`data-${key}`]: value }),
        {}
      )
    : undefined;

  let orientation = '';
  if (type === 'monsters') {
    orientation = rotation % 60 === 0 ? '-h' : '-v';
  }

  let transform = `translate(${x}px, ${y}px)`;
  if (type !== 'monsters') {
    transform += ` rotate(${rotation}deg)`;
  }

  return (
    <div
      className={cc([styles.asset, className])}
      data-type={type}
      onDoubleClick={onDoubleClick ? () => onDoubleClick(asset) : undefined}
      style={{ transform }}
      {...dataAttrs}
    >
      <img alt={name} src={`/assets/${type}/${assetId}${orientation}.png`} />
    </div>
  );
};

export default Asset;
