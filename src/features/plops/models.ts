import { Asset } from '../session/models';

export interface Ploppable extends Asset {
  clonedFromAsset?: string;
}
