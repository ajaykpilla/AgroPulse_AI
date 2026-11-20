import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Download,
  Video,
  Layers,
  ChevronRight,
  Maximize2,
  RefreshCw,
  FileText,
  Film,
  Sparkles,
} from "lucide-react";
import {
  THREE_MINUTE_DEMO_SCENES,
  DemoScene,
  DemoTargetTab,
  DemoEcosystemSubMode,
} from "../data/demoVideoData";
import { AppMode } from "../data/ecosystemData";
import {
  exportDemoScriptPackage,
  downloadConsolidatedDemoVideo,
} from "../utils/videoExporter";

interface DemoVideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPersona: (mode: AppMode) => void;
  onSyncTab?: (tab: DemoTargetTab, ecosystemSubMode?: DemoEcosystemSubMode) => void;
  onExploreTab?: (tab: DemoTargetTab, ecosystemSubMode?: DemoEcosystemSubMode) => void;
}

export const DemoVideoPlayerModal: React.FC<DemoVideoPlayerModalProps> = ({
  isOpen,
  onClose,
  onNavigateToPersona,
  onSyncTab,
  onExploreTab,
}) => {
  const [playerView, setPlayerView] = useState<"interactive" | "mp4">("interactive");
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState("");
  const [downloadReadyUrl, setDownloadReadyUrl] = useState<string | null>(null);

  const totalDurationSec = THREE_MINUTE_DEMO_SCENES.reduce(
    (acc, s) => acc + s.durationSec,
    0
  ); // 165 seconds (2:45 — under 3 minutes)

  const activeScene: DemoScene = THREE_MINUTE_DEMO_SCENES[currentSceneIdx];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastNarratedSceneRef = useRef<number>(-1);

  // Sync background tab silently without closing the modal
  useEffect(() => {
    if (isOpen && onSyncTab) {
      onSyncTab(activeScene.targetTab, activeScene.targetEcosystemSubMode);
    }
  }, [currentSceneIdx, isOpen]);

  // Trigger audio automatically when advancing scenes while playing
  useEffect(() => {
    if (isOpen && playerView === "interactive" && isPlaying && !isMuted) {
      if (lastNarratedSceneRef.current !== currentSceneIdx) {
        lastNarratedSceneRef.current = currentSceneIdx;
        playSceneAudio(activeScene.narrationVoiceover);
      }
    }
  }, [currentSceneIdx, isPlaying, isMuted, isOpen, playerView]);

  // Timer loop for simulation playback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && playerView === "interactive") {
      interval = setInterval(() => {
        setElapsedSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlaying(false);
            return totalDurationSec;
          }

          let accumulated = 0;
          for (let i = 0; i < THREE_MINUTE_DEMO_SCENES.length; i++) {
            accumulated += THREE_MINUTE_DEMO_SCENES[i].durationSec;
            if (prev + 1 < accumulated) {
              if (currentSceneIdx !== i) setCurrentSceneIdx(i);
              break;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDurationSec, currentSceneIdx, playerView]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const playSceneAudio = async (narrationText: string) => {
    if (isMuted) return;
    stopAudio();
    setIsSpeaking(true);

    const useFallback = () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(narrationText);
        utterance.lang = "en-IN";
        utterance.rate = 1.04;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    };

    try {
      const res = await fetch("/api/ai/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: narrationText }),
      });

      if (!res.ok) {
        useFallback();
        return;
      }

      const data = await res.json();
      if (data.audioDataUrl) {
        const audio = new Audio(data.audioDataUrl);
        audioRef.current = audio;
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => useFallback();
        await audio.play();
        return;
      }
      useFallback();
    } catch {
      useFallback();
    }
  };

  const handleTogglePlay = () => {
    const nextState = !isPlaying;
    if (nextState && elapsedSec >= totalDurationSec) {
      setElapsedSec(0);
      setCurrentSceneIdx(0);
      lastNarratedSceneRef.current = -1;
    }
    setIsPlaying(nextState);
    if (!nextState) {
      stopAudio();
      lastNarratedSceneRef.current = -1;
    }
  };

  const handleSelectScene = (index: number) => {
    setCurrentSceneIdx(index);
    let startSec = 0;
    for (let i = 0; i < index; i++) {
      startSec += THREE_MINUTE_DEMO_SCENES[i].durationSec;
    }
    setElapsedSec(startSec);
    lastNarratedSceneRef.current = -1;
    if (isPlaying && !isMuted) {
      lastNarratedSceneRef.current = index;
      playSceneAudio(THREE_MINUTE_DEMO_SCENES[index].narrationVoiceover);
    }
  };

  const handleScrubBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = clickX / rect.width;
    const targetSec = Math.round(ratio * totalDurationSec);
    setElapsedSec(targetSec);

    let accumulated = 0;
    for (let i = 0; i < THREE_MINUTE_DEMO_SCENES.length; i++) {
      accumulated += THREE_MINUTE_DEMO_SCENES[i].durationSec;
      if (targetSec < accumulated || i === THREE_MINUTE_DEMO_SCENES.length - 1) {
        if (i !== currentSceneIdx) {
          setCurrentSceneIdx(i);
          lastNarratedSceneRef.current = -1;
        }
        break;
      }
    }
  };

  const handleNextScene = () => {
    if (currentSceneIdx < THREE_MINUTE_DEMO_SCENES.length - 1) {
      handleSelectScene(currentSceneIdx + 1);
    }
  };

  const handlePrevScene = () => {
    if (currentSceneIdx > 0) {
      handleSelectScene(currentSceneIdx - 1);
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    lastNarratedSceneRef.current = -1;
    stopAudio();
    onClose();
  };

  const handleExploreCurrentScreen = () => {
    handleClose();
    if (onExploreTab) {
      onExploreTab(activeScene.targetTab, activeScene.targetEcosystemSubMode);
    } else {
      onNavigateToPersona(activeScene.targetMode);
    }
  };

  const handleDownloadVideo = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportProgress(0);
    setExportStatusText("Preparing 2:45 consolidated HD demo video...");

    try {
      await downloadConsolidatedDemoVideo((pct, status) => {
        setExportProgress(pct);
        setExportStatusText(status);
      });
      setDownloadReadyUrl("/api/download-demo-video");
    } catch (err: any) {
      console.error("Video export failed:", err);
      setExportStatusText(err?.message || "Failed to download video file.");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const formatMinSec = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = Math.min(100, (elapsedSec / totalDurationSec) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col my-auto max-h-[94vh]">
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  AgroPulse 3-Min Demo Walkthrough (2:45)
                </span>
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  {activeScene.timestamp}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {activeScene.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Switch between Interactive Walkthrough & Direct HD MP4 */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-900 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setPlayerView("interactive");
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition cursor-pointer ${
                  playerView === "interactive"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Interactive</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  stopAudio();
                  setPlayerView("mp4");
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition cursor-pointer ${
                  playerView === "mp4"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Film className="w-3 h-3" />
                <span>HD MP4</span>
              </button>
            </div>

            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadVideo}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition shadow-sm whitespace-nowrap cursor-pointer"
              title="Download consolidated 2:45 HD demo walkthrough video (.mp4)"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{exportProgress}%</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download MP4</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={exportDemoScriptPackage}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg border border-slate-700 hidden md:flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer"
              title="Download full 2:45 walkthrough script (.md)"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Script (.md)</span>
            </button>

            <button
              type="button"
              aria-label="Close demo player"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Export Progress Banner */}
        {isExporting && (
          <div className="bg-emerald-950/90 border-b border-emerald-800 px-6 py-2 flex items-center justify-between text-xs text-emerald-200">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              {exportStatusText}
            </span>
            <span className="font-mono tabular-nums font-bold text-emerald-400">
              {exportProgress}%
            </span>
          </div>
        )}

        {downloadReadyUrl && !isExporting && (
          <div className="bg-emerald-900/40 border-b border-emerald-700/60 px-6 py-2 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3-Min Demo Video downloaded!
            </span>
            <a
              href={downloadReadyUrl}
              download="AgroPulse_3Min_Demo_Walkthrough.mp4"
              className="font-bold underline text-white hover:text-emerald-200"
            >
              Save again
            </a>
          </div>
        )}

        <div className="overflow-y-auto flex-1">
          {playerView === "mp4" ? (
            /* Direct Embedded Consolidated 2:45 MP4 Video Player */
            <div className="bg-black flex flex-col">
              <div className="aspect-video w-full bg-slate-950 flex items-center justify-center relative">
                <video
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  src="/AgroPulse_3Min_Demo_Walkthrough.mp4"
                >
                  Your browser does not support HTML5 video playback.
                </video>
              </div>
              <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span>
                  Consolidated HD Walkthrough (1280×720 · 2:45 Runtime · Traversing all 5 live modules of agropulse.ai.studio)
                </span>
                <button
                  type="button"
                  onClick={() => setPlayerView("interactive")}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  Switch to Interactive Chapter Walkthrough →
                </button>
              </div>
            </div>
          ) : (
            /* Interactive 6-Scene Guided Stage */
            <div className="relative aspect-16/9 bg-slate-950 overflow-hidden flex flex-col justify-end min-h-[340px]">
              <img
                src={activeScene.slideImg}
                alt={activeScene.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-40 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/20" />

              {/* Center Stage Presentation Overlay */}
              <div className="relative z-10 p-5 sm:p-7 space-y-3.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-emerald-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {activeScene.persona}
                  </span>
                  <span className="text-xs font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                    {activeScene.focusTag}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {activeScene.title}
                </h2>

                {/* Live Narration Voiceover Display */}
                <div className="bg-slate-900/85 border border-slate-700/80 p-3.5 sm:p-4 rounded-xl backdrop-blur-md space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                      <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />
                      Voiceover Narration:
                    </span>
                    <span className="font-mono tabular-nums text-slate-400">
                      {formatMinSec(elapsedSec)} / {formatMinSec(totalDurationSec)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    "{activeScene.narrationVoiceover}"
                  </p>
                </div>

                {/* Key Takeaways */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {activeScene.keyTakeaways.map((point, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/75 border border-slate-800 p-2.5 rounded-lg flex items-start gap-2 text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clickable Progress Scrubber */}
              <div className="relative z-10 px-6 py-2">
                <div
                  onClick={handleScrubBarClick}
                  className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer"
                  title="Click to seek timeline"
                >
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Media Player Control Bar */}
              <div className="relative z-10 px-4 sm:px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-slate-950" />
                    ) : (
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handlePrevScene}
                    disabled={currentSceneIdx === 0}
                    className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextScene}
                    disabled={currentSceneIdx === THREE_MINUTE_DEMO_SCENES.length - 1}
                    className="p-2 rounded-lg text-slate-400 hover:text-white disabled:opacity-40 cursor-pointer"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-mono tabular-nums text-slate-300">
                    {formatMinSec(elapsedSec)}{" "}
                    <span className="text-slate-500">/ {formatMinSec(totalDurationSec)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextMuted = !isMuted;
                      setIsMuted(nextMuted);
                      if (nextMuted) {
                        stopAudio();
                      } else if (isPlaying) {
                        playSceneAudio(activeScene.narrationVoiceover);
                      }
                    }}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      isMuted
                        ? "bg-red-950/60 border-red-800 text-red-300"
                        : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">
                      {isMuted ? "Muted" : isSpeaking ? "Speaking" : "Voiceover On"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExploreCurrentScreen}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Explore Live Screen</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6-Scene Chapter Timeline */}
          <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Walkthrough Chapters (6 Scenes · 2:45 Total Runtime)
              </span>
              <span className="hidden sm:inline">Click any chapter to jump &amp; sync screen</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {THREE_MINUTE_DEMO_SCENES.map((scene, i) => {
                const isSelected = i === currentSceneIdx;
                return (
                  <button
                    key={scene.id}
                    type="button"
                    onClick={() => {
                      setPlayerView("interactive");
                      handleSelectScene(i);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected && playerView === "interactive"
                        ? "bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/40"
                        : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-mono">{scene.timestamp.split(" ")[0]}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          isSelected && playerView === "interactive"
                            ? "bg-emerald-500 text-slate-950 font-bold"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {scene.durationSec}s
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                      {scene.title}
                    </h4>
                    <div className="mt-1.5 flex items-center text-[10px] text-emerald-400 font-medium">
                      <span className="truncate">{scene.persona}</span>
                      <ChevronRight className="w-3 h-3 ml-auto shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
