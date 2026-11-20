import React, { useState } from "react";
import {
  Sprout,
  Radio,
  ShieldCheck,
  TrendingUp,
  Zap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Thermometer,
  Droplets,
  CloudLightning,
  ExternalLink,
} from "lucide-react";

interface ApplicationHeroTileProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onOpenCoPilot: (prompt?: string) => void;
  onOpenDemoVideo?: () => void;
  onOpenPresentationDeck?: () => void;
}

export const ApplicationHeroTile: React.FC<ApplicationHeroTileProps> = ({
  activeTab,
  onTabChange,
  onOpenCoPilot,
  onOpenDemoVideo,
  onOpenPresentationDeck,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/40 border border-emerald-500/30 shadow-xl backdrop-blur-md mb-5 sm:mb-6 transition-all duration-300">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

      {/* Primary Tile Header Section */}
      <div className="p-4 sm:p-6 lg:p-7 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Brand & Persona Identity Block */}
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                  <Sprout className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                  AgroPulse AI
                </h1>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Live Grid Synced
                </span>
                <span className="hidden sm:inline-flex text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  v2.4 LTS · Android / Web
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Autonomous Closed-Loop Agritech &amp; Quick-Commerce Co-Pilot · Real-time 64-sector IoT telemetry, 50-year climate reanalysis, and 15-minute farm-to-doorstep traceability.
              </p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 pt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Kandi FPC Cluster #04 (Telangana)
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>Sentinel-2 Multispectral</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-teal-300 font-mono">15-Acre Canopy Grid</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-amber-300 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  investmentShield Parametric Active
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons in Master Tile */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 self-start lg:self-center">
            <button
              type="button"
              onClick={() => onOpenCoPilot("Explain the current status of Kandi FPC cluster, active telemetry anomalies, and recommended zero-cost organic interventions.")}
              className="px-3.5 py-2 text-xs font-semibold text-slate-100 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 rounded-xl transition-all border border-slate-700/80 shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ask AgroPulse AI</span>
            </button>

            {onOpenPresentationDeck && (
              <button
                type="button"
                onClick={onOpenPresentationDeck}
                className="px-3.5 py-2 text-xs font-semibold text-slate-100 bg-slate-800/90 hover:bg-slate-700 active:bg-slate-600 rounded-xl transition-all border border-slate-700/80 shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Pitch Overview</span>
              </button>
            )}

            {onOpenDemoVideo && (
              <button
                type="button"
                onClick={onOpenDemoVideo}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-all border border-emerald-400/40 shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>3-Min Demo Video</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl transition border border-slate-700/60 cursor-pointer"
              title={isExpanded ? "Collapse metric ribbon" : "Expand metric ribbon"}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expandable Core Impact Metrics Ribbon (Anti-AI slop: clean numbers, tabular-nums) */}
        {isExpanded && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* Metric Tile 1: Farmer Realization */}
            <div className="bg-slate-950/60 border border-emerald-500/25 rounded-xl p-3 sm:p-3.5 hover:border-emerald-500/50 transition">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Farmer Realization</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                +35%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                vs APMC Mandi benchmark
              </div>
            </div>

            {/* Metric Tile 2: Consumer Produce Price */}
            <div className="bg-slate-950/60 border border-teal-500/25 rounded-xl p-3 sm:p-3.5 hover:border-teal-500/50 transition">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Urban Consumer Cost</span>
                <Zap className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-teal-400 mt-1">
                -20%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Direct farm gate disintermediation
              </div>
            </div>

            {/* Metric Tile 3: 15-Minute Delivery SLA */}
            <div className="bg-slate-950/60 border border-amber-500/25 rounded-xl p-3 sm:p-3.5 hover:border-amber-500/50 transition">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Express Delivery SLA</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-400 mt-1">
                15 Mins
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                From micro-darkstore to doorstep
              </div>
            </div>

            {/* Metric Tile 4: Zero-Cost Bio Remediation */}
            <div className="bg-slate-950/60 border border-indigo-500/25 rounded-xl p-3 sm:p-3.5 hover:border-indigo-500/50 transition">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Bio Remediation</span>
                <Sprout className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-indigo-400 mt-1">
                ₹0 Cost
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Jeevamrutham + Neemastra verified
              </div>
            </div>

            {/* Metric Tile 5: Parametric Calamity Shield */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-950/60 border border-cyan-500/25 rounded-xl p-3 sm:p-3.5 hover:border-cyan-500/50 transition">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Automated Insurance</span>
                <CloudLightning className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-cyan-400 mt-1">
                ₹4.8L Pool
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Satellite rain threshold &gt;35mm/hr
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
