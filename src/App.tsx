/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Text, 
  Box, 
  Plane, 
  Environment,
  ContactShadows,
  Float,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, 
  Home, 
  Building2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  User, 
  Music, 
  Music2,
  Trash2,
  ChevronUp,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { CHARACTERS, FURNITURE, WORLD_WIDTH, WORLD_HEIGHT, FLOOR_HEIGHT } from './constants';
import { Character, FurnitureItem3D, PlacedItem, GameState } from './types';

// --- 3D Components ---

function Player3D({ character, position }: { character: Character, position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  const skinColor = "#c68642"; // Warm tan / Morena skin tone
  const hairColor = "#1a1a1a"; // Black hair

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle bobbing
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Torso */}
      <Box args={[0.6, 0.8, 0.3]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={character.color} />
      </Box>
      
      {/* Head */}
      <Box args={[0.4, 0.4, 0.4]} position={[0, 1.4, 0]}>
        <meshStandardMaterial color={skinColor} />
      </Box>
      
      {/* Hair (Top) */}
      <Box args={[0.45, 0.15, 0.45]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color={hairColor} />
      </Box>
      {/* Hair (Back) */}
      <Box args={[0.45, 0.3, 0.1]} position={[0, 1.45, -0.2]}>
        <meshStandardMaterial color={hairColor} />
      </Box>

      {/* Arms */}
      <Box args={[0.2, 0.6, 0.2]} position={[-0.45, 0.9, 0]}>
        <meshStandardMaterial color={skinColor} />
      </Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.45, 0.9, 0]}>
        <meshStandardMaterial color={skinColor} />
      </Box>

      {/* Legs */}
      <Box args={[0.25, 0.7, 0.25]} position={[-0.2, 0.35, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[0.25, 0.7, 0.25]} position={[0.2, 0.35, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>

      {/* Icon Label */}
      <Html position={[0, 2.2, 0]} center>
        <div className="text-4xl select-none pointer-events-none drop-shadow-md">
          {character.icon}
        </div>
      </Html>
    </group>
  );
}

// --- Realistic Furniture Components ---

function BedModel({ color }: { color: string }) {
  return (
    <group>
      {/* Frame */}
      <Box args={[2, 0.3, 3]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#4b2c20" />
      </Box>
      {/* Mattress */}
      <Box args={[1.9, 0.3, 2.8]} position={[0, 0.4, 0.1]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Pillow */}
      <Box args={[1.6, 0.15, 0.6]} position={[0, 0.6, -0.9]}>
        <meshStandardMaterial color="white" />
      </Box>
      {/* Headboard */}
      <Box args={[2, 1, 0.2]} position={[0, 0.5, -1.4]}>
        <meshStandardMaterial color="#4b2c20" />
      </Box>
    </group>
  );
}

function TableModel({ color }: { color: string }) {
  return (
    <group>
      {/* Top */}
      <Box args={[2, 0.1, 2]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Legs */}
      <Box args={[0.1, 0.7, 0.1]} position={[-0.9, 0.35, -0.9]}><meshStandardMaterial color={color} /></Box>
      <Box args={[0.1, 0.7, 0.1]} position={[0.9, 0.35, -0.9]}><meshStandardMaterial color={color} /></Box>
      <Box args={[0.1, 0.7, 0.1]} position={[-0.9, 0.35, 0.9]}><meshStandardMaterial color={color} /></Box>
      <Box args={[0.1, 0.7, 0.1]} position={[0.9, 0.35, 0.9]}><meshStandardMaterial color={color} /></Box>
    </group>
  );
}

function ChairModel({ color }: { color: string }) {
  return (
    <group>
      {/* Seat */}
      <Box args={[0.8, 0.1, 0.8]} position={[0, 0.45, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Back */}
      <Box args={[0.8, 0.6, 0.1]} position={[0, 0.75, -0.35]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Legs */}
      <Box args={[0.08, 0.4, 0.08]} position={[-0.35, 0.2, -0.35]}><meshStandardMaterial color={color} /></Box>
      <Box args={[0.08, 0.4, 0.08]} position={[0.35, 0.2, -0.35]}><meshStandardMaterial color={color} /></Box>
      <Box args={[0.08, 0.4, 0.08]} position={[-0.35, 0.2, 0.35]}><meshStandardMaterial color={color} /></Box>
      <Box args={[0.08, 0.4, 0.08]} position={[0.35, 0.2, 0.35]}><meshStandardMaterial color={color} /></Box>
    </group>
  );
}

function TVModel({ color }: { color: string }) {
  return (
    <group>
      {/* Stand */}
      <Box args={[0.8, 0.1, 0.4]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      <Box args={[0.1, 0.3, 0.1]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      {/* Screen Frame */}
      <Box args={[2, 1.2, 0.1]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#111" />
      </Box>
      {/* Screen */}
      <Box args={[1.8, 1, 0.02]} position={[0, 0.8, 0.05]}>
        <meshStandardMaterial color="#222" emissive="#111" />
      </Box>
    </group>
  );
}

function SofaModel({ color }: { color: string }) {
  return (
    <group>
      {/* Base */}
      <Box args={[3, 0.4, 1.2]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Back */}
      <Box args={[3, 0.8, 0.3]} position={[0, 0.6, -0.45]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Arms */}
      <Box args={[0.3, 0.6, 1.2]} position={[-1.35, 0.4, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Box args={[0.3, 0.6, 1.2]} position={[1.35, 0.4, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
    </group>
  );
}

function FridgeModel({ color }: { color: string }) {
  return (
    <group>
      {/* Body */}
      <Box args={[1, 2, 1]} position={[0, 1, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Door Line */}
      <Box args={[1.02, 0.02, 1.02]} position={[0, 1.3, 0]}>
        <meshStandardMaterial color="#ccc" />
      </Box>
      {/* Handles */}
      <Box args={[0.05, 0.4, 0.1]} position={[0.4, 1.5, 0.5]}>
        <meshStandardMaterial color="#999" />
      </Box>
      <Box args={[0.05, 0.4, 0.1]} position={[0.4, 0.7, 0.5]}>
        <meshStandardMaterial color="#999" />
      </Box>
    </group>
  );
}

function LampModel({ color }: { color: string }) {
  return (
    <group>
      {/* Base */}
      <Box args={[0.4, 0.1, 0.4]} position={[0, 0.05, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      {/* Pole */}
      <Box args={[0.05, 1.2, 0.05]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#333" />
      </Box>
      {/* Shade */}
      <Box args={[0.6, 0.5, 0.6]} position={[0, 1.25, 0]}>
        <meshStandardMaterial color={color} transparent opacity={0.9} emissive={color} emissiveIntensity={0.5} />
      </Box>
    </group>
  );
}

function ToyBoxModel({ color }: { color: string }) {
  return (
    <group>
      {/* Box */}
      <Box args={[1.2, 0.7, 1]} position={[0, 0.35, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Lid */}
      <Box args={[1.3, 0.1, 1.1]} position={[0, 0.75, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Handle */}
      <Box args={[0.4, 0.05, 0.1]} position={[0, 0.8, 0.45]}>
        <meshStandardMaterial color="#fff" />
      </Box>
    </group>
  );
}

function BookshelfModel({ color }: { color: string }) {
  return (
    <group>
      {/* Frame */}
      <Box args={[2, 2, 0.6]} position={[0, 1, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Shelves (cutouts) */}
      <Box args={[1.8, 0.05, 0.55]} position={[0, 0.5, 0.05]}><meshStandardMaterial color="#333" /></Box>
      <Box args={[1.8, 0.05, 0.55]} position={[0, 1.0, 0.05]}><meshStandardMaterial color="#333" /></Box>
      <Box args={[1.8, 0.05, 0.55]} position={[0, 1.5, 0.05]}><meshStandardMaterial color="#333" /></Box>
      {/* Some "Books" */}
      <Box args={[0.1, 0.4, 0.4]} position={[-0.7, 0.7, 0.1]}><meshStandardMaterial color="red" /></Box>
      <Box args={[0.1, 0.4, 0.4]} position={[-0.55, 0.7, 0.1]}><meshStandardMaterial color="blue" /></Box>
      <Box args={[0.1, 0.4, 0.4]} position={[0.2, 1.2, 0.1]}><meshStandardMaterial color="green" /></Box>
      <Box args={[0.1, 0.4, 0.4]} position={[0.35, 1.2, 0.1]}><meshStandardMaterial color="yellow" /></Box>
    </group>
  );
}

function GarageModel({ color }: { color: string }) {
  return (
    <group>
      {/* Walls */}
      <Box args={[6, 4, 0.2]} position={[0, 2, -2.9]}><meshStandardMaterial color={color} /></Box>
      <Box args={[0.2, 4, 6]} position={[-2.9, 2, 0]}><meshStandardMaterial color={color} /></Box>
      <Box args={[0.2, 4, 6]} position={[2.9, 2, 0]}><meshStandardMaterial color={color} /></Box>
      {/* Roof */}
      <Box args={[6.2, 0.2, 6.2]} position={[0, 4.1, 0]}><meshStandardMaterial color="#475569" /></Box>
      {/* Garage Door (Open) */}
      <Box args={[5.6, 0.1, 5.8]} position={[0, 3.8, 0]}><meshStandardMaterial color="#cbd5e1" /></Box>
      {/* Floor */}
      <Box args={[5.8, 0.1, 5.8]} position={[0, 0.05, 0]}><meshStandardMaterial color="#64748b" /></Box>
    </group>
  );
}

function CarModel({ color }: { color: string }) {
  return (
    <group>
      {/* Body Lower */}
      <Box args={[2, 0.6, 4]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Body Upper (Cabin) */}
      <Box args={[1.8, 0.6, 2]} position={[0, 1.0, -0.2]}>
        <meshStandardMaterial color={color} />
      </Box>
      {/* Windows */}
      <Box args={[1.82, 0.4, 1.8]} position={[0, 1.0, -0.2]}>
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.6} />
      </Box>
      {/* Wheels */}
      <Box args={[0.4, 0.4, 0.4]} position={[-0.9, 0.2, 1.2]}><meshStandardMaterial color="#111" /></Box>
      <Box args={[0.4, 0.4, 0.4]} position={[0.9, 0.2, 1.2]}><meshStandardMaterial color="#111" /></Box>
      <Box args={[0.4, 0.4, 0.4]} position={[-0.9, 0.2, -1.2]}><meshStandardMaterial color="#111" /></Box>
      <Box args={[0.4, 0.4, 0.4]} position={[0.9, 0.2, -1.2]}><meshStandardMaterial color="#111" /></Box>
      {/* Headlights */}
      <Box args={[0.4, 0.2, 0.1]} position={[-0.6, 0.5, 2.0]}><meshStandardMaterial color="#fff" emissive="#fff" /></Box>
      <Box args={[0.4, 0.2, 0.1]} position={[0.6, 0.5, 2.0]}><meshStandardMaterial color="#fff" emissive="#fff" /></Box>
    </group>
  );
}

function FurniturePiece({ item, placed, onRemove }: { item: FurnitureItem3D, placed: PlacedItem, onRemove: (id: string) => void }) {
  const renderModel = () => {
    switch (item.id) {
      case 'bed': return <BedModel color={item.color} />;
      case 'table': return <TableModel color={item.color} />;
      case 'chair': return <ChairModel color={item.color} />;
      case 'tv': return <TVModel color={item.color} />;
      case 'sofa': return <SofaModel color={item.color} />;
      case 'fridge': return <FridgeModel color={item.color} />;
      case 'lamp': return <LampModel color={item.color} />;
      case 'toybox': return <ToyBoxModel color={item.color} />;
      case 'bookshelf': return <BookshelfModel color={item.color} />;
      case 'garage': return <GarageModel color={item.color} />;
      case 'car_red':
      case 'car_blue': return <CarModel color={item.color} />;
      case 'rug': 
        return (
          <Plane args={[item.width, item.depth]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <meshStandardMaterial color={item.color} />
          </Plane>
        );
      default:
        return (
          <Box args={[item.width, item.height, item.depth]} position={[0, item.height / 2, 0]}>
            <meshStandardMaterial color={item.color} />
          </Box>
        );
    }
  };

  return (
    <group position={[placed.x - WORLD_WIDTH/2, (placed.floor - 1) * FLOOR_HEIGHT, placed.y - WORLD_HEIGHT/2]}>
      {renderModel()}
      {/* Selection/Delete UI */}
      <Html position={[0, item.height + 0.8, 0]} center>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove(placed.id);
          }}
          className="bg-red-500 p-1.5 rounded-full text-white shadow-lg hover:bg-red-600 transition-colors border-2 border-white"
        >
          <Trash2 size={14} />
        </button>
      </Html>
    </group>
  );
}

function HouseStructure({ currentFloor }: { currentFloor: number }) {
  const floors = [1, 2, 3, 4];
  
  return (
    <group>
      {floors.map((f) => (
        <group key={f} position={[0, (f - 1) * FLOOR_HEIGHT, 0]}>
          {/* Floor Plane */}
          <Plane args={[WORLD_WIDTH, WORLD_HEIGHT]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <meshStandardMaterial 
              color={f === currentFloor ? "#ffffff" : "#f1f5f9"} 
              transparent 
              opacity={f > currentFloor ? 0.1 : 1} 
            />
          </Plane>
          
          {/* Walls (only for current and lower floors) */}
          {f <= currentFloor && (
            <>
              <Box args={[WORLD_WIDTH, FLOOR_HEIGHT, 0.2]} position={[0, FLOOR_HEIGHT/2, -WORLD_HEIGHT/2]}>
                <meshStandardMaterial color="#e2e8f0" transparent opacity={0.5} />
              </Box>
              <Box args={[0.2, FLOOR_HEIGHT, WORLD_HEIGHT]} position={[-WORLD_WIDTH/2, FLOOR_HEIGHT/2, 0]}>
                <meshStandardMaterial color="#e2e8f0" transparent opacity={0.5} />
              </Box>
            </>
          )}
        </group>
      ))}
    </group>
  );
}

function BankStructure() {
  return (
    <group position={[WORLD_WIDTH/2 + 10, 0, 0]}>
      <Box args={[10, 8, 10]} position={[0, 4, 0]}>
        <meshStandardMaterial color="#cbd5e1" />
      </Box>
      <Box args={[4, 5, 0.2]} position={[0, 2.5, 5.1]}>
        <meshStandardMaterial color="#10b981" />
      </Box>
      <Html position={[0, 9, 0]} center>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-2xl border-4 border-emerald-500 flex flex-col items-center">
          <Building2 className="text-emerald-600 w-8 h-8" />
          <span className="font-black text-emerald-700">BANK</span>
        </div>
      </Html>
    </group>
  );
}

function CityBuildings() {
  return (
    <group>
      {/* Some background buildings to make it look like a city */}
      <Box args={[8, 20, 8]} position={[-25, 10, -20]}><meshStandardMaterial color="#94a3b8" /></Box>
      <Box args={[10, 15, 10]} position={[-30, 7.5, 10]}><meshStandardMaterial color="#64748b" /></Box>
      <Box args={[6, 25, 6]} position={[10, 12.5, -30]}><meshStandardMaterial color="#475569" /></Box>
      <Box args={[12, 18, 12]} position={[40, 9, -15]}><meshStandardMaterial color="#cbd5e1" /></Box>
      <Box args={[8, 12, 8]} position={[35, 6, 20]}><meshStandardMaterial color="#94a3b8" /></Box>
    </group>
  );
}

// --- Main App ---

export default function App() {
  const [gameState, setGameState] = useState<GameState>('character_select');
  const [money, setMoney] = useState(500);
  const [currentFloor, setCurrentFloor] = useState(1);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [drivingCarId, setDrivingCarId] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Using a more chill, lofi-style track for a relaxing atmosphere
    audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/05/27/audio_1808d3099c.mp3');
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) audioRef.current.pause();
      else audioRef.current.play().catch(e => console.log("Audio play failed", e));
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  const handleCharacterSelect = (char: Character) => {
    setSelectedCharacter(char);
    setGameState('playing');
  };

  const movePlayer = useCallback((dx: number, dy: number) => {
    setPlayerPos(prev => {
      const speed = drivingCarId ? 1.5 : 0.5;
      const newX = Math.max(-WORLD_WIDTH/2 - 25, Math.min(WORLD_WIDTH/2 + 35, prev.x + dx * speed));
      const newY = Math.max(-WORLD_HEIGHT/2 - 20, Math.min(WORLD_HEIGHT/2 + 20, prev.y + dy * speed));
      return { x: newX, y: newY };
    });
  }, [drivingCarId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showShop) return;
      switch (e.key) {
        case 'ArrowUp': case 'w': movePlayer(0, -1); break;
        case 'ArrowDown': case 's': movePlayer(0, 1); break;
        case 'ArrowLeft': case 'a': movePlayer(-1, 0); break;
        case 'ArrowRight': case 'd': movePlayer(1, 0); break;
        case 'e': 
          if (drivingCarId) {
            setDrivingCarId(null);
          } else {
            const nearby = findNearbyCar();
            if (nearby) setDrivingCarId(nearby.id);
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, showShop, drivingCarId]);

  // Sync car position with player when driving
  useEffect(() => {
    if (drivingCarId) {
      setPlacedItems(prev => prev.map(item => 
        item.id === drivingCarId 
        ? { ...item, x: playerPos.x + WORLD_WIDTH/2, y: playerPos.y + WORLD_HEIGHT/2 } 
        : item
      ));
    }
  }, [playerPos, drivingCarId]);

  // Check bank proximity
  useEffect(() => {
    if (playerPos.x > WORLD_WIDTH/2 + 5) {
      // Auto-collect money if near bank
      const interval = setInterval(() => {
        setMoney(m => m + 10);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playerPos.x]);

  const findNearbyCar = () => {
    if (currentFloor !== 1) return null;
    return placedItems.find(item => {
      const furniture = FURNITURE.find(f => f.id === item.itemId);
      if (furniture?.category !== 'garage' || furniture.id === 'garage') return false;
      const dist = Math.sqrt(
        Math.pow(item.x - (playerPos.x + WORLD_WIDTH/2), 2) + 
        Math.pow(item.y - (playerPos.y + WORLD_HEIGHT/2), 2)
      );
      return dist < 3;
    });
  };

  const nearbyCar = findNearbyCar();

  const buyItem = (item: FurnitureItem3D) => {
    if (money >= item.price) {
      const newItem: PlacedItem = {
        id: Math.random().toString(36).substr(2, 9),
        itemId: item.id,
        x: playerPos.x + WORLD_WIDTH/2,
        y: playerPos.y + WORLD_HEIGHT/2,
        floor: currentFloor
      };
      setPlacedItems([...placedItems, newItem]);
      setMoney(money - item.price);
      setShowShop(false);
    }
  };

  const removeItem = (id: string) => {
    const itemToRemove = placedItems.find(i => i.id === id);
    if (itemToRemove) {
      const furniture = FURNITURE.find(f => f.id === itemToRemove.itemId);
      if (furniture) {
        setMoney(money + Math.floor(furniture.price * 0.8));
      }
      setPlacedItems(placedItems.filter(i => i.id !== id));
    }
  };

  if (gameState === 'character_select') {
    return (
      <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-4 font-sans">
        <motion.h1 
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-6xl font-bold text-sky-600 mb-12 text-center drop-shadow-sm"
        >
          Cody's 3D Dream House
        </motion.h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
          {CHARACTERS.map((char) => (
            <motion.button
              key={char.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCharacterSelect(char)}
              className="bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center gap-4 border-4 border-transparent hover:border-sky-400 transition-colors"
            >
              <span className="text-6xl">{char.icon}</span>
              <span className="text-xl font-bold text-gray-700">{char.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-50 overflow-hidden relative font-sans">
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 15, 20]} fov={50} />
            <OrbitControls 
              enablePan={false} 
              maxPolarAngle={Math.PI / 2.1} 
              minDistance={10} 
              maxDistance={40}
              target={[playerPos.x, (currentFloor - 1) * FLOOR_HEIGHT, playerPos.y]}
            />
            
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} castShadow />
            <Environment preset="city" />

            <World3D 
              playerPos={playerPos} 
              currentFloor={currentFloor} 
              placedItems={placedItems} 
              selectedCharacter={selectedCharacter!} 
              onRemove={removeItem}
              isDriving={!!drivingCarId}
            />
            
            <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={40} blur={2} far={4.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* HUD Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-50 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3 border-2 border-sky-200">
            <div className="bg-yellow-400 p-2 rounded-full">
              <Coins className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-gray-800">${money}</span>
            {playerPos.x > WORLD_WIDTH/2 + 5 && (
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-emerald-500 font-bold text-sm"
              >
                + $10/s
              </motion.span>
            )}
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3 border-2 border-sky-200">
            <div className="bg-sky-500 p-2 rounded-full">
              <Home className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Floor</span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-gray-800">{currentFloor} / 4</span>
                <div className="flex flex-col gap-0.5">
                  <button 
                    onClick={() => setCurrentFloor(f => Math.min(4, f + 1))}
                    className="p-0.5 hover:bg-sky-100 rounded transition-colors"
                  >
                    <ChevronUp className="w-4 h-4 text-sky-600" />
                  </button>
                  <button 
                    onClick={() => setCurrentFloor(f => Math.max(1, f - 1))}
                    className="p-0.5 hover:bg-sky-100 rounded transition-colors"
                  >
                    <ChevronDown className="w-4 h-4 text-sky-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setPlayerPos({ x: 0, y: 0 })}
            className="bg-white/90 p-3 rounded-2xl shadow-lg border-2 border-sky-200 hover:bg-sky-100 transition-colors"
            title="Reset Position"
          >
            <RotateCcw className="text-sky-600" />
          </button>
          <button 
            onClick={toggleMusic}
            className="bg-white/90 p-3 rounded-2xl shadow-lg border-2 border-sky-200 hover:bg-sky-100 transition-colors"
          >
            {isMusicPlaying ? <Music className="text-sky-600" /> : <Music2 className="text-gray-400" />}
          </button>
          <button 
            onClick={() => setGameState('character_select')}
            className="bg-white/90 p-3 rounded-2xl shadow-lg border-2 border-sky-200 hover:bg-sky-100 transition-colors"
          >
            <User className="text-sky-600" />
          </button>
        </div>
      </div>

      {/* Shop Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        {drivingCarId ? (
          <button 
            onClick={() => setDrivingCarId(null)}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-3xl font-black text-xl shadow-xl flex items-center gap-3 transform active:scale-95 transition-all"
          >
            <RotateCcw className="w-8 h-8" />
            EXIT CAR (E)
          </button>
        ) : nearbyCar ? (
          <button 
            onClick={() => setDrivingCarId(nearbyCar.id)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-3xl font-black text-xl shadow-xl flex items-center gap-3 transform active:scale-95 transition-all"
          >
            <RotateCcw className="w-8 h-8" />
            DRIVE CAR (E)
          </button>
        ) : playerPos.x > WORLD_WIDTH/2 + 5 ? (
          <div className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-bounce">
            Collecting money at the Bank! 🏦
          </div>
        ) : (
          <button 
            onClick={() => setShowShop(true)}
            className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-3xl font-black text-xl shadow-xl flex items-center gap-3 transform active:scale-95 transition-all"
          >
            <ShoppingBag className="w-8 h-8" />
            SHOP FURNITURE
          </button>
        )}
      </div>

      {/* Shop Modal */}
      <AnimatePresence>
        {showShop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 bg-sky-500 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black">3D Furniture Shop</h2>
                  <p className="font-bold opacity-90">Decorate floor {currentFloor}!</p>
                </div>
                <button 
                  onClick={() => setShowShop(false)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                >
                  <Minus className="w-8 h-8" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {FURNITURE.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 flex flex-col gap-4 hover:border-sky-200 transition-colors"
                  >
                    <div 
                      className="w-full h-32 rounded-2xl shadow-inner flex items-center justify-center"
                      style={{ backgroundColor: item.color }}
                    >
                      <div className="w-12 h-12 bg-white/20 rounded-lg" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-black text-gray-800 text-lg">{item.name}</h3>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-tighter">{item.category}</p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-black text-sm">
                        ${item.price}
                      </span>
                    </div>
                    <button 
                      onClick={() => buyItem(item)}
                      disabled={money < item.price}
                      className={`w-full py-3 rounded-2xl font-black transition-all shadow-md ${
                        money >= item.price 
                        ? 'bg-sky-500 hover:bg-sky-600 text-white active:scale-95' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {money >= item.price ? 'BUY ITEM' : 'TOO EXPENSIVE'}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4 text-xs font-bold text-sky-600/50 uppercase tracking-widest pointer-events-none">
        WASD to move • Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}

function World3D({ playerPos, currentFloor, placedItems, selectedCharacter, onRemove, isDriving }: { 
  playerPos: { x: number, y: number }, 
  currentFloor: number, 
  placedItems: PlacedItem[], 
  selectedCharacter: Character,
  onRemove: (id: string) => void,
  isDriving: boolean
}) {
  return (
    <group>
      {/* Ground */}
      <Plane args={[200, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#ecfdf5" />
      </Plane>
      
      {/* Street */}
      <Plane args={[15, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[WORLD_WIDTH/2 + 5, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" />
      </Plane>

      {/* City Buildings */}
      <CityBuildings />

      {/* House */}
      <HouseStructure currentFloor={currentFloor} />
      
      {/* Bank */}
      <BankStructure />

      {/* Furniture */}
      {placedItems.map((placed) => {
        const item = FURNITURE.find(f => f.id === placed.itemId);
        if (!item) return null;
        return <FurniturePiece key={placed.id} item={item} placed={placed} onRemove={onRemove} />;
      })}

      {/* Player (only show if not driving) */}
      {!isDriving && (
        <Player3D character={selectedCharacter} position={[playerPos.x, (currentFloor - 1) * FLOOR_HEIGHT, playerPos.y]} />
      )}
    </group>
  );
}
