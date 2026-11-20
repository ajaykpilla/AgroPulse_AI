import demoHeroCoverImg from "../assets/images/demo_video_hero_cover_1792312951901.jpg";
import demoSlide2Img from "../assets/images/demo_slide_scene2_krishi_1792313428195.jpg";
import demoSlide3Img from "../assets/images/demo_slide_scene3_godown_1792313427943.jpg";
import demoSlide4Img from "../assets/images/demo_slide_scene4_express_1792313427497.jpg";
import leafScanImg from "../assets/images/sample_tomato_leaf_scan_1791732018407.jpg";
import tomatoImg from "../assets/images/product_roma_tomatoes_1791731971325.jpg";

export type DemoTargetTab = "sensors" | "heatmap" | "trends" | "krishi" | "ecosystem";
export type DemoEcosystemSubMode = "admin" | "express" | "harvest-pass" | "dpi";

export interface DemoScene {
  id: string;
  timestamp: string;
  durationSec: number;
  title: string;
  persona:
    | "Platform Overview"
    | "Live Sensors Hub"
    | "64-Sector Heatmap"
    | "Climate Trends"
    | "AgroPulse Krishi"
    | "Ecosystem & DPI";
  focusTag: string;
  narrationVoiceover: string;
  uiActionPrompt: string;
  targetMode: "krishi" | "admin" | "express" | "dpi";
  targetTab: DemoTargetTab;
  targetEcosystemSubMode?: DemoEcosystemSubMode;
  keyTakeaways: string[];
  slideImg: string;
}

export const DEMO_VIDEO_COVER_IMG = demoHeroCoverImg;

