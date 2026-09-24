"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface BuildingProps {
  scoreTotal: number;
  status: "ACTIVE" | "IDLE" | "UNCLAIMED" | "ABANDONED" | "RUIN";
  position: [number, number, number];
}

export default function Building({
  scoreTotal,
  status,
  position,
}: BuildingProps) {
  // Height formula from spec: 1 + (score.total / 100) * 24
  const height = 1 + (scoreTotal / 100) * 24;
  const width = 1.8;
  const depth = 1.8;

  const isLit = status === "ACTIVE";
  
  // Base color
  const baseColor = isLit ? "#1a2e1a" : "#0f1a0f";
  // Window emission
  const windowColor = isLit ? "#c9983a" : "#443311";
  const windowIntensity = isLit ? 1.5 : 0.2;

  // Generate simple windows
  const windows = useMemo(() => {
    const arr = [];
    const windowRows = Math.floor(height) * 2;
    const windowCols = 2;
    const padding = 0.2;

    for (let i = 0; i < windowRows; i++) {
      for (let j = 0; j < windowCols; j++) {
        // Only add some windows randomly for a more natural look
        if (Math.random() > 0.3) {
          // Front face windows
          arr.push(
            <mesh
              key={`front-${i}-${j}`}
              position={[
                (j - 0.5) * 0.8,
                (i + 0.5) * (height / windowRows) - height / 2,
                depth / 2 + 0.01,
              ]}
            >
              <planeGeometry args={[0.3, 0.4]} />
              <meshStandardMaterial
                color={windowColor}
                emissive={windowColor}
                emissiveIntensity={windowIntensity}
              />
            </mesh>
          );
          // Back face windows
          arr.push(
            <mesh
              key={`back-${i}-${j}`}
              position={[
                (j - 0.5) * 0.8,
                (i + 0.5) * (height / windowRows) - height / 2,
                -(depth / 2 + 0.01),
              ]}
              rotation={[0, Math.PI, 0]}
            >
              <planeGeometry args={[0.3, 0.4]} />
              <meshStandardMaterial
                color={windowColor}
                emissive={windowColor}
                emissiveIntensity={windowIntensity}
              />
            </mesh>
          );
        }
      }
    }
    return arr;
  }, [height, windowColor, windowIntensity]);

  return (
    <group position={[position[0], position[1] + height / 2, position[2]]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Render windows on the facade */}
      {windows}
    </group>
  );
}
