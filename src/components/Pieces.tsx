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
  const glowColor = color === 'w' ? '#67e8f9' : '#c084fc';

  return (
    <group scale={selected ? 1.08 : 1}>
      <mesh castShadow receiveShadow position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.44, 0.54, 0.14, 8]} />
        {trim}
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.39, 0.018, 8, 36]} />
        <meshBasicMaterial color={glowColor} transparent opacity={selected ? 0.95 : 0.72} />
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
          <mesh castShadow position={[0, 0.82, 0]}>
            <coneGeometry args={[0.18, 0.34, 4]} />
            {trim}
          </mesh>
          {[0, 1, 2].map((step) => {
            const angle = (Math.PI * 2 * step) / 3;
            return (
              <mesh
                key={step}
                castShadow
                position={[Math.cos(angle) * 0.19, 0.62, Math.sin(angle) * 0.19]}
                rotation={[0.55, angle, 0]}
              >
                <coneGeometry args={[0.035, 0.22, 4]} />
                {trim}
              </mesh>
            );
          })}
        </>
      )}

      {type === 'r' && (
        <>
          <mesh castShadow position={[0, 0.66, 0]}>
            <boxGeometry args={[0.52, 0.58, 0.52]} />
            {material}
          </mesh>
          <mesh castShadow position={[0, 0.72, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.44, 0.42, 0.44]} />
            {material}
          </mesh>
          {[0, 1, 2, 3].map((step) => {
            const angle = (Math.PI / 2) * step;
            return (
              <mesh
                key={step}
                castShadow
                position={[Math.cos(angle) * 0.25, 1.04, Math.sin(angle) * 0.25]}
              >
                <boxGeometry args={[0.17, 0.27, 0.17]} />
                {trim}
              </mesh>
            );
          })}
        </>
      )}

      {type === 'n' && (
        <>
          <mesh castShadow position={[0.03, 0.68, 0]} rotation={[0.18, 0.2, -0.36]}>
            <coneGeometry args={[0.3, 0.92, 5]} />
            {material}
          </mesh>
          <mesh castShadow position={[0.11, 0.98, -0.16]} rotation={[0.48, 0, -0.32]}>
            <boxGeometry args={[0.14, 0.5, 0.28]} />
            {trim}
          </mesh>
          <mesh castShadow position={[-0.11, 0.86, 0.13]} rotation={[0.2, 0.5, 0.38]}>
            <coneGeometry args={[0.055, 0.32, 4]} />
            {trim}
          </mesh>
        </>
      )}

      {type === 'b' && (
        <>
          <mesh castShadow position={[0, 0.66, 0]}>
            <coneGeometry args={[0.36, 0.78, 6]} />
            {material}
          </mesh>
          <mesh castShadow position={[0, 0.68, 0]} rotation={[0, Math.PI / 6, 0]}>
            <coneGeometry args={[0.25, 0.92, 6]} />
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
            <cylinderGeometry args={[0.27, 0.38, 0.72, 8]} />
            {material}
          </mesh>
          <mesh castShadow position={[0, 0.74, 0]} rotation={[0, Math.PI / 4, 0]}>
            <cylinderGeometry args={[0.19, 0.3, 0.8, 8]} />
            {material}
          </mesh>
          {[0, 1, 2, 3, 4].map((step) => {
            const angle = (Math.PI * 2 * step) / 5;
            return (
              <mesh
                key={step}
                castShadow
                position={[Math.cos(angle) * 0.27, 1.16, Math.sin(angle) * 0.27]}
              >
                <coneGeometry args={[0.085, 0.36, 4]} />
                {trim}
              </mesh>
            );
          })}
          <mesh castShadow position={[0, 1.3, 0]}>
            <octahedronGeometry args={[0.14, 0]} />
            {trim}
          </mesh>
        </>
      )}

      {type === 'k' && (
        <>
          <mesh castShadow position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.32, 0.4, 0.8, 8]} />
            {material}
          </mesh>
          <mesh castShadow position={[0, 1.02, 0]} rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.36, 0.2, 0.36]} />
            {trim}
          </mesh>
          <mesh castShadow position={[0, 1.17, 0]}>
            <boxGeometry args={[0.11, 0.44, 0.11]} />
            {trim}
          </mesh>
          <mesh castShadow position={[0, 1.27, 0]}>
            <boxGeometry args={[0.36, 0.09, 0.09]} />
            {trim}
          </mesh>
          {[0, 1, 2, 3].map((step) => {
            const angle = (Math.PI / 2) * step + Math.PI / 4;
            return (
              <mesh
                key={step}
                castShadow
                position={[Math.cos(angle) * 0.3, 1.02, Math.sin(angle) * 0.3]}
                rotation={[0, angle, 0]}
              >
                <coneGeometry args={[0.055, 0.34, 4]} />
                {trim}
              </mesh>
            );
          })}
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
