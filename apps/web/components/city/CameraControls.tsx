"use client";

import { MapControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { MapControls as MapControlsImpl } from "three-stdlib";

interface CameraControlsProps {
  focusTarget?: [number, number, number] | null;
}

export default function CameraControls({ focusTarget }: CameraControlsProps) {
  const controlsRef = useRef<MapControlsImpl>(null);
  const { camera } = useThree();
  
  const startPos = useRef(new THREE.Vector3());
  const startLook = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const endLook = useRef(new THREE.Vector3());
  const progress = useRef(1);
  const active = useRef(false);

  useEffect(() => {
    if (!focusTarget) return;

    startPos.current.copy(camera.position);
    if (controlsRef.current) {
      startLook.current.copy(controlsRef.current.target);
    }

    const [px, py, pz] = focusTarget;
    // We want to pull back from the target based on typical desktop/mobile sizes
    const isMobile = window.innerWidth < 640;
    const dist = isMobile ? 80 : 60;
    const camH = isMobile ? 60 : 40;

    // Calculate a position outward from the center (0,0,0) so we look at the front of the district
    const len = Math.sqrt(px * px + pz * pz) || 1;
    endPos.current.set(px + (px / len) * dist, py + camH, pz + (pz / len) * dist);
    
    // Look directly at the target, slightly elevated
    endLook.current.set(px, py, pz);

    progress.current = 0;
    active.current = true;
  }, [focusTarget, camera]);

  useFrame((_, delta) => {
    if (!active.current || progress.current >= 1) return;

    // Advance progress (complete in roughly ~1.4 seconds)
    progress.current = Math.min(1, progress.current + delta * 0.7);
    
    // Ease-out cubic
    const t = 1 - Math.pow(1 - progress.current, 3);

    // Direct interpolation from start to end
    camera.position.lerpVectors(startPos.current, endPos.current, t);

    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(startLook.current, endLook.current, t);
      controlsRef.current.update();
    }

    if (progress.current >= 1) {
      active.current = false;
    }
  });

  return (
    <MapControls
      ref={controlsRef}
      enableRotate={true}
      enablePan={true}
      enableZoom={true}
      maxPolarAngle={Math.PI / 2.1} // Prevent going below ground
      minPolarAngle={Math.PI / 4}
      minDistance={10}
      maxDistance={250}
      dampingFactor={0.05}
      makeDefault
    />
  );
}
