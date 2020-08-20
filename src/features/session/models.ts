import { Ploppable } from '../plops/models';

export interface Assets {
  [id: string]: Ploppable;
}

type Connection = string;

export interface Session {
  id: string;
  scenario: Scenario;
}

export interface JoinedSession {
  session: Session;
  connections: Connection[];
}

export type Scenario = {
  assets: Assets;
};

export interface Subscriptions {
  [action: string]: Handler[];
}

export type Handler = (payload: any) => void;
