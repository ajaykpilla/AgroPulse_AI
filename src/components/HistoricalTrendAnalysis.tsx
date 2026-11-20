import React, { useState } from "react";
import {
  TrendingUp,
  Download,
  Share2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Sprout,
  Thermometer,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  getHistoricalTrendData,
  HistoricalTrendPoint,
} from "../data/sensorData";

interface HistoricalTrendAnalysisProps {
  cropName?: string;
  clusterName?: string;
  onOpenCoPilotWithPrompt: (prompt: string) => void;
  isAndroidView?: boolean;
}

export const HistoricalTrendAnalysis: React.FC<HistoricalTrendAnalysisProps> = ({
  cropName = "Hydroponic Roma Tomatoes",
  clusterName = "Kandi FPC Smart Hub #04",
  onOpenCoPilotWithPrompt,
  isAndroidView = false,
}) => {
  const [horizon, setHorizon] = useState<"24h" | "7d" | "30d" | "90d" | "50yr">("30d");
  const [activeMetric, setActiveMetric] = useState<"ndvi" | "moisture" | "temperature" | "nitrogen">("ndvi");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const data: HistoricalTrendPoint[] = getHistoricalTrendData(horizon);

  // SVG Chart Dimensions
  const svgWidth = 720;
  const svgHeight = 280;
  const padding = { top: 25, right: 30, bottom: 45, left: 45 };
  const graphWidth = svgWidth - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Active Metric Scales
  let minVal = 0;
  let maxVal = 1;
  let unit = "";
  let metricLabel = "";

  if (activeMetric === "ndvi") {
    minVal = 0.2;
    maxVal = 1.0;
    unit = "NDVI";
    metricLabel = "Vegetative Canopy Vigor (NDVI)";
  } else if (activeMetric === "moisture") {
    minVal = 20;
    maxVal = 100;
    unit = "%";
    metricLabel = "Root-Zone Soil Moisture (%)";
  } else if (activeMetric === "temperature") {
    minVal = 15;
    maxVal = 45;
    unit = "°C";
    metricLabel = "Canopy Leaf Temperature (°C)";
  } else if (activeMetric === "nitrogen") {
    minVal = 40;
    maxVal = 260;
    unit = "mg/kg";
    metricLabel = "Available Soil Nitrogen (mg/kg)";
  }

  const getMetricVal = (p: HistoricalTrendPoint): number => {
    if (activeMetric === "ndvi") return p.ndvi;
    if (activeMetric === "moisture") return p.soilMoisturePercent;
    if (activeMetric === "temperature") return p.canopyTempC;
    return p.nitrogenMgKg;
  };

  const getBaselineVal = (p: HistoricalTrendPoint): number => {
    if (activeMetric === "ndvi") return p.ndviBaseline;
    if (activeMetric === "moisture") return p.soilMoistureThresholdMin;
    if (activeMetric === "temperature") return p.ambientTempC;
    return 160;
  };

  // Convert data points to SVG coordinates
  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(1, data.length - 1)) * graphWidth;
    const val = getMetricVal(d);
    const normalizedY = (val - minVal) / (maxVal - minVal);
    const y = padding.top + graphHeight - Math.max(0, Math.min(graphHeight, normalizedY * graphHeight));
    return { x, y, data: d, val };
  });

  const baselinePoints = data.map((d, i) => {
    const x = padding.left + (i / Math.max(1, data.length - 1)) * graphWidth;
    const val = getBaselineVal(d);
    const normalizedY = (val - minVal) / (maxVal - minVal);
    const y = padding.top + graphHeight - Math.max(0, Math.min(graphHeight, normalizedY * graphHeight));
    return { x, y, val };
  });

  // Polyline strings
  const polylineStr = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const baselinePolylineStr = baselinePoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPathStr = points.length > 0
    ? `M ${points[0].x.toFixed(1)},${(padding.top + graphHeight).toFixed(1)} ` +
      points.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)} `).join("") +
      `L ${points[points.length - 1].x.toFixed(1)},${(padding.top + graphHeight).toFixed(1)} Z`
    : "";

  // Summary statistics
  const currentMetricValues = data.map(getMetricVal);
  const currentAvg = (currentMetricValues.reduce((a, b) => a + b, 0) / currentMetricValues.length).toFixed(
    activeMetric === "ndvi" ? 2 : 1
  );
  const currentMax = Math.max(...currentMetricValues).toFixed(activeMetric === "ndvi" ? 2 : 1);
  const currentMin = Math.min(...currentMetricValues).toFixed(activeMetric === "ndvi" ? 2 : 1);
  const totalRainfallMm = data.reduce((sum, d) => sum + d.rainfallMm, 0).toFixed(1);
  const calamityCount = data.filter((d) => d.parametricPayoutTriggered).length;

  const activeHoverPoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : points[points.length - 1];

  // CSV Exporter
  const handleExportCsv = () => {
    const headers = [
      "Time/Period",
      "DaysAfterSowing",
      "NDVI",
      "NDVI_Baseline",
      "SoilMoisture_Percent",
      "CanopyTemp_C",
      "AmbientTemp_C",
      "Nitrogen_mg_kg",
      "Rainfall_mm",
      "Irrigation_mm",
      "ParametricCalamityTriggered",
      "EventAnnotation",
    ];
    const rows = data.map((d) => [
      `"${d.timestampLabel}"`,
      d.daysAfterSowing,
      d.ndvi,
      d.ndviBaseline,
      d.soilMoisturePercent,
      d.canopyTempC,
      d.ambientTempC,
      d.nitrogenMgKg,
      d.rainfallMm,
      d.irrigationPulseMm,
      d.parametricPayoutTriggered ? "YES" : "NO",
      `"${d.eventAnnotation || ""}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AgroPulse_${clusterName.replace(/\s+/g, "_")}_${horizon}_trend.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice("Exported full sensor dataset to CSV format.");
    setTimeout(() => setExportNotice(null), 4000);
  };

  // WhatsApp Share Simulator
  const handleShareToFpc = () => {
    const text = `AgroPulse AI Crop Telemetry Report for ${cropName} (${clusterName}):\n- Horizon: ${horizon.toUpperCase()}\n- Average ${metricLabel}: ${currentAvg} ${unit}\n- Total Accumulated Rainfall: ${totalRainfallMm}mm\n- Parametric Insurance Triggers: ${calamityCount}\n- Verified on AgroPulse Digital Grid.`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank");
    setExportNotice("Prepared formatted WhatsApp dispatch summary for FPC Ground Officers.");
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-4">
      {/* Horizon & Metric Selector Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                Historical Trend Analysis &amp; 50-Yr Climate Reanalysis
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-parameter growth trajectories, irrigation events, and satellite weather anomaly records.
            </p>
          </div>

          {/* Time Horizon Segmented Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
            {(["24h", "7d", "30d", "90d", "50yr"] as const).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => {
                  setHorizon(h);
                  setHoveredIndex(null);
                }}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  horizon === h
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {h === "24h"
                  ? "24 Hours"
                  : h === "7d"
                  ? "7 Days"
                  : h === "30d"
                  ? "30 Days"
                  : h === "90d"
                  ? "90D Full Season"
                  : "50-Yr Reanalysis"}
              </button>
            ))}
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Metric:</span>
          <button
            type="button"
            onClick={() => setActiveMetric("ndvi")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeMetric === "ndvi"
                ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-semibold"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            🌿 NDVI Vigor
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("moisture")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeMetric === "moisture"
                ? "bg-teal-950 text-teal-300 border border-teal-500/50 font-semibold"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            💧 Soil Moisture
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("temperature")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeMetric === "temperature"
                ? "bg-amber-950 text-amber-300 border border-amber-500/50 font-semibold"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            🌡️ Canopy Temp
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric("nitrogen")}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              activeMetric === "nitrogen"
                ? "bg-indigo-950 text-indigo-300 border border-indigo-500/50 font-semibold"
                : "bg-slate-800/80 text-slate-400 hover:text-slate-200"
            }`}
          >
            🧪 Soil Nitrogen (N)
          </button>

          {/* Export Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              title="Download full CSV sensor log"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleShareToFpc}
              className="px-3 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              title="Share brief to FPC WhatsApp Group"
            >
              <Share2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Export Notification Toast */}
        {exportNotice && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
        )}

        {/* SVG Interactive Chart Viewport */}
        <div className="relative bg-slate-950/80 border border-slate-800 rounded-xl p-2 sm:p-4 overflow-hidden">
          {/* Active Hover Data Ribbon */}
          {activeHoverPoint && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 mb-2 bg-slate-900/90 rounded-lg border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white font-mono">
                  {activeHoverPoint.data.timestampLabel}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400">Day {activeHoverPoint.data.daysAfterSowing} DAS</span>
              </div>
              <div className="flex items-center gap-3 font-mono tabular-nums">
                <span className="text-emerald-400 font-bold">
                  {metricLabel.split(" ")[0]}: {activeHoverPoint.val} {unit}
                </span>
                <span className="text-slate-400 text-[11px]">
                  (Baseline: {getBaselineVal(activeHoverPoint.data)} {unit})
                </span>
                {activeHoverPoint.data.rainfallMm > 0 && (
                  <span className="text-cyan-400 text-[11px]">
                    🌧️ {activeHoverPoint.data.rainfallMm}mm rain
                  </span>
                )}
                {activeHoverPoint.data.irrigationPulseMm > 0 && (
                  <span className="text-teal-400 text-[11px]">
                    💧 {activeHoverPoint.data.irrigationPulseMm}mm drip
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Interactive SVG Chart */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[540px] select-none"
            >
              <defs>
                <linearGradient id="metricAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Horizontal Gridlines & Y-Axis Labels */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
                const y = padding.top + graphHeight * (1 - pct);
                const val = (minVal + pct * (maxVal - minVal)).toFixed(activeMetric === "ndvi" ? 2 : 0);
                return (
                  <g key={idx}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={svgWidth - padding.right}
                      y2={y}
                      stroke="rgba(148, 163, 184, 0.12)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      fill="rgba(148, 163, 184, 0.7)"
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Rainfall and Irrigation Bars at Bottom */}
              {data.map((d, i) => {
                if (d.rainfallMm <= 0 && d.irrigationPulseMm <= 0) return null;
                const x = padding.left + (i / Math.max(1, data.length - 1)) * graphWidth;
                const barH = Math.min(graphHeight * 0.45, Math.max(8, (d.rainfallMm || d.irrigationPulseMm) * 2.5));
                const y = padding.top + graphHeight - barH;
                return (
                  <rect
                    key={`bar-${i}`}
                    x={x - 4}
                    y={y}
                    width={8}
                    height={barH}
                    rx={2}
                    fill={d.rainfallMm > 0 ? "url(#rainGrad)" : "rgba(45, 212, 191, 0.4)"}
                    opacity={0.8}
                  />
                );
              })}

              {/* Baseline Reference Polyline (dashed gray) */}
              <polyline
                fill="none"
                stroke="rgba(148, 163, 184, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                points={baselinePolylineStr}
              />

              {/* Primary Metric Shaded Area */}
              <path d={areaPathStr} fill="url(#metricAreaGrad)" />

              {/* Primary Metric Polyline */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {/* Historical Event Markers & Dots */}
              {points.map((p, i) => {
                const isHovered = hoveredIndex === i;
                const hasEvent = !!p.data.eventAnnotation;
                const isCalamity = p.data.parametricPayoutTriggered;

                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onClick={() => setHoveredIndex(i)}
                    className="cursor-pointer"
                  >
                    {/* Hover Hitbox */}
                    <rect
                      x={p.x - 12}
                      y={padding.top}
                      width={24}
                      height={graphHeight}
                      fill="transparent"
                    />

                    {/* Calamity / Event Vertical Marker Line */}
                    {hasEvent && (
                      <line
                        x1={p.x}
                        y1={padding.top}
                        x2={p.x}
                        y2={padding.top + graphHeight}
                        stroke={isCalamity ? "#f43f5e" : "#38bdf8"}
                        strokeWidth={1.5}
                        strokeDasharray="2 2"
                      />
                    )}

                    {/* Data Point Dot */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isHovered ? 5.5 : hasEvent ? 4 : 2.5}
                      fill={isCalamity ? "#f43f5e" : hasEvent ? "#38bdf8" : "#10b981"}
                      stroke="#0f172a"
                      strokeWidth={1.5}
                    />

                    {/* Event Flag Badge for key annotations */}
                    {hasEvent && (
                      <g transform={`translate(${p.x}, ${Math.max(padding.top + 10, p.y - 14)})`}>
                        <circle r={7} fill={isCalamity ? "#e11d48" : "#0284c7"} />
                        <text
                          textAnchor="middle"
                          dy="3"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          !
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* X-Axis Tick Labels */}
              {points.map((p, i) => {
                // Show fewer labels on dense datasets
                const step = data.length > 30 ? 10 : data.length > 15 ? 4 : 2;
                if (i % step !== 0 && i !== data.length - 1) return null;

                return (
                  <text
                    key={`xtick-${i}`}
                    x={p.x}
                    y={padding.top + graphHeight + 18}
                    fill="rgba(148, 163, 184, 0.7)"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {p.data.timestampLabel}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 rounded" />
                <span>Actual Sensor Telemetry</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
                <span>50-Yr Reanalysis Baseline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-sky-400/50" />
                <span>Rainfall / Drip Pulse</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Parametric Calamity Event</span>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              Source: ISRO EOS-04 SAR · IMD 0.25° Grid · LoRaWAN Probe
            </div>
          </div>
        </div>

        {/* Statistical Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400">Mean {unit}</div>
            <div className="text-lg font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
              {currentAvg} {unit}
            </div>
            <div className="text-[10px] text-slate-500">Across {data.length} intervals</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400">Peak Observed</div>
            <div className="text-lg font-bold font-mono tabular-nums text-teal-400 mt-0.5">
              {currentMax} {unit}
            </div>
            <div className="text-[10px] text-slate-500">Min: {currentMin} {unit}</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400">Total Rainfall</div>
            <div className="text-lg font-bold font-mono tabular-nums text-sky-400 mt-0.5">
              {totalRainfallMm} mm
            </div>
            <div className="text-[10px] text-slate-500">Seasonal accumulation</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3">
            <div className="text-slate-400">Parametric Triggers</div>
            <div className="text-lg font-bold font-mono tabular-nums text-rose-400 mt-0.5">
              {calamityCount}
            </div>
            <div className="text-[10px] text-slate-500">Auto-settled via Smart Contract</div>
          </div>
        </div>

        {/* Active Horizon Event Log Callout */}
        {activeHoverPoint?.data?.eventAnnotation && (
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-3.5 text-xs space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-400">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Event Logged on {activeHoverPoint.data.timestampLabel} (Day {activeHoverPoint.data.daysAfterSowing} DAS):</span>
            </div>
            <p className="text-slate-200 leading-relaxed pl-5">
              {activeHoverPoint.data.eventAnnotation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
