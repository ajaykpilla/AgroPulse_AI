import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sprout,
  Zap,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  Download,
  Printer,
  Smartphone,
  Globe,
  Users,
  Building2,
  ShoppingBag,
  Radio,
  CloudRain,
  Share2,
  Copy,
  Check,
  Link as LinkIcon,
  FileSpreadsheet,
  ShieldCheck,
  Activity,
  Droplets,
  Thermometer,
  Monitor,
  QrCode,
} from "lucide-react";

import heroCoverImg from "../assets/images/demo_video_hero_cover_1792312951901.jpg";
import krishiSlideImg from "../assets/images/demo_slide_scene2_krishi_1792313428195.jpg";
import godownSlideImg from "../assets/images/demo_slide_scene3_godown_1792313427943.jpg";
import expressSlideImg from "../assets/images/demo_slide_scene4_express_1792313427497.jpg";
import leafScanImg from "../assets/images/sample_tomato_leaf_scan_1791732018407.jpg";
import tomatoImg from "../assets/images/product_roma_tomatoes_1791731971325.jpg";
import mangoImg from "../assets/images/product_alphonso_mangoes_1791731995390.jpg";

import { AppMode } from "../data/ecosystemData";
import { DemoTargetTab, DemoEcosystemSubMode } from "../data/demoVideoData";
import { exportPitchOverviewMarkdown } from "../utils/videoExporter";

interface PresentationDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: AppMode) => void;
  onNavigateTab?: (tab: DemoTargetTab, ecosystemSubMode?: DemoEcosystemSubMode) => void;
  initialSlide?: number;
}

