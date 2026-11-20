/**
 * AgroPulse Real-Time Agritech IoT Sensor & Crop Health Data Models
 * Supports real-time sensor streaming, multi-depth soil strata, interactive 2D heatmaps,
 * and multi-horizon historical trends with 50-year climate reanalysis baseline.
 */

export interface IoTSensorNode {
  id: string;
  name: string;
  cluster: string;
  district: string;
  cropType: string;
  plotAreaAcres: number;
  latitude: number;
  longitude: number;
  daysAfterSowing: number;
  variety: string;
  irrigationType: "Drip Micro-Irrigation" | "Solar Mist Sprinklers" | "Furrow Flooding";
  connectivity: "LoRaWAN 868MHz" | "BLE 5.2 Mesh" | "4G NB-IoT";
  batteryPercent: number;
  solarCharging: boolean;
  signalRssiDbm: number;
  activeSensorsCount: number;
  lastSyncSecondsAgo: number;
}

export interface LiveSensorTelemetry {
  nodeId: string;
  timestamp: string;
  // Multi-depth Soil Moisture (% volumetric water content)
  soilMoisture10cm: number; // Shallow topsoil (15-90%)
  soilMoisture30cm: number; // Active root zone (20-85%)
  soilMoisture60cm: number; // Deep subsoil reservoir (25-80%)
  // Thermal dynamics
  canopyTempC: number;      // Plant leaf surface temp (18-42°C)
  ambientTempC: number;     // Air temp (20-45°C)
  // Spectral vegetation indices
  ndvi: number;             // Normalized Difference Vegetation Index (0.15 - 0.95)
  ndre: number;             // Red Edge Chlorophyll Index (0.10 - 0.85)
  // Soil Chemical & Fertility
  soilNitrogenMgKg: number; // Available N (40 - 280 mg/kg)
  soilPhosphorusMgKg: number; // Available P (15 - 95 mg/kg)
  soilPotassiumMgKg: number;  // Available K (90 - 320 mg/kg)
  soilPh: number;           // Soil pH (5.5 - 8.2)
  soilEcDsM: number;        // Electrical Conductivity (0.3 - 2.8 dS/m)
  // Microclimate & Leaf status
  leafWetnessPercent: number; // Condensation / dew (0 - 100%)
  parSolarRadiation: number;  // Photosynthetically Active Radiation (100 - 1800 µmol/m²/s)
  relativeHumidityPercent: number; // (20 - 98%)
  // Health Classification
  healthStatus: "Optimal Growth" | "Mild Water/Heat Stress" | "Nutrient Deficit Alert" | "Fungal Infection Risk";
  healthScorePercent: number; // 0 - 100
  activeAlert?: string;
  organicRemedy?: string;
}

export interface FieldSectorCell {
  id: string; // e.g. "A1", "C4", "H8"
  sectorName: string;
  row: number; // 0 - 7
  col: number; // 0 - 7
  acreage: number; // e.g. 0.25 acres
  cropType: string;
  daysAfterSowing: number;
  soilType: "Red Sandy Loam" | "Black Cotton Soil" | "Clayey Alluvial";
  irrigationSolenoidStatus: "Idle (Closed)" | "Active (Flowing)" | "Scheduled";
  // Heatmap layer values
  ndvi: number;
  soilMoisture: number; // root-zone %
  canopyTempC: number;
  npkFertilityIndex: number; // 0 - 100
  fungalRiskScore: number;   // 0 - 100
  // Evaluated status
  status: "Optimal" | "Stressed" | "Deficient" | "High Risk";
  stressReason?: string;
  organicRemedyRecommendation: string;
}

export interface HistoricalTrendPoint {
  timestampLabel: string;
  timestampIso: string;
  daysAfterSowing: number;
  ndvi: number;
  ndviBaseline: number; // 50-year climate reanalysis / ideal benchmark
  soilMoisturePercent: number;
  soilMoistureThresholdMin: number;
  canopyTempC: number;
  ambientTempC: number;
  nitrogenMgKg: number;
  rainfallMm: number;
  irrigationPulseMm: number;
  chlorophyllSpad: number;
  eventAnnotation?: string;
  parametricPayoutTriggered?: boolean;
}

