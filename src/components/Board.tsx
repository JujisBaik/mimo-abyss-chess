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
        <meshStandardMaterial
          color="#08111f"
          emissive="#071827"
          emissiveIntensity={0.22}
          metalness={0.72}
          roughness={0.22}
        />
      </mesh>

      <mesh position={[0, -0.005, 0]}>
        <boxGeometry args={[8.28, 0.05, 8.28]} />
        <meshStandardMaterial
          color="#162235"
          emissive="#0f2d3e"
          emissiveIntensity={0.42}
          metalness={0.8}
          roughness={0.22}
        />
      </mesh>

      {[-4.85, 4.85].map((z) => (
        <mesh key={`rail-z-${z}`} position={[0, 0.18, z]}>
          <boxGeometry args={[9.7, 0.18, 0.16]} />
          <meshStandardMaterial color="#071827" emissive="#06b6d4" emissiveIntensity={0.72} />
        </mesh>
      ))}
      {[-4.85, 4.85].map((x) => (
        <mesh key={`rail-x-${x}`} position={[x, 0.18, 0]}>
          <boxGeometry args={[0.16, 0.18, 9.7]} />
          <meshStandardMaterial color="#101126" emissive="#8b5cf6" emissiveIntensity={0.68} />
        </mesh>
      ))}

      {squares.map(({ position, square, isLight }) => {
        const isSelected = selectedSquare === square;
        const isValidMove = validMoves.includes(square);
        const isLastMove = lastMove?.from === square || lastMove?.to === square;
        
        let color = isLight ? '#3f5272' : '#0c1727';
        let glow = '#000000';
        let glowPower = isLight ? 0.08 : 0.02;
        if (isSelected) {
          color = '#8b5cf6';
          glow = '#d8b4fe';
          glowPower = 1.1;
        } else if (isValidMove) {
          color = '#0e7490';
          glow = '#67e8f9';
          glowPower = 0.95;
        } else if (isLastMove) {
          color = '#6474c8';
          glow = '#c4b5fd';
          glowPower = 0.78;
        } else {
          glow = isLight ? '#1e3a5f' : '#020617';
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
              <boxGeometry args={[0.92, 0.13, 0.92]} />
              <meshStandardMaterial
                color={color}
                emissive={glow}
                emissiveIntensity={glowPower}
                metalness={0.5}
                roughness={0.2}
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
