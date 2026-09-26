// Older rows pointed cover_image at placehold.co; those map to the local SVG covers.
export function blogCoverSrc(post) {
  if (!post?.cover_image) return null;
  return post.cover_image.includes("placehold.co") ? `/images/blog/${post.slug}.svg` : post.cover_image;
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
