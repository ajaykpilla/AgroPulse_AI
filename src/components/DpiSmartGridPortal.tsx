/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AgroPulse AI - Indian AgriTech DPI (Digital Public Infrastructure) Portal
 * Features:
 * Tab 1: Know Your Farmer (KYF) - AgriStack UFSI + Bhulekh Land Cross-Verification + e-Panta Geotagging + FPO Pooling
 * Tab 2: Know Your Consumer (KYC) - ONDC Forward Demand + Zero-Middleman Price Ledger + Crop Passport Lineage
 * Tab 3: State/Local Govt Smart-Grid Dashboard - Acreage, S&D Surplus/Deficit Alerts, Cold-Storage Allocation
 * Tab 4: DPI JSON Schemas & Live Floor Price Algorithm Simulator
 */

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  MapPin,
  TrendingUp,
  Building2,
  Sprout,
  Users,
  Search,
  ChevronRight,
  ArrowRight,
  Copy,
  Check,
  Download,
  ExternalLink,
  QrCode,
  Sparkles,
  Layers,
  Scale,
  DollarSign,
  AlertTriangle,
  Info,
  Calendar,
  Compass,
  RefreshCw,
  ShoppingBag,
  Clock,
  Award,
  Sliders,
  Send,
  SlidersHorizontal,
} from "lucide-react";

import {
  AgriStackFarmerProfile,
  BhulekhLandParcel,
  FarmerPoolCluster,
  ONDCConsumerDemand,
  CropLineageBatch,
  SmartGridRegionAnalytics,
  SAMPLE_AGRISTACK_FARMERS,
  SAMPLE_BHULEKH_PARCELS,
  SAMPLE_FPO_CLUSTERS,
  SAMPLE_ONDC_DEMANDS,
  SAMPLE_CROP_LINEAGE_BATCHES,
  SAMPLE_SMART_GRID_ANALYTICS,
  FLOOR_PRICE_ALGORITHM_DOCS,
} from "../data/dpiSchemas";

interface DpiSmartGridPortalProps {
  onNavigateToPersona?: (mode: "krishi" | "admin" | "express") => void;
}

