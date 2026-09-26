import { ExternalLink, Linkedin, Play } from "lucide-react";
import { XLogo } from "@/components/SocialIcons";
import { useLang } from "@/lib/LanguageContext";

/** @param {string} href */
export function youtubeId(href) {
  try {
    const u = new URL(href);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (host === "youtube.com") {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const m = u.pathname.match(/^\/(?:shorts|live|embed)\/([\w-]{6,})/);
      return m ? m[1] : null;
    }
  } catch {
    // not a URL
  }
  return null;
}

/** @param {string} href @returns {"youtube" | "x" | "linkedin" | null} */
export function sourceKind(href) {
  if (youtubeId(href)) return "youtube";
  try {
    const host = new URL(href).hostname.replace(/^www\./, "");
    if (host === "x.com" || host === "twitter.com") return "x";
    if (host === "linkedin.com" || host.endsWith(".linkedin.com")) return "linkedin";
  } catch {
    // not a URL
  }
  return null;
}

/**
 * Rich card for a link that stands alone in a paragraph: a YouTube thumbnail
 * with a play button, or an X / LinkedIn "discussed on" card. No iframes.
 * @param {{ href: string, label: string }} props
 */
export default function SourceCard({ href, label }) {
  const { t } = useLang();
  const kind = sourceKind(href);
  const external = { href, target: "_blank", rel: "noopener noreferrer" };

  if (kind === "youtube") {
    const id = youtubeId(href);
    return (
      <a
        {...external}
        className="group not-prose my-6 block overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-video bg-black">
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg group-hover:scale-105 transition-transform">
              <Play className="h-7 w-7 translate-x-0.5 fill-white text-white" />
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <span className="flex-shrink-0 text-xs text-muted-foreground">{t.blog.watchOnYoutube}</span>
        </div>
      </a>
    );
  }

  const Icon = kind === "x" ? XLogo : Linkedin;
  return (
    <a
      {...external}
      className="not-prose my-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-background border border-border">
        <Icon className="h-5 w-5 text-foreground" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold uppercase tracking-wide text-primary">
          {kind === "x" ? t.blog.discussedOnX : t.blog.discussedOnLinkedIn}
        </span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
      </span>
      <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
    </a>
  );
}
