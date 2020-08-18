import { Ploppable } from '../plops/models';

export interface SessionCreatedPayload {
  id: string;
  scenario: Scenario;
}

interface Assets {
  [id: string]: Ploppable;
}

export type Scenario = {
  assets: Assets;
};

export interface Subscriptions {
  [action: string]: Handler[];
}

export type Handler = (payload: any) => void;
