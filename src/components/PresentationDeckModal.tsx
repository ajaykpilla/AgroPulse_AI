import React, { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Sprout,
  ShieldAlert,
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
  Cpu,
  RefreshCw,
  Sun,
  CloudRain,
  Lock,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Link as LinkIcon,
  Maximize2,
  QrCode,
  FileSpreadsheet,
} from "lucide-react";

import heroCoverImg from "../assets/images/demo_video_hero_cover_1792312951901.jpg";
import krishiSlideImg from "../assets/images/demo_slide_scene2_krishi_1792313428195.jpg";
import godownSlideImg from "../assets/images/demo_slide_scene3_godown_1792313427943.jpg";
import expressSlideImg from "../assets/images/demo_slide_scene4_express_1792313427497.jpg";
import leafScanImg from "../assets/images/sample_tomato_leaf_scan_1791732018407.jpg";
import tomatoImg from "../assets/images/product_roma_tomatoes_1791731971325.jpg";
import mangoImg from "../assets/images/product_alphonso_mangoes_1791731995390.jpg";

import { AppMode } from "../data/ecosystemData";

interface PresentationDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: AppMode) => void;
  initialSlide?: number;
}

export const PresentationDeckModal: React.FC<PresentationDeckModalProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  initialSlide = 0,
}) => {
  const [currentSlide, setCurrentSlide] = useState(initialSlide);
  const [copiedLinkType, setCopiedLinkType] = useState<string | null>(null);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);

  // Sync initial slide when opened with a specific slide from URL
  useEffect(() => {
    if (isOpen) {
      if (initialSlide >= 0 && initialSlide < 7) {
        setCurrentSlide(initialSlide);
      }
      // Update browser URL query params to reflect deck=true&slide=X
      updateBrowserUrl(initialSlide >= 0 ? initialSlide : currentSlide);
    }
  }, [isOpen, initialSlide]);

  // Update browser URL query parameter when slide changes
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
      // ignore in iframe environments if restricted
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
    // Clean up URL parameters when closing deck
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

  if (!isOpen) return null;

  const slides = [
    {
      id: "executive-summary",
      title: "AgroPulse AI: Closed-Loop Agritech & Quick-Commerce",
      subtitle: "Autonomous Platform Unifying Rural Smallholders with 15-Minute Urban Grocery Delivery",
      category: "1. Executive Summary & Vision",
      bgGradient: "from-emerald-950 via-teal-950 to-slate-950",
      content: (
        <div className="space-y-6 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Single-Persona Workspace · Production Agritech Stack</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Eliminating the 5-Tier Middleman Tax Across India's Food Supply Chain
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Smallholder farmers lose up to <strong>40% of their harvest</strong> to distress sales, lack of cold chain infrastructure, and delayed mandi payouts. Meanwhile, urban consumers pay <strong>inflated retail prices</strong> for chemical-laden, stale produce. 
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong>AgroPulse</strong> solves this with a direct closed-loop model: farmers receive vernacular Voice AI guidance and instant 78% liquidity against smart solar godown receipts, while urban consumers enjoy 15-minute pesticide-tested deliveries at 20% lower cost.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-emerald-900/40 border border-emerald-500/30 p-3 rounded-xl text-center">
                  <div className="text-xl font-black text-emerald-400">+35%</div>
                  <div className="text-[11px] text-slate-300">Farmer Net Earnings</div>
                </div>
                <div className="bg-sky-900/40 border border-sky-500/30 p-3 rounded-xl text-center">
                  <div className="text-xl font-black text-sky-400">-20%</div>
                  <div className="text-[11px] text-slate-300">Consumer Grocery Cost</div>
                </div>
                <div className="bg-amber-900/40 border border-amber-500/30 p-3 rounded-xl text-center">
                  <div className="text-xl font-black text-amber-400">14 Mins</div>
                  <div className="text-[11px] text-slate-300">Avg Dark-Store SLA</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl group bg-slate-900">
                <img
                  src={heroCoverImg}
                  alt="AgroPulse Ecosystem Overview"
                  className="w-full h-56 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Live Ecosystem Screenshot
                  </span>
                  <span className="text-xs text-white font-semibold">
                    Farm-to-Doorstep Unified Pipeline
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div
              onClick={() => {
                onSelectMode("krishi");
                handleClose();
              }}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-emerald-500/30 hover:border-emerald-400 p-4 rounded-xl cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4" /> AgroPulse Krishi
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-emerald-300">Launch →</span>
              </div>
              <p className="text-xs text-slate-300">
                Voice AI crop advisory, leaf scan blight diagnostics & 78% liquidity advances.
              </p>
            </div>

            <div
              onClick={() => {
                onSelectMode("admin");
                handleClose();
              }}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-teal-500/30 hover:border-teal-400 p-4 rounded-xl cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" /> Command Center
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-teal-300">Launch →</span>
              </div>
              <p className="text-xs text-slate-300">
                50-yr weather reanalysis, parametric smart contract payouts & NGO partner syncing.
              </p>
            </div>

            <div
              onClick={() => {
                onSelectMode("express");
                handleClose();
              }}
              className="bg-slate-900/80 hover:bg-slate-800/90 border border-sky-500/30 hover:border-sky-400 p-4 rounded-xl cursor-pointer transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4" /> 15-Mins Express
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-sky-300">Launch →</span>
              </div>
              <p className="text-xs text-slate-300">
                Solar cold chain quick delivery, QR harvest traceability & 1-Year Harvest Pass.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "key-concepts",
      title: "Key Concepts: Closed-Loop Architecture",
      subtitle: "How Real-Time Data Flows Seamlessly Between Field, Godown, and Doorstep",
      category: "2. System Architecture & Flow",
      bgGradient: "from-slate-950 via-emerald-955 to-slate-950",
      content: (
        <div className="space-y-6 text-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-emerald-500/40 p-4 rounded-xl relative">
              <div className="w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center font-bold text-xs mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Pre-Harvest Advisory</h4>
              <p className="text-xs text-slate-300">
                Gemini-powered Voice AI in Hindi, Marathi, Telugu & Tamil provides micro-climate advisory and organic neem-astra recipes.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-teal-500/40 p-4 rounded-xl relative">
              <div className="w-7 h-7 bg-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center font-bold text-xs mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Decentralized Godowns</h4>
              <p className="text-xs text-slate-300">
                Solar cold storage maintains 4°C-12°C. Graded crops yield electronic warehouse receipts (e-NWR) unlocking 78% cash advances.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-indigo-500/40 p-4 rounded-xl relative">
              <div className="w-7 h-7 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-xs mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Parametric Insurance</h4>
              <p className="text-xs text-slate-300">
                Satellite precipitation data triggers instant smart contract compensation if rain exceeds 38mm/hr, settled within 48h.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-sky-500/40 p-4 rounded-xl relative">
              <div className="w-7 h-7 bg-sky-500/20 text-sky-400 rounded-lg flex items-center justify-center font-bold text-xs mb-3">
                4
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Hyperlocal Fulfillment</h4>
              <p className="text-xs text-slate-300">
                Express dark stores restocked directly from godowns. Consumers receive 15-minute delivery with full batch traceability.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2 rounded-xl overflow-hidden border border-slate-700 shadow-md">
              <img
                src={godownSlideImg}
                alt="Smart Godown & Working Capital Liquidity"
                className="w-full h-44 object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Financial Liquidity Engine
              </span>
              <h4 className="text-base font-bold text-white">
                Eliminating Distress Sales with e-NWRs
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                When harvest hits peak season, mandis crash by 30-50%. AgroPulse enables farmers to store produce for up to 90 days in certified solar godowns, withdrawing 78% cash immediately at 6.5% interest, then selling when market prices stabilize.
              </p>
              <div className="text-xs text-emerald-300 font-semibold pt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Verified across ₹42.5 Lakhs in disbursed farmer advances
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "persona-krishi",
      title: "Target Persona 1: AgroPulse Krishi (Farmer Mode)",
      subtitle: "Vernacular Voice AI, Instant Organic Remedies & Financial Inclusion for 45,000+ Farmers",
      category: "3. Smallholder Farmer Experience",
      bgGradient: "from-emerald-950 via-slate-950 to-emerald-950",
      content: (
        <div className="space-y-6 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                <Sprout className="w-3.5 h-3.5" />
                <span>Empowering 45,000 Smallholders</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                High-Tech Agronomy, Zero Complexity
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/20">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">Multilingual Voice Commands:</strong> Illiterate & semi-literate farmers tap the mic to ask questions in Hindi, Marathi, Telugu, or Tamil.
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/20">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">Multimodal Leaf Diagnostics:</strong> Photographing infected leaves detects fungal early blight and outputs zero-cost organic preparation steps.
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/20">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <strong className="text-white">78% Working Capital Advance:</strong> Grade A produce yields an instant deposit slip with transparent credit calculations and UPI disbursal.
                  </div>
                </li>
              </ul>

              <button
                onClick={() => {
                  onSelectMode("krishi");
                  handleClose();
                }}
                className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                Switch to Live Krishi Portal →
              </button>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-emerald-500/40 shadow-lg bg-slate-900">
                <img
                  src={krishiSlideImg}
                  alt="Krishi Farmer Screen"
                  className="w-full h-44 object-cover"
                />
                <div className="p-2.5 bg-slate-900/90 text-[11px] text-emerald-300 font-medium">
                  🌾 Krishi Portal Interface &amp; Voice AI
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-emerald-500/40 shadow-lg bg-slate-900">
                <img
                  src={leafScanImg}
                  alt="Multimodal Leaf Scan"
                  className="w-full h-44 object-cover"
                />
                <div className="p-2.5 bg-slate-900/90 text-[11px] text-emerald-300 font-medium">
                  🔍 Multimodal Blight Detection
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "persona-command",
      title: "Target Persona 2: AgroPulse Command Center (Platform Admin)",
      subtitle: "50-Year Weather Reanalysis, Autonomous Parametric Payouts & NGO Field Coordination",
      category: "4. Platform & Ecosystem Operations",
      bgGradient: "from-teal-950 via-slate-950 to-teal-950",
      content: (
        <div className="space-y-6 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Enterprise &amp; FPC Coordination Engine</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Autonomous Risk Shield &amp; Working Capital Governance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Platform admins and Farmer Producer Company (FPC) directors monitor 12 agricultural zones simultaneously with satellite Doppler data, automated insurance payouts, and grassroots partner audits.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-900/80 border border-teal-500/30 p-3 rounded-xl">
                  <div className="text-xs font-bold text-teal-400 mb-1 flex items-center gap-1">
                    <CloudRain className="w-3.5 h-3.5" /> Parametric Triggers
                  </div>
                  <p className="text-[11px] text-slate-300">
                    If live Doppler rainfall exceeds 38mm/hr, a smart contract disburses ₹1,200/acre insurance automatically within 48h.
                  </p>
                </div>
                <div className="bg-slate-900/80 border border-teal-500/30 p-3 rounded-xl">
                  <div className="text-xs font-bold text-teal-400 mb-1 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> Grassroots NGO Sync
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Active partner feeds with PRADAN, BAIF, and Digital Green monitor bio-input audits and training compliance.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectMode("admin");
                  handleClose();
                }}
                className="mt-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                Switch to Live Command Center →
              </button>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-teal-500/40 shadow-2xl bg-slate-900">
                <img
                  src={godownSlideImg}
                  alt="Command Center & Godown Logistics"
                  className="w-full h-52 object-cover"
                />
                <div className="p-3 bg-slate-950/90 flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-300">
                    Weather Radar &amp; Working Capital Grid
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    12 Active Zones
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "persona-express",
      title: "Target Persona 3: AgroPulse Express (Urban Consumer)",
      subtitle: "15-Minute Solar Cold Deliveries, Farm-to-Doorstep QR Traceability & Organic Quality",
      category: "5. Urban Quick-Commerce Experience",
      bgGradient: "from-sky-950 via-slate-950 to-sky-950",
      content: (
        <div className="space-y-6 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-xs font-semibold">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick-Commerce Revolution</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Chemical-Free Freshness at 20% Lower Cost
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By bypassing conventional wholesale mandis and commission agents, urban households receive produce harvested less than 6 hours earlier, chilled in solar godowns, and delivered by electric fleets in 14 minutes.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-3 bg-slate-900/70 border border-sky-500/30 p-2.5 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                    ⚡
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">14-Minute Guaranteed SLA</h5>
                    <p className="text-[11px] text-slate-300">Hyperlocal micro-hubs packed within 2.5 minutes of order.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-900/70 border border-sky-500/30 p-2.5 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                    🏷️
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Farm-to-Doorstep Traceability</h5>
                    <p className="text-[11px] text-slate-300">QR code reveals farmer name, village FPC, pesticide audit, and harvest time.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectMode("express");
                  handleClose();
                }}
                className="mt-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
              >
                Switch to Live Express Storefront →
              </button>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-sky-500/40 shadow-lg bg-slate-900">
                <img
                  src={expressSlideImg}
                  alt="Express Storefront UI"
                  className="w-full h-44 object-cover"
                />
                <div className="p-2.5 bg-slate-900/90 text-[11px] text-sky-300 font-medium">
                  ⚡ 15-Minute Storefront &amp; Cart
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-sky-500/40 shadow-lg bg-slate-900">
                <img
                  src={tomatoImg}
                  alt="Pesticide Free Produce"
                  className="w-full h-44 object-cover"
                />
                <div className="p-2.5 bg-slate-900/90 text-[11px] text-sky-300 font-medium">
                  🍅 Certified Organic Produce
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "harvest-pass",
      title: "Innovation: 1-Year Forward Harvest Pass Importer",
      subtitle: "De-Risking Sowing Seasons by Contracting Urban Demand Ahead of Time",
      category: "6. Forward Demand Contraction",
      bgGradient: "from-amber-950 via-slate-950 to-emerald-955",
      content: (
        <div className="space-y-6 text-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Demand-Driven Agriculture</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Replacing Speculation with Guaranteed Forward Contracts
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Traditional farming suffers from cyclical supply shocks: if onions fetch high prices one year, every farmer sows onions, causing a catastrophic market glut the next season. 
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                The <strong>AgroPulse Harvest Pass Importer</strong> aggregates 1-year consumer subscription demand upfront (CSV / JSON data ingestion) and translates it into guaranteed sowing contracts for smallholder clusters.
              </p>

              <div className="bg-slate-900/80 border border-amber-500/30 p-3.5 rounded-xl space-y-2">
                <div className="text-xs font-bold text-amber-400">
                  Imported Forward Demand Snapshot:
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-800/80 p-2 rounded-lg">
                    <div className="font-bold text-white">Roma Tomatoes</div>
                    <div className="text-[11px] text-emerald-400">4,200 kg / yr</div>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-lg">
                    <div className="font-bold text-white">Alphonso Mangoes</div>
                    <div className="text-[11px] text-emerald-400">1,800 kg / yr</div>
                  </div>
                  <div className="bg-slate-800/80 p-2 rounded-lg">
                    <div className="font-bold text-white">Baby Spinach</div>
                    <div className="text-[11px] text-emerald-400">950 kg / yr</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl bg-slate-900">
                <img
                  src={mangoImg}
                  alt="Harvest Pass Premium Crops"
                  className="w-full h-52 object-cover"
                />
                <div className="p-3 bg-slate-950/90 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300">
                    Contracted Yield Protection
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    100% Demand Secured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "value-proposition",
      title: "Value Proposition, ROI & Scalability Roadmap",
      subtitle: "Transforming Fragmented Agriculture into a Scalable, High-Margin, Equitable Network",
      category: "7. Business Model & Impact",
      bgGradient: "from-slate-950 via-emerald-955 to-slate-950",
      content: (
        <div className="space-y-6 text-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-emerald-500/40 p-5 rounded-2xl text-center space-y-2">
              <div className="text-emerald-400 font-black text-3xl">+35%</div>
              <h4 className="text-white font-bold text-sm">Farmer Realization</h4>
              <p className="text-xs text-slate-400">
                Direct farm-gate pricing, zero middleman cuts, and solar storage liquidity eliminate distress sales.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-sky-500/40 p-5 rounded-2xl text-center space-y-2">
              <div className="text-sky-400 font-black text-3xl">-20%</div>
              <h4 className="text-white font-bold text-sm">Consumer Savings</h4>
              <p className="text-xs text-slate-400">
                Eliminating 4 intermediary transport tiers passes genuine savings directly to urban households.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/40 p-5 rounded-2xl text-center space-y-2">
              <div className="text-amber-400 font-black text-3xl">&lt;0.2%</div>
              <h4 className="text-white font-bold text-sm">Post-Harvest Loss</h4>
              <p className="text-xs text-slate-400">
                Compared to India's national average of 38-40%, our decentralized cold chain ensures virtually zero spoilage.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Scale &amp; Deployment Milestones
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="border-l-2 border-emerald-500 pl-3">
                <span className="font-bold text-emerald-400 block text-xs">Phase 1 · Current</span>
                <span className="text-slate-300">12 FPC Clusters across Maharashtra &amp; Karnataka with 45k active farmers.</span>
              </div>
              <div className="border-l-2 border-teal-500 pl-3">
                <span className="font-bold text-teal-400 block text-xs">Phase 2 · Q3 2027</span>
                <span className="text-slate-300">Expansion to 50 smart solar godowns with automated parametric insurance APIs.</span>
              </div>
              <div className="border-l-2 border-sky-500 pl-3">
                <span className="font-bold text-sky-400 block text-xs">Phase 3 · 2028</span>
                <span className="text-slate-300">National quick-commerce dark store integration across 15 Tier-1 Indian metros.</span>
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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-inner">
              AP
            </div>
            <div>
              <h2 className="text-white font-bold text-base sm:text-lg leading-tight">
                {slides[currentSlide].title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <span>Slide {currentSlide + 1} of {slides.length}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-300">{slides[currentSlide].category}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Share, Print, Close */}
          <div className="flex items-center gap-2 relative">
            {/* Share Deck Button with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShareDropdownOpen((prev) => !prev)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                title="Share presentation deck with a direct link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share Deck</span>
              </button>

              {shareDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 text-slate-200 animate-fadeIn">
                  <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-emerald-400" /> Shareable Web Link
                    </span>
                    <button
                      onClick={() => setShareDropdownOpen(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 mb-3">
                    Anyone with this link can view the complete AgroPulse presentation deck directly in their browser.
                  </p>

                  <div className="space-y-2">
                    {/* Copy Link to Current Slide */}
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(getShareableUrl(currentSlide), "slide");
                        setShareDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-300 hover:text-white flex items-center justify-between transition"
                    >
                      <span className="truncate">Copy link to this slide ({currentSlide + 1})</span>
                      <Copy className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400" />
                    </button>

                    {/* Copy Link to Full Deck (Start) */}
                    <button
                      type="button"
                      onClick={() => {
                        copyToClipboard(getShareableUrl(0), "deck");
                        setShareDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 hover:text-white flex items-center justify-between transition"
                    >
                      <span>Copy link to Deck Start (Slide 1)</span>
                      <Copy className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400" />
                    </button>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono truncate">
                    {getShareableUrl(currentSlide)}
                  </div>
                </div>
              )}
            </div>

            {/* Print Deck Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold items-center gap-1.5 transition cursor-pointer"
              title="Print or Export Slide Deck to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-xl transition cursor-pointer"
              title="Close Presentation Deck"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Copied to Clipboard Notification Toast */}
        {copiedLinkType && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between animate-fadeIn shadow-md">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              {copiedLinkType === "slide"
                ? `Copied shareable link to Slide ${currentSlide + 1} to clipboard!`
                : "Copied shareable presentation deck link to clipboard!"}
            </span>
            <span className="text-[11px] font-mono opacity-90 truncate max-w-xs ml-4">
              {getShareableUrl(copiedLinkType === "slide" ? currentSlide : 0)}
            </span>
          </div>
        )}

        {/* Slide Body */}
        <div className={`flex-1 bg-gradient-to-br ${slides[currentSlide].bgGradient} p-5 sm:p-7 md:p-8 overflow-y-auto`}>
          <div className="max-w-4xl mx-auto space-y-4">
            <p className="text-emerald-300 font-medium text-sm sm:text-base mb-4 sm:mb-6 leading-snug">
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
            <span className="hidden sm:inline">Previous Slide</span>
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
                title={`Jump to Slide ${idx + 1}: ${s.category}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Share Link icon in footer */}
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
              <span className="hidden sm:inline">Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
