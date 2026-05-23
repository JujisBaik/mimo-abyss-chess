import { Chess, type Color, type Square } from 'chess.js';
import { create } from 'zustand';

export type GameMode = 'pvp' | 'pve' | null;

export const getSquareFromPos = (row: number, col: number): Square => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
  return `${files[col]}${8 - row}` as Square;
};

export const getPosFromSquare = (square: Square): [number, number] => {
  const file = square.charCodeAt(0) - 97;
  const rank = 8 - Number(square[1]);
  return [rank, file];
};

interface LastMove {
  from: Square;
  to: Square;
  san: string;
  captured?: string;
}

interface GameState {
  chess: Chess;
  selectedSquare: Square | null;
  validMoves: Square[];
  lastMove: LastMove | null;
  mode: GameMode;
  playerColor: Color;
  difficulty: number;
  aiThinking: boolean;
  commentary: string;

  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square) => boolean;
  resetGame: () => void;
  setMode: (mode: GameMode) => void;
  setPlayerColor: (color: Color) => void;
  setDifficulty: (difficulty: number) => void;
}

let aiTimer: ReturnType<typeof setTimeout> | null = null;

const pickAiMove = (chess: Chess, difficulty: number) => {
  const moves = chess.moves({ verbose: true });
  const center = new Set<Square>(['d4', 'e4', 'd5', 'e5']);

  return [...moves].sort((a, b) => {
    const score = (move: (typeof moves)[number]) => {
      const captureScore = move.captured ? 6 : 0;
      const checkScore = move.san.includes('+') ? 4 : 0;
      const mateScore = move.san.includes('#') ? 50 : 0;
      const centerScore = center.has(move.to) ? 2 : 0;
      const noise = Math.random() * Math.max(1, 16 - difficulty);
      return captureScore + checkScore + mateScore + centerScore + noise;
    };

    return score(b) - score(a);
  })[0];
};

const maybeQueueAiMove = (delay = 650) => {
  const state = useGameStore.getState();

  if (aiTimer) {
    clearTimeout(aiTimer);
  }

  if (
    state.mode !== 'pve' ||
    state.chess.isGameOver() ||
    state.chess.turn() === state.playerColor
  ) {
    useGameStore.setState({ aiThinking: false });
    return;
  }

  useGameStore.setState({
    aiThinking: true,
    commentary: 'Void AI is reading the board...',
  });

  aiTimer = setTimeout(() => {
    const latest = useGameStore.getState();

    if (
      latest.mode !== 'pve' ||
      latest.chess.isGameOver() ||
      latest.chess.turn() === latest.playerColor
    ) {
      useGameStore.setState({ aiThinking: false });
      return;
    }

    const move = pickAiMove(latest.chess, latest.difficulty);
    if (!move) {
      useGameStore.setState({ aiThinking: false });
      return;
    }

    const nextChess = new Chess(latest.chess.fen());
    const applied = nextChess.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion || 'q',
    });

    if (applied) {
      useGameStore.setState({
        chess: nextChess,
        selectedSquare: null,
        validMoves: [],
        lastMove: {
          from: applied.from,
          to: applied.to,
          san: applied.san,
          captured: applied.captured,
        },
        aiThinking: false,
        commentary: applied.captured
          ? `Void AI took on ${applied.to}.`
          : `Void AI played ${applied.san}.`,
      });
    }
  }, delay);
};

export const useGameStore = create<GameState>((set, get) => ({
  chess: new Chess(),
  selectedSquare: null,
  validMoves: [],
  lastMove: null,
  mode: null,
  playerColor: 'w',
  difficulty: 8,
  aiThinking: false,
  commentary: 'Choose a mode to enter the board.',

  selectSquare: (square: Square) => {
    const { chess, selectedSquare, mode, playerColor, aiThinking } = get();

    if (aiThinking || chess.isGameOver()) {
      return;
    }

    if (mode === 'pve' && chess.turn() !== playerColor) {
      return;
    }

    if (selectedSquare === square) {
      set({ selectedSquare: null, validMoves: [] });
      return;
    }

    const piece = chess.get(square);
    if (piece && piece.color === chess.turn()) {
      const validMoves = chess.moves({ square, verbose: true }).map((move) => move.to);
      set({
        selectedSquare: square,
        validMoves,
        commentary: validMoves.length
          ? `${square.toUpperCase()} is armed.`
          : `${square.toUpperCase()} is trapped.`,
      });
      return;
    }

    set({ selectedSquare: null, validMoves: [] });
  },

  makeMove: (from: Square, to: Square) => {
    const { chess, mode, playerColor, aiThinking } = get();
    const piece = chess.get(from);

    if (!piece || aiThinking || chess.isGameOver()) {
      return false;
    }

    if (mode === 'pve' && piece.color !== playerColor) {
      return false;
    }

    const nextChess = new Chess(chess.fen());

    try {
      const move = nextChess.move({ from, to, promotion: 'q' });
      if (!move) {
        return false;
      }

      set({
        chess: nextChess,
        selectedSquare: null,
        validMoves: [],
        lastMove: {
          from: move.from,
          to: move.to,
          san: move.san,
          captured: move.captured,
        },
        commentary: move.captured
          ? `${move.san}: clean capture.`
          : `${move.san}: pressure added.`,
      });

      maybeQueueAiMove();
      return true;
    } catch {
      return false;
    }
  },

  resetGame: () => {
    if (aiTimer) {
      clearTimeout(aiTimer);
    }

    set({
      chess: new Chess(),
      selectedSquare: null,
      validMoves: [],
      lastMove: null,
      aiThinking: false,
      commentary: 'Fresh board. First blood is waiting.',
    });

    window.setTimeout(() => maybeQueueAiMove(450), 0);
  },

  setMode: (mode: GameMode) => {
    if (aiTimer) {
      clearTimeout(aiTimer);
    }

    set({
      mode,
      chess: new Chess(),
      selectedSquare: null,
      validMoves: [],
      lastMove: null,
      aiThinking: false,
      commentary:
        mode === 'pve'
          ? 'Void AI is online.'
          : mode === 'pvp'
            ? 'Local duel loaded.'
            : 'Choose a mode to enter the board.',
    });

    window.setTimeout(() => maybeQueueAiMove(450), 0);
  },

  setPlayerColor: (playerColor: Color) => {
    set({ playerColor });
    window.setTimeout(() => maybeQueueAiMove(450), 0);
  },

  setDifficulty: (difficulty: number) => {
    set({ difficulty });
  },
}));
