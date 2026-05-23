import { useGameStore, getSquareFromPos } from '../store/gameStore';
import { useMemo } from 'react';
import type { Square } from 'chess.js';

// Piece geometries (procedural)
const pieceGeometries: Record<string, any> = {
  p: { type: 'cylinder', args: [0.3, 0.3, 0.5], position: [0, 0.25, 0] },
  r: { type: 'box', args: [0.6, 0.8, 0.6], position: [0, 0.4, 0] },
  n: { type: 'cone', args: [0.3, 0.8, 8], position: [0, 0.4, 0] },
  b: { type: 'cylinder', args: [0.25, 0.4, 0.9], position: [0, 0.45, 0] },
  q: { type: 'cylinder', args: [0.35, 0.35, 1], position: [0, 0.5, 0] },
  k: { type: 'cylinder', args: [0.4, 0.4, 1.1], position: [0, 0.55, 0] },
};

const pieceColors: Record<string, number> = {
  w: 0xf5f5f5, // White pieces
  b: 0x1a1a2e, // Black pieces (dark obsidian)
};

export default function Pieces() {
  const { chess } = useGameStore();

  const pieces = useMemo(() => {
    const result: Array<{
      type: string;
      color: 'w' | 'b';
      position: [number, number, number];
      square: Square;
    }> = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = getSquareFromPos(row, col);
        const piece = chess.get(square);
        if (piece) {
          result.push({
            type: piece.type,
            color: piece.color,
            position: [col - 3.5, 0.3, row - 3.5],
            square,
          });
        }
      }
    }
    return result;
  }, [chess]);

  return (
    <group>
      {pieces.map((piece, index) => {
        const geo = pieceGeometries[piece.type];
        const color = pieceColors[piece.color];
        
        return (
          <mesh
            key={`${piece.square}-${index}`}
            position={geo.position}
          >
            {geo.type === 'cylinder' && (
              <cylinderGeometry args={geo.args} />
            )}
            {geo.type === 'box' && (
              <boxGeometry args={geo.args} />
            )}
            {geo.type === 'cone' && (
              <coneGeometry args={geo.args} />
            )}
            <meshStandardMaterial
              color={color}
              emissive={piece.color === 'b' ? 0x111122 : 0x000000}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}