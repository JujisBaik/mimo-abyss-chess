import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useState } from 'react';

function SimpleBoard() {
  const [clicks, setClicks] = useState<string[]>([]);

  return (
    <>
      <mesh
        position={[0, 0, 0]}
        onClick={() => {
          const newClick = `Clicked at ${new Date().toLocaleTimeString()}`;
          setClicks(prev => [...prev, newClick]);
          console.log(newClick);
        }}
      >
        <boxGeometry args={[8, 0.2, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      {clicks.length > 0 && (
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'black', padding: 10, color: 'white' }}>
          <p>Clicks: {clicks.length}</p>
          <p>Last: {clicks[clicks.length - 1]}</p>
        </div>
      )}
    </>
  );
}

export default function TestApp() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 10, 10] }}>
        <SimpleBoard />
      </Canvas>
    </div>
  );
}