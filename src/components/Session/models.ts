export interface Overlays {
  [id: string]: Ploppable;
}

export type Ploppable = Tile;

interface Tile extends PloppableBase {
  type: 'tile';
}

interface PloppableBase extends Omit<Asset, 'id'> {
  asset: string;
  id: string;
  rotation: number;
  x: number;
  y: number;
}

export interface Asset {
  height: number;
  id: string;
  name: string;
  width: number;
}
