"use client";

import { useState } from "react";
import CityScene from "./CityScene";
import CityHUD from "./CityHUD";
import District from "./District";
import Building from "../plot/Building";
import Beacon from "../plot/Beacon";
import Ruin from "../plot/Ruin";
import PlotPopup from "../plot/PlotPopup";
import InstancedCity from "./InstancedCity";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface CityWrapperProps {
  districts: any[];
  plots: any[];
}

export default function CityWrapper({ districts, plots }: CityWrapperProps) {
  const [lowGraphics, setLowGraphics] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  
  const router = useRouter();

  // Track global mouse position for the floating tooltip
  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMouse);
    return () => window.removeEventListener("mousemove", updateMouse);
  }, []);

  // Filter plots by active district
  const visiblePlots = activeFilter
    ? plots.filter((p) => p.district.slug === activeFilter)
    : plots;

  const builderCount = new Set(plots.filter(p => p.builderId).map(p => p.builderId)).size;
  const plotCount = plots.filter(p => p.status !== "UNCLAIMED" && p.status !== "RUIN").length;

  // Compute camera focus target based on active district
  const activeDistrict = districts.find(d => d.slug === activeFilter);
  const focusTarget: [number, number, number] | null = activeDistrict
    ? [activeDistrict.gridOriginX, 0, activeDistrict.gridOriginZ]
    : [0, 0, 0]; // Default center

  const hoveredPlot = plots.find(p => p.id === hoveredPlotId);

  return (
    <div className="relative w-full h-screen overflow-hidden cursor-crosshair">
      <CityHUD
        builderCount={builderCount}
        plotCount={plotCount}
        onFilterChange={setActiveFilter}
        lowGraphics={lowGraphics}
        onToggleGraphics={() => setLowGraphics(!lowGraphics)}
      />

      <CityScene lowGraphics={lowGraphics} focusTarget={focusTarget}>
        {/* Render Districts */}
        {districts.map((d) => (
          <District
            key={d.id}
            slug={d.slug}
            label={d.label}
            gridOriginX={d.gridOriginX}
            gridOriginZ={d.gridOriginZ}
          />
        ))}

        {/* Render Instanced Buildings (Phase C) */}
        <InstancedCity 
          plots={visiblePlots}
          hoveredPlotId={hoveredPlotId}
          setHoveredPlotId={setHoveredPlotId}
        />

        {/* Render Beacons and Ruins */}
        {visiblePlots.map((plot) => {
          if (plot.status === "ACTIVE" || plot.status === "IDLE" || plot.status === "ABANDONED") {
            return null; // Handled by InstancedCity
          }

          const position: [number, number, number] = [plot.gridX, 0, plot.gridZ];

          return (
            <group
              key={plot.id}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredPlotId(plot.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                if (hoveredPlotId === plot.id) {
                  setHoveredPlotId(null);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/plot/${plot.id}`);
              }}
            >
              {plot.status === "UNCLAIMED" && <Beacon position={position} />}
              {plot.status === "RUIN" && <Ruin position={position} />}
            </group>
          );
        })}
      </CityScene>

      {/* Floating 2D HTML Overlay for Plot Hover (Fixes React 19 drei/Html unmount crash) */}
      <div 
        className="fixed pointer-events-none z-50 transition-opacity duration-200"
        style={{
          left: mousePos.x + 15,
          top: mousePos.y + 15,
          opacity: hoveredPlot ? 1 : 0
        }}
      >
        <PlotPopup
          id={hoveredPlot?.id || ""}
          title={hoveredPlot?.idea?.title || ""}
          districtLabel={hoveredPlot?.district?.label || ""}
          status={hoveredPlot?.status || "UNCLAIMED"}
          buildScore={hoveredPlot?.healthScore?.total || 0}
          builderUsername={hoveredPlot?.builder?.username}
        />
      </div>
    </div>
  );
}
