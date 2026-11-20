/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Video,
  Download,
  FileText,
  RefreshCw,
  CheckCircle2,
  Sprout,
  ShieldAlert,
  ChevronRight,
  Share2,
  Building2,
  ShoppingBag,
  Grid3X3,
  SlidersHorizontal,
} from "lucide-react";
import {
  AppMode,
  INITIAL_GODOWN_DEPOSITS,
  INITIAL_WEATHER_REGIONS,
  INITIAL_NGO_PARTNERS,
  INITIAL_EXPRESS_PRODUCTS,
  INITIAL_HARVEST_PASS_ITEMS,
  GodownDeposit,
  ParametricWeatherRegion,
  NgoPartnerActivity,
  HarvestPassDemandItem,
} from "./data/ecosystemData";
import {
  generateInitialFieldSectors,
  FieldSectorCell,
} from "./data/sensorData";
import { AndroidAppShell, AndroidTab } from "./components/AndroidAppShell";
import { AndroidCropSensorHub } from "./components/AndroidCropSensorHub";
import { InteractiveCropHeatmap } from "./components/InteractiveCropHeatmap";
import { HistoricalTrendAnalysis } from "./components/HistoricalTrendAnalysis";
import { KrishiPortal } from "./components/KrishiPortal";
import { CommandCenter } from "./components/CommandCenter";
import { ExpressStorefront } from "./components/ExpressStorefront";
import { CoPilotDrawer } from "./components/CoPilotDrawer";
import { DemoVideoPlayerModal } from "./components/DemoVideoPlayerModal";
import { PresentationDeckModal } from "./components/PresentationDeckModal";
import { DpiSmartGridPortal } from "./components/DpiSmartGridPortal";
import HarvestPassImporter from "./components/HarvestPassImporter";
import { ApplicationHeroTile } from "./components/ApplicationHeroTile";
import { downloadConsolidatedDemoVideo } from "./utils/videoExporter";

