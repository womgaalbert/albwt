import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Activity } from "lucide-react";
import { blogCoverSrc } from "@/lib/blog";
import LazyVideo from "./LazyVideo";

/**
 * Maps blog post slugs to appropriate motion design simulation types or video loops
 */
function getBlogMotionConfig(post) {
  const slug = post?.slug || "";
  const cat = (post?.category || "").toLowerCase();

  // If the post has a specific video explicitly attached, use it
  if (post?.video) {
    return {
      type: "video",
      video: post.video,
      badge: "Motion Video",
      color: "hsl(var(--primary))",
    };
  }

  if (slug.includes("agent") || slug.includes("serverless") || cat.includes("opinion")) {
    return {
      type: "network",
      video: null,
      badge: "Agent Network · Live Sim",
      color: "#2dd4bf",
    };
  }
  if (slug.includes("arima") || slug.includes("forecasting") || slug.includes("time-series")) {
    return {
      type: "forecast",
      video: null,
      badge: "Time-Series · Dynamic Wave",
      color: "#38bdf8",
    };
  }
  if (slug.includes("cnn") || slug.includes("cifar") || slug.includes("vision")) {
    return {
      type: "vision",
      video: null,
      badge: "Computer Vision · Feature Scan",
      color: "#f59e0b",
    };
  }
  if (slug.includes("mlops") || slug.includes("pipeline")) {
    return {
      type: "pipeline",
      video: null,
      badge: "MLOps Pipeline · Active DAG",
      color: "#10b981",
    };
  }
  if (slug.includes("nlp") || slug.includes("distilbert") || slug.includes("transformer") || slug.includes("gpt")) {
    return {
      type: "attention",
      video: null,
      badge: "Attention Beams · Token Weights",
      color: "#a855f7",
    };
  }

  return {
    type: "network",
    video: null,
    badge: "AI Simulation · Production",
    color: "#2dd4bf",
  };
}

export default function BlogMotionMedia({
  post,
  title,
  alt,
  className = "h-52 w-full",
  priority = false,
}) {
  const [motionActive, setMotionActive] = useState(true);

  const config = getBlogMotionConfig(post);
  const cover = blogCoverSrc(post);

  return (
    <div className={`relative overflow-hidden group/media bg-black/60 ${className}`}>
      {/* Base Layer: Video or Image */}
      {config.video ? (
        <LazyVideo
          src={config.video}
          poster={cover || undefined}
          label={alt || title || ""}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105"
        />
      ) : cover ? (
        <img
          src={cover}
          alt={alt || title || ""}
          loading={priority ? "eager" : "lazy"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/media:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-card to-background flex items-center justify-center">
          <Activity className="w-8 h-8 text-primary/40 animate-pulse" />
        </div>
      )}

      {/* Dynamic Motion Graphic Overlays for Non-Video or Supplemental Telemetry */}
      <AnimatePresence>
        {motionActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Dynamic Network / Neural Constellation Overlay */}
            {config.type === "network" && (
              <svg className="w-full h-full opacity-60" viewBox="0 0 320 160" preserveAspectRatio="none">
                <motion.line
                  x1="40" y1="40" x2="160" y2="80"
                  stroke={config.color}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  animate={{ strokeDashoffset: [0, -14] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.line
                  x1="160" y1="80" x2="280" y2="50"
                  stroke={config.color}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  animate={{ strokeDashoffset: [0, -14] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                />
                <motion.line
                  x1="160" y1="80" x2="200" y2="130"
                  stroke={config.color}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  animate={{ strokeDashoffset: [0, 14] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                {[
                  { cx: 40, cy: 40, r: 4 },
                  { cx: 160, cy: 80, r: 6 },
                  { cx: 280, cy: 50, r: 4 },
                  { cx: 200, cy: 130, r: 5 },
                ].map((node, i) => (
                  <g key={i}>
                    <motion.circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.r * 2}
                      fill={config.color}
                      opacity={0.25}
                      animate={{ scale: [1, 1.8, 1], opacity: [0.35, 0.05, 0.35] }}
                      transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }}
                    />
                    <circle cx={node.cx} cy={node.cy} r={node.r} fill={config.color} />
                  </g>
                ))}
              </svg>
            )}

            {/* Dynamic Transformer Attention Beams Overlay */}
            {config.type === "attention" && (
              <svg className="w-full h-full opacity-60" viewBox="0 0 320 160" preserveAspectRatio="none">
                {[[30, 120, 100, 40], [100, 40, 220, 40], [100, 40, 180, 120], [220, 40, 290, 110]].map(([x1, y1, x2, y2], i) => (
                  <motion.line
                    key={i}
                    x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={config.color}
                    strokeWidth="1.5"
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: [0.2, 0.85, 0.2] }}
                    transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                  />
                ))}
                {[
                  { cx: 30, cy: 120 },
                  { cx: 100, cy: 40 },
                  { cx: 220, cy: 40 },
                  { cx: 180, cy: 120 },
                  { cx: 290, cy: 110 },
                ].map((token, i) => (
                  <g key={i}>
                    <motion.circle
                      cx={token.cx}
                      cy={token.cy}
                      r="4"
                      fill={config.color}
                      animate={{ r: [3.5, 5, 3.5] }}
                      transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity }}
                    />
                  </g>
                ))}
              </svg>
            )}

            {/* Dynamic Forecast Wave Overlay */}
            {config.type === "forecast" && (
              <svg className="w-full h-full opacity-60" viewBox="0 0 300 120" preserveAspectRatio="none">
                <motion.path
                  d="M 10 90 Q 60 40, 120 70 T 220 30 T 290 20"
                  fill="none"
                  stroke={config.color}
                  strokeWidth="2.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="220"
                  cy="30"
                  r="4"
                  fill={config.color}
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </svg>
            )}

            {/* Dynamic CNN Scanner Overlay */}
            {config.type === "vision" && (
              <motion.div
                className="absolute border border-dashed border-amber-400/80 rounded"
                style={{ background: "color-mix(in srgb, #f59e0b 10%, transparent)" }}
                animate={{
                  top: ["20%", "40%", "20%"],
                  left: ["20%", "50%", "20%"],
                  width: ["60px", "80px", "60px"],
                  height: ["60px", "70px", "60px"],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Dynamic MLOps Flow Overlay */}
            {config.type === "pipeline" && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500/20">
                <motion.div
                  className="w-8 h-full bg-emerald-400 rounded-full"
                  style={{ boxShadow: "0 0 8px #10b981" }}
                  animate={{ left: ["0%", "80%", "0%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/85 via-transparent to-transparent" />

      {/* Top Left: Video / Motion Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-black/60 backdrop-blur border border-white/10 text-white shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          {config.badge}
        </span>
      </div>

      {/* Top Right: Controls */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1">
        {!config.video && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMotionActive(!motionActive);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur border border-white/10 text-[10px] font-mono text-white/80 hover:text-white transition-colors"
            title="Toggle motion simulation"
          >
            <Sparkles className={`w-3 h-3 ${motionActive ? "text-primary" : "opacity-40"}`} />
            <span>{motionActive ? "Motion" : "Static"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
