import cc from 'classcat';
import { kebabCase } from 'lodash-es';
import React, { FC } from 'react';
import { Asset as IAsset } from '../session/models';
import styles from './Asset.module.scss';
import getAssetSrc from './util/getAssetSrc';

interface AssetProps {
  asset: IAsset;
  className?: string;
  onDoubleClick?: (asset: IAsset) => void;
}

const Asset: FC<AssetProps> = ({ asset, className, onDoubleClick }) => {
  const { assetId, meta, name, rotation, type, x, y } = asset;

  const dataAttrs = meta
    ? Object.entries(meta).reduce(
        (accAttrs, [key, value]) => ({
          ...accAttrs,
          [`data-${kebabCase(key)}`]: value,
        }),
        {}
      )
    : undefined;

  let transform = `translate(${x}px, ${y}px)`;
  if (type !== 'monsters') {
    transform += ` rotate(${rotation}deg)`;
  }

  const src = getAssetSrc(asset);

  return (
    <div
      className={cc([styles.asset, className])}
      data-asset={assetId}
      data-type={type}
      onDoubleClick={onDoubleClick ? () => onDoubleClick(asset) : undefined}
      style={{ transform }}
      {...dataAttrs}
    >
      <img alt={name} src={src} />
    </div>
  );
};

export default Asset;
