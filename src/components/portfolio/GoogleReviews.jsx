import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ExternalLink, PenLine } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { supabase } from "@/lib/supabase";
import { GOOGLE_PROFILE_URL, GOOGLE_REVIEW_URL, GOOGLE_REVIEWS_ENABLED } from "@/lib/google";
import { GoogleLogo } from "@/components/SocialIcons";

/** @param {{ value: number, className?: string }} props */
function Stars({ value, className = "w-4 h-4" }) {
  return (
    <div className="flex gap-0.5" aria-label={`${value.toFixed(1)} / 5`} role="img">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${className} ${i < Math.round(value) ? "fill-amber-400 text-amber-700 dark:text-amber-400" : "text-muted-foreground/40"}`}
        />
      ))}
    </div>
  );
}

/** "Leave a Google review" button — renders nothing until a review link is known. */
export function GoogleReviewButton({ href = GOOGLE_REVIEW_URL, className = "" }) {
  const { t } = useLang();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm font-semibold hover:border-primary/50 transition-colors ${className}`}
    >
      <GoogleLogo className="w-4 h-4" />
      {t.googleReviews.leaveReview}
      <PenLine className="w-3.5 h-3.5 opacity-60" />
    </a>
  );
}

/**
 * Live Google Business Profile rating + reviews, fetched through the
 * `google-reviews` Edge Function. Hidden entirely when disabled, loading,
 * or when there is nothing to show.
 */
export default function GoogleReviews() {
  const { t, lang } = useLang();
  const [data, setData] = useState(/** @type {any} */ (null));

  useEffect(() => {
    if (!GOOGLE_REVIEWS_ENABLED) return;
    let cancelled = false;
    supabase.functions
      .invoke("google-reviews", { body: { lang } })
      .then(({ data, error }) => {
        if (!cancelled && !error && data?.rating) setData(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (!data) return null;

  const profileUrl = GOOGLE_PROFILE_URL || data.mapsUri;
  const reviewUrl = GOOGLE_REVIEW_URL || data.writeReviewUri;
  const reviews = data.reviews.filter((r) => r.text).slice(0, 3);

  return (
    <section className="py-24" aria-labelledby="google-reviews-title">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
            {t.googleReviews.badge}
          </span>
          <h2 id="google-reviews-title" className="text-3xl md:text-4xl font-black mt-3 text-foreground">
            {t.googleReviews.title}
          </h2>
          <div className="mt-6 inline-flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-3">
            <GoogleLogo className="w-6 h-6" />
            <span className="text-2xl font-black text-foreground">{data.rating.toFixed(1)}</span>
            <Stars value={data.rating} className="w-5 h-5" />
            <span className="text-muted-foreground text-sm">
              {t.googleReviews.basedOn.replace("{n}", String(data.count))}
            </span>
          </div>
        </motion.div>

        {reviews.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  {r.photoUri ? (
                    <img src={r.photoUri} alt="" width="40" height="40" loading="lazy" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground">
                      {r.author.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0">
                    {r.authorUri ? (
                      <a href={r.authorUri} target="_blank" rel="noopener noreferrer" className="text-foreground font-semibold text-sm hover:underline truncate block">
                        {r.author}
                      </a>
                    ) : (
                      <p className="text-foreground font-semibold text-sm truncate">{r.author}</p>
                    )}
                    <p className="text-muted-foreground text-xs">{r.relativeTime}</p>
                  </div>
                  <GoogleLogo className="w-4 h-4 ml-auto flex-shrink-0" />
                </div>
                <Stars value={r.rating} />
                <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-6">{r.text}</p>
                {r.uri && (
                  <a href={r.uri} target="_blank" rel="noopener noreferrer" className="text-xs font-medium inline-flex items-center gap-1 hover:underline" style={{ color: "hsl(var(--primary))" }}>
                    {t.googleReviews.readMore} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <GoogleReviewButton href={reviewUrl} />
          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.googleReviews.seeAll} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
