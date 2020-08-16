import { useLocalStore } from 'mobx-react-lite';
import React, { createContext, FC, useContext } from 'react';
import PlopsStore from './features/plops/plopsStore';
import ScenarioStore from './features/scenario/scenarioStore';

interface StoreContext {
  plops: PlopsStore;
  scenario: ScenarioStore;
}

const StoreContext = createContext<StoreContext | undefined>(undefined);

export const useStore = (): StoreContext => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore used outside of StoreContextProvider');
  }

  return store;
};

export const usePlopsStore = (): PlopsStore => {
  return useStore().plops;
};

export const useScenarioStore = (): ScenarioStore => {
  return useStore().scenario;
};

export const StoreContextProvider: FC = ({ children }) => {
  const store = useLocalStore(() => ({
    plops: new PlopsStore(),
    scenario: new ScenarioStore(),
  }));

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
