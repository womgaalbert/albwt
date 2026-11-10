import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useLang } from "@/lib/LanguageContext";

const IDLE_MS = 25000;
const POSTER = "/images/agent-teardown-poster.webp";
const SLOW_FRAME_MS = 26;
const SAMPLE_FRAMES = 50;
const DRAG_SPEED = 0.006;
const DEFAULT_AZIMUTH = -0.5;
const DEFAULT_ELEVATION = 0.44;

function canRender3D() {
  const connection = /** @type {any} */ (navigator).connection;
  if (connection?.saveData) return false;
  try {
    return Boolean(document.createElement("canvas").getContext("webgl2"));
  } catch {
    return false;
  }
}

// Reads the site's theme tokens so the model always matches the page.
function readPalette() {
  const styles = getComputedStyle(document.documentElement);
  const token = (name) => `hsl(${styles.getPropertyValue(name).trim().replace(/\s+/g, ",")})`;
  const isDark = document.documentElement.classList.contains("dark");
  return {
    accent: token("--primary"),
    body: token("--muted-foreground"),
    plate: token("--secondary"),
    dim: token("--border"),
    sky: "hsl(0,0%,100%)",
    floor: token("--muted"),
    shadow: isDark ? 0.4 : 0.16,
  };
}

/** Explorable 3D model of the repository-analysis agent. Loads only near the viewport. */
export default function AgentTeardown() {
  const { t } = useLang();
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const copy = t.teardown;

  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  // The render loop reads these without re-rendering React on every frame.
  const control = useRef({ selected: null, lastInput: 0, azimuth: DEFAULT_AZIMUTH, elevation: DEFAULT_ELEVATION, visible: false });

  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [supported] = useState(canRender3D);

  const posterOnly = reducedMotion || !supported || failed;

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        control.current.visible = entry.isIntersecting;
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "400px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (posterOnly || !near || !canvasRef.current) return undefined;
    let cancelled = false;
    let frameId = 0;
    let resizeObserver;
    let scene;

    import("./scene.js")
      .then(({ createScene, tourState, STAGE_COUNT }) => {
        if (cancelled || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const start = performance.now();
        scene = createScene(canvas, readPalette(), {
          tier: window.matchMedia("(max-width: 767px)").matches ? 1 : 0,
        });
        sceneRef.current = scene;

        resizeObserver = new ResizeObserver(([entry]) => scene.resize(entry.contentRect.width, entry.contentRect.height));
        resizeObserver.observe(canvas.parentElement);

        const current = { focus: 0, explode: 0 };
        let shownStage = 0;
        let previous = start;
        let sampleFrames = 0;
        let sampleTime = 0;

        const frame = (now) => {
          frameId = requestAnimationFrame(frame);
          if (!control.current.visible || document.hidden) {
            previous = now;
            return;
          }
          const delta = Math.min(100, now - previous);
          previous = now;

          // Step down a quality tier when frames run slow on this device.
          sampleFrames += 1;
          sampleTime += delta;
          if (sampleFrames === SAMPLE_FRAMES) {
            if (sampleTime / SAMPLE_FRAMES > SLOW_FRAME_MS && scene.quality < scene.lowestQuality) {
              scene.setQuality(scene.quality + 1);
            }
            sampleFrames = 0;
            sampleTime = 0;
          }

          const c = control.current;
          if (c.selected !== null && now - c.lastInput > IDLE_MS) c.selected = null;

          const time = (now - start) / 1000;
          const target = c.selected === null ? tourState(time) : { active: c.selected, focus: c.selected, explode: 1 };
          const blend = 1 - Math.exp(-delta / 170);
          current.focus += (target.focus - current.focus) * blend;
          current.explode += (target.explode - current.explode) * blend;

          if (target.active !== shownStage && target.active < STAGE_COUNT) {
            shownStage = target.active;
            setActiveStage(shownStage);
          }

          scene.renderAt({
            time,
            active: target.active,
            focus: current.focus,
            explode: current.explode,
            azimuth: c.azimuth,
            elevation: c.elevation,
          });
          setReady(true);
        };
        frameId = requestAnimationFrame(frame);
      })
      .catch(() => setFailed(true));

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      scene?.dispose();
      sceneRef.current = null;
    };
  }, [near, posterOnly]);

  useEffect(() => {
    sceneRef.current?.setPalette(readPalette());
  }, [resolvedTheme]);

  const selectStage = (index) => {
    control.current.selected = index;
    control.current.lastInput = performance.now();
    setActiveStage(index);
  };

  const onPointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const c = control.current;
    const startX = event.clientX;
    const startY = event.clientY;
    const startAzimuth = c.azimuth;
    const startElevation = c.elevation;
    c.lastInput = performance.now();
    if (c.selected === null) c.selected = activeStage;

    const target = event.currentTarget;
    const onMove = (e) => {
      c.azimuth = startAzimuth - (e.clientX - startX) * DRAG_SPEED;
      c.elevation = Math.min(1.2, Math.max(0.12, startElevation + (e.clientY - startY) * DRAG_SPEED));
      c.lastInput = performance.now();
    };
    const onUp = () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerup", onUp);
      target.removeEventListener("pointercancel", onUp);
    };
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerup", onUp);
    target.addEventListener("pointercancel", onUp);
  };

  const stage = copy.stages[activeStage];

  return (
    <div ref={wrapperRef} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="relative aspect-[4/3] sm:aspect-[16/9] bg-gradient-to-b from-muted/60 to-background">
        <img
          src={POSTER}
          alt={copy.posterAlt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready && !posterOnly ? "opacity-0" : "opacity-100"}`}
        />
        {!posterOnly && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            onPointerDown={onPointerDown}
            className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-pan-y transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
          />
        )}
        {!posterOnly && (
          <p className="pointer-events-none absolute bottom-3 left-4 text-xs text-muted-foreground bg-background/70 backdrop-blur rounded-full px-3 py-1">
            {copy.hint}
          </p>
        )}
      </div>

      <div className="p-5 md:p-6 border-t border-border">
        <div role="group" aria-label={copy.stagesLabel} className="flex flex-wrap gap-2 mb-4">
          {copy.stages.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-pressed={index === activeStage}
              onClick={() => selectStage(index)}
              className={`min-h-11 px-3.5 rounded-full border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                index === activeStage
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-background text-muted-foreground border-border hover:border-primary hover:text-foreground"
              }`}
            >
              {index + 1}. {item.name}
            </button>
          ))}
        </div>
        <div aria-live="polite">
          <h3 className="text-foreground font-bold text-lg">{stage.name}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mt-1">{stage.role}</p>
        </div>
      </div>
    </div>
  );
}
