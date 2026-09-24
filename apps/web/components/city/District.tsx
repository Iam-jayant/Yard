"use client";

import { Html } from "@react-three/drei";

interface DistrictProps {
  slug: string;
  label: string;
  gridOriginX: number;
  gridOriginZ: number;
  size?: number; // Size of the district plane
}

export default function District({
  slug,
  label,
  gridOriginX,
  gridOriginZ,
  size = 40,
}: DistrictProps) {
  return (
    <group position={[gridOriginX, 0, gridOriginZ]}>
      {/* District Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#111111" />
      </mesh>

      {/* Grid Helper for visual structure */}
      <gridHelper
        args={[size, 10, "#333333", "#222222"]}
        position={[0, 0.01, 0]}
      />

      {/* District Label Overlay */}
      <Html
        position={[0, 0, -size / 2 - 2]}
        center
        className="pointer-events-none select-none"
        style={{
          transform: 'translate3d(0,0,0)', // Fix rendering issues in some browsers
        }}
      >
        <div className="bg-[#0d0d0d]/80 border border-[#333] px-3 py-1 rounded text-[#C9983A] font-mono text-xs uppercase tracking-wider backdrop-blur-sm whitespace-nowrap">
          {label} DISTRICT
        </div>
      </Html>
    </group>
  );
}