export const IOT_SENSOR_NODES: IoTSensorNode[] = [
  {
    id: "NODE-SG-01",
    name: "Sangareddy Plot 4A (Roma Tomatoes)",
    cluster: "Kandi FPC Smart Hub #04",
    district: "Sangareddy, Telangana",
    cropType: "Hydroponic Roma Tomatoes",
    plotAreaAcres: 3.5,
    latitude: 17.5342,
    longitude: 78.1189,
    daysAfterSowing: 54,
    variety: "Arka Rakshak (High Lycopene)",
    irrigationType: "Drip Micro-Irrigation",
    connectivity: "LoRaWAN 868MHz",
    batteryPercent: 94,
    solarCharging: true,
    signalRssiDbm: -72,
    activeSensorsCount: 8,
    lastSyncSecondsAgo: 3,
  },
  {
    id: "NODE-CH-04",
    name: "Chevella Protected Greenhouse #2 (Baby Spinach)",
    cluster: "Chevella Greens Godown #11",
    district: "Ranga Reddy, Telangana",
    cropType: "Pesticide-Free Baby Spinach",
    plotAreaAcres: 2.2,
    latitude: 17.3065,
    longitude: 78.1347,
    daysAfterSowing: 28,
    variety: "Palak All Green Multi-cut",
    irrigationType: "Solar Mist Sprinklers",
    connectivity: "BLE 5.2 Mesh",
    batteryPercent: 88,
    solarCharging: true,
    signalRssiDbm: -68,
    activeSensorsCount: 7,
    lastSyncSecondsAgo: 1,
  },
  {
    id: "NODE-ZH-09",
    name: "Zaheerabad Orchard North (Alphonso Canopy)",
    cluster: "Zaheerabad Orchard Hub #19",
    district: "Sangareddy West",
    cropType: "Carbide-Free Alphonso Mangoes",
    plotAreaAcres: 5.0,
    latitude: 17.6781,
    longitude: 77.6042,
    daysAfterSowing: 110,
    variety: "Banganapalli & Alphonso Heirloom",
    irrigationType: "Drip Micro-Irrigation",
    connectivity: "4G NB-IoT",
    batteryPercent: 82,
    solarCharging: false,
    signalRssiDbm: -84,
    activeSensorsCount: 6,
    lastSyncSecondsAgo: 8,
  },
  {
    id: "NODE-MD-07",
    name: "Medak Allium Solar Terraces (Red Onions)",
    cluster: "Medak Allium Cold Hub #07",
    district: "Medak, Telangana",
    cropType: "Heirloom Red Onions & Purple Garlic",
    plotAreaAcres: 4.1,
    latitude: 18.0463,
    longitude: 78.2612,
    daysAfterSowing: 76,
    variety: "Bhima Super Solar-Cured",
    irrigationType: "Drip Micro-Irrigation",
    connectivity: "LoRaWAN 868MHz",
    batteryPercent: 91,
    solarCharging: true,
    signalRssiDbm: -76,
    activeSensorsCount: 7,
    lastSyncSecondsAgo: 4,
  },
  {
    id: "NODE-TG-12",
    name: "Warangal Regenerative Rice Paddies (Basmati)",
    cluster: "Warangal Agro-Ecological Network",
    district: "Warangal, Telangana",
    cropType: "Organic Basmati Rice (Staple)",
    plotAreaAcres: 6.8,
    latitude: 17.9689,
    longitude: 79.5941,
    daysAfterSowing: 62,
    variety: "Pusa Basmati 1121 Native",
    irrigationType: "Furrow Flooding",
    connectivity: "LoRaWAN 868MHz",
    batteryPercent: 79,
    solarCharging: true,
    signalRssiDbm: -79,
    activeSensorsCount: 8,
    lastSyncSecondsAgo: 2,
  },
];

