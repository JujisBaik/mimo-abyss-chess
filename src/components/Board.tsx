import { useMemo } from 'react';
import type { Square } from 'chess.js';
import { getSquareFromPos, useGameStore } from '../store/gameStore';

export default function Board() {
  const { selectedSquare, validMoves, lastMove, makeMove, selectSquare } = useGameStore();

  const squares = useMemo(() => {
    const result: Array<{ position: [number, number, number]; square: Square; isLight: boolean }> = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = getSquareFromPos(row, col);
        const isLight = (row + col) % 2 === 0;
        result.push({
          position: [col - 3.5, 0, row - 3.5],
          square,
          isLight,
        });
      }
    }
    return result;
  }, []);

  const activateSquare = (square: Square) => {
    if (selectedSquare && validMoves.includes(square)) {
      makeMove(selectedSquare, square);
    } else {
      selectSquare(square);
    }
  };

  return (
    <group>
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[9.35, 0.22, 9.35]} />
        <meshStandardMaterial color="#05070d" metalness={0.65} roughness={0.28} />
      </mesh>

      <mesh position={[0, -0.005, 0]}>
        <boxGeometry args={[8.28, 0.05, 8.28]} />
        <meshStandardMaterial
          color="#101521"
          emissive="#101521"
          emissiveIntensity={0.35}
          metalness={0.8}
          roughness={0.22}
        />
      </mesh>

      {[-4.85, 4.85].map((z) => (
        <mesh key={`rail-z-${z}`} position={[0, 0.18, z]}>
          <boxGeometry args={[9.7, 0.18, 0.16]} />
          <meshStandardMaterial color="#08111f" emissive="#06b6d4" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {[-4.85, 4.85].map((x) => (
        <mesh key={`rail-x-${x}`} position={[x, 0.18, 0]}>
          <boxGeometry args={[0.16, 0.18, 9.7]} />
          <meshStandardMaterial color="#08111f" emissive="#7c3aed" emissiveIntensity={0.45} />
        </mesh>
      ))}

      {squares.map(({ position, square, isLight }) => {
        const isSelected = selectedSquare === square;
        const isValidMove = validMoves.includes(square);
        const isLastMove = lastMove?.from === square || lastMove?.to === square;
        
        let color = isLight ? '#263040' : '#111827';
        let glow = '#000000';
        let glowPower = 0;
        if (isSelected) {
          color = '#7c3aed';
          glow = '#a855f7';
          glowPower = 0.95;
        } else if (isValidMove) {
          color = '#064e5f';
          glow = '#22d3ee';
          glowPower = 0.75;
        } else if (isLastMove) {
          color = '#312e81';
          glow = '#818cf8';
          glowPower = 0.55;
        }

        return (
          <group key={square} position={position}>
            <mesh
              receiveShadow
              onPointerDown={(event) => {
                event.stopPropagation();
                activateSquare(square);
              }}
            >
              <boxGeometry args={[0.96, 0.12, 0.96]} />
              <meshStandardMaterial
                color={color}
                emissive={glow}
                emissiveIntensity={glowPower}
                metalness={0.58}
                roughness={0.24}
              />
            </mesh>

            {isValidMove && (
              <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.18, 0.3, 36]} />
                <meshBasicMaterial color="#67e8f9" transparent opacity={0.78} />
              </mesh>
            )}

            {isSelected && (
              <mesh position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.34, 0.44, 48]} />
                <meshBasicMaterial color="#c084fc" transparent opacity={0.9} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
