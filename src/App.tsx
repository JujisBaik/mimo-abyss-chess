import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { Suspense, useEffect } from 'react';
import Board from './components/Board';
import HUD from './components/HUD';
import Lighting from './components/Lighting';
import ModeSelect from './components/ModeSelect';
import Pieces from './components/Pieces';
import { useGameStore } from './store/gameStore';

function CameraRig() {
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    camera.position.set(7.8, 8.2, 8.4);
    camera.lookAt(0, 0.25, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#040816']} />
      <fog attach="fog" args={['#040816', 14, 32]} />
      <CameraRig />
      <Stars radius={82} depth={48} count={2600} factor={4.8} saturation={0.15} fade speed={0.42} />
      <Lighting />
      <Board />
      <Pieces />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <circleGeometry args={[18, 96]} />
        <meshBasicMaterial color="#050b17" transparent opacity={0.46} />
      </mesh>
      <OrbitControls
        enableDamping
        enablePan={false}
        dampingFactor={0.08}
        minDistance={7.5}
        maxDistance={13.5}
        minPolarAngle={0.45}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0.25, 0]}
      />
      <EffectComposer>
        <Bloom intensity={0.78} luminanceThreshold={0.22} luminanceSmoothing={0.78} />
        <Vignette darkness={0.56} offset={0.18} />
      </EffectComposer>
    </>
  );
}

function App() {
  const mode = useGameStore((state) => state.mode);
  const setMode = useGameStore((state) => state.setMode);

  useEffect(() => {
    const requestedMode = new URLSearchParams(window.location.search).get('mode');
    if (!mode && (requestedMode === 'pvp' || requestedMode === 'pve')) {
      setMode(requestedMode, true);
    }
  }, [mode, setMode]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#040816] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(8,47,73,0.22),transparent_34%,rgba(88,28,135,0.2)),linear-gradient(180deg,rgba(15,23,42,0.12),rgba(2,6,23,0.24))]" />
      <Canvas
        camera={{ position: [7.8, 8.2, 8.4], fov: 45 }}
        dpr={[1, 1.7]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
        className="relative z-0"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            'linear-gradient(115deg, rgba(34, 211, 238, 0.16) 0 1px, transparent 1px 86px), linear-gradient(25deg, rgba(168, 85, 247, 0.14) 0 1px, transparent 1px 112px)',
          backgroundSize: '180px 180px, 220px 220px',
          mixBlendMode: 'screen',
          opacity: 0.18,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(110deg, transparent 0%, rgba(34, 211, 238, 0.08) 34%, transparent 52%, rgba(168, 85, 247, 0.08) 74%, transparent 100%)',
          opacity: 0.55,
        }}
      />
      {mode ? <HUD /> : <ModeSelect />}
    </div>
  );
}

export default App;