export const INITIAL_TELEMETRY_MAP: Record<string, LiveSensorTelemetry> = {
  "NODE-SG-01": {
    nodeId: "NODE-SG-01",
    timestamp: new Date().toISOString(),
    soilMoisture10cm: 64.2,
    soilMoisture30cm: 71.8,
    soilMoisture60cm: 77.4,
    canopyTempC: 27.6,
    ambientTempC: 31.4,
    ndvi: 0.79,
    ndre: 0.68,
    soilNitrogenMgKg: 182,
    soilPhosphorusMgKg: 52,
    soilPotassiumMgKg: 210,
    soilPh: 6.5,
    soilEcDsM: 1.15,
    leafWetnessPercent: 14,
    parSolarRadiation: 1240,
    relativeHumidityPercent: 62,
    healthStatus: "Optimal Growth",
    healthScorePercent: 92,
    organicRemedy: " rhizosphere microbiome thriving. Continue 10-day Jeevamrutham cycle.",
  },
  "NODE-CH-04": {
    nodeId: "NODE-CH-04",
    timestamp: new Date().toISOString(),
    soilMoisture10cm: 78.5,
    soilMoisture30cm: 82.1,
    soilMoisture60cm: 79.3,
    canopyTempC: 23.4,
    ambientTempC: 25.8,
    ndvi: 0.86,
    ndre: 0.74,
    soilNitrogenMgKg: 220,
    soilPhosphorusMgKg: 64,
    soilPotassiumMgKg: 245,
    soilPh: 6.7,
    soilEcDsM: 0.98,
    leafWetnessPercent: 32,
    parSolarRadiation: 890,
    relativeHumidityPercent: 74,
    healthStatus: "Optimal Growth",
    healthScorePercent: 96,
    organicRemedy: "Optimal chlorophyll synthesis. Ready for 15-minute Express harvest batch.",
  },
  "NODE-ZH-09": {
    nodeId: "NODE-ZH-09",
    timestamp: new Date().toISOString(),
    soilMoisture10cm: 42.1,
    soilMoisture30cm: 51.3,
    soilMoisture60cm: 63.8,
    canopyTempC: 33.8,
    ambientTempC: 36.2,
    ndvi: 0.63,
    ndre: 0.51,
    soilNitrogenMgKg: 110,
    soilPhosphorusMgKg: 38,
    soilPotassiumMgKg: 175,
    soilPh: 7.2,
    soilEcDsM: 1.42,
    leafWetnessPercent: 5,
    parSolarRadiation: 1560,
    relativeHumidityPercent: 44,
    healthStatus: "Mild Water/Heat Stress",
    healthScorePercent: 74,
    activeAlert: "Afternoon stomatal thermal resistance detected (>33°C canopy).",
    organicRemedy: "Apply Panchagavya foliar cooling spray + 30-min evening micro-drip cycle.",
  },
  "NODE-MD-07": {
    nodeId: "NODE-MD-07",
    timestamp: new Date().toISOString(),
    soilMoisture10cm: 53.6,
    soilMoisture30cm: 61.2,
    soilMoisture60cm: 68.0,
    canopyTempC: 28.2,
    ambientTempC: 30.5,
    ndvi: 0.72,
    ndre: 0.61,
    soilNitrogenMgKg: 145,
    soilPhosphorusMgKg: 44,
    soilPotassiumMgKg: 280,
    soilPh: 6.8,
    soilEcDsM: 1.08,
    leafWetnessPercent: 12,
    parSolarRadiation: 1320,
    relativeHumidityPercent: 58,
    healthStatus: "Optimal Growth",
    healthScorePercent: 88,
    organicRemedy: "Wood ash & sulfur mulch optimal. High allicin compound development.",
  },
  "NODE-TG-12": {
    nodeId: "NODE-TG-12",
    timestamp: new Date().toISOString(),
    soilMoisture10cm: 88.0,
    soilMoisture30cm: 86.4,
    soilMoisture60cm: 82.0,
    canopyTempC: 26.8,
    ambientTempC: 29.2,
    ndvi: 0.81,
    ndre: 0.70,
    soilNitrogenMgKg: 165,
    soilPhosphorusMgKg: 49,
    soilPotassiumMgKg: 198,
    soilPh: 6.9,
    soilEcDsM: 0.85,
    leafWetnessPercent: 48,
    parSolarRadiation: 1180,
    relativeHumidityPercent: 81,
    healthStatus: "Optimal Growth",
    healthScorePercent: 90,
    organicRemedy: "Azolla bio-fertilizer layer active. Methane mitigation protocol in effect.",
  },
};

/**
 * 64-sector grid (8x8) representing a 15-acre farm cluster.
 * Row indices: 0 to 7 (Sectors A through H)
 * Column indices: 0 to 7 (Sectors 1 through 8)
 */
