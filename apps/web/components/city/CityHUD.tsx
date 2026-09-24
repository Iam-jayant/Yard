"use client";

import { useState } from "react";

interface CityHUDProps {
  builderCount: number;
  plotCount: number;
  onFilterChange: (districtId: string | null) => void;
  lowGraphics: boolean;
  onToggleGraphics: () => void;
}

export default function CityHUD({
  builderCount,
  plotCount,
  onFilterChange,
  lowGraphics,
  onToggleGraphics,
}: CityHUDProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const districts = [
    { id: "ai", label: "AI" },
    { id: "web3", label: "WEB3" },
    { id: "infra", label: "INFRA" },
    { id: "web", label: "WEB" },
    { id: "open", label: "OPEN" },
  ];

  const handleFilterClick = (id: string) => {
    const newFilter = activeFilter === id ? null : id;
    setActiveFilter(newFilter);
    onFilterChange(newFilter);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex gap-4">
          {/* Stats Widget */}
          <div className="bg-[#0d0d0d]/80 border border-[#333] rounded-lg p-3 backdrop-blur-md flex gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                Builders Active
              </span>
              <span className="text-lg font-mono text-[#e2e2e2] font-semibold">
                {builderCount}
              </span>
            </div>
            <div className="w-px bg-[#333]"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                Plots Claimed
              </span>
              <span className="text-lg font-mono text-[#e2e2e2] font-semibold">
                {plotCount}
              </span>
            </div>
          </div>
        </div>

        {/* Graphics Toggle */}
        <button
          onClick={onToggleGraphics}
          className={`px-3 py-1.5 rounded-md border font-mono text-xs transition-colors backdrop-blur-md ${
            lowGraphics
              ? "bg-[#C9983A]/20 border-[#C9983A]/50 text-[#C9983A]"
              : "bg-[#0d0d0d]/80 border-[#333] text-gray-400 hover:text-gray-200"
          }`}
        >
          {lowGraphics ? "LO-FI: ON" : "LO-FI: OFF"}
        </button>
      </div>

      {/* Bottom Bar - Filters */}
      <div className="flex justify-center pointer-events-auto">
        <div className="bg-[#0d0d0d]/80 border border-[#333] rounded-full p-1.5 backdrop-blur-md flex gap-1">
          <button
            onClick={() => handleFilterClick("all")}
            className={`px-4 py-1.5 rounded-full font-mono text-xs transition-colors ${
              activeFilter === null
                ? "bg-[#333] text-white"
                : "text-gray-400 hover:text-gray-200 hover:bg-[#222]"
            }`}
          >
            ALL
          </button>
          
          {districts.map((d) => (
            <button
              key={d.id}
              onClick={() => handleFilterClick(d.id)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs transition-colors ${
                activeFilter === d.id
                  ? "bg-[#333] text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-[#222]"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