export const DpiSmartGridPortal: React.FC<DpiSmartGridPortalProps> = ({
  onNavigateToPersona,
}) => {
  const [activeTab, setActiveTab] = useState<"kyf" | "kyc" | "smartgrid" | "schemas">("kyf");

  // ==========================================
  // TAB 1: KYF STATE & SIMULATION
  // ==========================================
  const [kyfStep, setKyfStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [farmerForm, setFarmerForm] = useState({
    aadhaarNumber: "8841-9923-4812",
    farmerName: "Rameshwar B. Patil",
    mobileNumber: "+91 98231 44812",
    state: "Maharashtra",
    district: "Pune",
    tehsil: "Junnar",
    village: "Narayangaon",
    khasraNumber: "74/2A",
    ownershipType: "Owner-Cultivator" as const,
    parcelAreaAcres: 4.8,
    netSownAcres: 4.2,
    cropSeason: "Kharif 2024-25" as const,
    cropVariety: "Roma Tomatoes (Abhinav F1)",
    sowingDate: "2024-07-12",
    expectedHarvest: "2024-10-24",
    estimatedYieldQuintals: 52,
    certification: "PGS-India Green Organic" as const,
    irrigation: "Micro-Drip Solar" as const,
  });

  const [isVerifyingDigiLocker, setIsVerifyingDigiLocker] = useState(false);
  const [digiLockerVerified, setDigiLockerVerified] = useState(true);
  const [isVerifyingBhulekh, setIsVerifyingBhulekh] = useState(false);
  const [bhulekhVerified, setBhulekhVerified] = useState(true);
  const [enrolledFarmers, setEnrolledFarmers] = useState<AgriStackFarmerProfile[]>(SAMPLE_AGRISTACK_FARMERS);
  const [assignedFpoCluster, setAssignedFpoCluster] = useState<FarmerPoolCluster>(SAMPLE_FPO_CLUSTERS[0]);
  const [kyfSuccessToast, setKyfSuccessToast] = useState<string | null>(null);

  // ==========================================
  // TAB 2: KYC & LINEAGE STATE
  // ==========================================
  const [kycBuyerPersona, setKycBuyerPersona] = useState<"Individual Household" | "HoReCa / Restaurant" | "Institutional Buyer" | "Kirana / Retailer">("Individual Household");
  const [kycCrop, setKycCrop] = useState("Roma Tomatoes");
  const [kycQuantityKg, setKycQuantityKg] = useState(15);
  const [kycCadence, setKycCadence] = useState<"Weekly Farm Box" | "Bi-Weekly Supply" | "Monthly Recurring" | "Forward Harvest Contract">("Weekly Farm Box");
  const [kycDeliverySla, setKycDeliverySla] = useState<"15-Min Ultra-Fast" | "Same Day Evening" | "Scheduled Next Morning">("15-Min Ultra-Fast");
  const [selectedLineageBatch, setSelectedLineageBatch] = useState<CropLineageBatch>(SAMPLE_CROP_LINEAGE_BATCHES[0]);
  const [subscribedFarmers, setSubscribedFarmers] = useState<Record<string, boolean>>({
    "UFSI-IND-MH-2024-998412": true,
  });
  const [kycOrderSuccess, setKycOrderSuccess] = useState<string | null>(null);

  // ==========================================
  // TAB 4: ALGORITHM SIMULATOR STATE
  // ==========================================
  const [algoMsp, setAlgoMsp] = useState(1850);
  const [algoENam, setAlgoENam] = useState(2150);
  const [algoCertType, setAlgoCertType] = useState<"npop" | "pgs" | "zbnf" | "grade_a">("pgs");
  const [algoDemandCoveragePct, setAlgoDemandCoveragePct] = useState(90);
  const [algoClusterAcres, setAlgoClusterAcres] = useState(380);
  const [copiedSchemaId, setCopiedSchemaId] = useState<string | null>(null);

  // Calculate dynamic floor price in algorithm tab
  const calculateSimulatedPrice = () => {
    const base = Math.max(algoMsp, algoENam);
    let certMult = 0.06;
    if (algoCertType === "npop") certMult = 0.22;
    else if (algoCertType === "pgs") certMult = 0.18;
    else if (algoCertType === "zbnf") certMult = 0.12;

    const certBonus = Math.round(base * certMult);
    let demandBonus = 0;
    if (algoDemandCoveragePct >= 100) demandBonus = 240;
    else if (algoDemandCoveragePct >= 70) demandBonus = 150;
    else if (algoDemandCoveragePct >= 40) demandBonus = 80;

    const scaleBonus = Math.min(150, Math.floor(algoClusterAcres * 0.4) + 60);
    const floorPrice = base + certBonus + demandBonus + scaleBonus;

    return {
      base,
      certBonus,
      demandBonus,
      scaleBonus,
      floorPrice,
      perKg: (floorPrice / 100).toFixed(1),
    };
  };

  const simResult = calculateSimulatedPrice();

  // Handlers for simulated verifications
  const handleSimulateDigiLocker = () => {
    setIsVerifyingDigiLocker(true);
    setTimeout(() => {
      setIsVerifyingDigiLocker(false);
      setDigiLockerVerified(true);
    }, 1200);
  };

  const handleSimulateBhulekh = () => {
    setIsVerifyingBhulekh(true);
    setTimeout(() => {
      setIsVerifyingBhulekh(false);
      setBhulekhVerified(true);
    }, 1400);
  };

  const handleCompleteFarmerEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: AgriStackFarmerProfile = {
      schema_version: "agristack.farmer.v2.1",
      farmer_id: `UFSI-IND-MH-2024-${Math.floor(100000 + Math.random() * 900000)}`,
      aadhaar_masked: `XXXX-XXXX-${farmerForm.aadhaarNumber.slice(-4)}`,
      digilocker_consent_id: `DL-CONSENT-MH-${Math.floor(1000 + Math.random() * 9000)}`,
      digilocker_verified: true,
      verification_timestamp: new Date().toISOString(),
      farmer_name: farmerForm.farmerName,
      gender: "Male",
      mobile_number: farmerForm.mobileNumber,
      state_lgd_code: 27,
      state_name: farmerForm.state,
      district_name: farmerForm.district,
      sub_district_tehsil: farmerForm.tehsil,
      village_lgd_code: 556781,
      village_name: farmerForm.village,
      bank_account_verified: true,
      npci_dbt_enabled: true,
      upi_vpa: `${farmerForm.farmerName.toLowerCase().replace(/[^a-z]/g, "")}@upi`,
      fpo_membership_id: assignedFpoCluster.fpo_cluster_id,
      primary_crops: [farmerForm.cropVariety],
    };

    setEnrolledFarmers([newProfile, ...enrolledFarmers]);
    setKyfStep(5);
    setKyfSuccessToast(`Enrolled ${farmerForm.farmerName} successfully into AgriStack Farmer Registry! Assigned to ${assignedFpoCluster.fpo_name}`);
    setTimeout(() => setKyfSuccessToast(null), 5000);
  };

  const handleToggleSubscribeFarmer = (farmerId: string) => {
    const isNow = !subscribedFarmers[farmerId];
    setSubscribedFarmers((prev) => ({ ...prev, [farmerId]: isNow }));
    if (isNow) {
      setKycOrderSuccess(`Subscribed to ${selectedLineageBatch.farmer_name}'s upcoming harvest forward deliveries!`);
    } else {
      setKycOrderSuccess(`Unsubscribed from forward harvest delivery notifications.`);
    }
    setTimeout(() => setKycOrderSuccess(null), 4000);
  };

  const handleCopySchema = (schemaKey: string, schemaObj: any) => {
    const jsonStr = JSON.stringify(schemaObj, null, 2);
    navigator.clipboard?.writeText(jsonStr);
    setCopiedSchemaId(schemaKey);
    setTimeout(() => setCopiedSchemaId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 
        HERO BANNER: India AgriTech Digital Public Infrastructure (DPI)
      */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-500/40 text-white p-5 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>India AgriTech DPI · AgriStack, Bhulekh &amp; ONDC Native Grid</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              AgroPulse DPI: Smart Grid, KYF &amp; KYC
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Eliminating traditional arhatiyas (commission middlemen) with Aadhaar-linked AgriStack UFSI identity, Bhulekh Khasra land cross-verification, ONDC consumer demand aggregation, and state smart-grid planning.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                AgriStack UFSI Verified
              </span>
              <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                MahaBhulekh / Dharani / Bhoomi RoR
              </span>
              <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                ONDC Beckn Protocol Compatible
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                Live e-NAM Benchmarking
              </span>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 flex flex-row lg:flex-col justify-around lg:justify-center gap-4 shrink-0 shadow-inner">
            <div className="text-center lg:text-right">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">₹2,950</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Guaranteed Floor / Qtl
              </div>
            </div>
            <div className="text-center lg:text-right">
              <div className="text-xl sm:text-2xl font-black text-sky-400">148 Farmers</div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Pooled in Junnar FPO
              </div>
            </div>
          </div>
        </div>

        {/* Ambient background accent */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 
        MAIN TAB NAVIGATION: 4 DISTINCT DPI MODULES
      */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-1.5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 w-full">
          {/* Tab 1: Know Your Farmer (KYF) */}
          <button
            type="button"
            onClick={() => setActiveTab("kyf")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "kyf"
                ? "bg-emerald-600 text-white shadow-md font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Sprout className="w-4 h-4 shrink-0" />
            <span>1. Know Your Farmer (KYF)</span>
          </button>

          {/* Tab 2: Know Your Consumer (KYC) */}
          <button
            type="button"
            onClick={() => setActiveTab("kyc")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "kyc"
                ? "bg-emerald-600 text-white shadow-md font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>2. Know Your Consumer (KYC)</span>
          </button>

          {/* Tab 3: State Smart-Grid Dashboard */}
          <button
            type="button"
            onClick={() => setActiveTab("smartgrid")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "smartgrid"
                ? "bg-emerald-600 text-white shadow-md font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>3. State Smart-Grid</span>
          </button>

          {/* Tab 4: DPI Schemas & Algorithm Explorer */}
          <button
            type="button"
            onClick={() => setActiveTab("schemas")}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === "schemas"
                ? "bg-emerald-600 text-white shadow-md font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>4. JSON Schemas &amp; Algo</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {kyfSuccessToast && (
        <div className="bg-emerald-700 text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
            <span>{kyfSuccessToast}</span>
          </div>
          <button onClick={() => setKyfSuccessToast(null)} className="text-emerald-200 hover:text-white text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {kycOrderSuccess && (
        <div className="bg-sky-700 text-white px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-sky-200" />
            <span>{kycOrderSuccess}</span>
          </div>
          <button onClick={() => setKycOrderSuccess(null)} className="text-sky-200 hover:text-white text-xs underline">
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: KNOW YOUR FARMER (KYF) - AGRISTACK & BHULEKH ONBOARDING            */}
      {/* ========================================================================= */}
      {activeTab === "kyf" && (
        <div className="space-y-6">
          {/* Multi-step progress bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 sm:pb-0">
              {[
                { step: 1, title: "AgriStack UFSI Identity", icon: ShieldCheck },
                { step: 2, title: "Bhulekh Land Verification", icon: MapPin },
                { step: 3, title: "e-Panta Geotagging", icon: Compass },
                { step: 4, title: "Crop & Yield Enrollment", icon: Sprout },
                { step: 5, title: "FPO Pooling & Floor Price", icon: Users },
              ].map((item) => {
                const Icon = item.icon;
                const isCurrent = kyfStep === item.step;
                const isDone = kyfStep > item.step;
                return (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => setKyfStep(item.step as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                      isCurrent
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-300 ring-1 ring-emerald-400"
                        : isDone
                        ? "text-emerald-700 bg-slate-50 hover:bg-slate-100"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                        isCurrent
                          ? "bg-emerald-600 text-white"
                          : isDone
                          ? "bg-emerald-200 text-emerald-800"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isDone ? "✓" : item.step}
                    </div>
                    <span className="hidden sm:inline">{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: The Interactive Form / Current Step */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
              {/* STEP 1: AgriStack Identity & DigiLocker */}
              {kyfStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      Module 1 · Step 1/5
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      AgriStack &amp; Aadhaar UFSI Identity Verification
                    </h3>
                    <p className="text-xs text-slate-500">
                      Simulated integration with Government of India federated Farmer Registry via DigiLocker consent.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Aadhaar Number (Linked to Land RoR)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={farmerForm.aadhaarNumber}
                          onChange={(e) => setFarmerForm({ ...farmerForm, aadhaarNumber: e.target.value })}
                          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-emerald-500"
                          placeholder="8841-XXXX-XXXX"
                        />
                        <button
                          type="button"
                          onClick={handleSimulateDigiLocker}
                          disabled={isVerifyingDigiLocker}
                          className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                        >
                          {isVerifyingDigiLocker ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>DigiLocker Auth...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verify via DigiLocker</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {digiLockerVerified && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                          ✓
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="font-bold text-emerald-900 flex items-center gap-2">
                            <span>DigiLocker Farmer Consent Verified</span>
                            <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-mono">
                              UFSI-IND-MH-2024-998412
                            </span>
                          </div>
                          <p className="text-emerald-700 text-[11px]">
                            Aadhaar e-KYC authentication successful. NPCI Direct Benefit Transfer (DBT) bank mandate confirmed active.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Farmer Name (as per Aadhaar)
                        </label>
                        <input
                          type="text"
                          value={farmerForm.farmerName}
                          onChange={(e) => setFarmerForm({ ...farmerForm, farmerName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Mobile Number (SMS &amp; Voice AI Advisory)
                        </label>
                        <input
                          type="text"
                          value={farmerForm.mobileNumber}
                          onChange={(e) => setFarmerForm({ ...farmerForm, mobileNumber: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setKyfStep(2)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
                      >
                        <span>Next: Bhulekh Land Records</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Bhulekh & Land Record Verification */}
              {kyfStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      Module 1 · Step 2/5
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Bhulekh &amp; State Land Records Cross-Verification
                    </h3>
                    <p className="text-xs text-slate-500">
                      Real-time query against MahaBhulekh, Bhoomi, Dharani, or Bhulekh UP to prevent ghost acreage.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        State Land Registry Portal
                      </label>
                      <select
                        value={farmerForm.state}
                        onChange={(e) => setFarmerForm({ ...farmerForm, state: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      >
                        <option value="Maharashtra">MahaBhulekh (Maharashtra)</option>
                        <option value="Karnataka">Bhoomi (Karnataka)</option>
                        <option value="Telangana">Dharani (Telangana)</option>
                        <option value="Uttar Pradesh">Bhulekh UP (Uttar Pradesh)</option>
                        <option value="Andhra Pradesh">MeeBhoomi (Andhra Pradesh)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                      <input
                        type="text"
                        value={farmerForm.district}
                        onChange={(e) => setFarmerForm({ ...farmerForm, district: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Tehsil / Mandal</label>
                      <input
                        type="text"
                        value={farmerForm.tehsil}
                        onChange={(e) => setFarmerForm({ ...farmerForm, tehsil: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Village Name</label>
                      <input
                        type="text"
                        value={farmerForm.village}
                        onChange={(e) => setFarmerForm({ ...farmerForm, village: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Khasra / Khatauni / Survey Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={farmerForm.khasraNumber}
                        onChange={(e) => setFarmerForm({ ...farmerForm, khasraNumber: e.target.value })}
                        className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-800 font-bold"
                        placeholder="e.g. 74/2A"
                      />
                      <button
                        type="button"
                        onClick={handleSimulateBhulekh}
                        disabled={isVerifyingBhulekh}
                        className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
                      >
                        {isVerifyingBhulekh ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Querying Land Portal...</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5" />
                            <span>Lookup Bhulekh RoR</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {bhulekhVerified && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Bhulekh Record-of-Rights (RoR) Matches</span>
                        </span>
                        <span className="text-[10px] font-mono bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded">
                          RoR #BHULEKH-MH-PUN-0842
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 text-slate-700">
                        <div>
                          <span className="text-slate-500 block">Owner Name:</span>
                          <strong>{farmerForm.farmerName}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Total Area:</span>
                          <strong>4.8 Acres (1.94 Ha)</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Soil Card:</span>
                          <strong>SHC-MH-2024-8841</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Patwari Sign:</span>
                          <span className="text-emerald-700 font-bold">Verified ✓</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setKyfStep(1)}
                      className="text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 rounded-xl text-xs"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setKyfStep(3)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
                    >
                      <span>Next: e-Panta Geotagging</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Geotagging & Boundary Polygon Mapping */}
              {kyfStep === 3 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      Module 1 · Step 3/5
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Geotagging &amp; Digital Crop Survey (e-Panta)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Coordinates and boundary polygons to confirm net sown area and prevent duplicate insurance claims.
                    </p>
                  </div>

                  {/* Polygon Mapping Canvas Simulator */}
                  <div className="bg-slate-900 rounded-xl p-4 text-white space-y-3 border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Compass className="w-4 h-4" />
                        Plot Coordinates: Lat 19.1242° N, Lng 73.9781° E
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        Net Sown: 4.2 Acres
                      </span>
                    </div>

                    {/* SVG Farm Polygon Simulation */}
                    <div className="h-44 w-full bg-slate-950 rounded-lg relative overflow-hidden flex items-center justify-center border border-emerald-900/50">
                      <svg className="w-full h-full" viewBox="0 0 400 180">
                        {/* Grid lines */}
                        <defs>
                          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.8" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />

                        {/* Surrounding Field Outlines */}
                        <polygon points="20,20 120,30 110,80 15,70" fill="#064e3b" fillOpacity="0.2" stroke="#059669" strokeWidth="1" strokeDasharray="2,2" />
                        <polygon points="280,30 380,20 370,90 270,75" fill="#064e3b" fillOpacity="0.2" stroke="#059669" strokeWidth="1" strokeDasharray="2,2" />

                        {/* Verified Polygon: Khasra 74/2A */}
                        <polygon points="135,35 260,45 245,145 120,130" fill="#10b981" fillOpacity="0.35" stroke="#34d399" strokeWidth="2.5" />
                        
                        {/* Vertices Pins */}
                        <circle cx="135" cy="35" r="4" fill="#34d399" />
                        <circle cx="260" cy="45" r="4" fill="#34d399" />
                        <circle cx="245" cy="145" r="4" fill="#34d399" />
                        <circle cx="120" cy="130" r="4" fill="#34d399" />

                        <text x="145" y="85" fill="#ffffff" fontSize="12" fontWeight="bold">Khasra 74/2A</text>
                        <text x="145" y="102" fill="#a7f3d0" fontSize="10">Roma Tomatoes · 4.2 Ac</text>
                      </svg>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>✓ Polygon Vertices: 4 Points Mapped</span>
                      <span>Satellite Survey ID: EPANTA-MH-2024-KHARIF-4128</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Net Sown Area (Acres)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={farmerForm.netSownAcres}
                        onChange={(e) => setFarmerForm({ ...farmerForm, netSownAcres: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Equivalent in Hectares
                      </label>
                      <div className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
                        {(farmerForm.netSownAcres * 0.404686).toFixed(2)} Ha
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setKyfStep(2)}
                      className="text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 rounded-xl text-xs"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setKyfStep(4)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
                    >
                      <span>Next: Crop &amp; Yield</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Crop Season, Variety, Yield & Certification */}
              {kyfStep === 4 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      Module 1 · Step 4/5
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      Crop Season, Yield &amp; Certification Enrollment
                    </h3>
                    <p className="text-xs text-slate-500">
                      Establishes forward supply data for FPO pooling and consumer pre-commitment contracts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Season</label>
                      <select
                        value={farmerForm.cropSeason}
                        onChange={(e: any) => setFarmerForm({ ...farmerForm, cropSeason: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      >
                        <option value="Kharif 2024-25">Kharif (Monsoon Sown)</option>
                        <option value="Rabi 2024-25">Rabi (Winter Sown)</option>
                        <option value="Zaid 2025">Zaid (Summer Crop)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Variety</label>
                      <input
                        type="text"
                        value={farmerForm.cropVariety}
                        onChange={(e) => setFarmerForm({ ...farmerForm, cropVariety: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Yield (in Quintals)</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={farmerForm.estimatedYieldQuintals}
                          onChange={(e) => setFarmerForm({ ...farmerForm, estimatedYieldQuintals: parseInt(e.target.value, 10) || 0 })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-slate-500 font-bold uppercase">
                          Quintals (Qtl)
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Equivalent to {(farmerForm.estimatedYieldQuintals * 100).toLocaleString()} kg
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Certification Status</label>
                      <select
                        value={farmerForm.certification}
                        onChange={(e: any) => setFarmerForm({ ...farmerForm, certification: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-semibold"
                      >
                        <option value="PGS-India Green Organic">PGS-India Green Organic (+18% Floor Bonus)</option>
                        <option value="NPOP Certified Export">NPOP Certified Organic (+22% Floor Bonus)</option>
                        <option value="Zero-Budget Natural Farming (ZBNF)">Zero-Budget Natural Farming (+12% Floor Bonus)</option>
                        <option value="Conventional Grade A">Conventional Grade A Residue-Tested (+6% Floor Bonus)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setKyfStep(3)}
                      className="text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 rounded-xl text-xs"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteFarmerEnrollment}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Execute Pooling &amp; Calculate Floor Price</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Automated Pooling Engine & Assigned FPO Card */}
              {kyfStep === 5 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                        Module 1 · Step 5/5 Completed
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        Automated Farmer Pooling &amp; Guaranteed Floor Price Card
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pooled &amp; Secured
                    </span>
                  </div>

                  {/* Regional FPO Cluster Allocation Card */}
                  <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 text-white rounded-2xl p-5 border border-emerald-500/40 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-bold uppercase text-emerald-400">
                          Auto-Assigned Hyper-local FPO Cluster
                        </span>
                        <h4 className="text-lg font-black text-white">{assignedFpoCluster.fpo_name}</h4>
                        <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{assignedFpoCluster.block_tehsil}, {assignedFpoCluster.nodal_district} ({assignedFpoCluster.geo_radius_km} km radius)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-emerald-400">
                          ₹{assignedFpoCluster.guaranteed_floor_price_per_qtl}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold">
                          Guaranteed Floor / Qtl
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-3 rounded-xl text-xs border border-emerald-500/20">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Pooled Farmers:</span>
                        <strong className="text-white text-sm">{assignedFpoCluster.enrolled_farmers_count} Active</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Collective Sown Area:</span>
                        <strong className="text-white text-sm">{assignedFpoCluster.active_sown_acres} Acres</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Aggregated Yield:</span>
                        <strong className="text-white text-sm">{assignedFpoCluster.aggregated_yield_quintals} Qtl</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Demand Pre-Locked:</span>
                        <strong className="text-emerald-400 text-sm">{assignedFpoCluster.demand_coverage_percent}% ONDC</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-900/40 border border-emerald-500/30 rounded-xl space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Central Gov Statutory MSP:</span>
                        <span className="font-mono text-slate-200">₹{assignedFpoCluster.msp_benchmark_price_per_qtl} / Qtl</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Live e-NAM APMC Modal Rate:</span>
                        <span className="font-mono text-slate-200">₹{assignedFpoCluster.mandi_benchmark_price_per_qtl} / Qtl</span>
                      </div>
                      <div className="flex items-center justify-between text-emerald-300 font-bold border-t border-emerald-500/20 pt-1.5">
                        <span>AgroPulse Guaranteed Net Farmgate:</span>
                        <span className="font-mono text-emerald-400 text-sm">
                          ₹{assignedFpoCluster.guaranteed_floor_price_per_qtl} / Qtl (₹{(assignedFpoCluster.guaranteed_floor_price_per_qtl / 100).toFixed(1)}/kg)
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-200 font-medium">
                        ✦ +37.2% Net Gain over local commission agents with zero post-harvest mandi deduction.
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setKyfStep(1)}
                      className="text-emerald-700 hover:text-emerald-800 font-semibold text-xs flex items-center gap-1"
                    >
                      <span>← Enroll Another Parcel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("kyc")}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                    >
                      <span>Explore ONDC KYC Demand Match →</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Cols: Enrolled Smallholders Roster & Live Land Ledger */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified AgriStack Roster ({enrolledFarmers.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">Live Federated Registry</span>
                </div>

                <div className="space-y-3">
                  {enrolledFarmers.map((farmer) => (
                    <div
                      key={farmer.farmer_id}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-400 transition bg-slate-50 space-y-2 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="text-slate-900 block text-xs">{farmer.farmer_name}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">{farmer.farmer_id}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          DigiLocker ✓
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Location:</span>
                          <span>{farmer.village_name}, {farmer.district_name}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Crops Enrolled:</span>
                          <span className="text-emerald-700 font-semibold">{farmer.primary_crops.join(", ")}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                        <span>DBT Mandate: Aadhaar Linked</span>
                        <span className="font-mono text-emerald-700 font-semibold">{farmer.upi_vpa}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bhulekh RoR Sample Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold uppercase text-[10px]">
                    State Land Portal Query Log
                  </span>
                  <span className="text-[10px] text-slate-400">Response in 180ms</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-slate-300 space-y-1">
                  <div>PORTAL: MahaBhulekh API Gateway</div>
                  <div>RECORD: 74/2A · Narayangaon Village</div>
                  <div>TENURE: Clean Bhoomiswami Title (No Encumbrance)</div>
                  <div>CROP SURVEY: Digital Survey Done (Patwari ID: 8812)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KNOW YOUR CONSUMER (KYC) - ONDC DEMAND & CROP PASSPORT              */}
      {/* ========================================================================= */}
      {activeTab === "kyc" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 Cols: Consumer Demand Capture & Disintermediation Split */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">
                    Module 2 · Demand Signaling
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">
                    Know Your Consumer (KYC) Forward Demand Capture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aggregates consumer pre-orders via ONDC to calculate guaranteed floor prices before harvest.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Buyer Persona Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Select Buyer Persona
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "Individual Household", label: "🏡 Individual Household", desc: "Weekly 5-15 kg grocery basket" },
                        { id: "HoReCa / Restaurant", label: "🍽️ HoReCa / Restaurant", desc: "Commercial kitchens (100-800 kg)" },
                        { id: "Institutional Buyer", label: "🏢 Institutional Buyer", desc: "Canteens & hospitals (1-5 tons)" },
                        { id: "Kirana / Retailer", label: "🏪 Kirana / Retail Store", desc: "Daily retail distribution" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setKycBuyerPersona(item.id as any)}
                          className={`p-2.5 rounded-xl text-left border transition text-xs cursor-pointer ${
                            kycBuyerPersona === item.id
                              ? "bg-sky-50 border-sky-400 text-sky-950 ring-1 ring-sky-400"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          <div className="font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Target Crop Variety</label>
                      <select
                        value={kycCrop}
                        onChange={(e) => setKycCrop(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      >
                        <option value="Roma Tomatoes">Roma Tomatoes (Organic PGS-India)</option>
                        <option value="Nashik Red Onions">Nashik Red Onions (Garwa Quality)</option>
                        <option value="Alphonso Mangoes">Alphonso Mangoes (Carbide Free)</option>
                        <option value="Baby Spinach">Baby Spinach (Hydro-Clean)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Commitment Quantity ({kycBuyerPersona === "Individual Household" ? "kg" : "Quintals"})
                      </label>
                      <input
                        type="number"
                        value={kycQuantityKg}
                        onChange={(e) => setKycQuantityKg(parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Cadence</label>
                      <select
                        value={kycCadence}
                        onChange={(e: any) => setKycCadence(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      >
                        <option value="Weekly Farm Box">Weekly Farm Box (Recurring)</option>
                        <option value="Bi-Weekly Supply">Bi-Weekly Supply</option>
                        <option value="Monthly Recurring">Monthly Recurring</option>
                        <option value="Forward Harvest Contract">Full Season Forward Contract</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery SLA</label>
                      <select
                        value={kycDeliverySla}
                        onChange={(e: any) => setKycDeliverySla(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
                      >
                        <option value="15-Min Ultra-Fast">15-Min Hyperlocal Dark Store</option>
                        <option value="Scheduled Next Morning">Scheduled Morning 6-8 AM</option>
                        <option value="Same Day Evening">Same Day Evening 5-7 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* TRANSPARENT ZERO-MIDDLEMAN PRICE LEDGER */}
                  <div className="bg-slate-900 text-white rounded-2xl p-4.5 border border-slate-800 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold uppercase text-[11px] tracking-wide flex items-center gap-1.5">
                        <Scale className="w-4 h-4 text-emerald-400" />
                        <span>Zero-Middleman Price Ledger (₹/kg)</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ONDC Transparent Split</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* Price Bar Visualization */}
                      <div className="h-4 rounded-full overflow-hidden flex bg-slate-800">
                        <div style={{ width: "77.6%" }} className="bg-emerald-500" title="Farmer Payout (77.6%)" />
                        <div style={{ width: "7.6%" }} className="bg-sky-500" title="Solar Logistics (7.6%)" />
                        <div style={{ width: "3.4%" }} className="bg-amber-500" title="AgroPulse Fee (3.4%)" />
                        <div style={{ width: "11.4%" }} className="bg-indigo-500" title="Packaging & Testing (11.4%)" />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg">
                          <span className="text-emerald-300 font-medium">1. Direct Farmer UPI:</span>
                          <strong className="text-white">₹29.50 (77.6%)</strong>
                        </div>
                        <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg">
                          <span className="text-sky-300 font-medium">2. Solar Cold Chain:</span>
                          <strong className="text-white">₹2.90 (7.6%)</strong>
                        </div>
                        <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg">
                          <span className="text-amber-300 font-medium">3. AgroPulse Fee:</span>
                          <strong className="text-white">₹1.30 (3.4%)</strong>
                        </div>
                        <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg">
                          <span className="text-indigo-300 font-medium">4. Quality &amp; Pack:</span>
                          <strong className="text-white">₹4.30 (11.4%)</strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-lg font-black text-white">₹38.00 / kg</div>
                          <div className="text-[10px] text-emerald-400 font-semibold">AgroPulse Consumer Price</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-rose-400 line-through">₹55.00 / kg</div>
                          <div className="text-[10px] text-slate-400">Traditional Mandi Markup (-31% Savings)</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setKycOrderSuccess(`Pre-order locked! ${kycQuantityKg} kg of ${kycCrop} booked on ONDC network with direct payout to farmer pool.`);
                      setTimeout(() => setKycOrderSuccess(null), 5000);
                    }}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Lock Forward Demand Order via ONDC</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: ONDC Digital "Crop Passport" & Lineage Viewer */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      Farm-to-Fork Traceability
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      ONDC "Crop Passport" Lineage Card
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold">
                    {selectedLineageBatch.crop_passport_code}
                  </span>
                </div>

                {/* THE CROP PASSPORT CARD */}
                <div className="bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white rounded-2xl p-5 border border-emerald-500/40 space-y-4 shadow-xl">
                  {/* Top Bar with QR Code & Farmer Details */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
                        AgriStack Verified Lineage
                      </div>
                      <h4 className="text-xl font-black text-white">{selectedLineageBatch.farmer_name}</h4>
                      <div className="text-xs text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{selectedLineageBatch.village}, {selectedLineageBatch.tehsil}, {selectedLineageBatch.district}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Land Parcel: {selectedLineageBatch.khasra_survey_number} · Patwari Verified
                      </div>
                    </div>

                    {/* Simulated SVG QR Code */}
                    <div className="bg-white p-2 rounded-xl shrink-0 shadow-md text-slate-900 flex flex-col items-center">
                      <svg width="68" height="68" viewBox="0 0 68 68">
                        <rect width="68" height="68" fill="#ffffff" />
                        <rect x="4" y="4" width="20" height="20" fill="#064e3b" />
                        <rect x="8" y="8" width="12" height="12" fill="#ffffff" />
                        <rect x="44" y="4" width="20" height="20" fill="#064e3b" />
                        <rect x="48" y="8" width="12" height="12" fill="#ffffff" />
                        <rect x="4" y="44" width="20" height="20" fill="#064e3b" />
                        <rect x="8" y="48" width="12" height="12" fill="#ffffff" />
                        <rect x="28" y="10" width="8" height="8" fill="#064e3b" />
                        <rect x="28" y="28" width="12" height="12" fill="#064e3b" />
                        <rect x="44" y="32" width="6" height="6" fill="#064e3b" />
                        <rect x="32" y="48" width="16" height="16" fill="#064e3b" />
                      </svg>
                      <span className="text-[8px] font-mono font-bold mt-0.5 text-slate-700">SCAN PASSPORT</span>
                    </div>
                  </div>

                  {/* Certified Badges */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-900/80 border border-emerald-500/30 p-2.5 rounded-xl">
                      <span className="text-slate-400 text-[10px] block">Organic Audit Body:</span>
                      <strong className="text-emerald-300 font-semibold">{selectedLineageBatch.certification_body}</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">Cert #{selectedLineageBatch.certification_id}</span>
                    </div>

                    <div className="bg-slate-900/80 border border-emerald-500/30 p-2.5 rounded-xl">
                      <span className="text-slate-400 text-[10px] block">Lab Residue Test:</span>
                      <strong className="text-emerald-300 font-semibold">{selectedLineageBatch.lab_residue_test_status}</strong>
                      <span className="text-[10px] text-slate-400 block font-mono">Zero synthetic chemicals</span>
                    </div>
                  </div>

                  {/* Sowing to Harvest Timeline */}
                  <div className="bg-slate-900/60 p-3 rounded-xl space-y-1.5 text-xs border border-slate-800">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>🌱 Sown on Field:</span>
                      <span className="font-mono text-white">{selectedLineageBatch.sowing_date}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>✂️ Harvest Timestamp:</span>
                      <span className="font-mono text-emerald-400">{selectedLineageBatch.harvest_timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>❄️ Solar Cold Storage Dispatch:</span>
                      <span className="font-mono text-sky-400">{selectedLineageBatch.cold_chain_dispatch_time}</span>
                    </div>
                  </div>

                  {/* 1-Click Subscribe Action */}
                  <div className="pt-1 flex items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-slate-400 block text-[10px]">Active Subscribers:</span>
                      <strong className="text-white text-sm">{selectedLineageBatch.subscriber_count} Households</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleSubscribeFarmer(selectedLineageBatch.farmer_id)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md ${
                        subscribedFarmers[selectedLineageBatch.farmer_id]
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white"
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {subscribedFarmers[selectedLineageBatch.farmer_id]
                          ? "✓ Subscribed to Next Harvest"
                          : "Subscribe to This Farmer's Next Harvest"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Batch Selector */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700 block">Switch Live Harvest Batch:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {SAMPLE_CROP_LINEAGE_BATCHES.map((batch) => (
                      <button
                        key={batch.lineage_batch_id}
                        type="button"
                        onClick={() => setSelectedLineageBatch(batch)}
                        className={`p-2.5 rounded-xl text-left border text-xs transition cursor-pointer ${
                          selectedLineageBatch.lineage_batch_id === batch.lineage_batch_id
                            ? "bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-1 ring-emerald-400"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <div className="truncate">{batch.crop_name}</div>
                        <div className="text-[10px] text-slate-500">{batch.farmer_name} · {batch.district}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STATE & LOCAL GOVT AGRICULTURAL SMART-GRID DASHBOARD               */}
      {/* ========================================================================= */}
      {activeTab === "smartgrid" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
                  Module 3 · Macro Planning Rails
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  State &amp; Local Government Agricultural Smart-Grid
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregating verified sown acreage, demand forecasting &amp; decentralized cold-storage allocation recommendations.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SAMPLE_SMART_GRID_ANALYTICS, null, 2));
                    const dl = document.createElement("a");
                    dl.setAttribute("href", dataStr);
                    dl.setAttribute("download", `AgroPulse_State_SmartGrid_Manifest_${new Date().toISOString().slice(0, 10)}.json`);
                    dl.click();
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Smart-Grid Manifest (JSON)</span>
                </button>
              </div>
            </div>

            {/* District Sown Acreage & Cold Storage Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {SAMPLE_SMART_GRID_ANALYTICS.map((region) => {
                const isSurplus = region.surplusDeficitQuintals > 0;
                return (
                  <div
                    key={region.district}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50 hover:border-slate-300 transition space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-slate-900">{region.district} District</h4>
                          <span className="text-xs text-slate-500">({region.state})</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {region.tehsilCount} Tehsils · {region.totalSownAcres.toLocaleString()} Net Sown Acres
                        </span>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          region.status === "Surplus Buffer Needed"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : region.status === "Deficit Alert"
                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        }`}
                      >
                        {region.status === "Surplus Buffer Needed" && <AlertTriangle className="w-3.5 h-3.5" />}
                        {region.status === "Deficit Alert" && <AlertTriangle className="w-3.5 h-3.5" />}
                        {region.status === "Balanced Grid" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{region.status}</span>
                      </span>
                    </div>

                    {/* Top Sown Crops breakdown */}
                    <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Top Sown Commodities (AgriStack Survey):
                      </span>
                      {region.topCrops.map((c) => (
                        <div key={c.crop} className="flex items-center justify-between text-xs">
                          <span className="text-slate-800 font-medium">{c.crop}</span>
                          <span className="text-slate-600 font-mono">
                            {c.sownAcres.toLocaleString()} Ac · {c.expectedYieldQuintals.toLocaleString()} Qtl
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Supply vs Demand Comparison */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 text-[10px] block">Projected Supply</span>
                        <strong className="text-slate-900 font-bold text-xs sm:text-sm">
                          {(region.projectedSupplyQuintals / 1000).toFixed(1)}k Qtl
                        </strong>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 text-[10px] block">Urban Demand</span>
                        <strong className="text-slate-900 font-bold text-xs sm:text-sm">
                          {(region.marketDemandQuintals / 1000).toFixed(1)}k Qtl
                        </strong>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 text-[10px] block">Net Gap</span>
                        <strong
                          className={`font-bold text-xs sm:text-sm ${
                            isSurplus ? "text-amber-600" : "text-rose-600"
                          }`}
                        >
                          {isSurplus ? "+" : ""}
                          {(region.surplusDeficitQuintals / 1000).toFixed(1)}k Qtl
                        </strong>
                      </div>
                    </div>

                    {/* Cold Storage Capacity & Utilization */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Solar Cold Storage Utilization ({region.solarGodownsAvailable} Godowns):</span>
                        <strong className="text-slate-800">{region.godownUtilizationPercent}% Capacity</strong>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${region.godownUtilizationPercent}%` }}
                          className={`h-full ${
                            region.godownUtilizationPercent > 85
                              ? "bg-rose-500"
                              : region.godownUtilizationPercent > 70
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1">
                      <strong className="text-emerald-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>State Dept Smart-Grid Action Plan:</span>
                      </strong>
                      <p className="text-emerald-800 text-[11px] leading-relaxed">
                        {region.recommendedAction}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DPI JSON SCHEMAS & LIVE FLOOR PRICE ALGORITHM SIMULATOR            */}
      {/* ========================================================================= */}
      {activeTab === "schemas" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                Module 4 · DPI Technical Architecture
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                India DPI JSON Schemas &amp; Floor Price Algorithm
              </h3>
              <p className="text-xs text-slate-500">
                Official interoperable schemas aligned with AgriStack, Bhulekh, ONDC and e-NAM standards.
              </p>
            </div>

            {/* LIVE ALGORITHM SIMULATOR */}
            <div className="bg-gradient-to-br from-slate-950 via-emerald-955 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-emerald-500/40 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    Interactive Formula Simulator
                  </span>
                  <h4 className="text-lg font-bold text-white">{FLOOR_PRICE_ALGORITHM_DOCS.title}</h4>
                </div>
                <div className="bg-emerald-900/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-mono text-xs text-emerald-300">
                  {FLOOR_PRICE_ALGORITHM_DOCS.formulaLatex}
                </div>
              </div>

              {/* Sliders for Algorithm Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs">
                {/* 1. Base Mandi Price Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-300">e-NAM Mandi Rate (₹/Qtl):</span>
                    <strong className="text-white font-mono">₹{algoENam}</strong>
                  </div>
                  <input
                    type="range"
                    min="1200"
                    max="4500"
                    step="50"
                    value={algoENam}
                    onChange={(e) => setAlgoENam(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>₹1,200</span>
                    <span>Statutory MSP: ₹{algoMsp}</span>
                    <span>₹4,500</span>
                  </div>
                </div>

                {/* 2. Certification Selector */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Organic Certification:</span>
                    <strong className="text-emerald-400 font-bold uppercase text-[11px]">{algoCertType}</strong>
                  </div>
                  <select
                    value={algoCertType}
                    onChange={(e: any) => setAlgoCertType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="pgs">PGS-India Green (+18%)</option>
                    <option value="npop">NPOP Export Grade (+22%)</option>
                    <option value="zbnf">Natural Farming / ZBNF (+12%)</option>
                    <option value="grade_a">Conventional Grade A (+6%)</option>
                  </select>
                </div>

                {/* 3. Forward Demand Coverage Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-300">ONDC Demand Locked:</span>
                    <strong className="text-sky-400 font-mono">{algoDemandCoveragePct}%</strong>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={algoDemandCoveragePct}
                    onChange={(e) => setAlgoDemandCoveragePct(parseInt(e.target.value, 10))}
                    className="w-full accent-sky-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>10% (Low)</span>
                    <span>80% Threshold</span>
                    <span>120% (Overbooked)</span>
                  </div>
                </div>
              </div>

              {/* Real-time Math Output Card */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 text-[11px]">Formula Breakdown:</div>
                  <div className="font-mono text-slate-200">
                    ₹{simResult.base} (Base) + ₹{simResult.certBonus} (Quality) + ₹{simResult.demandBonus} (Demand) + ₹{simResult.scaleBonus} (Pool Scale)
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                    ₹{simResult.floorPrice.toLocaleString()} <span className="text-sm font-normal text-slate-300">/ Qtl</span>
                  </div>
                  <div className="text-xs text-slate-300 font-semibold">
                    (₹{simResult.perKg} / kg net UPI farmer payout)
                  </div>
                </div>
              </div>
            </div>

            {/* 5 INDIA DPI JSON SCHEMAS ACCORDION */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Interoperable JSON Schemas for State &amp; ONDC Integration</span>
              </h4>

              {[
                { key: "agristack", title: "AgriStackFarmerProfile Schema", data: SAMPLE_AGRISTACK_FARMERS[0] },
                { key: "bhulekh", title: "BhulekhLandParcel Schema", data: SAMPLE_BHULEKH_PARCELS[0] },
                { key: "fpo", title: "FarmerPoolCluster Schema", data: SAMPLE_FPO_CLUSTERS[0] },
                { key: "ondc", title: "ONDCConsumerDemand Schema", data: SAMPLE_ONDC_DEMANDS[0] },
                { key: "lineage", title: "CropLineageBatch Schema (Crop Passport)", data: SAMPLE_CROP_LINEAGE_BATCHES[0] },
              ].map((schema) => (
                <div key={schema.key} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="bg-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                    <span className="font-mono text-xs font-bold text-slate-800">{schema.title}</span>
                    <button
                      type="button"
                      onClick={() => handleCopySchema(schema.key, schema.data)}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedSchemaId === schema.key ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Schema JSON</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-[11px] font-mono text-slate-700 bg-slate-900 text-emerald-300 overflow-x-auto max-h-56">
                    {JSON.stringify(schema.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
