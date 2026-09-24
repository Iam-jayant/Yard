"use client";

import { Canvas } from "@react-three/fiber";
import CameraControls from "./CameraControls";

interface CitySceneProps {
  children?: React.ReactNode;
  lowGraphics?: boolean;
}

export default function CityScene({ children, lowGraphics = false }: CitySceneProps) {
  return (
    <div className="w-full h-screen bg-[#0d0d0d]">
      <Canvas
        shadows={!lowGraphics}
        dpr={lowGraphics ? [1, 1] : [1, 2]} // Lower pixel ratio in low graphics mode
        camera={{
          position: [40, 40, 40],
          fov: 35,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: !lowGraphics }}
      >
        <color attach="background" args={["#0d0d0d"]} />
        <fog attach="fog" args={["#0d0d0d", 50, 150]} />

        {/* Ambient light for base visibility */}
        <ambientLight intensity={0.4} />

        {/* Directional light for shadows and warm accent */}
        <directionalLight
          position={[50, 100, 20]}
          intensity={1.2}
          color="#fdf4dc" // Warm accent
          castShadow={!lowGraphics}
          shadow-mapSize-width={lowGraphics ? 512 : 2048}
          shadow-mapSize-height={lowGraphics ? 512 : 2048}
          shadow-camera-near={0.5}
          shadow-camera-far={200}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />

        {/* Controls */}
        <CameraControls />

        {/* Scene Content (Districts, Buildings, Beacons) */}
        {children}
      </Canvas>
    </div>
  );
}
