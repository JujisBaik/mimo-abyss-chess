import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function HUD() {
  const { aiThinking, chess, commentary, lastMove, mode, resetGame, setMode } = useGameStore();
  const turn = chess.turn();
  const isCheck = chess.isCheck();
  const isCheckmate = chess.isCheckmate();
  const isDraw = chess.isDraw();
  const isGameOver = chess.isGameOver();

  const status = isCheckmate
    ? `${turn === 'w' ? 'Black' : 'White'} wins by checkmate`
    : isDraw
      ? 'Draw'
      : isCheck
        ? 'Check'
        : aiThinking
          ? 'AI thinking'
          : `${turn === 'w' ? 'White' : 'Black'} to move`;

  return (
    <>
      <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-start">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel pointer-events-auto min-w-64 px-4 py-3"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-300">
            MiMo Abyss Chess
          </p>
          <div className="mt-1 flex items-end gap-3">
            <h1 className="text-2xl font-black leading-none text-white sm:text-3xl">
              {status}
            </h1>
            <span className="rounded-full border border-cyan-300/35 px-2 py-1 text-xs font-bold uppercase text-cyan-200">
              {mode === 'pve' ? 'Void AI' : 'Local'}
            </span>
          </div>
          <p className="mt-2 max-w-md text-sm text-slate-300">{commentary}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto flex gap-2"
        >
          <button className="hud-button" onClick={resetGame}>
            New
          </button>
          <button className="hud-button" onClick={() => setMode(null)}>
            Menu
          </button>
        </motion.div>
      </div>

      {(isCheck || isGameOver) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none absolute left-1/2 top-28 z-10 -translate-x-1/2"
        >
          <div className="rounded-full border border-fuchsia-300/35 bg-fuchsia-950/55 px-5 py-2 text-sm font-black uppercase tracking-[0.18em] text-fuchsia-100 shadow-[0_0_35px_rgba(217,70,239,0.35)]">
            {status}
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel pointer-events-none absolute bottom-4 left-4 z-10 max-w-md px-4 py-3 text-sm text-slate-300"
      >
        <div className="grid grid-cols-2 gap-x-5 gap-y-1 sm:grid-cols-4">
          <span className="text-slate-500">Turn</span>
          <span className="font-bold text-white">{turn === 'w' ? 'White' : 'Black'}</span>
          <span className="text-slate-500">Last</span>
          <span className="font-bold text-white">{lastMove ? `${lastMove.from}-${lastMove.to}` : '-'}</span>
        </div>
        {lastMove && (
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-cyan-200">{lastMove.san}</p>
        )}
      </motion.div>
    </>
  );
}
