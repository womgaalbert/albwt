import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import ImageLightbox from "./ImageLightbox";
import MembersGate from "./MembersGate";

const PRIVATE_BUCKET = "private-media";

function resolveText(value, lang) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value.en ?? "";
}

/**
 * Accessible image with a live ink-drawing treatment.
 *
 * - The original image sits underneath; an identical copy on top is run through
 *   the global #ink-filter (see InkFilterDefs). Hover / keyboard focus on the
 *   nearest `.ink-reveal` ancestor fades the ink layer out to reveal colour.
 * - `alt` / `caption` accept a string or { en, fr }.
 * - `access="members"`: signed-out visitors see a blurred preview and a
 *   magic-link gate. With `storagePath`, the real file comes from the private
 *   Supabase bucket through a short-lived signed URL.
 *
 * @param {object} props
 * @param {string} [props.src]
 * @param {string | {en: string, fr: string}} [props.alt]
 * @param {string | {en: string, fr: string}} [props.caption]
 * @param {number} [props.width]
 * @param {number} [props.height]
 * @param {boolean} [props.priority]
 * @param {boolean} [props.ink]
 * @param {boolean} [props.zoomable]
 * @param {"public" | "members"} [props.access]
 * @param {string} [props.storagePath]
 * @param {string} [props.className]
 * @param {string} [props.imgClassName]
 */
export default function InkImage({
  src,
  alt,
  caption,
  width,
  height,
  priority = false,
  ink = true,
  zoomable = false,
  access = "public",
  storagePath,
  className = "",
  imgClassName = "object-cover",
}) {
  const { lang, t } = useLang();
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [signedUrl, setSignedUrl] = useState(null);

  const gated = access === "members" && !isAuthenticated;
  const altText = resolveText(alt, lang);
  const captionText = resolveText(caption, lang);

  useEffect(() => {
    if (access !== "members" || !isAuthenticated || !storagePath) return;
    let active = true;
    supabase.storage.from(PRIVATE_BUCKET).createSignedUrl(storagePath, 60 * 60)
      .then(({ data }) => { if (active && data?.signedUrl) setSignedUrl(data.signedUrl); });
    return () => { active = false; };
  }, [access, isAuthenticated, storagePath]);

  const displaySrc = signedUrl || src;
  if (!displaySrc) return null;

  const imgProps = {
    src: displaySrc,
    width,
    height,
    loading: /** @type {"eager" | "lazy"} */ (priority ? "eager" : "lazy"),
    decoding: /** @type {"async"} */ ("async"),
    draggable: false,
  };

  return (
    <div className={`ink-image ink-reveal relative overflow-hidden ${className}`}>
      <img {...imgProps} alt={altText} className={`w-full h-full ${imgClassName} ${gated ? "blur-md scale-105" : ""}`} />
      {ink && !gated && (
        <img {...imgProps} alt="" aria-hidden="true" className={`ink-layer absolute inset-0 w-full h-full ${imgClassName}`} />
      )}

      {zoomable && !gated && (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t.media.enlarge.replace("{alt}", altText)}
            className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-ring"
          >
            <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground opacity-0 transition-opacity ink-zoom-hint">
              <Maximize2 className="w-4 h-4" aria-hidden="true" />
            </span>
          </button>
          <ImageLightbox open={open} onClose={() => setOpen(false)} src={displaySrc} alt={altText} caption={captionText} />
        </>
      )}

      {gated && <MembersGate />}
    </div>
  );
}
