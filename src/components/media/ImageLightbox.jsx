import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

// Native <dialog>: showModal() gives focus trapping, Esc-to-close and a backdrop for free.
export default function ImageLightbox({ open, onClose, src, alt, caption }) {
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
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-label={alt}
      className="lightbox bg-transparent p-0 max-w-[min(1200px,94vw)] w-full"
    >
      {open && (
        <figure className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
          <img src={src} alt={alt} className="w-full max-h-[80vh] object-contain bg-background" />
          {caption && <figcaption className="px-5 py-3 text-sm text-muted-foreground">{caption}</figcaption>}
          <button
            type="button"
            onClick={onClose}
            aria-label={t.media.close}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            autoFocus
          >
            <X className="w-5 h-5" />
          </button>
        </figure>
      )}
    </dialog>
  );
}
