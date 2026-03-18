import { Character, FurnitureItem } from './types';

export const CHARACTERS: Character[] = [
  { id: 'cody', name: 'Cody (Son)', color: '#3b82f6', icon: '👦' },
  { id: 'maria', name: 'Maria (Mommy)', color: '#ec4899', icon: '👩' },
  { id: 'jose', name: 'Jose (Daddy)', color: '#10b981', icon: '👨' },
  { id: 'ana', name: 'Ana (Ate)', color: '#f59e0b', icon: '👧' },
];

export const FURNITURE: FurnitureItem[] = [
  { id: 'bed', name: 'Comfy Bed', price: 50, category: 'bedroom', color: '#6366f1', width: 2, height: 0.5, depth: 3 },
  { id: 'table', name: 'Dining Table', price: 30, category: 'kitchen', color: '#92400e', width: 2, height: 0.8, depth: 2 },
  { id: 'chair', name: 'Wooden Chair', price: 10, category: 'kitchen', color: '#b45309', width: 0.8, height: 1, depth: 0.8 },
  { id: 'tv', name: 'Big TV', price: 100, category: 'living', color: '#1f2937', width: 2, height: 1.2, depth: 0.2 },
  { id: 'sofa', name: 'Soft Sofa', price: 80, category: 'living', color: '#ef4444', width: 3, height: 0.8, depth: 1.2 },
  { id: 'fridge', name: 'Cool Fridge', price: 120, category: 'kitchen', color: '#f8fafc', width: 1, height: 2, depth: 1 },
  { id: 'lamp', name: 'Bright Lamp', price: 15, category: 'other', color: '#fbbf24', width: 0.4, height: 1.5, depth: 0.4 },
  { id: 'toybox', name: 'Toy Box', price: 25, category: 'bedroom', color: '#8b5cf6', width: 1.2, height: 0.8, depth: 1 },
  { id: 'rug', name: 'Fluffy Rug', price: 20, category: 'other', color: '#10b981', width: 3, height: 0.05, depth: 3 },
  { id: 'bookshelf', name: 'Bookshelf', price: 40, category: 'other', color: '#78350f', width: 2, height: 2, depth: 0.6 },
  { id: 'garage', name: 'Big Garage', price: 250, category: 'garage', color: '#94a3b8', width: 6, height: 4, depth: 6 },
  { id: 'car_red', name: 'Red Sports Car', price: 150, category: 'garage', color: '#ef4444', width: 2, height: 1, depth: 4 },
  { id: 'car_blue', name: 'Blue Family Car', price: 130, category: 'garage', color: '#3b82f6', width: 2.2, height: 1.2, depth: 4.5 },
];

export const GRID_SIZE = 1; // 1 unit in 3D
export const WORLD_WIDTH = 30;
export const WORLD_HEIGHT = 20;
export const FLOOR_HEIGHT = 3;
