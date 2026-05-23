import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function ModeSelect() {
  const { setMode, setPlayerColor, setDifficulty, difficulty, playerColor } = useGameStore();

  console.log('ModeSelect rendered');

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 max-w-md w-full mx-4 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2 neon-text text-abyss-accent"
        >
          MIMO ABYSS CHESS
        </motion.h1>
        <p className="text-gray-400 mb-8">Chess, but the void is watching.</p>

        {/* Mode Selection */}
        <div className="space-y-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log('PvP clicked');
              setMode('pvp');
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg font-semibold hover:from-purple-500 hover:to-violet-500 transition-all"
          >
            👥 PvP Local
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log('PvE clicked');
              setMode('pve');
            }}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all"
          >
            🤖 vs AI (Stockfish)
          </motion.button>
        </div>

        {/* Settings */}
        <div className="space-y-4 text-left">
          <div>
            <label className="text-gray-400 text-sm">Difficulty (Stockfish Depth): {difficulty}</label>
            <input
              type="range"
              min="1"
              max="15"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setPlayerColor('w')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                playerColor === 'w'
                  ? 'bg-white text-black'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              ⚪ White
            </button>
            <button
              onClick={() => setPlayerColor('b')}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                playerColor === 'b'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              ⚫ Black
            </button>
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Powered by Stockfish.wasm + MiMo Commentary
        </p>
      </motion.div>
    </div>
  );
}