import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Block } from "@/types/blockchain";

interface BlockchainVisualizationProps {
  blockchain: Block[];
}

// Individual 3D Block Component
const Block3D = ({ block, position }: { block: Block; position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5 + block.index) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + block.index) * 0.1;
    }
  });

  const blockColor = new THREE.Color().setHSL(
    (block.index * 0.1) % 1,
    0.7,
    0.6
  );

  return (
    <group position={position}>
      <Box
        ref={meshRef}
        args={[2, 1.5, 1]}
        onClick={() => console.log("Block clicked:", block.index)}
      >
        <meshStandardMaterial
          color={blockColor}
          metalness={0.8}
          roughness={0.2}
          emissive={blockColor}
          emissiveIntensity={0.1}
        />
      </Box>
      
      {/* Connection line to previous block */}
      {block.index > 0 && (
        <Box args={[0.1, 0.1, 2]} position={[-1, 0, 0]}>
          <meshStandardMaterial color="#4a90e2" emissive="#4a90e2" emissiveIntensity={0.3} />
        </Box>
      )}
      
      {/* Block info text */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {block.crop}
      </Text>
      
      <Text
        position={[0, -1.4, 0]}
        fontSize={0.2}
        color="#90a4ae"
        anchorX="center"
        anchorY="middle"
      >
        {block.quantity}kg
      </Text>
    </group>
  );
};

// Floating particles for atmosphere
const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#4a90e2" transparent opacity={0.6} />
    </points>
  );
};

// Main 3D Scene
export const BlockchainVisualization = ({ blockchain }: BlockchainVisualizationProps) => {
  return (
    <div className="h-96 w-full bg-gradient-to-b from-slate-900 to-slate-700 rounded-lg overflow-hidden shadow-strong">
      <Canvas
        camera={{ position: [10, 5, 10], fov: 60 }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#0f172a"]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
        
        {/* Particles */}
        <Particles />
        
        {/* Blockchain blocks */}
        {blockchain.map((block, index) => (
          <Block3D
            key={block.index}
            block={block}
            position={[index * 3 - (blockchain.length * 1.5), 0, 0]}
          />
        ))}
        
        {/* Central logo sphere */}
        <Sphere position={[0, 8, 0]} args={[1]}>
          <meshStandardMaterial
            color="#2d6a4f"
            metalness={0.9}
            roughness={0.1}
            emissive="#2d6a4f"
            emissiveIntensity={0.2}
          />
        </Sphere>
        
        <Text
          position={[0, 6, 0]}
          fontSize={1}
          color="#4ade80"
          anchorX="center"
          anchorY="middle"
          font="/fonts/bold.woff"
        >
          AgriChain
        </Text>
        
        {blockchain.length === 0 && (
          <Text
            position={[0, 0, 0]}
            fontSize={0.8}
            color="#64748b"
            anchorX="center"
            anchorY="middle"
          >
            No blocks yet...
          </Text>
        )}
      </Canvas>
    </div>
  );
};