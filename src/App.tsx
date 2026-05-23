'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect } from 'react';
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

  useEffect(() => {
    console.log('App mounted');
  }, []);

  console.log('App rendering, mode:', mode);

  return (
    <div className="w-full h-full relative bg-black">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [8, 10, 8], fov: 50 }}
        gl={{ antialias: true }}
        style={{ background: '#0a0a0f', cursor: 'crosshair', display: 'block' }}
      >
        <Suspense fallback={<div>Loading 3D...</div>}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      {!mode ? (
        <ModeSelect />
      ) : (
        <HUD />
      )}

      {/* Debug info */}
      <div className="absolute top-2 left-2 text-gray-500 text-xs z-20">
        v0.1 • Click board to play
      </div>
    </div>
  );
}

export default App;