export default function App() {
  // Android Navigation Tab State ("sensors" | "heatmap" | "trends" | "krishi" | "ecosystem")
  const [activeTab, setActiveTab] = useState<AndroidTab>("sensors");

  // Ecosystem Sub-Mode State when inside "ecosystem" tab
  const [ecosystemSubMode, setEcosystemSubMode] = useState<"admin" | "express" | "harvest-pass" | "dpi">("admin");

  // Data State
  const [fieldSectors, setFieldSectors] = useState<FieldSectorCell[]>(generateInitialFieldSectors);
  const [deposits, setDeposits] = useState<GodownDeposit[]>(INITIAL_GODOWN_DEPOSITS);
  const [weatherRegions, setWeatherRegions] = useState<ParametricWeatherRegion[]>(INITIAL_WEATHER_REGIONS);
  const [ngoPartners, setNgoPartners] = useState<NgoPartnerActivity[]>(INITIAL_NGO_PARTNERS);
  const [harvestPassDemand, setHarvestPassDemand] = useState<HarvestPassDemandItem[]>(INITIAL_HARVEST_PASS_ITEMS);

  // CoPilot & Modals State
  const [coPilotOpen, setCoPilotOpen] = useState(false);
  const [coPilotPrompt, setCoPilotPrompt] = useState<string>("");
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);
  const [presentationDeckOpen, setPresentationDeckOpen] = useState(false);
  const [initialDeckSlide, setInitialDeckSlide] = useState(0);

  // Auto-open Presentation Deck if URL contains query param
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const deckParam = params.get("deck");
      const viewParam = params.get("view");
      const slideParam = params.get("slide");
      const tabParam = params.get("tab") as AndroidTab | null;

      if (tabParam && ["sensors", "heatmap", "trends", "krishi", "ecosystem"].includes(tabParam)) {
        setActiveTab(tabParam);
      }

      if (deckParam === "true" || deckParam === "1" || viewParam === "deck") {
        setPresentationDeckOpen(true);
        if (slideParam) {
          const slideNum = parseInt(slideParam, 10);
          if (!isNaN(slideNum) && slideNum >= 1 && slideNum <= 8) {
            setInitialDeckSlide(slideNum - 1);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Handlers for Sector Updates
  const handleUpdateSector = (updated: FieldSectorCell) => {
    setFieldSectors((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  // Handlers for Godown Deposits
  const handleAddDeposit = (newDeposit: GodownDeposit) => {
    setDeposits((prev) => [newDeposit, ...prev]);
  };

  // Handlers for Parametric Weather Calamity
  const handleTriggerCalamityPayout = (regionId: string) => {
    setWeatherRegions((prev) =>
      prev.map((reg) =>
        reg.id === regionId
          ? {
              ...reg,
              liveRainfallMmHr: Math.max(reg.liveRainfallMmHr, 38.8),
              status: "Payout Triggered",
              lastUpdated: "Just now · Automated Smart Contract Direct Disbursed",
            }
          : reg
      )
    );
  };

  const handleUpdateAdvanceRate = (depositId: string, newRate: number) => {
    setDeposits((prev) =>
      prev.map((dep) =>
        dep.id === depositId
          ? {
              ...dep,
              advanceRatePercent: newRate,
              advanceDisbursedInr: Math.round((dep.marketValuationInr * newRate) / 100),
            }
          : dep
      )
    );
  };

  const handleSyncNgoTask = (ngoId: string, newStatus: NgoPartnerActivity["status"]) => {
    setNgoPartners((prev) =>
      prev.map((ngo) =>
        ngo.id === ngoId
          ? {
              ...ngo,
              status: newStatus,
              bioInputsAudited: ngo.bioInputsAudited + 12,
              lastSync: "Just now",
            }
          : ngo
      )
    );
  };

  const handleUpdateSowingStatus = (
    itemId: string,
    newStatus: HarvestPassDemandItem["sowingStatus"]
  ) => {
    setHarvestPassDemand((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              sowingStatus: newStatus,
            }
          : item
      )
    );
  };

  const handleHarvestPassLocked = (newItems: HarvestPassDemandItem[]) => {
    setHarvestPassDemand(newItems);
  };

  // Open Co-Pilot with pre-populated prompt
  const handleOpenCoPilotWithPrompt = (prompt?: string) => {
    setCoPilotPrompt(prompt || "");
    setCoPilotOpen(true);
  };

  // Determine current active persona for Co-Pilot
  const currentPersonaMode: AppMode =
    activeTab === "krishi"
      ? "krishi"
      : activeTab === "ecosystem"
      ? ecosystemSubMode === "express"
        ? "express"
        : ecosystemSubMode === "dpi"
        ? "dpi"
        : "admin"
      : "krishi";

  return (
    <>
      <AndroidAppShell
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenCoPilot={() => {
          setCoPilotPrompt("");
          setCoPilotOpen(true);
        }}
        onOpenDemoVideo={() => setDemoVideoOpen(true)}
        onOpenPresentationDeck={() => setPresentationDeckOpen(true)}
      >
        {/* Master Application Hero / Brand & Status Tile */}
        <ApplicationHeroTile
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenCoPilot={handleOpenCoPilotWithPrompt}
          onOpenDemoVideo={() => setDemoVideoOpen(true)}
          onOpenPresentationDeck={() => setPresentationDeckOpen(true)}
        />

        {/* TAB 1: SENSORS (Real-Time Sensor Integration Hub) */}
        {activeTab === "sensors" && (
          <AndroidCropSensorHub
            onOpenCoPilotWithPrompt={handleOpenCoPilotWithPrompt}
            onOpenHeatmapTab={() => setActiveTab("heatmap")}
          />
        )}

        {/* TAB 2: HEATMAP (Interactive 2D Crop Health Heatmaps) */}
        {activeTab === "heatmap" && (
          <InteractiveCropHeatmap
            sectors={fieldSectors}
            onUpdateSector={handleUpdateSector}
            onOpenCoPilotWithPrompt={handleOpenCoPilotWithPrompt}
          />
        )}

        {/* TAB 3: TRENDS (Historical Trend Analysis & 50-Yr Climate Reanalysis) */}
        {activeTab === "trends" && (
          <HistoricalTrendAnalysis
            cropName="Hydroponic Roma Tomatoes"
            clusterName="Kandi FPC Smart Hub #04"
            onOpenCoPilotWithPrompt={handleOpenCoPilotWithPrompt}
          />
        )}

        {/* TAB 4: KRISHI AI (Farmer Mode: Voice, Multimodal Scan, Zero-Cost Remedies, Insurance, Godowns) */}
        {activeTab === "krishi" && (
          <KrishiPortal
            deposits={deposits}
            onAddDeposit={handleAddDeposit}
            weatherRegions={weatherRegions}
            harvestPassDemand={harvestPassDemand}
            onTriggerCalamityPayout={handleTriggerCalamityPayout}
            onOpenCoPilotWithPrompt={handleOpenCoPilotWithPrompt}
            onOpenDpiPortal={() => {
              setActiveTab("ecosystem");
              setEcosystemSubMode("dpi");
            }}
          />
        )}

        {/* TAB 5: ECOSYSTEM (Command Center, Express 15-Min Delivery, Harvest Pass, State DPI) */}
        {activeTab === "ecosystem" && (
          <div className="space-y-4">
            {/* Ecosystem Sub-Mode Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300">
                Ecosystem Module:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setEcosystemSubMode("admin")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    ecosystemSubMode === "admin"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🏢 Command Center
                </button>
                <button
                  type="button"
                  onClick={() => setEcosystemSubMode("express")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    ecosystemSubMode === "express"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ⚡ Express Storefront
                </button>
                <button
                  type="button"
                  onClick={() => setEcosystemSubMode("harvest-pass")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    ecosystemSubMode === "harvest-pass"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  📑 1-Yr Harvest Pass
                </button>
                <button
                  type="button"
                  onClick={() => setEcosystemSubMode("dpi")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    ecosystemSubMode === "dpi"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  🌐 State Agri DPI
                </button>
              </div>
            </div>

            {/* Sub-Mode 1: Command Center (Platform Admin) */}
            {ecosystemSubMode === "admin" && (
              <CommandCenter
                deposits={deposits}
                weatherRegions={weatherRegions}
                ngoPartners={ngoPartners}
                harvestPassDemand={harvestPassDemand}
                onTriggerCalamityPayout={handleTriggerCalamityPayout}
                onUpdateAdvanceRate={handleUpdateAdvanceRate}
                onSyncNgoTask={handleSyncNgoTask}
                onUpdateSowingStatus={handleUpdateSowingStatus}
                onOpenDpiPortal={() => setEcosystemSubMode("dpi")}
              />
            )}

            {/* Sub-Mode 2: Express Storefront (Urban Consumer 15-Min Delivery & Traceability) */}
            {ecosystemSubMode === "express" && (
              <ExpressStorefront
                products={INITIAL_EXPRESS_PRODUCTS}
                onHarvestPassLocked={handleHarvestPassLocked}
                onOpenDpiPortal={() => {
                  setActiveTab("ecosystem");
                  setEcosystemSubMode("dpi");
                }}
              />
            )}

            {/* Sub-Mode 3: 1-Year Harvest Pass Importer */}
            {ecosystemSubMode === "harvest-pass" && (
              <HarvestPassImporter
                onHarvestPassLocked={handleHarvestPassLocked}
                onOpenCoPilotWithPrompt={handleOpenCoPilotWithPrompt}
              />
            )}

            {/* Sub-Mode 4: India AgriTech DPI Smart Grid */}
            {ecosystemSubMode === "dpi" && (
              <DpiSmartGridPortal
                onNavigateToPersona={(mode: "krishi" | "admin" | "express") => {
                  if (mode === "krishi") {
                    setActiveTab("krishi");
                  } else {
                    setActiveTab("ecosystem");
                    setEcosystemSubMode(mode);
                  }
                }}
              />
            )}
          </div>
        )}
      </AndroidAppShell>

      {/* AI Multi-Persona Co-Pilot Drawer */}
      <CoPilotDrawer
        isOpen={coPilotOpen}
        onClose={() => setCoPilotOpen(false)}
        activeMode={currentPersonaMode}
        initialPrompt={coPilotPrompt}
        ecosystemSnapshot={{
          activeTab,
          selectedCluster: "Kandi FPC Smart Hub #04",
          weatherRegionsCount: weatherRegions.length,
          depositsCount: deposits.length,
          stressedSectorsCount: fieldSectors.filter((s) => s.status !== "Optimal").length,
        }}
      />

      {/* Interactive Pitch Overview Modal (8 Slides) */}
      <PresentationDeckModal
        isOpen={presentationDeckOpen}
        onClose={() => setPresentationDeckOpen(false)}
        initialSlide={initialDeckSlide}
        onNavigateTab={(tab, subMode) => {
          setPresentationDeckOpen(false);
          setActiveTab(tab);
          if (subMode) setEcosystemSubMode(subMode);
        }}
        onSelectMode={(mode: AppMode) => {
          setPresentationDeckOpen(false);
          if (mode === "krishi") {
            setActiveTab("krishi");
          } else if (mode === "admin") {
            setActiveTab("ecosystem");
            setEcosystemSubMode("admin");
          } else if (mode === "express") {
            setActiveTab("ecosystem");
            setEcosystemSubMode("express");
          } else if (mode === "dpi") {
            setActiveTab("ecosystem");
            setEcosystemSubMode("dpi");
          }
        }}
      />

      {/* 3-Minute (2:45) Walkthrough Demo Video Player Modal */}
      <DemoVideoPlayerModal
        isOpen={demoVideoOpen}
        onClose={() => setDemoVideoOpen(false)}
        onSyncTab={(tab, subMode) => {
          setActiveTab(tab);
          if (subMode) setEcosystemSubMode(subMode);
        }}
        onExploreTab={(tab, subMode) => {
          setDemoVideoOpen(false);
          setActiveTab(tab);
          if (subMode) setEcosystemSubMode(subMode);
        }}
        onNavigateToPersona={(mode: AppMode) => {
          setDemoVideoOpen(false);
          if (mode === "krishi") {
            setActiveTab("krishi");
          } else if (mode === "admin") {
            setActiveTab("ecosystem");
            setEcosystemSubMode("admin");
          } else if (mode === "express") {
            setActiveTab("ecosystem");
            setEcosystemSubMode("express");
          } else if (mode === "dpi") {
            setActiveTab("ecosystem");
            setEcosystemSubMode("dpi");
          }
        }}
      />
    </>
  );
}
