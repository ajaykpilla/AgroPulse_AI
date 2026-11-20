import React, { useState, useEffect } from "react";
import {
  Wifi,
  BatteryCharging,
  Sun,
  Droplets,
  Thermometer,
  Sprout,
  Activity,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Sliders,
  CheckCircle2,
  Sparkles,
  Radio,
  Clock,
  Compass,
  Zap,
} from "lucide-react";
import {
  IOT_SENSOR_NODES,
  INITIAL_TELEMETRY_MAP,
  IoTSensorNode,
  LiveSensorTelemetry,
} from "../data/sensorData";

interface AndroidCropSensorHubProps {
  onOpenCoPilotWithPrompt: (prompt: string) => void;
  onOpenHeatmapTab?: () => void;
  isAndroidView?: boolean;
}

export const AndroidCropSensorHub: React.FC<AndroidCropSensorHubProps> = ({
  onOpenCoPilotWithPrompt,
  onOpenHeatmapTab,
  isAndroidView = false,
}) => {
  const [nodes, setNodes] = useState<IoTSensorNode[]>(IOT_SENSOR_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("NODE-SG-01");
  const [telemetryMap, setTelemetryMap] = useState<Record<string, LiveSensorTelemetry>>(
    INITIAL_TELEMETRY_MAP
  );
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamFrequencySec, setStreamFrequencySec] = useState<number>(2);
  const [lastSyncText, setLastSyncText] = useState("Just now");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pairModalOpen, setPairModalOpen] = useState(false);

  // New Node Form
  const [newNodeName, setNewNodeName] = useState("Chevella Sector 5 Node");
  const [newNodeCrop, setNewNodeCrop] = useState("Heirloom Roma Tomato");

  const currentNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
  const currentTelemetry = telemetryMap[selectedNodeId] || telemetryMap["NODE-SG-01"];

  // Live sensor streaming simulation
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setTelemetryMap((prev) => {
        const existing = prev[selectedNodeId] || telemetryMap["NODE-SG-01"];
        // Micro-jitter
        const jitterMoisture = (Math.random() - 0.48) * 0.4;
        const jitterTemp = (Math.random() - 0.5) * 0.2;
        const jitterNdvi = (Math.random() - 0.5) * 0.005;

        return {
          ...prev,
          [selectedNodeId]: {
            ...existing,
            timestamp: new Date().toISOString(),
            soilMoisture10cm: Math.max(15, Math.min(95, parseFloat((existing.soilMoisture10cm + jitterMoisture).toFixed(1)))),
            soilMoisture30cm: Math.max(20, Math.min(92, parseFloat((existing.soilMoisture30cm + jitterMoisture * 0.6).toFixed(1)))),
            soilMoisture60cm: Math.max(25, Math.min(90, parseFloat((existing.soilMoisture60cm + jitterMoisture * 0.3).toFixed(1)))),
            canopyTempC: Math.max(18, Math.min(42, parseFloat((existing.canopyTempC + jitterTemp).toFixed(1)))),
            ambientTempC: Math.max(20, Math.min(45, parseFloat((existing.ambientTempC + jitterTemp * 1.1).toFixed(1)))),
            ndvi: Math.max(0.2, Math.min(0.96, parseFloat((existing.ndvi + jitterNdvi).toFixed(3)))),
            parSolarRadiation: Math.max(400, Math.min(1800, Math.round(existing.parSolarRadiation + (Math.random() - 0.5) * 25))),
          },
        };
      });
      setLastSyncText("Just now");
    }, streamFrequencySec * 1000);

    return () => clearInterval(interval);
  }, [isStreaming, streamFrequencySec, selectedNodeId]);

  // Stress Event Injections
  const handleInjectStress = (type: "heatwave" | "downpour" | "drought" | "bioboost") => {
    setTelemetryMap((prev) => {
      const cur = prev[selectedNodeId];
      if (!cur) return prev;

      if (type === "heatwave") {
        setToastMessage("Simulated Extreme Heatwave Event: Canopy temp surged to 37.8°C with stomatal closure.");
        return {
          ...prev,
          [selectedNodeId]: {
            ...cur,
            canopyTempC: 37.8,
            ambientTempC: 41.2,
            soilMoisture10cm: Math.max(22, cur.soilMoisture10cm - 18),
            leafWetnessPercent: 2,
            healthStatus: "Mild Water/Heat Stress",
            healthScorePercent: 68,
            activeAlert: "Canopy thermal anomaly (+6.4°C over seasonal mean). Stomates closed to prevent transpiration.",
            organicRemedy: "Apply Panchagavya cooling foliar mist + 25-minute evening micro-drip pulse.",
          },
        };
      }

      if (type === "downpour") {
        setToastMessage("Simulated Satellite Weather Calamity: 38.8mm/hr unseasonal cloudburst! Automated investmentShield claim queued.");
        return {
          ...prev,
          [selectedNodeId]: {
            ...cur,
            soilMoisture10cm: 94.5,
            soilMoisture30cm: 89.2,
            soilMoisture60cm: 84.0,
            canopyTempC: 22.8,
            ambientTempC: 24.1,
            leafWetnessPercent: 92,
            healthStatus: "Fungal Infection Risk",
            healthScorePercent: 72,
            activeAlert: "High rainfall & leaf condensation: Alternaria leaf spot sporulation index exceeds 85%.",
            organicRemedy: "Spray 5-day fermented sour buttermilk in copper vessel (1:10 dilution) immediately after rain clears.",
          },
        };
      }

      if (type === "drought") {
        setToastMessage("Simulated Root-Zone Moisture Deficit: Topsoil moisture dropped below 30% threshold.");
        return {
          ...prev,
          [selectedNodeId]: {
            ...cur,
            soilMoisture10cm: 26.4,
            soilMoisture30cm: 34.1,
            canopyTempC: 34.2,
            healthStatus: "Mild Water/Heat Stress",
            healthScorePercent: 64,
            activeAlert: "Shallow root-zone drought stress detected. High wilting risk within 18 hours.",
            organicRemedy: "Trigger micro-drip irrigation solenoid valve and apply dry straw mulching around root crown.",
          },
        };
      }

      if (type === "bioboost") {
        setToastMessage("Applied Jeevamrutham Microbial Bio-Drench: Rhizosphere nitrogen enriched and NDVI boosted to 0.88!");
        return {
          ...prev,
          [selectedNodeId]: {
            ...cur,
            ndvi: 0.88,
            ndre: 0.76,
            soilNitrogenMgKg: 235,
            soilPotassiumMgKg: 260,
            healthStatus: "Optimal Growth",
            healthScorePercent: 98,
            activeAlert: undefined,
            organicRemedy: "Beneficial nitrogen-fixing bacteria thriving. Crop qualified for AgroPulse Express 'AI Soil Verified' premium.",
          },
        };
      }

      return prev;
    });

    setTimeout(() => setToastMessage(null), 5000);
  };

  const handlePairNewNode = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `NODE-EXT-${Date.now().toString().slice(-4)}`;
    const newNode: IoTSensorNode = {
      id,
      name: newNodeName,
      cluster: "Kandi FPC Smart Hub #04",
      district: "Sangareddy, Telangana",
      cropType: newNodeCrop,
      plotAreaAcres: 2.0,
      latitude: 17.52 + Math.random() * 0.05,
      longitude: 78.11 + Math.random() * 0.05,
      daysAfterSowing: 42,
      variety: "Native Resilient Variety",
      irrigationType: "Drip Micro-Irrigation",
      connectivity: "BLE 5.2 Mesh",
      batteryPercent: 100,
      solarCharging: true,
      signalRssiDbm: -65,
      activeSensorsCount: 7,
      lastSyncSecondsAgo: 0,
    };

    setNodes((prev) => [newNode, ...prev]);
    setSelectedNodeId(id);
    setTelemetryMap((prev) => ({
      ...prev,
      [id]: {
        nodeId: id,
        timestamp: new Date().toISOString(),
        soilMoisture10cm: 68.0,
        soilMoisture30cm: 74.0,
        soilMoisture60cm: 78.0,
        canopyTempC: 26.5,
        ambientTempC: 29.8,
        ndvi: 0.82,
        ndre: 0.71,
        soilNitrogenMgKg: 195,
        soilPhosphorusMgKg: 55,
        soilPotassiumMgKg: 225,
        soilPh: 6.6,
        soilEcDsM: 1.05,
        leafWetnessPercent: 18,
        parSolarRadiation: 1250,
        relativeHumidityPercent: 60,
        healthStatus: "Optimal Growth",
        healthScorePercent: 94,
        organicRemedy: "New IoT Node paired successfully via BLE Mesh. Calibrated to zero drift.",
      },
    }));

    setPairModalOpen(false);
    setToastMessage(`Paired and calibrated new IoT node: "${newNodeName}" (${id}).`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAskAiAboutNode = () => {
    const prompt = `Please provide a real-time agricultural assessment for IoT Node ${currentNode.name} (${currentNode.cropType}, Day ${currentNode.daysAfterSowing}):
- Current NDVI: ${currentTelemetry.ndvi} (NDRE: ${currentTelemetry.ndre})
- Soil Moisture: 10cm=${currentTelemetry.soilMoisture10cm}%, 30cm=${currentTelemetry.soilMoisture30cm}%, 60cm=${currentTelemetry.soilMoisture60cm}%
- Leaf Temp: ${currentTelemetry.canopyTempC}°C vs Ambient ${currentTelemetry.ambientTempC}°C
- Soil NPK: N=${currentTelemetry.soilNitrogenMgKg}mg/kg, P=${currentTelemetry.soilPhosphorusMgKg}mg/kg, K=${currentTelemetry.soilPotassiumMgKg}mg/kg, pH=${currentTelemetry.soilPh}
- Active Status: ${currentTelemetry.healthStatus} (${currentTelemetry.activeAlert || "All parameters normal"})
What zero-cost natural farming practices (Jeevamrutham, Neemastra, Panchagavya, mulching) should be prioritized today?`;
    onOpenCoPilotWithPrompt(prompt);
  };

  return (
    <div className="space-y-4">
      {/* Node Picker & Telemetry Streaming Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Real-Time Agritech IoT Sensor Network
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Crop Health &amp; Field Telemetry Hub
            </h3>
          </div>

          {/* Node Selector Dropdown & Pair Button */}
          <div className="flex items-center gap-2">
            <select
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-100 text-xs font-medium rounded-xl px-3 py-2 focus:ring-1 focus:ring-emerald-500 focus:outline-none max-w-[220px] sm:max-w-[260px] truncate"
            >
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setPairModalOpen(true)}
              className="px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900/60 rounded-xl flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer"
              title="Pair BLE or LoRaWAN sensor probe"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pair Node</span>
            </button>
          </div>
        </div>

        {/* Node Connectivity & Hardware Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-3 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentNode.connectivity}</span>
              <span className="font-mono tabular-nums text-slate-500">
                ({currentNode.signalRssiDbm} dBm)
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <BatteryCharging className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-mono tabular-nums">{currentNode.batteryPercent}%</span>
              {currentNode.solarCharging && (
                <span className="text-[11px] text-teal-400">· Solar Powered</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentNode.district}</span>
              <span className="text-slate-500">· {currentNode.plotAreaAcres} Acres</span>
            </div>
          </div>

          {/* Streaming Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                isStreaming
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3 h-3 text-emerald-400" />
                  <span>Streaming Live</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-slate-400" />
                  <span>Paused</span>
                </>
              )}
            </button>

            <select
              value={streamFrequencySec}
              onChange={(e) => setStreamFrequencySec(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-2 py-1 rounded-lg"
              title="Telemetry sync rate"
            >
              <option value={1}>1s Poll</option>
              <option value={2}>2s Poll</option>
              <option value={5}>5s Poll</option>
            </select>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Enhanced Real-Time Telemetry Primary KPI Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        {/* Tile 1: NDVI & NDRE Canopy Vigor */}
        <div className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Canopy Vigor Tile</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sprout className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-400">
                {currentTelemetry.ndvi}
              </span>
              <span className="text-xs font-semibold text-slate-400">NDVI</span>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              ▲ +0.04
            </span>
          </div>

          {/* Mini 12-Hour Sparkline Curve */}
          <div className="h-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tileNdviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0,18 Q 20,16 40,12 T 70,8 T 100,6 L 100,24 L 0,24 Z" fill="url(#tileNdviGrad)" />
              <path d="M 0,18 Q 20,16 40,12 T 70,8 T 100,6" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800 text-slate-400">
            <span>NDRE Red Edge:</span>
            <span className="font-mono tabular-nums text-emerald-300 font-semibold">{currentTelemetry.ndre}</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, currentTelemetry.ndvi * 100)}%` }}
            />
          </div>
        </div>

        {/* Tile 2: Canopy & Ambient Temperature */}
        <div className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/60 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Thermal Differential</span>
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Thermometer className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-amber-400">
                {currentTelemetry.canopyTempC}°C
              </span>
              <span className="text-xs font-semibold text-slate-400">Leaf</span>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/30">
              -{(currentTelemetry.ambientTempC - currentTelemetry.canopyTempC).toFixed(1)}°C vs Air
            </span>
          </div>

          {/* Mini 12-Hour Sparkline Curve */}
          <div className="h-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tileTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0,16 Q 30,19 50,10 T 80,12 T 100,14 L 100,24 L 0,24 Z" fill="url(#tileTempGrad)" />
              <path d="M 0,16 Q 30,19 50,10 T 80,12 T 100,14" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800 text-slate-400">
            <span>Ambient Air:</span>
            <span className="font-mono tabular-nums text-slate-300 font-semibold">{currentTelemetry.ambientTempC}°C</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (currentTelemetry.canopyTempC / 45) * 100)}%` }}
            />
          </div>
        </div>

        {/* Tile 3: Active Root Moisture (30cm Depth) */}
        <div className="bg-slate-900/90 border border-teal-500/30 hover:border-teal-500/60 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Active Root Hydration</span>
            <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Droplets className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-teal-400">
                {currentTelemetry.soilMoisture30cm}%
              </span>
              <span className="text-xs font-semibold text-slate-400">30cm</span>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/30">
              Optimal Zone
            </span>
          </div>

          {/* Mini 12-Hour Sparkline Curve */}
          <div className="h-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tileMoistGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0,14 Q 25,18 50,8 T 75,10 T 100,7 L 100,24 L 0,24 Z" fill="url(#tileMoistGrad)" />
              <path d="M 0,14 Q 25,18 50,8 T 75,10 T 100,7" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800 text-slate-400">
            <span>Target Band:</span>
            <span className="font-mono tabular-nums text-teal-300 font-semibold">60% – 75%</span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, currentTelemetry.soilMoisture30cm)}%` }}
            />
          </div>
        </div>

        {/* Tile 4: Biological Health Score */}
        <div className="bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Crop Health Index</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-emerald-400">
                {currentTelemetry.healthScorePercent}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 100</span>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              Grade A+
            </span>
          </div>

          {/* Mini 12-Hour Sparkline Curve */}
          <div className="h-6 w-full opacity-80 group-hover:opacity-100 transition-opacity">
            <svg viewBox="0 0 100 24" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tileHealthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d="M 0,16 Q 30,12 55,9 T 85,7 T 100,5 L 100,24 L 0,24 Z" fill="url(#tileHealthGrad)" />
              <path d="M 0,16 Q 30,12 55,9 T 85,7 T 100,5" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800 text-slate-400">
            <span>Classification:</span>
            <span className="font-semibold text-emerald-300 truncate max-w-[120px]">
              {currentTelemetry.healthStatus}
            </span>
          </div>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentTelemetry.healthScorePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Responsive 2-Column Split on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (lg:col-span-8): Soil Moisture Strata + Chemistry Grid + Live Alert */}
        <div className="lg:col-span-8 space-y-4">
          {/* Multi-Depth Soil Moisture Strata Visualizer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">
                  Multi-Depth Soil Moisture Strata (10cm · 30cm · 60cm)
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-400">Root-zone hydration profiling</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Depth 1: 10cm Topsoil */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Shallow Topsoil (10cm)</span>
                  <span className="font-mono font-bold text-teal-400 tabular-nums">
                    {currentTelemetry.soilMoisture10cm}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, currentTelemetry.soilMoisture10cm)}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500">
                  Direct evaporation &amp; rain absorption layer
                </div>
              </div>

              {/* Depth 2: 30cm Root Zone */}
              <div className="bg-slate-950/70 border border-teal-500/40 rounded-xl p-3 space-y-2 ring-1 ring-teal-500/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-teal-300 font-semibold">Active Root Crown (30cm)</span>
                  <span className="font-mono font-bold text-teal-300 tabular-nums">
                    {currentTelemetry.soilMoisture30cm}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, currentTelemetry.soilMoisture30cm)}%` }}
                  />
                </div>
                <div className="text-[11px] text-teal-400 font-medium">
                  Primary nutrient uptake stratum (Target 60-75%)
                </div>
              </div>

              {/* Depth 3: 60cm Subsoil */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Deep Subsoil Reserve (60cm)</span>
                  <span className="font-mono font-bold text-indigo-400 tabular-nums">
                    {currentTelemetry.soilMoisture60cm}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, currentTelemetry.soilMoisture60cm)}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500">
                  Deep taproot reservoir buffer against dry spells
                </div>
              </div>
            </div>
          </div>

          {/* Secondary Soil Chemistry & Microclimate Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
              <div className="text-slate-400">Available Nitrogen (N)</div>
              <div className="text-lg font-bold font-mono tabular-nums text-emerald-400">
                {currentTelemetry.soilNitrogenMgKg} <span className="text-xs font-normal text-slate-400">mg/kg</span>
              </div>
              <div className="text-[10px] text-slate-500">Biological microbial N</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
              <div className="text-slate-400">Phosphorus &amp; Potassium</div>
              <div className="text-lg font-bold font-mono tabular-nums text-teal-400">
                {currentTelemetry.soilPhosphorusMgKg}P · {currentTelemetry.soilPotassiumMgKg}K
              </div>
              <div className="text-[10px] text-slate-500">Wood ash / rock phosphate balance</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
              <div className="text-slate-400">Soil pH &amp; Conductivity</div>
              <div className="text-lg font-bold font-mono tabular-nums text-amber-400">
                pH {currentTelemetry.soilPh} · {currentTelemetry.soilEcDsM} <span className="text-xs font-normal">dS/m</span>
              </div>
              <div className="text-[10px] text-slate-500">Salinity safe / neutral zone</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1">
              <div className="text-slate-400">Leaf Wetness &amp; PAR</div>
              <div className="text-lg font-bold font-mono tabular-nums text-sky-400">
                {currentTelemetry.leafWetnessPercent}% · {currentTelemetry.parSolarRadiation} <span className="text-xs font-normal">PAR</span>
              </div>
              <div className="text-[10px] text-slate-500">Dew point &amp; photosynth flux</div>
            </div>
          </div>

          {/* Agronomic Alert Banner if stressed */}
          {currentTelemetry.activeAlert && (
            <div className="bg-amber-950/60 border border-amber-500/50 rounded-2xl p-4 text-xs sm:text-sm text-amber-200 flex items-start gap-3 shadow-md">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-300">Live Anomaly Triggered on {currentNode.name}</div>
                <p className="leading-relaxed">{currentTelemetry.activeAlert}</p>
                {currentTelemetry.organicRemedy && (
                  <div className="pt-1.5 text-xs text-emerald-300 font-medium">
                    💡 Zero-Cost Remedy: {currentTelemetry.organicRemedy}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (lg:col-span-4): Simulator & Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          {/* Interactive Anomaly Injection Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Field Shock Simulator
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Live test</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Inject real-world microclimate anomalies to observe real-time sensor reaction and automated parametric insurance claim triggers:
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInjectStress("heatwave")}
                className="px-3 py-2 text-xs font-medium text-amber-300 bg-amber-950/70 border border-amber-500/40 hover:bg-amber-900/60 rounded-xl transition cursor-pointer text-left"
              >
                <div className="font-semibold">🔥 Heatwave Spike</div>
                <div className="text-[10px] text-amber-400/80 mt-0.5">+6°C Stomatal Curl</div>
              </button>

              <button
                type="button"
                onClick={() => handleInjectStress("downpour")}
                className="px-3 py-2 text-xs font-medium text-sky-300 bg-sky-950/70 border border-sky-500/40 hover:bg-sky-900/60 rounded-xl transition cursor-pointer text-left"
              >
                <div className="font-semibold">🌧️ Cloudburst</div>
                <div className="text-[10px] text-sky-400/80 mt-0.5">38.8mm/hr Payout</div>
              </button>

              <button
                type="button"
                onClick={() => handleInjectStress("drought")}
                className="px-3 py-2 text-xs font-medium text-rose-300 bg-rose-950/70 border border-rose-500/40 hover:bg-rose-900/60 rounded-xl transition cursor-pointer text-left"
              >
                <div className="font-semibold">☀️ Root Drought</div>
                <div className="text-[10px] text-rose-400/80 mt-0.5">&lt;30% Moisture</div>
              </button>

              <button
                type="button"
                onClick={() => handleInjectStress("bioboost")}
                className="px-3 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 hover:bg-emerald-900/60 rounded-xl transition cursor-pointer text-left"
              >
                <div className="font-semibold">🌿 Bio-Boost</div>
                <div className="text-[10px] text-emerald-400/80 mt-0.5">+15% NDVI Vigor</div>
              </button>
            </div>
          </div>

          {/* Action Strip Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <button
              type="button"
              onClick={handleAskAiAboutNode}
              className="w-full px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Ask AgroPulse AI on Current Node</span>
            </button>

            {onOpenHeatmapTab && (
              <button
                type="button"
                onClick={onOpenHeatmapTab}
                className="w-full px-4 py-2.5 text-xs font-semibold text-teal-300 bg-teal-950 border border-teal-500/40 hover:bg-teal-900/60 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View 15-Acre Interactive Heatmap →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pair Node Modal Dialog */}
      {pairModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Pair IoT Field Sensor Node</span>
              </h3>
              <button
                type="button"
                onClick={() => setPairModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePairNewNode} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Node Identifier / Sector Label</label>
                <input
                  type="text"
                  required
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. Medak North Polyhouse #3"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sown Crop Variety</label>
                <input
                  type="text"
                  required
                  value={newNodeCrop}
                  onChange={(e) => setNewNodeCrop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. Arka Rakshak Roma Tomato"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Auto-Detected Hardware Protocol:</span>
                </div>
                <div>• Wireless: BLE 5.2 Mesh &amp; LoRaWAN 868MHz</div>
                <div>• Probes: 3-Strata TDR Soil Moisture + Infrared Leaf Sensor</div>
                <div>• Calibrated Baseline: IMD Telangana Agro-Climatic Grid</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPairModalOpen(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition"
                >
                  Pair &amp; Calibrate Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
