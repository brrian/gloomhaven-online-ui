import { Instance, SignalData } from 'simple-peer';

export interface PeerConnection {
  connectionId: string;
  peer: Instance;
}

export interface SignalEvent {
  connectionId: string;
  signal: SignalData;
}

export interface Subscriptions {
  [action: string]: Handler[];
}

export type Handler = (payload: any) => void;