export const PresentationDeckModal: React.FC<PresentationDeckModalProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  onNavigateTab,
  initialSlide = 0,
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);

  const totalSlides = 8;

  useEffect(() => {
    if (isOpen) {
      if (initialSlide >= 0 && initialSlide < totalSlides) {
        setCurrentSlide(initialSlide);
      }
      updateBrowserUrl(initialSlide >= 0 && initialSlide < totalSlides ? initialSlide : currentSlide);
    }
  }, [isOpen, initialSlide]);

  const handleSlideChange = (newSlideIdx: number) => {
    setCurrentSlide(newSlideIdx);
    updateBrowserUrl(newSlideIdx);
  };

  const updateBrowserUrl = (slideIdx: number) => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("deck", "true");
      url.searchParams.set("slide", (slideIdx + 1).toString());
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore in restricted iframe environments
    }
  };

  const getShareableUrl = (slideIdx?: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("deck", "true");
    if (typeof slideIdx === "number") {
      url.searchParams.set("slide", (slideIdx + 1).toString());
    }
    return url.toString();
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedLinkType(type);
      setTimeout(() => setCopiedLinkType(null), 3000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleClose = () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("deck");
      url.searchParams.delete("slide");
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }
    onClose();
  };

  const jumpToScreen = (tab: DemoTargetTab, subMode?: DemoEcosystemSubMode, fallbackMode: AppMode = "krishi") => {
    if (onNavigateTab) {
      onNavigateTab(tab, subMode);
    } else {
      onSelectMode(fallbackMode);
    }
    handleClose();
  };

  if (!isOpen) return null;

  const slides = [
    {
      id: "executive-overview",
      title: "AgroPulse AI: Precision Crop Intelligence & Closed-Loop Commerce",
      subtitle: "Live Application Pitch Overview · Traversed from agropulse.ai.studio",
      category: "1. Executive Overview",
      bgGradient: "from-slate-950 via-emerald-950/50 to-slate-950",
      content: (
        <div className="space-y-5 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-7 space-y-3.5">
              <div className="text-xs font-mono text-emerald-400 tracking-wide uppercase">
                agropulse.ai.studio · Android PWA + Desktop 1440px
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                Unifying Real-Time Field IoT Telemetry with 15-Minute Farm-to-Doorstep Fulfillment
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Smallholder farmers lose up to <strong className="text-white">40% of harvest value</strong> to
                distress sales, post-harvest spoilage, and 4–5 mandi intermediary layers—while urban families pay
                inflated prices for chemical-heavy produce.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">AgroPulse AI</strong> closes the loop inside one unified workspace:
                LoRaWAN crop sensors, 64-sector spectral heatmaps, 50-year climate reanalysis, vernacular Krishi AI,
                solar cold godown liquidity, 15-minute Express commerce, and India AgriTech DPI.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="bg-slate-900/90 border border-emerald-500/30 p-3 rounded-xl">
                  <div className="text-xl font-black font-mono tabular-nums text-emerald-400">+35%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Farmer Realization</div>
                </div>
                <div className="bg-slate-900/90 border border-teal-500/30 p-3 rounded-xl">
                  <div className="text-xl font-black font-mono tabular-nums text-teal-400">-20%</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Consumer Cost</div>
                </div>
                <div className="bg-slate-900/90 border border-amber-500/30 p-3 rounded-xl">
                  <div className="text-xl font-black font-mono tabular-nums text-amber-400">15 Min</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Express Delivery</div>
                </div>
                <div className="bg-slate-900/90 border border-indigo-500/30 p-3 rounded-xl">
                  <div className="text-xl font-black font-mono tabular-nums text-indigo-400">₹0</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Bio-Remediation</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/35 shadow-xl bg-slate-900">
                <img
                  src={heroCoverImg}
                  alt="AgroPulse AI Closed-Loop Field-to-Doorstep Ecosystem"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                    Kandi FPC Smart Hub #04 · Telangana
                  </span>
                  <span className="text-sm text-white font-bold">
                    64 Micro-Sectors · Sentinel-2 · investmentShield Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Strip Across All 5 Live Modules */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
            {[
              { tab: "sensors" as DemoTargetTab, label: "1. Sensors", desc: "Live LoRaWAN & Shocks", icon: <Radio className="w-3.5 h-3.5" /> },
              { tab: "heatmap" as DemoTargetTab, label: "2. Heatmap", desc: "64-Sector 5-Layer Grid", icon: <Layers className="w-3.5 h-3.5" /> },
              { tab: "trends" as DemoTargetTab, label: "3. Trends", desc: "50-Yr ERA5 Reanalysis", icon: <TrendingUp className="w-3.5 h-3.5" /> },
              { tab: "krishi" as DemoTargetTab, label: "4. Krishi AI", desc: "Voice, Scan & Godowns", icon: <Sprout className="w-3.5 h-3.5" /> },
              { tab: "ecosystem" as DemoTargetTab, label: "5. Ecosystem", desc: "Admin, Express & DPI", icon: <Building2 className="w-3.5 h-3.5" /> },
            ].map((item) => (
              <button
                key={item.tab}
                type="button"
                onClick={() => jumpToScreen(item.tab, item.tab === "ecosystem" ? "admin" : undefined)}
                className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 p-3 rounded-xl text-left transition cursor-pointer group"
              >
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    {item.icon}
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-emerald-300">→</span>
                </div>
                <div className="text-[11px] text-slate-400">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "live-sensor-hub",
      title: "Module 1: Real-Time IoT Crop Sensor Hub",
      subtitle: "Continuous Multi-Depth Soil & Canopy Telemetry Across 5 Solar LoRaWAN Farm Nodes",
      category: "2. Sensors Tab Walkthrough",
      bgGradient: "from-slate-950 via-teal-950/40 to-slate-950",
      content: (
        <div className="space-y-5 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <div className="lg:col-span-7 space-y-3.5">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Turning Raw Field Telemetry into Instant Agronomic Action
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The <strong className="text-white">Sensors</strong> hub streams live metrics from 5 solar-powered
                field nodes across Sangareddy, Chevella, Zaheerabad, Medak, and Warangal at configurable{" "}
                <span className="font-mono text-emerald-300">1s / 2s / 5s</span> polling intervals.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/90 border border-emerald-500/25 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <Sprout className="w-3.5 h-3.5" /> Sparkline KPI Tiles
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Live NDVI/NDRE canopy vigor, canopy-to-air thermal differential, active root hydration, and Grade A+ health score.
                  </p>
                </div>
                <div className="bg-slate-900/90 border border-teal-500/25 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-teal-400">
                    <Droplets className="w-3.5 h-3.5" /> 3-Depth Soil Strata
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Simultaneous volumetric moisture tracking at <strong>10cm</strong> topsoil, <strong>30cm</strong> active root zone, and <strong>60cm</strong> subsoil reserve.
                  </p>
                </div>
                <div className="bg-slate-900/90 border border-amber-500/25 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Thermometer className="w-3.5 h-3.5" /> Field Shock Simulator
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Inject Extreme Heatwave, Cloudburst Downpour, Root Drought, or Organic Bio-Boost to validate real-time alert &amp; remedy loops.
                  </p>
                </div>
                <div className="bg-slate-900/90 border border-indigo-500/25 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                    <Activity className="w-3.5 h-3.5" /> Instant Node Pairing
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Onboard new LoRaWAN field probes in seconds with crop tagging, battery/solar telemetry, and AI Co-Pilot escalation.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => jumpToScreen("sensors")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                Open Live Sensors Tab →
              </button>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
                  <span className="font-bold text-white">Active Field Cluster Nodes</span>
                  <span className="font-mono text-emerald-400">5 / 5 Online</span>
                </div>
                {[
                  { id: "NODE-SG-01", loc: "Sangareddy · Roma Tomato", ndvi: "0.84", moist: "68%" },
                  { id: "NODE-CH-02", loc: "Chevella · Baby Spinach", ndvi: "0.79", moist: "72%" },
                  { id: "NODE-ZH-03", loc: "Zaheerabad · Red Onions", ndvi: "0.62", moist: "44%" },
                  { id: "NODE-MD-04", loc: "Medak · Alphonso Orchard", ndvi: "0.87", moist: "64%" },
                  { id: "NODE-WR-05", loc: "Warangal · Guntur Chilli", ndvi: "0.74", moist: "59%" },
                ].map((node) => (
                  <div key={node.id} className="flex items-center justify-between text-xs bg-slate-950/70 px-3 py-2 rounded-lg border border-slate-800/80">
                    <div>
                      <div className="font-mono font-bold text-emerald-300">{node.id}</div>
                      <div className="text-[11px] text-slate-400">{node.loc}</div>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <div className="text-white font-semibold">NDVI {node.ndvi}</div>
                      <div className="text-[11px] text-teal-400">{node.moist} H₂O</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "interactive-heatmap",
      title: "Module 2: 64-Sector Interactive Crop Heatmap",
      subtitle: "8×8 Micro-Sector Canopy Mapping (A1–H8) with 5 Spectral Layers & Direct Valve Actuation",
      category: "3. Heatmap Tab Walkthrough",
      bgGradient: "from-slate-950 via-emerald-950/40 to-slate-950",
      content: (
        <div className="space-y-5 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-6 space-y-3.5">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Pinpoint Agronomic Stress Down to Every 0.25-Acre Block
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rather than treating an entire farm uniformly, AgroPulse subdivides each 15-acre cluster into{" "}
                <strong className="text-white">64 addressable micro-sectors</strong> with instant visual triage and
                closed-loop actuation.
              </p>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">5 Switchable Layers:</strong> NDVI Vigor, Soil Moisture, Canopy Leaf Heat, NPK Fertility Index, and Fungal Spore Risk.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Enhanced Tile Views:</strong> Toggle between Detailed tiles (coordinate, value, moisture gauge, drip/stress icons) and Compact density, plus live hover preview.
                  </span>
                </li>
                <li className="flex items-start gap-2.5 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">One-Tap Remediation:</strong> Sticky Sector Inspector opens micro-drip solenoid valves (+14% moisture) or dispatches zero-cost Jeevamrutham sprays.
                  </span>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => jumpToScreen("heatmap")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                Open Live 64-Sector Heatmap →
              </button>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {/* Visual Mini-Grid Preview of 64-Sector Tile Matrix */}
              <div className="bg-slate-900/95 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">8×8 Precision Field Matrix (Sample View)</span>
                  <span className="font-mono text-emerald-400">Mean NDVI 0.78</span>
                </div>
                <div className="grid grid-cols-8 gap-1">
                  {[
                    "bg-emerald-600", "bg-emerald-500", "bg-emerald-600", "bg-lime-500", "bg-emerald-600", "bg-emerald-500", "bg-emerald-600", "bg-emerald-500",
                    "bg-emerald-500", "bg-amber-400", "bg-orange-500", "bg-emerald-500", "bg-emerald-600", "bg-emerald-600", "bg-lime-500", "bg-emerald-500",
                    "bg-emerald-600", "bg-emerald-500", "bg-emerald-600", "bg-emerald-600", "bg-emerald-500", "bg-amber-400", "bg-emerald-500", "bg-emerald-600",
                    "bg-lime-500", "bg-emerald-500", "bg-emerald-600", "bg-rose-600", "bg-orange-500", "bg-emerald-500", "bg-emerald-600", "bg-emerald-600",
                  ].map((color, idx) => (
                    <div
                      key={idx}
                      className={`h-8 rounded-md ${color} border border-white/10 flex items-center justify-center text-[9px] font-mono font-bold text-white/90`}
                    >
                      {String.fromCharCode(65 + Math.floor(idx / 8))}{(idx % 8) + 1}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  <span>Stress filter highlights NDVI &lt; 0.60</span>
                  <span className="font-mono text-teal-400">Drip Solenoids Linked</span>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center gap-3 p-3">
                <img src={tomatoImg} alt="Hydroponic Roma Tomatoes" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">Sector B2 · Stomatal Heat &amp; Moisture Deficit</div>
                  <div className="text-slate-400 mt-0.5">
                    1-tap micro-drip pulse restores root moisture +14% and lowers leaf temp within minutes.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "historical-trends",
      title: "Module 3: Historical Trend Analysis & 50-Yr Climate Baseline",
      subtitle: "Multi-Horizon Seasonal Intelligence Comparing Live Telemetry Against ERA5/IMD Reanalysis",
      category: "4. Trends Tab Walkthrough",
      bgGradient: "from-slate-950 via-indigo-950/40 to-slate-950",
      content: (
        <div className="space-y-5 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-7 space-y-3.5">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Contextualizing Every Crop Cycle with 50 Years of Climate Memory
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The <strong className="text-white">Trends</strong> module overlays real-time crop readings against
                historical seasonal baselines across five interactive horizons:{" "}
                <span className="font-mono text-emerald-300">24h · 7d · 30d · 90d · 50-Year ERA5/IMD</span>.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                  <div className="font-bold text-emerald-400 mb-1">4 Core Agronomic Series</div>
                  <p className="text-slate-300">
                    Switch cleanly between Canopy NDVI, Root-Zone Soil Moisture (%), Leaf Temperature (°C), and Available Nitrogen (mg/kg).
                  </p>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                  <div className="font-bold text-teal-400 mb-1">Interactive Crosshairs &amp; Events</div>
                  <p className="text-slate-300">
                    Hover any point on the responsive SVG curve to inspect exact delta vs. baseline alongside marked rainfall/spray events.
                  </p>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                  <div className="font-bold text-amber-400 mb-1">Statistical Summary Ribbon</div>
                  <p className="text-slate-300">
                    Auto-computes period Mean, Peak, Min, and anomaly count with tabular monospace precision.
                  </p>
                </div>
                <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl">
                  <div className="font-bold text-indigo-400 mb-1">FPO Export &amp; WhatsApp Share</div>
                  <p className="text-slate-300">
                    Export structured CSV datasets for agronomy audits or share WhatsApp field summaries directly to farmer groups.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => jumpToScreen("trends", undefined, "admin")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                Open Live Trends &amp; 50-Yr Analysis →
              </button>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-slate-900/95 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">NDVI vs. 50-Yr Baseline</span>
                  <span className="font-mono text-emerald-400">+11.4% Above Norm</span>
                </div>
                <svg viewBox="0 0 320 140" className="w-full h-36">
                  <defs>
                    <linearGradient id="pitchTrendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <line x1="10" y1="30" x2="310" y2="30" stroke="#1e293b" strokeWidth="1" />
                  <line x1="10" y1="70" x2="310" y2="70" stroke="#1e293b" strokeWidth="1" />
                  <line x1="10" y1="110" x2="310" y2="110" stroke="#1e293b" strokeWidth="1" />
                  {/* Baseline dashed */}
                  <polyline
                    fill="none"
                    stroke="#64748b"
                    strokeWidth="2"
                    strokeDasharray="5,4"
                    points="10,98 70,92 130,85 190,78 250,74 310,70"
                  />
                  {/* Actual area + curve */}
                  <polygon
                    fill="url(#pitchTrendGrad)"
                    points="10,125 10,95 70,84 130,68 190,54 250,42 310,34 310,125"
                  />
                  <polyline
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points="10,95 70,84 130,68 190,54 250,42 310,34"
                  />
                  <circle cx="190" cy="54" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="310" cy="34" r="4.5" fill="#34d399" stroke="#ffffff" strokeWidth="2" />
                </svg>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-2">
                  <span>— Live Cluster Telemetry</span>
                  <span>--- ERA5 50-Yr Mean</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "krishi-farmer-ai",
      title: "Module 4: AgroPulse Krishi — Farmer AI & Financial Shield",
      subtitle: "Vernacular Voice Advisory, Zero-Cost Leaf Diagnostics, 78% Godown Advances & Satellite Insurance",
      category: "5. Krishi AI Tab Walkthrough",
      bgGradient: "from-emerald-950/60 via-slate-950 to-slate-950",
      content: (
        <div className="space-y-5 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-6 space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Precision Agronomy &amp; Liquidity Built for Every Smallholder
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Vernacular Voice AI &amp; TTS:</strong> Farmers speak naturally in Telugu, Hindi, Marathi, or English and receive spoken agronomic advice.
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Gemini Multimodal Leaf Diagnostics:</strong> Detects early Alternaria blight or nitrogen hunger from a leaf photo and prescribes ₹0 organic recipes (Sour Buttermilk + Copper, Jeevamrutham, Neemastra), saving <strong>₹2,400/acre</strong>.
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Solar Godowns &amp; 78% Instant Advances:</strong> Store produce at 4°C–12°C for up to 90 days, receiving electronic warehouse receipts (e-NWR) and instant cash liquidity—eliminating harvest-glut distress sales.
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">investmentShield Parametric Payouts:</strong> ISRO/IMD satellite triggers (&gt;35mm/hr rainfall excess or dry spells) disburse direct insurance payouts automatically with zero paperwork.
                  </div>
                </li>
              </ul>

              <button
                type="button"
                onClick={() => jumpToScreen("krishi", undefined, "krishi")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 transition cursor-pointer"
              >
                Open Live Krishi AI Portal →
              </button>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-emerald-500/35 bg-slate-900">
                <img src={krishiSlideImg} alt="Krishi Voice AI" className="w-full h-40 object-cover" />
                <div className="p-2.5 text-[11px] text-emerald-300 font-semibold">
                  Vernacular Voice Co-Pilot
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-emerald-500/35 bg-slate-900">
                <img src={leafScanImg} alt="Leaf Blight Scan" className="w-full h-40 object-cover" />
                <div className="p-2.5 text-[11px] text-emerald-300 font-semibold">
                  Multimodal Leaf Scan (94% Conf.)
                </div>
              </div>
              <div className="col-span-2 rounded-xl overflow-hidden border border-teal-500/30 bg-slate-900 flex items-center gap-3 p-3">
                <img src={godownSlideImg} alt="Solar Godown" className="w-20 h-14 rounded-lg object-cover shrink-0" />
                <div className="text-xs">
                  <div className="font-bold text-white">Decentralized Solar Cold Godowns + investmentShield</div>
                  <div className="text-slate-400 mt-0.5">₹42.5L verified farmer advances · ₹4.8L active parametric calamity pool.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ecosystem-commerce",
      title: "Module 5: Command Center, 15-Min Express & 1-Yr Harvest Pass",
      subtitle: "Closing the Loop from Urban Quick-Commerce Demand Directly Back to Pre-Sowing Farm Quotas",
      category: "6. Ecosystem Operations & Commerce",
      bgGradient: "from-sky-950/50 via-slate-950 to-teal-950/40",
      content: (
        <div className="space-y-5 text-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-4 space-y-2.5 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Command Center
                </span>
                <span className="text-[10px] font-mono text-slate-400">Admin</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed flex-1">
                Monitors 12 agricultural zones, adjusts FPC godown working-capital advance rates, triggers calamity smart contracts, and syncs ground NGO audits with <strong>PRADAN, BAIF &amp; Digital Green</strong>.
              </p>
              <button
                type="button"
                onClick={() => jumpToScreen("ecosystem", "admin", "admin")}
                className="w-full py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 text-xs font-semibold transition cursor-pointer"
              >
                Launch Command Center →
              </button>
            </div>

            <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-4 space-y-2.5 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" /> 15-Min Express
                </span>
                <span className="text-[10px] font-mono text-slate-400">Consumer</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed flex-1">
                Hyperlocal urban storefront restocked directly from solar cold godowns. Every pack carries a <strong>QR Traceability Passport</strong> verifying farmer name, harvest hour, and zero-pesticide soil audit.
              </p>
              <button
                type="button"
                onClick={() => jumpToScreen("ecosystem", "express", "express")}
                className="w-full py-1.5 rounded-lg bg-sky-600/20 hover:bg-sky-600/30 border border-sky-500/40 text-sky-300 text-xs font-semibold transition cursor-pointer"
              >
                Launch Express Storefront →
              </button>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-2.5 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4" /> 1-Yr Harvest Pass
                </span>
                <span className="text-[10px] font-mono text-slate-400">AI Importer</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed flex-1">
                Ingests urban quick-commerce order exports (Blinkit, Zepto, Instamart) via Gemini AI to project 12-month staple demand—converting consumer budgets into <strong>guaranteed pre-sowing farm contracts</strong>.
              </p>
              <button
                type="button"
                onClick={() => jumpToScreen("ecosystem", "harvest-pass", "express")}
                className="w-full py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition cursor-pointer"
              >
                Launch Harvest Pass Importer →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center gap-3.5 p-3">
              <img src={expressSlideImg} alt="Express Dark Store" className="w-24 h-16 rounded-lg object-cover shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-white">14-Min Avg Fulfillment · Jubilee Hills / Banjara Hills</div>
                <div className="text-slate-400 mt-0.5">Direct farm-gate sourcing lowers household grocery bills by 20% while keeping &lt;0.2% spoilage.</div>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center gap-3.5 p-3">
              <img src={mangoImg} alt="Contracted Harvest" className="w-24 h-16 rounded-lg object-cover shrink-0" />
              <div className="text-xs">
                <div className="font-bold text-white">Demand-First Sowing Eliminates Price Gluts</div>
                <div className="text-slate-400 mt-0.5">Locked annual quotas (4,200 kg Roma Tomatoes, 1,800 kg Alphonso, 950 kg Spinach) secure farmer floor prices.</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "india-agri-dpi",
      title: "Module 6: India AgriTech DPI Smart Grid",
      subtitle: "Standards-Native Integration Across AgriStack UFSI, Bhulekh Land Records, e-Panta & ONDC",
      category: "7. National Digital Public Infrastructure",
      bgGradient: "from-slate-950 via-emerald-950/45 to-slate-950",
      content: (
        <div className="space-y-5 text-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" /> Know Your Farmer (KYF) &amp; AgriStack UFSI
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                5-step verifiable farmer onboarding linking DigiLocker Aadhaar UFSI, <strong>Bhulekh 7/12 &amp; Khasra</strong> land ownership cross-checks, <strong>e-Panta GPS boundary polygons</strong>, and FPO cluster pooling.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <QrCode className="w-4 h-4" /> Know Your Consumer (KYC) &amp; ONDC Beckn
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Open Network for Digital Commerce forward order matching with transparent zero-middleman price splits: <strong className="text-emerald-400 font-mono">77.6% direct farmer UPI</strong>, 7.6% solar cold logistics, 3.4% platform fee.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                <Globe className="w-4 h-4" /> State Govt Smart-Grid Planning
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                District &amp; mandal net sown acreage visibility with live supply-demand surplus/deficit alerts and proactive solar cold-storage routing before APMC mandi price crashes.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Sparkles className="w-4 h-4" /> Live Floor Price Algorithm Simulator
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Combines pre-committed Harvest Pass forward contracts, live e-NAM mandi modal rates, and FPO pooling scale dividends into auditable JSON schemas.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
            <div className="text-xs text-slate-300">
              <strong className="text-white block">Built for India's Public Digital Agriculture Stack</strong>
              Open APIs ready for FPO federations, state agriculture departments, and ONDC buyer apps.
            </div>
            <button
              type="button"
              onClick={() => jumpToScreen("ecosystem", "dpi", "dpi")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition cursor-pointer shrink-0"
            >
              Open Live State Agri DPI Portal →
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "architecture-roadmap",
      title: "Cross-Device Architecture, Unit Economics & Roadmap",
      subtitle: "Android-First PWA + Desktop Command Workspace Powered by Server-Side Gemini AI",
      category: "8. Tech Stack & Scale Roadmap",
      bgGradient: "from-slate-950 via-slate-900 to-emerald-950/50",
      content: (
        <div className="space-y-5 text-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="bg-slate-900/90 border border-emerald-500/30 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Smartphone className="w-4 h-4" /> Dual Mobile &amp; Desktop UX
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Installable Android PWA with offline service worker, touch bottom navigation, Desktop 1440px command layout, and an instant <strong>Pixel 8 Pro</strong> viewport switcher.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-teal-500/30 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                <Monitor className="w-4 h-4" /> Full-Stack Gemini AI Engine
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Secure Express backend proxying 4-persona Co-Pilot chat, multimodal leaf vision diagnostics, Harvest Pass CSV normalization, and vernacular neural TTS.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/30 p-4 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Zap className="w-4 h-4" /> High-Margin Unit Economics
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                &lt;0.2% post-harvest loss, 3.4% platform take-rate, solar-powered cold storage OpEx, and pre-funded annual consumer Harvest Pass working capital.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Deployment &amp; Growth Milestones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950/70 border border-emerald-500/30 p-3.5 rounded-xl">
                <span className="font-mono font-bold text-emerald-400 block">Phase 1 · Current</span>
                <p className="text-slate-300 mt-1">
                  12 FPC clusters, 64-sector LoRaWAN canopy grids &amp; 45,000+ smallholders across Telangana, Maharashtra &amp; Karnataka.
                </p>
              </div>
              <div className="bg-slate-950/70 border border-teal-500/30 p-3.5 rounded-xl">
                <span className="font-mono font-bold text-teal-400 block">Phase 2 · Q3 2027</span>
                <p className="text-slate-300 mt-1">
                  Scale to 50 solar cold godowns with automated IMD/ISRO investmentShield smart contracts and live AgriStack federation.
                </p>
              </div>
              <div className="bg-slate-950/70 border border-sky-500/30 p-3.5 rounded-xl">
                <span className="font-mono font-bold text-sky-400 block">Phase 3 · 2028</span>
                <p className="text-slate-300 mt-1">
                  National 15-minute Express dark-store network across 15 Tier-1 Indian metros powered by 1-Year Harvest Pass contracts.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-5 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-inner shrink-0">
              AP
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-bold text-sm sm:text-lg leading-tight truncate">
                {slides[currentSlide].title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <span className="font-mono">Slide {currentSlide + 1} / {slides.length}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300 truncate">{slides[currentSlide].category}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Download Draft, Share, Print, Close */}
          <div className="flex items-center gap-2 relative shrink-0">
            <button
              type="button"
              onClick={exportPitchOverviewMarkdown}
              className="bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Download full Pitch Overview Draft (.md)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Draft (.md)</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShareDropdownOpen((prev) => !prev)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                title="Share pitch overview with a direct link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {shareDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-200 animate-fadeIn">
                  <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-emerald-400" /> Shareable Pitch Link
                    </span>
                    <button
                      type="button"
                      onClick={() => setShareDropdownOpen(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3">
                    Share a direct browser link to this AgroPulse AI Pitch Overview.
                  </p>

                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(getShareableUrl(currentSlide), "slide");
                        setShareDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-300 hover:text-white flex items-center justify-between transition cursor-pointer"
                    >
                      <span className="truncate">Copy link to Slide {currentSlide + 1}</span>
                      <Copy className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(getShareableUrl(0), "deck");
                        setShareDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white flex items-center justify-between transition cursor-pointer"
                    >
                      <span>Copy link to Pitch Start (Slide 1)</span>
                      <Copy className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400" />
                    </button>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono truncate">
                    {getShareableUrl(currentSlide)}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold items-center gap-1.5 transition cursor-pointer"
              title="Print or Export Pitch Overview to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition cursor-pointer"
              title="Close Pitch Overview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Copied Notification Toast */}
        {copiedLinkType && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-md">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {copiedLinkType === "slide"
                ? `Copied link to Slide ${currentSlide + 1} to clipboard!`
                : "Copied AgroPulse AI Pitch Overview link to clipboard!"}
            </span>
            <span className="text-[11px] font-mono opacity-90 truncate max-w-xs ml-4">
              {getShareableUrl(copiedLinkType === "slide" ? currentSlide : 0)}
            </span>
          </div>
        )}

        {/* Slide Body */}
        <div className={`flex-1 bg-gradient-to-br ${slides[currentSlide].bgGradient} p-5 sm:p-7 md:p-8 overflow-y-auto`}>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-emerald-300 font-medium text-xs sm:text-sm mb-3 sm:mb-4 leading-snug">
              {slides[currentSlide].subtitle}
            </p>
            {slides[currentSlide].content}
          </div>
        </div>

        {/* Modal Footer / Navigation Controls */}
        <div className="bg-slate-950 px-5 sm:px-6 py-3.5 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleSlideChange(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
              currentSlide === 0
                ? "bg-slate-900 text-slate-600 cursor-not-allowed"
                : "bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSlideChange(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? "w-7 sm:w-8 bg-emerald-500"
                    : "w-2.5 bg-slate-700 hover:bg-slate-600"
                }`}
                title={`Slide ${idx + 1}: ${s.category}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => copyToClipboard(getShareableUrl(currentSlide), "slide")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Copy link to this slide"
            >
              <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Copy Link</span>
            </button>

            <button
              type="button"
              onClick={() => handleSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide === slides.length - 1}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                currentSlide === slides.length - 1
                  ? "bg-slate-900 text-slate-600 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
