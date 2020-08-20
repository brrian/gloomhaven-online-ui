import { useLocalStore } from 'mobx-react-lite';
import React, { createContext, FC, useContext } from 'react';
import PeersStore from './features/peers/peersStore';
import PlopsStore from './features/plops/plopsStore';
import SessionStore from './features/session/sessionStore';

interface StoreContext {
  peers: PeersStore;
  plops: PlopsStore;
  session: SessionStore;
}

const StoreContext = createContext<StoreContext | undefined>(undefined);

export const useStore = (): StoreContext => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore used outside of StoreContextProvider');
  }

  return store;
};

export const usePeersStore = (): PeersStore => {
  return useStore().peers;
};

export const usePlopsStore = (): PlopsStore => {
  return useStore().plops;
};

export const useSessionStore = (): SessionStore => {
  return useStore().session;
};

export const StoreContextProvider: FC = ({ children }) => {
  const store = useLocalStore(() => ({
    peers: new PeersStore(),
    plops: new PlopsStore(),
    session: new SessionStore(),
  }));

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};
