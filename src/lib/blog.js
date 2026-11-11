// Older rows pointed cover_image at placehold.co; those map to the local SVG covers.
export function blogCoverSrc(post) {
  if (!post?.cover_image) return null;
  return post.cover_image.includes("placehold.co") ? `/images/blog/${post.slug}.svg` : post.cover_image;
}

/**
 * Blog covers that have a silent motion loop, keyed by slug. Each loop is a
 * camera move over the post's real figures, rendered by media-studio; the
 * poster shows the same frame the loop starts from.
 */
export const BLOG_LOOPS = {
  "agents-md-open-standard-coding-agents": {
    loop: "/videos/blog/agents-md-open-standard-coding-agents-loop.mp4",
    poster: "/images/blog/agents-md-open-standard-coding-agents-poster.webp",
  },
  "gpt-6-wave-and-model-churn": {
    loop: "/videos/blog/gpt-6-wave-and-model-churn-loop.mp4",
    poster: "/images/blog/gpt-6-wave-and-model-churn-poster.webp",
  },
  "why-ai-agents-fail-in-production": {
    loop: "/videos/blog/why-ai-agents-fail-in-production-loop.mp4",
    poster: "/images/blog/why-ai-agents-fail-in-production-poster.webp",
  },
  "cnn-cifar10-from-scratch": {
    loop: "/videos/blog/cnn-cifar10-from-scratch-loop.mp4",
    poster: "/images/blog/cnn-cifar10-from-scratch-poster.webp",
  },
  "time-series-forecasting-arima": {
    loop: "/videos/blog/time-series-forecasting-arima-loop.mp4",
    poster: "/images/blog/time-series-forecasting-arima-poster.webp",
  },
  "transformer-time-series": {
    loop: "/videos/blog/transformer-time-series-loop.mp4",
    poster: "/images/blog/transformer-time-series-poster.webp",
  },
  "production-ai-agent-serverless": {
    loop: "/videos/blog/production-ai-agent-serverless-loop.mp4",
    poster: "/images/blog/production-ai-agent-serverless-poster.webp",
  },
  "mlops-pipeline-production": {
    loop: "/videos/blog/mlops-pipeline-production-loop.mp4",
    poster: "/images/blog/mlops-pipeline-production-poster.webp",
  },
  "nlp-document-classifier-distilbert": {
    loop: "/videos/blog/nlp-document-classifier-distilbert-loop.mp4",
    poster: "/images/blog/nlp-document-classifier-distilbert-poster.webp",
  },
  "smart-metering-etl-vee-ontario": {
    loop: "/videos/blog/smart-metering-etl-vee-ontario-loop.mp4",
    poster: "/images/blog/smart-metering-etl-vee-ontario-poster.webp",
  },
};

/** The motion loop attached to a post, if any. */
export function blogCoverMedia(post) {
  return BLOG_LOOPS[post?.slug] ?? null;
}

/** Category filter keys → values stored in blog_posts.category. */
export const BLOG_CATEGORY_DB_VALUES = {
  all: "All",
  tutorials: "Tutorials",
  opinion: "Opinion",
  caseStudies: "Case Studies",
  research: "Research",
  industry: "Industry Insights",
};

/**
 * Translated label for a stored category, e.g. "Case Studies" → "Études de cas".
 * @param {string} dbValue
 * @param {Record<string, string>} labels  t.blog.categories
 */
export function blogCategoryLabel(dbValue, labels) {
  const key = Object.keys(BLOG_CATEGORY_DB_VALUES).find((k) => BLOG_CATEGORY_DB_VALUES[k] === dbValue);
  return (key && labels?.[key]) || dbValue;
}

/**
 * Text fields of a post in the reader's language; French columns fall back to English.
 * @param {any} post
 * @param {string} lang
 */
export function localizePost(post, lang) {
  const fr = lang === "fr";
  const pick = (field) => (fr && post?.[`${field}_fr`]) || post?.[field] || "";
  return {
    title: pick("title"),
    excerpt: pick("excerpt"),
    content: pick("content"),
    coverAlt: pick("cover_alt") || pick("title"),
    // True when the reader asked for French but this post has no translation yet.
    untranslated: fr && !post?.content_fr,
  };
}
