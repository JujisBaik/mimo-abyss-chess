import type { ThreeEvent } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { useMemo } from 'react';
import type { PieceSymbol, Square } from 'chess.js';
import { getSquareFromPos, useGameStore } from '../store/gameStore';

interface RenderedPiece {
  type: PieceSymbol;
  color: 'w' | 'b';
  position: [number, number, number];
  square: Square;
}

const pieceLabel: Record<PieceSymbol, string> = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King',
};

function PieceMaterial({ color, selected }: { color: 'w' | 'b'; selected: boolean }) {
  const white = color === 'w';

  return (
    <meshStandardMaterial
      color={white ? '#dff7ff' : '#111827'}
      emissive={white ? '#22d3ee' : '#8b5cf6'}
      emissiveIntensity={selected ? 0.85 : white ? 0.2 : 0.45}
      metalness={0.82}
      roughness={0.18}
    />
  );
}

function TrimMaterial({ color }: { color: 'w' | 'b' }) {
  return (
    <meshStandardMaterial
      color={color === 'w' ? '#67e8f9' : '#c084fc'}
      emissive={color === 'w' ? '#06b6d4' : '#9333ea'}
      emissiveIntensity={0.75}
      metalness={0.9}
      roughness={0.16}
    />
  );
}

function PieceShape({ type, color, selected }: { type: PieceSymbol; color: 'w' | 'b'; selected: boolean }) {
  const material = <PieceMaterial color={color} selected={selected} />;
  const trim = <TrimMaterial color={color} />;

  return (
    <group scale={selected ? 1.08 : 1}>
      <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.34, 0.44, 0.18, 32]} />
        {trim}
      </mesh>
      <mesh castShadow position={[0, 0.29, 0]}>
        <cylinderGeometry args={[0.24, 0.32, 0.26, 32]} />
        {material}
      </mesh>

      {type === 'p' && (
        <>
          <mesh castShadow position={[0, 0.56, 0]}>
            <sphereGeometry args={[0.25, 28, 18]} />
            {material}
          </mesh>
          <mesh castShadow position={[0, 0.84, 0]}>
            <coneGeometry args={[0.16, 0.28, 5]} />
            {trim}
          </mesh>
        </>
      )}

      {type === 'r' && (
        <>
          <mesh castShadow position={[0, 0.66, 0]}>
            <boxGeometry args={[0.48, 0.54, 0.48]} />
            {material}
          </mesh>
          {[0, 1, 2, 3].map((step) => {
            const angle = (Math.PI / 2) * step;
            return (
              <mesh
                key={step}
                castShadow
                position={[Math.cos(angle) * 0.21, 1.0, Math.sin(angle) * 0.21]}
              >
                <boxGeometry args={[0.16, 0.22, 0.16]} />
                {trim}
              </mesh>
            );
          })}
        </>
      )}

      {type === 'n' && (
        <>
          <mesh castShadow position={[0, 0.66, 0]} rotation={[0.18, 0.2, -0.28]}>
            <coneGeometry args={[0.28, 0.82, 7]} />
            {material}
          </mesh>
          <mesh castShadow position={[0.08, 0.92, -0.12]} rotation={[0.4, 0, -0.25]}>
            <boxGeometry args={[0.16, 0.42, 0.26]} />
            {trim}
          </mesh>
        </>
      )}

      {type === 'b' && (
        <>
          <mesh castShadow position={[0, 0.68, 0]}>
            <coneGeometry args={[0.34, 0.78, 32]} />
            {material}
          </mesh>
          <mesh castShadow position={[0, 1.04, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.08, 0.34, 0.08]} />
            {trim}
          </mesh>
        </>
      )}

      {type === 'q' && (
        <>
          <mesh castShadow position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.27, 0.34, 0.7, 32]} />
            {material}
          </mesh>
          {[0, 1, 2, 3, 4].map((step) => {
            const angle = (Math.PI * 2 * step) / 5;
            return (
              <mesh
                key={step}
                castShadow
                position={[Math.cos(angle) * 0.24, 1.13, Math.sin(angle) * 0.24]}
              >
                <coneGeometry args={[0.09, 0.28, 5]} />
                {trim}
              </mesh>
            );
          })}
          <mesh castShadow position={[0, 1.22, 0]}>
            <sphereGeometry args={[0.12, 18, 12]} />
            {trim}
          </mesh>
        </>
      )}

      {type === 'k' && (
        <>
          <mesh castShadow position={[0, 0.74, 0]}>
            <cylinderGeometry args={[0.3, 0.36, 0.78, 32]} />
            {material}
          </mesh>
          <mesh castShadow position={[0, 1.17, 0]}>
            <boxGeometry args={[0.11, 0.44, 0.11]} />
            {trim}
          </mesh>
          <mesh castShadow position={[0, 1.27, 0]}>
            <boxGeometry args={[0.36, 0.09, 0.09]} />
            {trim}
          </mesh>
        </>
      )}
    </group>
  );
}

export default function Pieces() {
  const { chess, selectedSquare, validMoves, makeMove, selectSquare } = useGameStore();

  const pieces = useMemo(() => {
    const result: RenderedPiece[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = getSquareFromPos(row, col);
        const piece = chess.get(square);
        if (piece) {
          result.push({
            type: piece.type,
            color: piece.color,
            position: [col - 3.5, 0.04, row - 3.5],
            square,
          });
        }
      }
    }

    return result;
  }, [chess]);

  const activatePiece = (event: ThreeEvent<PointerEvent>, square: Square) => {
    event.stopPropagation();

    if (selectedSquare && validMoves.includes(square)) {
      makeMove(selectedSquare, square);
      return;
    }

    selectSquare(square);
  };

  return (
    <group>
      {pieces.map((piece) => {
        const selected = selectedSquare === piece.square;
        const target = validMoves.includes(piece.square);

        return (
          <Float
            key={piece.square}
            speed={selected ? 4 : 1.2}
            rotationIntensity={selected ? 0.16 : 0.03}
            floatIntensity={selected ? 0.16 : 0.025}
          >
            <group
              position={piece.position}
              onPointerDown={(event) => activatePiece(event, piece.square)}
              userData={{ label: `${piece.color === 'w' ? 'White' : 'Black'} ${pieceLabel[piece.type]}` }}
            >
              <PieceShape type={piece.type} color={piece.color} selected={selected || target} />
              {target && (
                <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.42, 0.52, 48]} />
                  <meshBasicMaterial color="#f472b6" transparent opacity={0.85} />
                </mesh>
              )}
            </group>
          </Float>
        );
      })}
    </group>
  );
}
