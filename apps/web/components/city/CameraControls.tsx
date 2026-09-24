"use client";

import { MapControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export default function CameraControls() {
  const { camera } = useThree();

  return (
    <MapControls
      camera={camera}
      enableRotate={true}
      enablePan={true}
      enableZoom={true}
      maxPolarAngle={Math.PI / 3} // Lock vertical angle (roughly isometric feel)
      minPolarAngle={Math.PI / 4} // Lock vertical angle
      maxDistance={150} // Max zoom out
      minDistance={20} // Max zoom in
      dampingFactor={0.05} // Smooth panning
    />
  );
}
