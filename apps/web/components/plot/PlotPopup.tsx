"use client";

import { Html } from "@react-three/drei";
import Link from "next/link";
import { PlotStatus } from "@yard/db"; // Assuming we can import the enum

interface PlotPopupProps {
  id: string;
  title: string;
  districtLabel: string;
  status: PlotStatus | string;
  buildScore?: number;
  builderUsername?: string | null;
}

export default function PlotPopup({
  id,
  title,
  districtLabel,
  status,
  buildScore = 0,
  builderUsername,
}: PlotPopupProps) {
  const getStatusColor = () => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400 border-green-400/30 bg-green-400/10";
      case "IDLE":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/10";
      case "UNCLAIMED":
        return "text-[#C9983A] border-[#C9983A]/30 bg-[#C9983A]/10";
      case "ABANDONED":
        return "text-red-400 border-red-400/30 bg-red-400/10";
      case "RUIN":
        return "text-gray-400 border-gray-400/30 bg-gray-400/10";
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/10";
    }
  };

  return (
    <Html
      position={[0, 4, 0]}
      center
      style={{
        transition: "all 0.2s",
        pointerEvents: "auto",
        zIndex: 10,
      }}
    >
      <Link href={`/plot/${id}`}>
        <div className="w-64 bg-[#0d0d0d]/95 border border-[#333] rounded-lg shadow-xl overflow-hidden cursor-pointer hover:border-[#555] transition-colors backdrop-blur-md">
          {/* Header */}
          <div className="p-3 border-b border-[#222]">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs text-gray-500 font-mono tracking-wider">
                {districtLabel}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded border font-mono tracking-wider ${getStatusColor()}`}
              >
                {status}
              </span>
            </div>
            <h3 className="text-[#e2e2e2] font-semibold text-sm leading-tight line-clamp-2">
              {title}
            </h3>
          </div>

          {/* Body */}
          <div className="p-3 bg-[#111] flex justify-between items-center">
            {status !== "UNCLAIMED" && status !== "RUIN" ? (
              <>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
                    Builder
                  </span>
                  <span className="text-xs text-gray-300 font-mono">
                    @{builderUsername || "unknown"}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-0.5">
                    Score
                  </span>
                  <span className="text-sm font-mono text-[#e2e2e2] font-semibold">
                    {buildScore.toFixed(0)}
                  </span>
                </div>
              </>
            ) : (
              <div className="w-full text-center">
                <span className="text-xs text-[#C9983A] uppercase tracking-widest font-mono">
                  Available to Claim
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </Html>
  );
}
