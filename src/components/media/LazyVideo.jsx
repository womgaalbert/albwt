import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const noop = () => {};

function wantsReducedData() {
  const connection = /** @type {any} */ (navigator).connection;
  return Boolean(connection?.saveData);
}

/**
 * Silent looping video that costs nothing until it is near the viewport.
 *
 * The source attaches only when the element comes within 200px of the screen,
 * and playback stops again when it leaves. Visitors who prefer reduced motion
 * or reduced data get the poster image instead.
 */
export default function LazyVideo({ src, poster, label, className = "w-full h-full object-cover" }) {
  const { t } = useLang();
  const reducedMotion = useReducedMotion();
  const [reducedData] = useState(wantsReducedData);
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const [near, setNear] = useState(false);
  const [attached, setAttached] = useState(false);
  const [paused, setPaused] = useState(false);

  const posterOnly = reducedMotion || reducedData;

  useEffect(() => {
    if (posterOnly || !wrapperRef.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (entry.isIntersecting) setAttached(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [posterOnly]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !attached) return;
    if (near && !paused) {
      video.muted = true;
      video.play()?.catch(noop);
    } else {
      video.pause();
    }
  }, [attached, near, paused]);

  if (posterOnly) {
    return poster ? <img src={poster} alt={label} loading="lazy" decoding="async" className={className} /> : null;
  }

  const togglePaused = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setPaused((value) => !value);
  };

  return (
    <div ref={wrapperRef} className="relative w-full h-full">
      <video
        ref={videoRef}
        src={attached ? src : undefined}
        poster={poster}
        aria-label={label}
        preload="none"
        loop
        muted
        playsInline
        className={className}
      />
      <button
        type="button"
        onClick={togglePaused}
        aria-label={paused ? t.media.playVideo : t.media.pauseVideo}
        aria-pressed={paused}
        className="absolute bottom-1 right-1 z-20 w-11 h-11 flex items-center justify-center rounded-full text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-black/60 backdrop-blur border border-white/15 transition-colors hover:bg-black/80">
          {paused ? <Play className="w-3.5 h-3.5" aria-hidden="true" /> : <Pause className="w-3.5 h-3.5" aria-hidden="true" />}
        </span>
      </button>
    </div>
  );
}