export function generateInitialFieldSectors(): FieldSectorCell[] {
  const rowLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const sectors: FieldSectorCell[] = [];

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const id = `${rowLetters[r]}${c + 1}`;
      // Introduce spatial gradient with realistic clustered variations
      const centerDist = Math.hypot(r - 3.5, c - 3.5);
      const isCornerStress = (r === 0 && c <= 1) || (r >= 6 && c >= 6);
      const isWaterloggingArea = (r === 2 && c === 3) || (r === 2 && c === 4);
      const isFungalVulnerable = r === 5 && c <= 2;

      let ndvi = 0.78 - centerDist * 0.04 + (Math.sin(r * 2 + c) * 0.06);
      let moisture = 68 - (r * 2.5) + (c * 2) + (Math.cos(r + c) * 5);
      let temp = 27.5 + (r * 0.8) - (c * 0.4);
      let npk = 82 + (Math.sin(c) * 12);
      let fungal = 18 + (r * 4);

      let status: FieldSectorCell["status"] = "Optimal";
      let stressReason: string | undefined;
      let remedy = "Maintain routine 10-day Jeevamrutham root drench and pest monitoring.";

      if (isCornerStress) {
        ndvi = 0.48;
        moisture = 34;
        temp = 34.8;
        npk = 52;
        status = "Stressed";
        stressReason = "Low soil moisture & early stomatal thermal leaf curl";
        remedy = "Trigger micro-drip solenoid valve for 25 mins + foliar sour buttermilk spray.";
      } else if (isWaterloggingArea) {
        moisture = 89;
        ndvi = 0.69;
        temp = 24.5;
        fungal = 68;
        status = "Deficient";
        stressReason = "Root zone hypoxia risk from furrow drainage pooling";
        remedy = "Clear furrow sub-drainage channel; apply dry trichoderma compost powder.";
      } else if (isFungalVulnerable) {
        fungal = 76;
        ndvi = 0.62;
        status = "High Risk";
        stressReason = "High leaf wetness hours: early Alternaria leaf spot spore risk";
        remedy = "Spray 5-day fermented sour buttermilk in copper vessel (1:10 dilution).";
      }

      sectors.push({
        id,
        sectorName: `Sector ${id} · Plot Block ${rowLetters[r]}`,
        row: r,
        col: c,
        acreage: 0.25,
        cropType: r < 4 ? "Roma Tomato" : r < 6 ? "Baby Spinach" : "Red Onions",
        daysAfterSowing: 54 - r * 2,
        soilType: r < 3 ? "Red Sandy Loam" : r < 6 ? "Clayey Alluvial" : "Black Cotton Soil",
        irrigationSolenoidStatus: isCornerStress ? "Active (Flowing)" : "Idle (Closed)",
        ndvi: Math.max(0.2, Math.min(0.95, parseFloat(ndvi.toFixed(2)))),
        soilMoisture: Math.max(20, Math.min(95, parseFloat(moisture.toFixed(1)))),
        canopyTempC: Math.max(20, Math.min(40, parseFloat(temp.toFixed(1)))),
        npkFertilityIndex: Math.max(30, Math.min(100, Math.round(npk))),
        fungalRiskScore: Math.max(10, Math.min(95, Math.round(fungal))),
        status,
        stressReason,
        organicRemedyRecommendation: remedy,
      });
    }
  }

  return sectors;
}

/**
 * Multi-horizon historical trends data generator
 */
