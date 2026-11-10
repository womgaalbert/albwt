import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Sparkles, Activity, Cpu, TrendingUp, Layers, Eye, Globe, ShoppingBag } from "lucide-react";
import InkImage from "./InkImage";

/**
 * Generative Motion Design Visualizers for AI / Data Science Projects
 */

function ForecastMotion({ color = "hsl(var(--primary))" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-between p-4">
      {/* Grid Lines */}
      <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="forecast-grid" width="30" height="20" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#forecast-grid)" />

        {/* Confidence Interval Shaded Area */}
        <motion.path
          d="M 20 120 Q 90 90, 160 110 T 260 70 L 360 40 L 360 110 L 260 90 Z"
          fill={color}
          fillOpacity="0.15"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Historical Curve */}
        <motion.path
          d="M 20 120 Q 90 90, 160 110 T 260 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="text-white/80"
          strokeDasharray="4 2"
        />

        {/* Forecasted Curve */}
        <motion.path
          d="M 260 70 Q 310 50, 360 40"
          fill="none"
          stroke={color}
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Moving Coordinate Target Point */}
        <motion.circle
          cx="260"
          cy="70"
          r="4"
          fill={color}
          animate={{
            cx: [260, 360, 260],
            cy: [70, 40, 70],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Telemetry Badge */}
      <div className="flex items-center justify-between text-[11px] font-mono text-white/90 z-10 bg-black/50 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 w-fit">
        <span className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5" style={{ color }} />
          ARIMA(2,1,2) · FRED 1939-2025
        </span>
        <span className="ml-3 text-teal-400 font-bold">Δ 104.2 GWh</span>
      </div>
    </div>
  );
}

