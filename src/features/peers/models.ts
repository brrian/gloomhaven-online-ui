import { Instance, SignalData } from 'simple-peer';
import { Connection } from '../session/models';

export interface PeerConnection extends Connection {
  peer: Instance;
}

export interface SignalEvent {
  connection: Connection;
  signal: SignalData;
}

export interface Subscriptions {
  [action: string]: Handler[];
}

export type Handler = (payload: any) => void;
