import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense } from 'react';
import Board from './components/Board';
import Pieces from './components/Pieces';
import Lighting from './components/Lighting';
import HUD from './components/HUD';
import ModeSelect from './components/ModeSelect';
import { useGameStore } from './store/gameStore';

function Scene() {
  return (
    <>
      <Lighting />
      <Board />
      <Pieces />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.2}
      />
      <Environment preset="night" />
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.8} luminanceSmoothing={0.9} />
        <Vignette darkness={0.6} offset={0.1} />
      </EffectComposer>
    </>
  );
}

function App() {
  const mode = useGameStore((state) => state.mode);

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [8, 10, 8], fov: 50 }}
        gl={{ antialias: true }}
        style={{ background: '#0a0a0f' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      {!mode ? (
        <ModeSelect />
      ) : (
        <HUD />
      )}

      {/* Loading overlay */}
      <div className="absolute bottom-4 left-4 text-abyss-accent text-sm opacity-50">
        MiMo Abyss Chess v0.1
      </div>
    </div>
  );
}

export default App;