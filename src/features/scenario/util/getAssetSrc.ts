import { Asset } from '../../session/models';
import assetSources from '../assets';

export default function getAssetSrc({
  assetId,
  type,
  rotation,
}: Asset): string {
  if (type === 'monsters') {
    const orientation = rotation % 60 === 0 ? 'h' : 'v';
    return assetSources[`${assetId}-${orientation}`];
  }

  return assetSources[assetId];
}
