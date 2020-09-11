import { Ploppable } from '../../plops/models';
import { Assets } from '../../session/models';

export default function getAssetCount(
  assets: Assets = {},
  plop: Ploppable
): number {
  const counts = Object.values(assets).reduce((accCounts, asset) => {
    if (asset.assetId === plop.assetId) {
      const foundCount = asset.meta?.assetCount;

      if (foundCount) {
        accCounts.add(foundCount);
      }
    }

    return accCounts;
  }, new Set<number>());

  let count = 1;

  while (counts.has(count)) {
    count += 1;
  }

  return count;
}
