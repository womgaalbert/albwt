import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

// Plays a full presentation with sound, on request only. Same native <dialog>
// approach as ImageLightbox. The <video> unmounts on close, which stops playback.
export default function VideoDialog({ open, onClose, src, poster, title }) {
  const { t } = useLang();
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        e.stopPropagation();
        if (e.target === ref.current) onClose();
      }}
      aria-label={title}
      className="lightbox bg-transparent p-0 max-w-[min(1200px,94vw)] w-full"
    >
      {open && (
        <div className="relative bg-black border border-border rounded-2xl overflow-hidden shadow-2xl">
          <video
            src={src}
            poster={poster}
            aria-label={title}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full max-h-[85dvh] object-contain bg-black"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.media.closeVideo}
            className="absolute top-3 right-3 w-11 h-11 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </dialog>
  );
}
