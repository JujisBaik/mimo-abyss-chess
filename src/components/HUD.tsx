import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function HUD() {
  const { turn, isCheck, isCheckmate, isDraw, lastMove, resetGame, setMode } = useGameStore();

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg px-4 py-2"
        >
          <span className="text-gray-400 text-sm">Turn: </span>
          <span className={`font-bold ${turn === 'w' ? 'text-white' : 'text-gray-800'}`}>
            {turn === 'w' ? '⚪ White' : '⚫ Black'}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          <button
            onClick={() => setMode(null)}
            className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-all"
          >
            ← Menu
          </button>
          <button
            onClick={resetGame}
            className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-all"
          >
            🔄 New Game
          </button>
        </motion.div>
      </div>

      {/* Status indicator */}
      {(isCheck || isCheckmate || isDraw) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="glass rounded-full px-6 py-3 text-center">
            {isCheckmate && (
              <span className="text-yellow-400 font-bold text-lg">
                {turn === 'w' ? '⚫ Black' : '⚪ White'} Wins! 🎉
              </span>
            )}
            {isCheck && !isCheckmate && (
              <span className="text-red-400 font-bold">⚠️ CHECK!</span>
            )}
            {isDraw && (
              <span className="text-gray-300 font-bold">🤝 Draw!</span>
            )}
          </div>
        </motion.div>
      )}

      {/* Last move info */}
      {lastMove && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-4 glass rounded-lg px-4 py-2 text-sm text-gray-300"
        >
          Last move: {lastMove.from} → {lastMove.to}
        </motion.div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 right-4 text-gray-500 text-xs">
        MiMo Abyss Chess v0.1 • React Three Fiber
      </div>
    </>
  );
}