import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Layers } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import InkImage from "./InkImage";
import LazyVideo from "./LazyVideo";
import VideoDialog from "./VideoDialog";

function PipelineMotion({ color = "hsl(var(--chart-1))" }) {
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
      </div>
    </div>
  );
}

/**
 * The visual at the top of a project card: a lazy silent loop when the project
 * has one, otherwise its image. Projects with a full presentation get a button
 * that opens it with sound.
 */
export default function ProjectMotionMedia({
  project,
  className = "w-full h-full",
  containerClassName = "relative h-60 overflow-hidden",
  priority = false,
  zoomable = true,
}) {
  const { t, lang } = useLang();
  const reducedMotion = useReducedMotion();
  const [fullVideoOpen, setFullVideoOpen] = useState(false);

  // `loop` is the small silent card clip; `video` is the full presentation.
  const hasVideo = Boolean(project?.loop);
  const hasFullVideo = Boolean(project?.video);
  const showPipeline = !hasVideo && !reducedMotion && project?.motionType === "pipeline";
  const altText = typeof project?.alt === "string" ? project.alt : project?.alt?.[lang];
  const label = altText || project?.title || "";

  return (
    <div className={`group ${containerClassName}`}>
      {hasVideo ? (
        <div className="relative w-full h-full bg-black">
          <LazyVideo src={project.loop} poster={project.image} label={label} />
        </div>
      ) : (
        <InkImage
          src={project.image}
          alt={label}
          caption={project.title}
          width={600}
          height={400}
          priority={priority}
          zoomable={zoomable}
          className={className}
        />
      )}

      {showPipeline && (
        <div className="absolute inset-0 pointer-events-none">
          <PipelineMotion color={project.color} />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

      <div className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-2">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-card/85 backdrop-blur shadow-sm"
          style={{ color: `color-mix(in srgb, ${project.color} 55%, hsl(var(--foreground)))`, borderColor: `color-mix(in srgb, ${project.color} 40%, transparent)` }}
        >
          {project.categoryLabel || project.category}
        </span>
      </div>

      {hasFullVideo && (
        <>
          <div className="absolute top-2 right-2 z-20">
            <button
              type="button"
              onClick={() => setFullVideoOpen(true)}
              className="inline-flex items-center gap-1.5 min-h-11 px-3.5 rounded-full bg-black/65 backdrop-blur border border-white/15 text-white text-xs font-semibold transition-colors hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              {t.media.watchVideo}
            </button>
          </div>
          <VideoDialog
            open={fullVideoOpen}
            onClose={() => setFullVideoOpen(false)}
            src={project.video}
            poster={project.image}
            title={label}
          />
        </>
      )}
    </div>
  );
}
