"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface BeaconProps {
  position: [number, number, number];
}

export default function Beacon({ position }: BeaconProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const flagRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Pulsing glow ring animation (scale oscillation)
    if (ringRef.current) {
      const scale = 1 + Math.sin(t * 3) * 0.2;
      ringRef.current.scale.set(scale, scale, scale);
      
      const material = ringRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.4 + Math.sin(t * 3) * 0.2;
    }

    // Animated flag mesh hovering above (bobbing up and down)
    if (flagRef.current) {
      flagRef.current.position.y = 1.5 + Math.sin(t * 2) * 0.2;
      flagRef.current.rotation.y = t * 0.5;
    }
  });

  return (
    <group position={position}>
      {/* Ground marker / Glow ring */}
      <mesh
        ref={ringRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
      >
        <ringGeometry args={[0.5, 0.8, 32]} />
        <meshBasicMaterial
          color="#C9983A"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flag / Floating marker */}
      <group ref={flagRef} position={[0, 1.5, 0]}>
        <mesh castShadow>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color="#C9983A"
            emissive="#C9983A"
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Amber point light */}
      <pointLight
        position={[0, 1, 0]}
        color="#C9983A"
        intensity={2}
        distance={4}
      />
    </group>
  );
}
