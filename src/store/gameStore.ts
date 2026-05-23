import { create } from 'zustand';
import { Chess, type Square } from 'chess.js';

interface GameState {
  // Game state
  chess: Chess;
  fen: string;
  turn: 'w' | 'b';
  selectedSquare: Square | null;
  validMoves: Square[];
  lastMove: { from: Square; to: Square } | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  
  // UI state
  mode: 'pvp' | 'pve' | null;
  playerColor: 'w' | 'b';
  difficulty: number; // Stockfish depth 1-15
  eval: number; // centipawns
  
  // Actions
  setMode: (mode: 'pvp' | 'pve' | null) => void;
  setPlayerColor: (color: 'w' | 'b') => void;
  setDifficulty: (depth: number) => void;
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square, promotion?: string) => boolean;
  resetGame: () => void;
}

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  chess: new Chess(),
  fen: new Chess().fen(),
  turn: 'w',
  selectedSquare: null,
  validMoves: [],
  lastMove: null,
  isCheck: false,
  isCheckmate: false,
  isDraw: false,
  
  mode: null,
  playerColor: 'w',
  difficulty: 5,
  eval: 0,
  
  // Actions
  setMode: (mode) => set({ mode }),
  
  setPlayerColor: (color) => set({ playerColor: color }),
  
  setDifficulty: (depth) => set({ difficulty: depth }),
  
  selectSquare: (square) => {
    console.log('selectSquare called:', square);
    const { chess } = get();
    const piece = chess.get(square);
    console.log('Piece at', square, ':', piece);
    
    if (piece && piece.color === chess.turn()) {
      const moves = chess.moves({ square, verbose: true });
      console.log('Valid moves:', moves);
      set({
        selectedSquare: square,
        validMoves: moves.map((m) => m.to as Square),
      });
    } else {
      console.log('No piece or wrong color');
      set({ selectedSquare: null, validMoves: [] });
    }
  },
  
  makeMove: (from, to, promotion = 'q') => {
    const { chess } = get();
    
    try {
      const move = chess.move({ from, to, promotion });
      if (move) {
        set({
          chess: new Chess(chess.fen()),
          fen: chess.fen(),
          turn: chess.turn(),
          selectedSquare: null,
          validMoves: [],
          lastMove: { from, to },
          isCheck: chess.isCheck(),
          isCheckmate: chess.isCheckmate(),
          isDraw: chess.isDraw(),
        });
        return true;
      }
    } catch (e) {
      console.error('Invalid move:', e);
    }
    return false;
  },
  
  resetGame: () => {
    const newChess = new Chess();
    set({
      chess: newChess,
      fen: newChess.fen(),
      turn: 'w',
      selectedSquare: null,
      validMoves: [],
      lastMove: null,
      isCheck: false,
      isCheckmate: false,
      isDraw: false,
      eval: 0,
    });
  },
}));

// Helper function to get square from row/col
export const getSquareFromPos = (row: number, col: number): Square => {
  return (files[col] + (8 - row)) as Square;
};