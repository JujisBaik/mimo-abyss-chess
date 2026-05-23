import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export default function ModeSelect() {
  const {
    difficulty,
    playerColor,
    setDifficulty,
    setMode,
    setPlayerColor,
    soundEnabled,
    toggleSound,
  } = useGameStore();

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#030712]/70 px-5 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-xl"
      >
        <div className="mb-6">
          <p className="text-xs font-black uppercase tracking-[0.42em] text-cyan-300">MiMo project</p>
          <h1 className="mt-3 text-5xl font-black leading-none text-white sm:text-7xl">
            Abyss Chess
          </h1>
          <p className="mt-4 max-w-md text-base text-slate-300">
            Neon relic pieces, legal chess logic, and a rude little void engine.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button className="mode-card mode-card-primary" onClick={() => setMode('pvp')}>
            <span className="text-xs uppercase tracking-[0.24em] text-cyan-200">Duel</span>
            <strong>Local PvP</strong>
          </button>
          <button className="mode-card mode-card-secondary" onClick={() => setMode('pve')}>
            <span className="text-xs uppercase tracking-[0.24em] text-fuchsia-200">Engine</span>
            <strong>Void AI</strong>
          </button>
        </div>

        <div className="glass-panel mt-4 p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Side</span>
            <div className="segmented">
              <button
                className={playerColor === 'w' ? 'active' : ''}
                onClick={() => setPlayerColor('w')}
              >
                White
              </button>
              <button
                className={playerColor === 'b' ? 'active' : ''}
                onClick={() => setPlayerColor('b')}
              >
                Black
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Sound</span>
            <button className="hud-button" onClick={toggleSound}>
              {soundEnabled ? 'On' : 'Off'}
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                Void AI depth
              </span>
              <span className="font-black text-cyan-200">{difficulty}</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={difficulty}
              onChange={(event) => setDifficulty(Number(event.target.value))}
              className="w-full accent-cyan-300"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
