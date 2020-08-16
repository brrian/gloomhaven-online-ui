import { decorate, observable } from 'mobx';
import { Ploppable } from '../plops/models';

interface Assets {
  [id: string]: Ploppable;
}

export default class ScenarioStore {
  public assets: Assets = {};

  public placeAsset = (plop: Ploppable): void => {
    this.assets[plop.id] = plop;
  };
}

decorate(ScenarioStore, {
  assets: observable,
});
