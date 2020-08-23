import { decorate, observable } from 'mobx';
import { v4 as uuid } from 'uuid';
import assets from '../../assets.json';
import { AssetType } from '../session/models';
import { Ploppable } from './models';

interface Plops {
  [id: string]: Ploppable;
}

export default class PlopsStore {
  public activePlop: Ploppable | undefined;

  public plops: Plops = {};

  public createPlopper = (
    type: AssetType,
    assetId: string,
    initialProps?: Partial<Ploppable>
  ): void => {
    const id = uuid();

    const asset = assets[type].find(asset => asset.id === assetId);

    if (!asset) {
      throw new Error(
        `Unable to find asset with type "${type}" and id "${assetId}"`
      );
    }

    const plop: Ploppable = {
      ...asset,
      assetId: asset.id,
      id,
      inTransit: true,
      rotation: 0,
      type,
      x: 0,
      y: 0,
      ...initialProps,
    };

    this.activePlop = plop;
    this.plops[id] = plop;
  };

  public destroyPlop = (id: string): void => {
    if (this.activePlop?.id === id) {
      this.activePlop = undefined;
    }

    delete this.plops[id];
  };

  public getPlopById = (id: string): Ploppable => {
    return this.plops[id];
  };

  public updatePlop = (id: string, updates: Partial<Ploppable>): void => {
    const newPlop = {
      ...this.plops[id],
      ...updates,
    };

    if (this.activePlop?.id === id) {
      this.activePlop = newPlop;
    }

    this.plops[id] = newPlop;
  };
}

decorate(PlopsStore, {
  activePlop: observable,
  plops: observable,
});
