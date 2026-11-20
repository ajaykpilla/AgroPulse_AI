import React, { useState } from "react";
import {
  Layers,
  Thermometer,
  Droplets,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Zap,
  Info,
  X,
  Play,
  RotateCcw,
  Grid3X3,
  Eye,
  Radio,
} from "lucide-react";
import { FieldSectorCell } from "../data/sensorData";

interface InteractiveCropHeatmapProps {
  sectors: FieldSectorCell[];
  onUpdateSector: (updatedSector: FieldSectorCell) => void;
  onOpenCoPilotWithPrompt: (prompt: string) => void;
  isAndroidView?: boolean;
}

export type HeatmapMetricLayer =
  | "ndvi"
  | "moisture"
  | "temperature"
  | "npk"
  | "fungal";

export const InteractiveCropHeatmap: React.FC<InteractiveCropHeatmapProps> = ({
  sectors,
  onUpdateSector,
  onOpenCoPilotWithPrompt,
  isAndroidView = false,
}) => {
  const [activeLayer, setActiveLayer] = useState<HeatmapMetricLayer>("ndvi");
  const [selectedSectorId, setSelectedSectorId] = useState<string>("B2");
  const [tileDensity, setTileDensity] = useState<"detailed" | "compact">("detailed");
  const [hoveredSector, setHoveredSector] = useState<FieldSectorCell | null>(null);
  const [filterThreshold, setFilterThreshold] = useState<number>(0); // 0 = all
  const [showOnlyStressed, setShowOnlyStressed] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const selectedSector = sectors.find((s) => s.id === selectedSectorId) || sectors[0];

  // Helper color calculation per metric layer
  const getCellColor = (sector: FieldSectorCell, layer: HeatmapMetricLayer): string => {
    switch (layer) {
      case "ndvi": {
        // 0.2 (brown/red) -> 0.5 (amber/yellow) -> 0.75+ (deep emerald green)
        const v = sector.ndvi;
        if (v >= 0.8) return "bg-emerald-600 text-white";
        if (v >= 0.7) return "bg-emerald-500 text-white";
        if (v >= 0.6) return "bg-lime-500 text-slate-900";
        if (v >= 0.5) return "bg-amber-400 text-slate-900";
        if (v >= 0.4) return "bg-orange-500 text-white";
        return "bg-rose-700 text-white";
      }
      case "moisture": {
        // < 35 (parched red) -> 45-60 (amber) -> 60-75 (optimal teal/blue) -> > 85 (waterlogged purple)
        const m = sector.soilMoisture;
        if (m > 85) return "bg-indigo-600 text-white"; // waterlogged
        if (m >= 65) return "bg-teal-500 text-white";
        if (m >= 50) return "bg-emerald-500 text-white";
        if (m >= 38) return "bg-amber-500 text-slate-900";
        return "bg-red-600 text-white"; // drought stress
      }
      case "temperature": {
        // < 26 (cool cyan/green) -> 28-32 (optimal yellow) -> > 34 (heat stress crimson)
        const t = sector.canopyTempC;
        if (t > 34) return "bg-red-600 text-white";
        if (t >= 31) return "bg-orange-500 text-white";
        if (t >= 28) return "bg-amber-400 text-slate-900";
        if (t >= 24) return "bg-emerald-500 text-white";
        return "bg-cyan-600 text-white";
      }
      case "npk": {
        // 0 - 100
        const n = sector.npkFertilityIndex;
        if (n >= 80) return "bg-emerald-600 text-white";
        if (n >= 65) return "bg-teal-500 text-white";
        if (n >= 50) return "bg-amber-500 text-slate-900";
        return "bg-rose-600 text-white";
      }
      case "fungal": {
        // High is bad
        const f = sector.fungalRiskScore;
        if (f >= 70) return "bg-rose-600 text-white";
        if (f >= 50) return "bg-orange-500 text-white";
        if (f >= 30) return "bg-amber-400 text-slate-900";
        return "bg-emerald-600 text-white";
      }
    }
  };

  const getMetricDisplayValue = (sector: FieldSectorCell, layer: HeatmapMetricLayer): string => {
    switch (layer) {
      case "ndvi":
        return sector.ndvi.toFixed(2);
      case "moisture":
        return `${sector.soilMoisture}%`;
      case "temperature":
        return `${sector.canopyTempC}°C`;
      case "npk":
        return `${sector.npkFertilityIndex}`;
      case "fungal":
        return `${sector.fungalRiskScore}%`;
    }
  };

  // Aggregated KPIs
  const avgNdvi = (sectors.reduce((acc, s) => acc + s.ndvi, 0) / sectors.length).toFixed(2);
  const stressedCount = sectors.filter((s) => s.status !== "Optimal").length;
  const activeSolenoids = sectors.filter((s) => s.irrigationSolenoidStatus === "Active (Flowing)").length;
  const waterloggedCount = sectors.filter((s) => s.soilMoisture > 85).length;

  // Actions on Selected Sector
  const handleToggleSolenoid = () => {
    if (!selectedSector) return;
    const isFlowing = selectedSector.irrigationSolenoidStatus === "Active (Flowing)";
    const updated: FieldSectorCell = {
      ...selectedSector,
      irrigationSolenoidStatus: isFlowing ? "Idle (Closed)" : "Active (Flowing)",
      soilMoisture: isFlowing ? selectedSector.soilMoisture : Math.min(82, selectedSector.soilMoisture + 14),
      status: isFlowing ? selectedSector.status : "Optimal",
      stressReason: isFlowing ? selectedSector.stressReason : undefined,
    };
    onUpdateSector(updated);
    setActionSuccessNotice(
      isFlowing
        ? `Solenoid Valve for ${selectedSector.id} closed.`
        : `Micro-drip irrigation activated for ${selectedSector.id} (+14% root-zone moisture applied).`
    );
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleApplyBioRemedy = () => {
    if (!selectedSector) return;
    const updated: FieldSectorCell = {
      ...selectedSector,
      ndvi: Math.min(0.92, parseFloat((selectedSector.ndvi + 0.08).toFixed(2))),
      fungalRiskScore: Math.max(12, selectedSector.fungalRiskScore - 30),
      npkFertilityIndex: Math.min(95, selectedSector.npkFertilityIndex + 18),
      status: "Optimal",
      stressReason: undefined,
      organicRemedyRecommendation: "Bio-spray verified. Rhizophere microbiome stabilized.",
    };
    onUpdateSector(updated);
    setActionSuccessNotice(
      `Zero-cost biological spray (Jeevamrutham + Buttermilk) applied to ${selectedSector.id}. NDVI boosted to ${updated.ndvi} and fungal risk lowered!`
    );
    setTimeout(() => setActionSuccessNotice(null), 4500);
  };

  const handleAskAiAboutSector = () => {
    if (!selectedSector) return;
    const prompt = `Please provide a tailored zero-cost organic prescription for Field ${selectedSector.id} (${selectedSector.cropType}, Day ${selectedSector.daysAfterSowing}): Current NDVI is ${selectedSector.ndvi}, Root-Zone Moisture is ${selectedSector.soilMoisture}%, Canopy Temp is ${selectedSector.canopyTempC}°C, and Fungal Risk is ${selectedSector.fungalRiskScore}%. Current status: ${selectedSector.status} (${selectedSector.stressReason || "None"}). What biological inputs (Jeevamrutham, Neemastra, Panchagavya) should be prepared?`;
    onOpenCoPilotWithPrompt(prompt);
  };

  return (
    <div className="space-y-4">
      {/* Top Metric Strip - Clean Unboxed Numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
          <div className="text-xs text-slate-400 font-medium">Mean Canopy NDVI</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-400">
              {avgNdvi}
            </span>
            <span className="text-xs text-slate-400">· 15 Acres</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Target Vigor: &ge; 0.75</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
          <div className="text-xs text-slate-400 font-medium">Stressed Sectors</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                stressedCount > 0 ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {stressedCount}
            </span>
            <span className="text-xs text-slate-400">/ 64 blocks</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stressedCount > 0 ? "Remediation recommended" : "100% healthy"}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
          <div className="text-xs text-slate-400 font-medium">Active Drip Lines</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-teal-400">
              {activeSolenoids}
            </span>
            <span className="text-xs text-slate-400">flowing</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Automated micro-pulse</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4">
          <div className="text-xs text-slate-400 font-medium">Waterlogging Zones</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span
              className={`text-xl sm:text-2xl font-bold font-mono tabular-nums ${
                waterloggedCount > 0 ? "text-indigo-400" : "text-slate-400"
              }`}
            >
              {waterloggedCount}
            </span>
            <span className="text-xs text-slate-400">&gt; 85% sat.</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Furrow drainage status</div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionSuccessNotice && (
        <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessNotice}</span>
          </div>
          <button
            onClick={() => setActionSuccessNotice(null)}
            className="text-emerald-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2-Column Responsive Split on Desktop (Heatmap Left, Sticky Inspector Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Heatmap Grid Canvas */}
        <div className="lg:col-span-7 xl:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5 space-y-4">
          {/* Layer Controls, Filter Bar & Tile Density Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm font-semibold text-white">Heatmap Layer:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Layer Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveLayer("ndvi")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeLayer === "ndvi"
                      ? "bg-emerald-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🌿 NDVI Vigor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayer("moisture")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeLayer === "moisture"
                      ? "bg-teal-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  💧 Soil Moisture
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayer("temperature")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeLayer === "temperature"
                      ? "bg-amber-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🌡️ Canopy Heat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayer("npk")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeLayer === "npk"
                      ? "bg-indigo-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🧪 NPK Fertility
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLayer("fungal")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeLayer === "fungal"
                      ? "bg-rose-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  🦠 Fungal Spores
                </button>
              </div>

              {/* Tile Density Switcher */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTileDensity("detailed")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                    tileDensity === "detailed"
                      ? "bg-emerald-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="Data-rich tiles with coordinates, metrics, moisture gauge and badges"
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Detailed</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTileDensity("compact")}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1 transition cursor-pointer ${
                    tileDensity === "compact"
                      ? "bg-emerald-600 text-white font-semibold shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                  title="High-density compact view"
                >
                  <span className="text-[10px] font-mono">■■</span>
                  <span className="hidden sm:inline">Compact</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-300">
                {activeLayer === "ndvi" && "NDVI Scale (Normalized Difference Vegetation Index):"}
                {activeLayer === "moisture" && "Soil Moisture (% Volumetric Water Content):"}
                {activeLayer === "temperature" && "Canopy Leaf Temperature (°C):"}
                {activeLayer === "npk" && "Soil Chemical Fertility Index (0-100):"}
                {activeLayer === "fungal" && "Microclimate Fungal Spore Index (0-100):"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono tabular-nums">
              {activeLayer === "ndvi" && (
                <>
                  <span className="px-2 py-0.5 rounded bg-rose-700 text-white">&lt;0.4 Severe</span>
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950">0.5-0.6 Mild</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-white">0.7-0.8 Good</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-700 text-white">&gt;0.8 Peak</span>
                </>
              )}
              {activeLayer === "moisture" && (
                <>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white">&lt;35% Drought</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950">38-50% Low</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500 text-white">50-75% Ideal</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-600 text-white">&gt;85% Saturated</span>
                </>
              )}
              {activeLayer === "temperature" && (
                <>
                  <span className="px-2 py-0.5 rounded bg-cyan-600 text-white">&lt;25°C Cool</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500 text-white">25-28°C Optimal</span>
                  <span className="px-2 py-0.5 rounded bg-orange-500 text-white">31-34°C Warm</span>
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white">&gt;34°C Heat Stress</span>
                </>
              )}
              {activeLayer === "npk" && (
                <>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white">&lt;50 Depleted</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950">50-65 Moderate</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white">&gt;80 Enriched</span>
                </>
              )}
              {activeLayer === "fungal" && (
                <>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white">&lt;30 Safe</span>
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950">30-50 Caution</span>
                  <span className="px-2 py-0.5 rounded bg-rose-600 text-white">&gt;70 Outbreak Risk</span>
                </>
              )}
            </div>
          </div>

          {/* Live Hover Sector Telemetry Tile Preview */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 sm:p-3 text-xs transition-all duration-200">
            {hoveredSector ? (
              <div className="flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs border border-emerald-500/30">
                    {hoveredSector.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{hoveredSector.sectorName}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          hoveredSector.status === "Optimal"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-950 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {hoveredSector.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {hoveredSector.cropType} · Day {hoveredSector.daysAfterSowing} DAS · {hoveredSector.soilType}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 font-mono tabular-nums text-[11px]">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">NDVI:</span>
                    <span className="text-emerald-400 font-bold">{hoveredSector.ndvi}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Moisture:</span>
                    <span className="text-teal-400 font-bold">{hoveredSector.soilMoisture}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Temp:</span>
                    <span className="text-amber-400 font-bold">{hoveredSector.canopyTempC}°C</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">NPK:</span>
                    <span className="text-indigo-400 font-bold">{hoveredSector.npkFertilityIndex}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Fungal:</span>
                    <span
                      className={`${
                        hoveredSector.fungalRiskScore > 50 ? "text-rose-400" : "text-emerald-400"
                      } font-bold`}
                    >
                      {hoveredSector.fungalRiskScore}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">(Click to select)</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Hover over any of the 64 micro-sector tiles for instant live telemetry preview</span>
                </div>
                <div className="hidden sm:block font-mono text-[10px] text-slate-500">
                  Selected Sector: {selectedSector.sectorName} ({selectedSector.id})
                </div>
              </div>
            )}
          </div>

          {/* 8x8 Interactive Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[340px] sm:min-w-[480px]">
              {/* Column Headers (1 to 8) */}
              <div className="grid grid-cols-9 gap-1 text-center text-[11px] font-mono font-medium text-slate-500 mb-1">
                <div></div>
                {Array.from({ length: 8 }).map((_, c) => (
                  <div key={c} className="py-0.5">
                    Col {c + 1}
                  </div>
                ))}
              </div>

              {/* Grid Rows (A to H) */}
              <div className="space-y-1">
                {["A", "B", "C", "D", "E", "F", "G", "H"].map((rowLetter, r) => (
                  <div key={r} className="grid grid-cols-9 gap-1 items-center">
                    {/* Row Letter Header */}
                    <div className="text-[11px] font-mono font-bold text-slate-400 text-center">
                      Row {rowLetter}
                    </div>

                    {/* 8 Cells in Row */}
                    {Array.from({ length: 8 }).map((_, c) => {
                      const sector = sectors.find((s) => s.row === r && s.col === c);
                      if (!sector) return <div key={c} className="h-10 bg-slate-800/40 rounded-xl" />;

                      const isSelected = sector.id === selectedSectorId;
                      const cellColor = getCellColor(sector, activeLayer);
                      const val = getMetricDisplayValue(sector, activeLayer);
                      const isDetailed = tileDensity === "detailed";

                      return (
                        <button
                          key={sector.id}
                          type="button"
                          onClick={() => setSelectedSectorId(sector.id)}
                          onMouseEnter={() => setHoveredSector(sector)}
                          onMouseLeave={() => setHoveredSector(null)}
                          className={`rounded-xl flex flex-col justify-between transition-all cursor-pointer relative select-none border border-white/10 ${cellColor} ${
                            isDetailed ? "h-14 sm:h-16 p-1 sm:p-1.5" : "h-9 sm:h-11 p-1 items-center justify-center"
                          } ${
                            isSelected
                              ? "ring-2 sm:ring-4 ring-white shadow-2xl scale-[1.06] z-20 font-bold"
                              : "hover:scale-[1.03] hover:shadow-md"
                          } ${showOnlyStressed && sector.status === "Optimal" ? "opacity-25" : "opacity-100"}`}
                          title={`${sector.sectorName} (${sector.cropType}) - ${val}`}
                        >
                          {/* Tile Top Row: ID & Micro Badges */}
                          <div className={`w-full flex items-center justify-between leading-none ${isDetailed ? "" : "justify-center gap-1"}`}>
                            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-tight">
                              {sector.id}
                            </span>

                            {isDetailed && (
                              <div className="flex items-center gap-1">
                                {sector.status !== "Optimal" && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full bg-white shadow-xs"
                                    title={sector.stressReason}
                                  />
                                )}
                                {sector.irrigationSolenoidStatus === "Active (Flowing)" && (
                                  <span className="text-[9px]" title="Drip active">💧</span>
                                )}
                                {sector.ndvi >= 0.8 && (
                                  <span className="text-[8px] opacity-80" title="Peak vigor">🌿</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Tile Middle: Metric Value */}
                          <div className="text-center leading-none">
                            <span className="text-[11px] sm:text-xs font-mono font-bold tabular-nums">
                              {val}
                            </span>
                          </div>

                          {/* Tile Bottom: Micro Moisture Gauge Bar (Detailed Mode) */}
                          {isDetailed ? (
                            <div className="w-full bg-black/25 h-1 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-white/70 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(100, sector.soilMoisture)}%` }}
                              />
                            </div>
                          ) : (
                            sector.irrigationSolenoidStatus === "Active (Flowing)" && (
                              <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-200 animate-ping" />
                            )
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

        {/* Filter Toggle Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOnlyStressed}
              onChange={(e) => setShowOnlyStressed(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
            />
            <span className="text-slate-300">Highlight only stressed sectors (NDVI &lt; 0.60 or moisture deficit)</span>
          </label>

          <div className="text-[11px] text-slate-500 font-mono">
            Tap any block to inspect live sector telemetry
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Selected Sector Inspector Card */}
      <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-24 space-y-4">
        {selectedSector ? (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-white">
                  {selectedSector.sectorName}
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                    selectedSector.status === "Optimal"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-950 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {selectedSector.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                <span>{selectedSector.cropType}</span>
                <span aria-hidden="true">·</span>
                <span>Day {selectedSector.daysAfterSowing} DAS</span>
                <span aria-hidden="true">·</span>
                <span>{selectedSector.soilType}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{selectedSector.acreage} Acres</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-slate-400">Valve:</span>
              <span
                className={`text-xs font-mono font-medium px-2.5 py-1 rounded-lg ${
                  selectedSector.irrigationSolenoidStatus === "Active (Flowing)"
                    ? "bg-cyan-950 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {selectedSector.irrigationSolenoidStatus}
              </span>
            </div>
          </div>

          {/* Detailed Sector Sensor Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 text-xs">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
              <div className="text-slate-400">Canopy NDVI</div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                {selectedSector.ndvi}
              </div>
              <div className="text-[10px] text-slate-500">Spectral vigor</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
              <div className="text-slate-400">Soil Moisture</div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-teal-400 mt-0.5">
                {selectedSector.soilMoisture}%
              </div>
              <div className="text-[10px] text-slate-500">Volumetric root zone</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
              <div className="text-slate-400">Leaf Temp</div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-amber-400 mt-0.5">
                {selectedSector.canopyTempC}°C
              </div>
              <div className="text-[10px] text-slate-500">Thermal sensor</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
              <div className="text-slate-400">NPK Fertility</div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-indigo-400 mt-0.5">
                {selectedSector.npkFertilityIndex}/100
              </div>
              <div className="text-[10px] text-slate-500">Chemical balance</div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
              <div className="text-slate-400">Fungal Risk</div>
              <div
                className={`text-base sm:text-lg font-bold font-mono tabular-nums mt-0.5 ${
                  selectedSector.fungalRiskScore > 50 ? "text-rose-400" : "text-slate-300"
                }`}
              >
                {selectedSector.fungalRiskScore}%
              </div>
              <div className="text-[10px] text-slate-500">Spore incubation</div>
            </div>
          </div>

          {/* Stress Warning (if any) */}
          {selectedSector.stressReason && (
            <div className="bg-amber-950/50 border border-amber-500/40 rounded-xl p-3 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Agronomic Stress Detected: </span>
                <span>{selectedSector.stressReason}</span>
              </div>
            </div>
          )}

          {/* Zero-Cost Organic Remediation Recommendation */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
              <Sprout className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recommended Zero-Cost Biological Action</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">
              {selectedSector.organicRemedyRecommendation}
            </p>
          </div>

          {/* Quick Actions Button Strip */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleToggleSolenoid}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>
                {selectedSector.irrigationSolenoidStatus === "Active (Flowing)"
                  ? "Close Solenoid Valve"
                  : "Trigger Micro-Drip Pulse"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleApplyBioRemedy}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Dispatch Jeevamrutham Foliar Spray</span>
            </button>

            <button
              type="button"
              onClick={handleAskAiAboutSector}
              className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl transition-all flex items-center gap-2 cursor-pointer ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ask AgroPulse AI</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-xs text-slate-400">
          Tap any field sector block on the heatmap to view live telemetry and recommendations.
        </div>
      )}
      </div>
    </div>
  </div>
  );
};
