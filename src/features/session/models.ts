export interface Assets {
  [id: string]: Asset;
}

export interface Asset {
  assetId: string;
  height: number;
  id: string;
  inTransit: boolean;
  name: string;
  rotation: number;
  type: AssetType;
  width: number;
  x: number;
  y: number;
}

export type AssetType = 'classes' | 'monsters' | 'tiles' | 'tokens';

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
