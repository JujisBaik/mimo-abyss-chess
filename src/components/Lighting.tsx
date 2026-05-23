export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.18} color="#0f172a" />
      <directionalLight
        position={[4, 9, 5]}
        intensity={1.15}
        color="#67e8f9"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-5, 6, -4]}
        intensity={0.72}
        color="#c084fc"
      />
      <pointLight position={[0, 4.5, 0]} intensity={1.1} color="#22d3ee" distance={12} />
      <pointLight position={[4.5, 1.8, -4.5]} intensity={0.85} color="#a855f7" distance={10} />
      <pointLight position={[-4.5, 1.8, 4.5]} intensity={0.7} color="#f472b6" distance={10} />
    </>
  );
}
