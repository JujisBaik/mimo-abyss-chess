import { useGameStore, getSquareFromPos } from '../store/gameStore';
import { useMemo } from 'react';
import type { Square } from 'chess.js';

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

  const handleClick = (square: Square) => {
    if (selectedSquare && validMoves.includes(square)) {
      makeMove(selectedSquare, square);
    } else {
      selectSquare(square);
    }
  };

  return (
    <group>
      {squares.map(({ position, square, isLight }) => {
        const isSelected = selectedSquare === square;
        const isValidMove = validMoves.includes(square);
        const isLastMove = lastMove?.from === square || lastMove?.to === square;
        
        let color = isLight ? 0x2d2d3d : 0x1a1a24;
        if (isSelected) color = 0x8b5cf6;
        else if (isValidMove) color = 0x00ffff;
        else if (isLastMove) color = 0x4c1d95;

        return (
          <mesh
            key={square}
            position={position}
            onClick={() => handleClick(square)}
          >
            <boxGeometry args={[1, 0.1, 1]} />
            <meshStandardMaterial color={color} emissive={isSelected || isValidMove ? color : 0x000000} />
          </mesh>
        );
      })}
    </group>
  );
}