"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import CameraControls from "./CameraControls";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface CitySceneProps {
  children?: React.ReactNode;
  lowGraphics?: boolean;
  focusTarget?: [number, number, number] | null;
}

// Deep navy-black palette
const BG_COLOR = "#050812"; 
const FOG_COLOR = "#050812";

export default function CityScene({ children, lowGraphics = false, focusTarget = null }: CitySceneProps) {
  return (
    <div className="w-full h-screen bg-[#050812]">
      <Canvas
        shadows={!lowGraphics}
        dpr={lowGraphics ? [1, 1] : [1, 2]}
        camera={{
          position: [40, 40, 40],
          fov: 35,
          near: 0.1,
          far: 2000,
        }}
        gl={{ antialias: false }} 
      >
        <color attach="background" args={[BG_COLOR]} />
        <fog attach="fog" args={[FOG_COLOR, 100, 500]} />

        {/* Ambient light: Midnight blue */}
        <ambientLight color="#1a2642" intensity={1.0} />

        {/* Hemisphere light: Sky fading into Ground */}
        <hemisphereLight args={["#0c1830", "#050810", 0.8]} />

        {/* Directional light (Sun): Warm gold rim light */}
        <directionalLight
          position={[50, 100, -20]}
          intensity={1.8}
          color="#ffd479"
          castShadow={!lowGraphics}
          shadow-mapSize-width={lowGraphics ? 512 : 2048}
          shadow-mapSize-height={lowGraphics ? 512 : 2048}
          shadow-camera-near={0.5}
          shadow-camera-far={300}
          shadow-camera-left={-100}
          shadow-camera-right={100}
          shadow-camera-top={100}
          shadow-camera-bottom={-100}
          shadow-bias={-0.0001}
        />

        {/* Fill light (Secondary) */}
        <directionalLight
          position={[-50, 40, 50]}
          intensity={0.6}
          color="#102040"
        />

        {/* Massive Ocean/Water Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} receiveShadow>
          <planeGeometry args={[4000, 4000]} />
          <meshStandardMaterial color="#020308" roughness={0.05} metalness={0.9} />
        </mesh>

        {/* Controls */}
        <CameraControls focusTarget={focusTarget} />

        {/* Scene Content */}
        <Suspense fallback={null}>
          {children}
        </Suspense>

        {/* Post Processing */}
        {!lowGraphics && (
          <EffectComposer multisampling={4}>
            <Bloom 
              luminanceThreshold={0.5} 
              luminanceSmoothing={0.2}
              intensity={1.8} 
              mipmapBlur 
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
