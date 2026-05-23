import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './index.css';

function DebugBoard() {
  useEffect(() => {
    console.log('DebugBoard mounted');
  }, []);

  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[8, 0.1, 8]} />
      <meshStandardMaterial color="#333" />
    </mesh>
  );
}

export default function DebugApp() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 10, 10] }}>
        <DebugBoard />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
      </Canvas>
    </div>
  );
}