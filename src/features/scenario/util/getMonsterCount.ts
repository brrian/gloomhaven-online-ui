import { Ploppable } from '../../plops/models';
import { Assets } from '../../session/models';

export default function getMonsterCount(
  assets: Assets = {},
  plop: Ploppable
): number {
  const counts = Object.values(assets).reduce((accCounts, asset) => {
    if (asset.type === 'monsters' && asset.assetId === plop.assetId) {
      const foundCount = asset.meta?.monsterCount;

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
