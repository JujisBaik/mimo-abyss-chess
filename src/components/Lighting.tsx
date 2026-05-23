export default function Lighting() {
  return (
    <>
      {/* Ambient light - dim void */}
      <ambientLight intensity={0.15} color="#0a0a0f" />
      
      {/* Key light - cyan */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color="#00ffff"
        castShadow
      />
      
      {/* Fill light - violet */}
      <directionalLight
        position={[-5, 8, -5]}
        intensity={0.4}
        color="#8b5cf6"
      />
      
      {/* Rim lights */}
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#00ffff" distance={20} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0a0f', 15, 35]} />
    </>
  );
}