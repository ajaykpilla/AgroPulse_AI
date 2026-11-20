import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Maximize2,
  Monitor,
  Wifi,
  Battery,
  Sparkles,
  Sprout,
  Layers,
  TrendingUp,
  Radio,
  Building2,
  Bell,
  RefreshCw,
  Video,
  Download,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

export type AndroidTab =
  | "sensors"
  | "heatmap"
  | "trends"
  | "krishi"
  | "ecosystem";

interface AndroidAppShellProps {
  activeTab: AndroidTab;
  onTabChange: (tab: AndroidTab) => void;
  onOpenCoPilot: () => void;
  onOpenDemoVideo?: () => void;
  onOpenPresentationDeck?: () => void;
  children: React.ReactNode;
}

export const AndroidAppShell: React.FC<AndroidAppShellProps> = ({
  activeTab,
  onTabChange,
  onOpenCoPilot,
  onOpenDemoVideo,
  onOpenPresentationDeck,
  children,
}) => {
  // Default to "responsive" (adapts automatically to desktop 1440px or mobile screens).
  // "phone" mode is a dedicated Pixel 8 Pro device frame simulator for desktop testing.
  const [viewportMode, setViewportMode] = useState<"responsive" | "phone">("responsive");
  const [currentTime, setCurrentTime] = useState<string>("09:41");
  const [isPulling, setIsPulling] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  // Clock in status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  // Haptic feedback trigger on tab switch
  const handleTabClick = (tab: AndroidTab) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // ignore
      }
    }
    onTabChange(tab);
  };

  const handleSimulateRefresh = () => {
    setIsPulling(true);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([10, 30]);
      } catch {
        // ignore
      }
    }
    setTimeout(() => {
      setIsPulling(false);
    }, 800);
  };

  const navLinks: { id: AndroidTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "sensors", label: "Sensors", icon: <Radio className="w-4 h-4" />, desc: "IoT Telemetry" },
    { id: "heatmap", label: "Heatmap", icon: <Layers className="w-4 h-4" />, desc: "64-Sector 2D Grid" },
    { id: "trends", label: "Trends", icon: <TrendingUp className="w-4 h-4" />, desc: "50-Yr Climate Reanalysis" },
    { id: "krishi", label: "Krishi AI", icon: <Sprout className="w-4 h-4" />, desc: "Farmer Diagnostics" },
    { id: "ecosystem", label: "Ecosystem", icon: <Building2 className="w-4 h-4" />, desc: "Admin & Express Store" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      {/* 
        UNIVERSAL TOP NAVIGATION BAR
        Conforms strictly to Frontend Design Top Bar Contract on Desktop:
        Zone 1: Wordmark & Cluster Trust Marker
        Zone 2: 5 Clean Single-Line Nav Links
        Zone 3: Key Actions (4-Min Video, Deck, PWA, Phone Simulator Toggle, AI Co-Pilot)
      */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/25 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
                  AgroPulse AI
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Grid
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden md:block whitespace-nowrap">
                Kandi FPC Smart Hub #04 · Telangana Agri-Grid
              </div>
            </div>
          </div>

          {/* Zone 2: Desktop Navigation Links (Clean single-line text links with active indicator) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-slate-800/90 text-emerald-400 font-semibold shadow-xs"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/40"
                  }`}
                >
                  <span className={isActive ? "text-emerald-400" : "text-slate-400"}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto lg:ml-0">
            {/* 4-Minute Walkthrough Demo Video CTA */}
            {onOpenDemoVideo && (
              <button
                type="button"
                onClick={onOpenDemoVideo}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition shadow-xs flex items-center gap-1.5 whitespace-nowrap cursor-pointer border border-emerald-400/30"
                title="Watch full 4-minute interactive solution walkthrough"
              >
                <Video className="w-3.5 h-3.5 text-emerald-200" />
                <span className="hidden sm:inline">4-Min Demo Video</span>
                <span className="sm:hidden">Video</span>
              </button>
            )}

            {/* Presentation Deck CTA */}
            {onOpenPresentationDeck && (
              <button
                type="button"
                onClick={onOpenPresentationDeck}
                className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition hidden md:flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                title="Open 7-slide Investor & Solution Pitch Deck"
              >
                <span>Pitch Deck</span>
              </button>
            )}

            {/* In-App PWA Install Trigger */}
            {isInstallable && (
              <button
                type="button"
                onClick={install}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900/60 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                title="Install Progressive Web App on Android/Desktop"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* Responsive / Mobile Frame Mode Switcher (For Desktop Testing) */}
            <div className="hidden lg:flex items-center gap-1 p-0.5 bg-slate-950 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setViewportMode("responsive")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  viewportMode === "responsive"
                    ? "bg-slate-800 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Desktop 1440px wide responsive layout"
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Desktop</span>
              </button>
              <button
                type="button"
                onClick={() => setViewportMode("phone")}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition cursor-pointer ${
                  viewportMode === "phone"
                    ? "bg-slate-800 text-white font-semibold shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
                title="Preview in Android Pixel 8 Pro device frame"
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pixel 8 View</span>
              </button>
            </div>

            {/* Pull-to-refresh button for mobile */}
            <button
              type="button"
              onClick={handleSimulateRefresh}
              className="lg:hidden w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition cursor-pointer"
              title="Sync live IoT sensors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPulling ? "animate-spin text-emerald-400" : ""}`} />
            </button>

            {/* AgroPulse AI Co-Pilot Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenCoPilot}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AgroPulse AI</span>
              <span className="sm:hidden">AI</span>
            </button>
          </div>
        </div>
      </header>

      {/* 
        MAIN CONTENT VIEWPORT CONTAINER
        Supports both:
        1. "responsive": Desktop 1440px full-width layout, or native touch mobile layout on small screens
        2. "phone": Dedicated Pixel 8 Pro simulated device bezel on desktop for realistic mobile app testing
      */}
      <div
        className={`w-full flex-1 flex justify-center ${
          viewportMode === "phone" ? "p-3 sm:p-6 bg-slate-950/80" : "p-0"
        }`}
      >
        <div
          className={`w-full transition-all duration-300 flex flex-col ${
            viewportMode === "phone"
              ? "max-w-[430px] rounded-[42px] border-[10px] border-slate-800 bg-slate-950 shadow-2xl overflow-hidden min-h-[880px] relative ring-1 ring-slate-700/50"
              : "max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6"
          }`}
        >
          {/* ANDROID STATUS BAR (Displayed when in Phone Viewport Mode) */}
          {viewportMode === "phone" && (
            <div className="w-full bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-300 select-none z-20 shrink-0 border-b border-slate-900">
              <span className="font-semibold font-mono tracking-tight text-[13px]">
                {currentTime}
              </span>
              <div className="w-4 h-4 rounded-full bg-black border border-slate-800 shadow-inner flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[10px] font-mono font-bold text-emerald-400">5G</span>
                <Wifi className="w-3.5 h-3.5 text-slate-300" />
                <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300">
                  <Battery className="w-4 h-4 text-emerald-400" />
                  <span>94%</span>
                </div>
              </div>
            </div>
          )}

          {/* Phone Frame Title Bar when simulated */}
          {viewportMode === "phone" && (
            <div className="bg-slate-900/90 px-4 py-2 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">AgroPulse Mobile</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Pixel 8 Pro Mode</span>
            </div>
          )}

          {/* MAIN SCROLLABLE APP BODY */}
          <main className={`flex-1 ${viewportMode === "phone" ? "overflow-y-auto p-3.5 pb-24" : "pb-16 lg:pb-8"}`}>
            {children}
          </main>

          {/* 
            ANDROID BOTTOM NAVIGATION BAR
            Rendered:
            1. Always when in "phone" mode
            2. On Mobile & Tablet screen sizes (< lg) when in "responsive" mode
            Hidden on Desktop (lg:) in responsive mode since top navigation bar is active!
          */}
          <nav
            className={`${
              viewportMode === "phone"
                ? "sticky bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 shrink-0"
                : "lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 shadow-2xl"
            }`}
          >
            <div className="grid grid-cols-5 items-center max-w-lg mx-auto">
              {navLinks.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`min-h-[46px] flex flex-col items-center justify-center rounded-xl transition-all select-none cursor-pointer ${
                      isActive
                        ? "text-emerald-400 font-bold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span className={isActive ? "scale-110" : ""}>{tab.icon}</span>
                    <span className="text-[10px] tracking-tight mt-0.5">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Android Navigation Gesture Home Pill */}
            {viewportMode === "phone" && (
              <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-1 mb-0.5" />
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};