export function getHistoricalTrendData(horizon: "24h" | "7d" | "30d" | "90d" | "50yr"): HistoricalTrendPoint[] {
  if (horizon === "24h") {
    // 24 hourly readings
    return Array.from({ length: 24 }).map((_, i) => {
      const hour = (i + 6) % 24; // 06:00 to 05:00 next day
      const hourStr = `${hour.toString().padStart(2, "0")}:00`;
      const isNoon = hour >= 11 && hour <= 15;
      const isNight = hour >= 21 || hour <= 5;

      const ambient = isNoon ? 32 + Math.sin(i) * 2.5 : isNight ? 22 + Math.cos(i) * 1.5 : 27;
      const canopy = ambient - (isNoon ? 2.8 : 1.2);
      const moisture = 74 - (isNoon ? i * 0.4 : 0) + (i === 17 ? 12 : 0); // irrigation pulse at 17:00
      const ndvi = 0.78 + (isNoon ? -0.03 : 0.02);

      return {
        timestampLabel: hourStr,
        timestampIso: `2026-10-12T${hourStr}:00Z`,
        daysAfterSowing: 54,
        ndvi: parseFloat(ndvi.toFixed(2)),
        ndviBaseline: 0.77,
        soilMoisturePercent: parseFloat(moisture.toFixed(1)),
        soilMoistureThresholdMin: 45,
        canopyTempC: parseFloat(canopy.toFixed(1)),
        ambientTempC: parseFloat(ambient.toFixed(1)),
        nitrogenMgKg: 182 - Math.round(i * 0.3),
        rainfallMm: i === 3 ? 1.2 : 0,
        irrigationPulseMm: i === 17 ? 8.5 : 0,
        chlorophyllSpad: 51.4,
        eventAnnotation: i === 17 ? "Automated Drip Cycle (8.5mm)" : i === 13 ? "Peak Solar PAR 1480 µmol/m²/s" : undefined,
      };
    });
  }

  if (horizon === "7d") {
    // 7 days
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day, idx) => {
      const rainfall = idx === 3 ? 38.4 : idx === 4 ? 6.2 : 0;
      const moisture = idx === 3 ? 88.5 : 68 - idx * 2.2 + (idx > 3 ? 15 : 0);
      const ndvi = 0.72 + idx * 0.015;

      return {
        timestampLabel: day,
        timestampIso: `2026-10-0${idx + 6}`,
        daysAfterSowing: 48 + idx,
        ndvi: parseFloat(ndvi.toFixed(2)),
        ndviBaseline: 0.74,
        soilMoisturePercent: parseFloat(moisture.toFixed(1)),
        soilMoistureThresholdMin: 45,
        canopyTempC: parseFloat((28.4 - (idx === 3 ? 4.2 : 0)).toFixed(1)),
        ambientTempC: parseFloat((31.8 - (idx === 3 ? 5.0 : 0)).toFixed(1)),
        nitrogenMgKg: 175 + (idx > 4 ? 20 : -idx * 4),
        rainfallMm: rainfall,
        irrigationPulseMm: idx === 1 ? 12 : idx === 6 ? 10 : 0,
        chlorophyllSpad: 49.5 + idx * 0.6,
        eventAnnotation: idx === 3 ? "Severe Cloudburst (38.4mm) · Parametric Payout Triggered" : idx === 5 ? "Jeevamrutham Foliar Application" : undefined,
        parametricPayoutTriggered: idx === 3,
      };
    });
  }

  if (horizon === "30d") {
    // 30 days
    return Array.from({ length: 30 }).map((_, i) => {
      const day = i + 1;
      const isCalamityDay = day === 14;
      const isBioRemedyDay = day === 18;
      const rainfall = isCalamityDay ? 42.0 : day === 6 ? 14.5 : 0;
      const moisture = isCalamityDay ? 92 : Math.max(35, 78 - ((day % 7) * 4) + (day > 14 ? 12 : 0));
      const ndvi = 0.58 + (day * 0.0075) + (day > 18 ? 0.04 : 0);

      return {
        timestampLabel: `Day ${day}`,
        timestampIso: `2026-09-${day.toString().padStart(2, "0")}`,
        daysAfterSowing: 24 + day,
        ndvi: parseFloat(ndvi.toFixed(2)),
        ndviBaseline: parseFloat((0.55 + day * 0.007).toFixed(2)),
        soilMoisturePercent: parseFloat(moisture.toFixed(1)),
        soilMoistureThresholdMin: 45,
        canopyTempC: parseFloat((29 + Math.sin(day) * 3).toFixed(1)),
        ambientTempC: parseFloat((32 + Math.sin(day) * 3.5).toFixed(1)),
        nitrogenMgKg: Math.round(150 + Math.sin(day * 0.5) * 30 + (day > 18 ? 40 : 0)),
        rainfallMm: rainfall,
        irrigationPulseMm: day % 6 === 0 ? 14 : 0,
        chlorophyllSpad: parseFloat((44 + day * 0.35).toFixed(1)),
        eventAnnotation: isCalamityDay
          ? "Unseasonal Downpour (42mm) · investmentShield ₹18,500 Disbursed"
          : isBioRemedyDay
          ? "BAIF Certified Jeevamrutham Root Drench"
          : undefined,
        parametricPayoutTriggered: isCalamityDay,
      };
    });
  }

  if (horizon === "90d") {
    // 90 days - Full crop growth cycle from Sowing to Harvest
    const stages = [
      { start: 1, end: 15, name: "Germination & Seedling", baseNdvi: 0.22, growthRate: 0.012 },
      { start: 16, end: 40, name: "Vegetative Canopy Expansion", baseNdvi: 0.40, growthRate: 0.015 },
      { start: 41, end: 65, name: "Flowering & Fruit Setting", baseNdvi: 0.72, growthRate: 0.005 },
      { start: 66, end: 90, name: "Ripening & Harvest Maturity", baseNdvi: 0.84, growthRate: -0.003 },
    ];

    return Array.from({ length: 90 }).map((_, i) => {
      const day = i + 1;
      const stage = stages.find((s) => day >= s.start && day <= s.end) || stages[0];
      const ndvi = stage.baseNdvi + (day - stage.start) * stage.growthRate;
      const moisture = 70 + Math.sin(day * 0.3) * 14;

      return {
        timestampLabel: `D${day}`,
        timestampIso: `2026-07-${(day % 30 + 1).toString().padStart(2, "0")}`,
        daysAfterSowing: day,
        ndvi: parseFloat(ndvi.toFixed(2)),
        ndviBaseline: parseFloat((ndvi - 0.05).toFixed(2)),
        soilMoisturePercent: parseFloat(moisture.toFixed(1)),
        soilMoistureThresholdMin: 45,
        canopyTempC: parseFloat((28 + Math.cos(day * 0.1) * 3.5).toFixed(1)),
        ambientTempC: parseFloat((31 + Math.cos(day * 0.1) * 4).toFixed(1)),
        nitrogenMgKg: Math.round(210 - day * 0.9 + (day > 30 ? 40 : 0) + (day > 60 ? 30 : 0)),
        rainfallMm: day === 22 ? 28 : day === 48 ? 39 : 0,
        irrigationPulseMm: day % 8 === 0 ? 16 : 0,
        chlorophyllSpad: parseFloat((32 + (day < 65 ? day * 0.4 : 58 - (day - 65) * 0.2)).toFixed(1)),
        eventAnnotation: day === 1
          ? "Sowing: Arka Rakshak Tomato Seedlings"
          : day === 48
          ? "Satellite Calamity Payout Triggered (39mm/hr)"
          : day === 90
          ? "Harvested: Deposited in Smart Godown Hub #04"
          : undefined,
        parametricPayoutTriggered: day === 48,
      };
    });
  }

  // 50-Year Climate Reanalysis Baseline comparison (ERA5 / IMD 0.25° Grid)
  // Showing decades of seasonal rainfall, mean temperatures, and vegetative stress indices
  const years = [
    1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024, 2025, 2026
  ];
  return years.map((yr, idx) => {
    const isCurrentYear = yr === 2026;
    const tempAnomaly = idx * 0.12 + (Math.sin(idx) * 0.4);
    const rainAnomaly = (Math.cos(idx * 1.5) * 60) - (idx * 2);

    return {
      timestampLabel: `'${yr.toString().slice(2)}`,
      timestampIso: `${yr}-01-01`,
      daysAfterSowing: 54,
      ndvi: parseFloat((0.68 + (isCurrentYear ? 0.11 : Math.sin(idx) * 0.05)).toFixed(2)),
      ndviBaseline: 0.69,
      soilMoisturePercent: parseFloat((62 + (isCurrentYear ? 10 : Math.cos(idx) * 8)).toFixed(1)),
      soilMoistureThresholdMin: 45,
      canopyTempC: parseFloat((26.5 + tempAnomaly).toFixed(1)),
      ambientTempC: parseFloat((29.8 + tempAnomaly * 1.2).toFixed(1)),
      nitrogenMgKg: isCurrentYear ? 185 : 140 + idx * 2,
      rainfallMm: Math.round(620 + rainAnomaly),
      irrigationPulseMm: 0,
      chlorophyllSpad: 50.2,
      eventAnnotation: isCurrentYear
        ? "2026: AgroPulse Closed-Loop Sowing & Parametric Shield in Effect"
        : yr === 2015
        ? "2015 Drought Shock (-38% yield)"
        : yr === 2020
        ? "2020 Unseasonal Monsoon Glut"
        : undefined,
      parametricPayoutTriggered: yr === 2015 || yr === 2020,
    };
  });
}
