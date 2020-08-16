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
