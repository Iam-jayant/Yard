"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface RuinProps {
  position: [number, number, number];
}

export default function Ruin({ position }: RuinProps) {
  const width = 1.6;
  const height = 0.8;
  const depth = 1.6;

  // Generate an irregular, ruined box by randomizing vertices slightly
  const geometry = useMemo(() => {
    // 2 segments on each axis to give enough vertices to perturb
    const geo = new THREE.BoxGeometry(width, height, depth, 2, 2, 2);
    const positionAttribute = geo.getAttribute("position");
    
    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      // Only perturb the top and sides slightly, leave the base flat
      if (y > -height / 2) {
        positionAttribute.setXYZ(
          i,
          x + (Math.random() - 0.5) * 0.4,
          y - Math.random() * 0.3,
          z + (Math.random() - 0.5) * 0.4
        );
      }
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={[position[0], position[1] + height / 2, position[2]]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#2a2a2a" // Grey desaturated color
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Some scattered rubble around the base */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 2,
            -height / 2 + 0.1,
            (Math.random() - 0.5) * 2,
          ]}
          rotation={[
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI,
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#222222" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
