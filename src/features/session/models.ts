export interface Assets {
  [id: string]: Asset;
}

export interface Asset {
  assetId: string;
  height: number;
  id: string;
  inTransit: boolean;
  meta?: AssetMeta;
  name: string;
  rotation: number;
  type: AssetType;
  width: number;
  x: number;
  y: number;
}

export type AssetType = 'classes' | 'monsters' | 'tiles' | 'tokens';

interface AssetMeta {
  [key: string]: any;
}

export interface Connection {
  id: string;
  name: string;
}

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
