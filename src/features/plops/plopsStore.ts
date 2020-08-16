import { decorate, observable } from 'mobx';
import { v4 as uuid } from 'uuid';
import { Ploppable } from './models';

interface Plops {
  [id: string]: Ploppable;
}

export default class PlopsStore {
  public activePlop: Ploppable | undefined;

  public plops: Plops = {};

  public createPlopper = (asset: Asset): void => {
    const id = uuid();

    const plop: Ploppable = {
      ...asset,
      asset: asset.id,
      id,
      rotation: 0,
      type: 'tile',
      x: 0,
      y: 0,
    };

    this.activePlop = plop;
    this.plops[id] = plop;
  };

  public deletePlopById = (id: string): void => {
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
