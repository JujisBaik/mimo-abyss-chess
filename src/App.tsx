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
      <color attach="background" args={['#030712']} />
      <fog attach="fog" args={['#030712', 12, 27]} />
      <CameraRig />
      <Stars radius={72} depth={42} count={1600} factor={4.2} saturation={0} fade speed={0.35} />
      <Lighting />
      <Board />
      <Pieces />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <circleGeometry args={[18, 96]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.82} />
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
        <Bloom intensity={0.72} luminanceThreshold={0.25} luminanceSmoothing={0.78} />
        <Vignette darkness={0.72} offset={0.12} />
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
      setMode(requestedMode);
    }
  }, [mode, setMode]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(34,211,238,0.18),transparent_34%),radial-gradient(circle_at_75%_70%,rgba(168,85,247,0.16),transparent_35%)]" />
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
      {mode ? <HUD /> : <ModeSelect />}
    </div>
  );
}

export default App;
