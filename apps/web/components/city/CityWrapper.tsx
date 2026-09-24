"use client";

import { useState } from "react";
import CityScene from "./CityScene";
import CityHUD from "./CityHUD";
import District from "./District";
import Building from "../plot/Building";
import Beacon from "../plot/Beacon";
import Ruin from "../plot/Ruin";
import PlotPopup from "../plot/PlotPopup";
import { Html } from "@react-three/drei";

interface CityWrapperProps {
  districts: any[];
  plots: any[];
}

export default function CityWrapper({ districts, plots }: CityWrapperProps) {
  const [lowGraphics, setLowGraphics] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null);

  // Filter plots by active district
  const visiblePlots = activeFilter
    ? plots.filter((p) => p.district.slug === activeFilter)
    : plots;

  const builderCount = new Set(plots.filter(p => p.builderId).map(p => p.builderId)).size;
  const plotCount = plots.filter(p => p.status !== "UNCLAIMED" && p.status !== "RUIN").length;

  return (
    <>
      <CityHUD
        builderCount={builderCount}
        plotCount={plotCount}
        onFilterChange={setActiveFilter}
        lowGraphics={lowGraphics}
        onToggleGraphics={() => setLowGraphics(!lowGraphics)}
      />

      <CityScene lowGraphics={lowGraphics}>
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

        {/* Render Plots */}
        {visiblePlots.map((plot) => {
          // Adjust position relative to district origin if gridX/Z are local, 
          // or if they are absolute city coordinates, just use them.
          // Spec says "position each on grid by plot.gridX / plot.gridZ"
          const position: [number, number, number] = [plot.gridX, 0, plot.gridZ];

          return (
            <group
              key={plot.id}
              onPointerOver={(e) => {
                e.stopPropagation(); // Prevent hovering multiple overlapping objects
                setHoveredPlotId(plot.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                if (hoveredPlotId === plot.id) {
                  setHoveredPlotId(null);
                }
              }}
            >
              {plot.status === "UNCLAIMED" && <Beacon position={position} />}
              
              {plot.status === "RUIN" && <Ruin position={position} />}
              
              {(plot.status === "ACTIVE" ||
                plot.status === "IDLE" ||
                plot.status === "ABANDONED") && (
                <Building
                  scoreTotal={plot.healthScore?.total || 0}
                  status={plot.status}
                  position={position}
                />
              )}

              {/* Render Hover Popup */}
              {hoveredPlotId === plot.id && (
                <group position={[position[0], position[1] + (plot.healthScore?.total ? 1 + (plot.healthScore.total / 100) * 24 : 3), position[2]]}>
                  <PlotPopup
                    id={plot.id}
                    title={plot.idea.title}
                    districtLabel={plot.district.label}
                    status={plot.status}
                    buildScore={plot.healthScore?.total || 0}
                    builderUsername={plot.builder?.username}
                  />
                </group>
              )}
            </group>
          );
        })}
      </CityScene>
    </>
  );
}