function SensorMotion({ color = "hsl(var(--brand-blue))" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-between p-4">
      {/* 3-Channel Waveform Oscilloscope */}
      <svg className="w-full h-full opacity-60" viewBox="0 0 400 160" preserveAspectRatio="none">
        {/* Wave 1 - X Axis */}
        <motion.path
          d="M 0 50 Q 50 10, 100 50 T 200 50 T 300 50 T 400 50"
          fill="none"
          stroke={color}
          strokeWidth="2"
          animate={{
            d: [
              "M 0 50 Q 50 15, 100 50 T 200 50 T 300 50 T 400 50",
              "M 0 50 Q 50 85, 100 50 T 200 50 T 300 50 T 400 50",
              "M 0 50 Q 50 15, 100 50 T 200 50 T 300 50 T 400 50",
            ],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
        />
        {/* Wave 2 - Y Axis */}
        <motion.path
          d="M 0 80 Q 50 110, 100 80 T 200 80 T 300 80 T 400 80"
          fill="none"
          stroke="#10b981"
          strokeWidth="1.5"
          opacity="0.8"
          animate={{
            d: [
              "M 0 80 Q 50 110, 100 80 T 200 80 T 300 80 T 400 80",
              "M 0 80 Q 50 45, 100 80 T 200 80 T 300 80 T 400 80",
              "M 0 80 Q 50 110, 100 80 T 200 80 T 300 80 T 400 80",
            ],
          }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
        {/* Wave 3 - Z Axis Accelerometer Pulse */}
        <motion.path
          d="M 0 110 Q 50 90, 100 110 T 200 110 T 300 110 T 400 110"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          opacity="0.7"
          animate={{
            d: [
              "M 0 110 Q 50 90, 100 110 T 200 110 T 300 110 T 400 110",
              "M 0 110 Q 50 135, 100 110 T 200 110 T 300 110 T 400 110",
              "M 0 110 Q 50 90, 100 110 T 200 110 T 300 110 T 400 110",
            ],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
        />
      </svg>

      <div className="flex items-center justify-between text-[11px] font-mono text-white/90 z-10 bg-black/50 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 w-fit">
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          Multimodal Sensor Fusion · Triaxial IMU
        </span>
        <span className="ml-3 text-emerald-400 font-bold">Class: 98.4% Conf</span>
      </div>
    </div>
  );
}

function AttentionMotion({ color = "#8b5cf6" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-between p-4">
      {/* Self-Attention Beam Matrix */}
      <svg className="w-full h-full" viewBox="0 0 300 140">
        {[40, 90, 140, 190, 240].map((x1, i) => (
          <g key={i}>
            {/* Input sequence tokens */}
            <circle cx={x1} cy="30" r="4" fill="hsl(var(--primary))" opacity="0.8" />
            {/* Output sequence tokens */}
            <circle cx={x1} cy="110" r="4" fill={color} opacity="0.9" />

            {/* Pulsing attention connection beams */}
            {[40, 90, 140, 190, 240].map((x2, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={x1}
                y1="30"
                x2={x2}
                y2="110"
                stroke={color}
                strokeWidth={i === j ? "1.8" : "0.5"}
                initial={{ opacity: 0.1 }}
                animate={{
                  opacity: i === j ? [0.4, 0.9, 0.4] : [0.05, 0.25, 0.05],
                }}
                transition={{
                  duration: 2,
                  delay: (i + j) * 0.15,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="flex items-center justify-between text-[11px] font-mono text-white/90 z-10 bg-black/50 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 w-fit">
        <span className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          Multi-Head Attention · 8 Heads
        </span>
        <span className="ml-3 text-purple-300 font-bold">Q × K^T / √d_k</span>
      </div>
    </div>
  );
}

function VisionMotion({ color = "#f59e0b" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-between p-4">
      {/* CNN Convolutional Kernel Scanner & Detection Boxes */}
      <div className="relative w-full h-full">
        {/* Moving Convolutional Kernel Frame */}
        <motion.div
          className="absolute border-2 border-dashed rounded-lg pointer-events-none"
          style={{ borderColor: color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}
          animate={{
            top: ["15%", "45%", "25%", "15%"],
            left: ["15%", "55%", "35%", "15%"],
            width: ["80px", "110px", "90px", "80px"],
            height: ["80px", "90px", "70px", "80px"],
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -top-4 left-0 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-amber-400">
            Conv2D 3x3 · mAP 0.947
          </div>
        </motion.div>

        {/* Static Grid Nodes */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-15">
          {[...Array(24)].map((_, idx) => (
            <div key={idx} className="border border-white/40" />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-white/90 z-10 bg-black/50 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 w-fit">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          Custom CNN · Dropout + Regularization
        </span>
        <span className="ml-3 text-amber-300 font-bold">mAP: 0.947</span>
      </div>
    </div>
  );
}

function PipelineMotion({ color = "#10b981" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-between p-4">
      {/* MLOps Pipeline Flow */}
      <div className="relative w-full h-full flex items-center justify-around px-4">
        {["Unity", "Workflow", "MLflow", "Serving"].map((stage, i) => (
          <div key={stage} className="flex flex-col items-center gap-1">
            <motion.div
              className="w-8 h-8 rounded-lg border border-white/20 bg-black/40 backdrop-blur flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-md"
              animate={{
                borderColor: [color, "rgba(255,255,255,0.2)", color],
                scale: [1, 1.08, 1],
              }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
            >
              0{i + 1}
            </motion.div>
            <span className="text-[10px] font-mono text-white/80">{stage}</span>
          </div>
        ))}

        {/* Animated Connecting Particle Line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-3 h-0.5 bg-white/20 -z-10">
          <motion.div
            className="w-12 h-full rounded-full shadow-lg"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
            animate={{ left: ["0%", "85%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-white/90 z-10 bg-black/50 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 w-fit">
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Databricks Lakehouse · Unity Catalog
        </span>
        <span className="ml-3 text-emerald-300 font-bold">Status: Active</span>
      </div>
    </div>
  );
}

function BrowserMotion({ color = "#6366f1" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-between p-4">
      {/* Browser Window Mockup */}
      <div className="relative w-full h-full rounded-xl border border-white/20 bg-black/30 backdrop-blur p-3 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 pb-2 border-b border-white/10">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <div className="ml-2 text-[10px] font-mono text-white/60">cmavocat.ca/triage</div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          <motion.div
            className="px-3 py-1.5 rounded-lg border border-indigo-400/30 bg-indigo-500/10 text-xs font-mono text-indigo-300"
            animate={{ opacity: [0.7, 1, 0.7], y: [0, -2, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            AI Document Classification · Fast Routing
          </motion.div>
          <div className="text-[10px] text-white/60 font-mono">Routing latency: 0.4s vs 15m manual</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-white/90 z-10 bg-black/50 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 w-fit">
        <span className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          Canadian Legal Tech Web Platform
        </span>
        <span className="ml-3 text-indigo-300 font-bold">100% Production</span>
      </div>
    </div>
  );
}

function RestaurantMotion({ color = "#e11d48" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-between p-4">
      {/* Restaurant ordering simulation */}
      <div className="relative w-full h-full rounded-xl border border-white/20 bg-black/40 backdrop-blur p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            <span className="ml-2 text-[10px] font-mono text-white/70">mialinegiftedhands.com</span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Yaoundé · Obili
          </span>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 py-2">
          {/* Animated food ordering cart badge */}
          <motion.div
            className="px-3 py-1.5 rounded-lg border border-rose-400/30 bg-rose-950/40 text-xs font-mono text-rose-200 flex items-center gap-2 shadow-lg"
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
            <span>Panier: Poulet DG + Ndolé · 6,500 FCFA</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Envoi instantané sur WhatsApp (+237)
          </motion.div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-white/60 pt-1 border-t border-white/5">
          <span>45 plats au menu (FR / EN)</span>
          <span>7j/7 · 7h–23h</span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-white/90 z-10 bg-black/50 backdrop-blur px-2.5 py-1 rounded-md border border-white/10 w-fit mt-2">
        <span className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-rose-400" />
          Resto-Bar & Commande Directe
        </span>
        <span className="ml-3 text-rose-300 font-bold">En Ligne</span>
      </div>
    </div>
  );
}

/**
 * ProjectMotionMedia Component
 *
 * Renders project visual as an interactive video or generative motion design graphic.
 * Provides controls for motion toggle, video playback, and lightbox modal.
 */
export default function ProjectMotionMedia({
  project,
  className = "w-full h-full",
  containerClassName = "relative h-60 overflow-hidden",
  priority = false,
  zoomable = true,
}) {
  const [motionActive, setMotionActive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const hasVideo = Boolean(project?.video);
  const motionType = project?.motionType || "forecast";

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={`group ${containerClassName}`}>
      {/* Base Layer: Native Video OR Static Image */}
      {hasVideo ? (
        <div className="relative w-full h-full bg-black">
          <video
            ref={videoRef}
            src={project.video}
            poster={project.image}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <InkImage
          src={project.image}
          alt={project.alt}
          caption={project.title}
          width={600}
          height={400}
          priority={priority}
          zoomable={zoomable}
          className={className}
        />
      )}

      {/* Motion Design Overlay Layer (Active when no video or as supplemental telemetry) */}
      <AnimatePresence>
        {motionActive && !hasVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 pointer-events-none"
          >
            {motionType === "forecast" && <ForecastMotion color={project.color} />}
            {motionType === "sensor" && <SensorMotion color={project.color} />}
            {motionType === "attention" && <AttentionMotion color={project.color} />}
            {motionType === "vision" && <VisionMotion color={project.color} />}
            {motionType === "pipeline" && <PipelineMotion color={project.color} />}
            {motionType === "browser" && <BrowserMotion color={project.color} />}
            {motionType === "restaurant" && <RestaurantMotion color={project.color} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

      {/* Top Left: Category Badge */}
      <div className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-2">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-card/85 backdrop-blur shadow-sm"
          style={{ color: project.color, borderColor: `color-mix(in srgb, ${project.color} 40%, transparent)` }}
        >
          {project.categoryLabel || project.category}
        </span>
      </div>

      {/* Top Right: Interactive Motion / Video Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5">
        {hasVideo ? (
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur border border-white/10 rounded-full px-2 py-0.5">
            <button
              type="button"
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors p-1"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="text-white hover:text-primary transition-colors p-1"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setMotionActive(!motionActive)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/85 backdrop-blur border border-border text-xs font-mono text-muted-foreground hover:text-foreground transition-colors shadow-sm"
            aria-label="Toggle motion visualization"
            title="Toggle motion simulation"
          >
            <Sparkles className={`w-3 h-3 ${motionActive ? "text-primary animate-pulse" : "opacity-40"}`} />
            <span>{motionActive ? "Motion: ON" : "Static"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
