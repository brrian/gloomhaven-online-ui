import { AssetSources } from '../models';
import classes from './classes';
import monsters from './monsters';
import summons from './summons';
import tiles from './tiles';
import token from './tokens';

const assetSources: AssetSources = {
  ...classes,
  ...monsters,
  ...summons,
  ...tiles,
  ...token,
};

export default assetSources;