export const THREE_MINUTE_DEMO_SCENES: DemoScene[] = [
  {
    id: "scene-1",
    timestamp: "0:00 - 0:25 (25s)",
    durationSec: 25,
    title: "1. AgroPulse AI Overview & Unified Shell",
    persona: "Platform Overview",
    focusTag: "Android PWA + Desktop · Closed-Loop Agritech",
    narrationVoiceover:
      "Welcome to AgroPulse AI at agropulse.ai.studio—a unified Android and desktop crop intelligence and quick-commerce platform. Across India, smallholders lose up to forty percent of their harvest to middlemen and spoilage while urban families overpay for stale produce. AgroPulse closes that loop in one responsive workspace, delivering thirty-five percent higher farmer earnings, twenty percent lower grocery costs, and fifteen-minute doorstep freshness.",
    uiActionPrompt:
      "Opening the Master Hero Tile, Desktop/Pixel 8 Pro switcher, and 5-tab agritech workspace.",
    targetMode: "krishi",
    targetTab: "sensors",
    keyTakeaways: [
      "Dual Android PWA & Desktop 1440px shell with Pixel 8 Pro preview",
      "+35% farmer net realization & -20% urban grocery cost",
      "Kandi FPC Smart Hub #04 synced with Sentinel-2 & LoRaWAN",
    ],
    slideImg: demoHeroCoverImg,
  },
  {
    id: "scene-2",
    timestamp: "0:25 - 0:55 (30s)",
    durationSec: 30,
    title: "2. Real-Time IoT Crop Sensor Hub",
    persona: "Live Sensors Hub",
    focusTag: "LoRaWAN Telemetry · Multi-Depth Soil Strata",
    narrationVoiceover:
      "Inside the Sensors tab, agronomists and farmers stream real-time telemetry from solar-powered LoRaWAN nodes across Sangareddy, Chevella, Zaheerabad, Medak, and Warangal. Enhanced sparkline tiles track canopy NDVI vigor, thermal leaf differentials, biological health scores, and root-zone moisture across ten, thirty, and sixty centimeter soil depths. Toggle one-second polling, pair new field nodes, or trigger the Field Shock Simulator to stress-test heatwaves, cloudbursts, and droughts.",
    uiActionPrompt:
      "Streaming live 2s telemetry across 5 LoRaWAN nodes, inspecting 10/30/60cm soil depth gauges, and simulating field shocks.",
    targetMode: "krishi",
    targetTab: "sensors",
    keyTakeaways: [
      "Live 1s / 2s / 5s LoRaWAN streaming across 5 active farm clusters",
      "Sparkline KPI tiles for NDVI, thermal delta & multi-depth moisture",
      "Field Shock Simulator: Heatwave, Cloudburst, Drought & Bio-Boost",
    ],
    slideImg: demoSlide2Img,
  },
  {
    id: "scene-3",
    timestamp: "0:55 - 1:25 (30s)",
    durationSec: 30,
    title: "3. Interactive 64-Sector Field Heatmap",
    persona: "64-Sector Heatmap",
    focusTag: "8×8 Micro-Sectors · 5 Agronomic Layers",
    narrationVoiceover:
      "Switching to the Heatmap tab reveals an interactive sixty-four sector grid spanning fifteen acres from block A1 through H8. Toggle instantly between five live layers: NDVI vigor, soil moisture, canopy heat, NPK fertility, and fungal spore risk. Switch between Detailed and Compact tiles, hover for instant sector telemetry, and tap any stressed block to open micro-drip solenoid valves or dispatch zero-cost Jeevamrutham foliar sprays directly.",
    uiActionPrompt:
      "Toggling 5 spectral/soil heatmap layers, hovering over Detailed micro-sector tiles, and firing micro-drip remediation.",
    targetMode: "krishi",
    targetTab: "heatmap",
    keyTakeaways: [
      "64 interactive micro-sector tiles (A1–H8) across 5 live layers",
      "Detailed & Compact modes with micro moisture gauges & hover card",
      "1-tap solenoid drip actuation & ₹0 Jeevamrutham foliar dispatch",
    ],
    slideImg: tomatoImg,
  },
  {
    id: "scene-4",
    timestamp: "1:25 - 1:50 (25s)",
    durationSec: 25,
    title: "4. Historical Trends & 50-Yr Climate Reanalysis",
    persona: "Climate Trends",
    focusTag: "24h to 50-Yr ERA5/IMD Climate Baseline",
    narrationVoiceover:
      "Next, the Trends tab turns live field readings into seasonal foresight. Compare canopy NDVI, root moisture, leaf temperature, and available nitrogen across twenty-four hour, seven-day, thirty-day, ninety-day, and fifty-year ERA5 and IMD climate reanalysis baselines. Interactive crosshairs pinpoint rainfall or thermal anomalies, while one-click CSV exports and WhatsApp sharing keep Farmer Producer Companies aligned in real time.",
    uiActionPrompt:
      "Comparing 30-day & 50-year climate reanalysis overlays with interactive SVG crosshairs and CSV export.",
    targetMode: "admin",
    targetTab: "trends",
    keyTakeaways: [
      "5 time horizons: 24h, 7d, 30d, 90d & 50-year ERA5/IMD baseline",
      "Interactive SVG hover crosshairs & agronomic event markers",
      "1-click CSV data download & WhatsApp cluster brief sharing",
    ],
    slideImg: demoSlide3Img,
  },
  {
    id: "scene-5",
    timestamp: "1:50 - 2:20 (30s)",
    durationSec: 30,
    title: "5. AgroPulse Krishi: Voice AI, Leaf Scan & Shield",
    persona: "AgroPulse Krishi",
    focusTag: "Vernacular Voice · ₹0 Remedies · 78% Advances",
    narrationVoiceover:
      "In AgroPulse Krishi, smallholders access voice-first vernacular agronomy in English, Hindi, Telugu, and Marathi. Our Gemini multimodal leaf scanner diagnoses early blight or nitrogen hunger from a single photo and prescribes zero-cost biological remedies like fermented buttermilk and Neemastra, saving twenty-four hundred rupees per acre. Farmers store harvests in solar godowns for instant seventy-eight percent liquidity advances, while investmentShield triggers automatic satellite rainfall payouts with zero paperwork.",
    uiActionPrompt:
      "Running Gemini multimodal leaf diagnosis, issuing a solar godown e-NWR 78% advance, and triggering investmentShield.",
    targetMode: "krishi",
    targetTab: "krishi",
    keyTakeaways: [
      "Multilingual voice AI & Gemini multimodal leaf blight scanner",
      "Solar cold godowns unlocking 70–80% instant e-NWR liquidity",
      "investmentShield automated satellite parametric calamity payouts",
    ],
    slideImg: leafScanImg,
  },
  {
    id: "scene-6",
    timestamp: "2:20 - 2:45 (25s)",
    durationSec: 25,
    title: "6. Closed-Loop Ecosystem, Express & India DPI",
    persona: "Ecosystem & DPI",
    focusTag: "15-Min Express · Harvest Pass · AgriStack ONDC",
    narrationVoiceover:
      "Finally, the Ecosystem tab unites four enterprise engines: the Command Center for FPC governance and NGO field sync, the fifteen-minute Express storefront with QR farm-to-doorstep traceability, the AI Harvest Pass Importer that converts urban grocery history into one-year guaranteed sowing contracts, and the India AgriTech DPI Smart Grid integrating AgriStack, Bhulekh land records, and ONDC. AgroPulse AI—real-time intelligence from soil to doorstep.",
    uiActionPrompt:
      "Traversing Command Center, 15-Min Express QR traceability, 1-Yr Harvest Pass Importer, and AgriStack/ONDC DPI Smart Grid.",
    targetMode: "express",
    targetTab: "ecosystem",
    targetEcosystemSubMode: "express",
    keyTakeaways: [
      "15-Min Express storefront with QR Crop Passports & 1-Yr Harvest Pass",
      "Command Center forward sowing quotas & PRADAN / BAIF / Digital Green sync",
      "India AgriStack UFSI, Bhulekh 7/12 & ONDC Beckn DPI ledger",
    ],
    slideImg: demoSlide4Img,
  },
];
