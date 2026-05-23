import { create } from 'zustand';
import { Chess, Square } from 'chess.js';

// Helper to convert row/col to square notation
export const getSquareFromPos = (row: number, col: number): Square => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
  return `${files[col]}${8 - row}` as Square;
};

// Helper to convert square notation to row/col
export const getPosFromSquare = (square: Square): [number, number] => {
  const file = square.charCodeAt(0) - 97; // 'a' -> 0
  const rank = 8 - parseInt(square[1]); // '1' -> 7
  return [rank, file];
};

interface GameState {
  chess: Chess;
  selectedSquare: Square | null;
  validMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  mode: 'pvp' | 'ai' | null;
  
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square) => boolean;
  resetGame: () => void;
  setMode: (mode: 'pvp' | 'ai') => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  selectedSquare: null,
  validMoves: [],
  lastMove: null,
  mode: null,

  selectSquare: (square: Square) => {
    const { chess, selectedSquare } = get();
    const piece = chess.get(square);
    
    console.log('Selecting square:', square, 'Piece:', piece);
    
    // If clicking same square, deselect
    if (selectedSquare === square) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }
    
    // If clicking a piece of current turn, select it
    if (piece && piece.color === chess.turn()) {
      const moves = chess.moves({ square, verbose: true });
      const validMoves = moves.map(m => m.to);
      console.log('Valid moves from', square, ':', validMoves);
      set({ selectedSquare: square, validMoves });
    } else {
      // If clicking empty square or opponent's piece, just deselect
      set({ selectedSquare: null, validMoves: [] });
    }
  },

  makeMove: (from: Square, to: Square) => {
    const { chess } = get();
    
    console.log('Attempting move:', from, '->', to);
    
    try {
      const move = chess.move({ from, to, promotion: 'q' });
      if (move) {
        console.log('Move successful:', move);
        set({
          selectedSquare: null,
          validMoves: [],
          lastMove: { from, to },
          chess: new Chess(chess.fen()), // Create new instance to trigger reactivity
        });
        return true;
      }
    } catch (e) {
      console.error('Invalid move:', e);
    }
    
    console.log('Move failed');
    return false;
  },

  resetGame: () => {
    set({
      chess: new Chess(),
      selectedSquare: null,
      validMoves: [],
      lastMove: null,
    });
  },

  setMode: (mode: 'pvp' | 'ai') => {
    set({ mode });
  },
}));