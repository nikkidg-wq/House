
export type Character = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type FurnitureItem = {
  id: string;
  name: string;
  price: number;
  category: 'bedroom' | 'kitchen' | 'living' | 'garage' | 'other';
  color: string;
  width: number;
  height: number;
  depth: number;
};

export interface FurnitureItem3D extends FurnitureItem {}

export type PlacedItem = {
  id: string;
  itemId: string;
  x: number;
  y: number;
  floor: number;
};

export type GameState = 'character_select' | 'playing' | 'at_bank';

export type WorldState = {
  money: number;
  currentFloor: number;
  placedItems: PlacedItem[];
  selectedCharacter: Character | null;
  playerPos: { x: number; y: number };
};
