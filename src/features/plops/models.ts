export type Ploppable = Monster | Tile;

export type AssetType = 'monsters' | 'tiles';

interface Monster extends PloppableBase {
  type: 'monsters';
}

interface Tile extends PloppableBase {
  type: 'tiles';
}

interface PloppableBase {
  assetId: string;
  height: number;
  id: string;
  name: string;
  rotation: number;
  width: number;
  x: number;
  y: number;
}
