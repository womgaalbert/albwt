import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Facebook, Link as LinkIcon } from "lucide-react";
import { sanitizeUrl } from "@/lib/sanitize";
import { format } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageContext";
import InkImage from "@/components/media/InkImage";
import Seo, { SITE_URL } from "@/components/Seo";
import { blogCoverSrc, blogCategoryLabel, localizePost } from "@/lib/blog";
import SourceCard, { sourceKind } from "@/components/blog/SourceCard";

const shareBtn = "w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function BlogPost() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("id");
  const { lang, t } = useLang();
  const dateLocale = lang === "fr" ? { locale: frLocale } : undefined;

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blogPost", postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });

  const shareUrl = window.location.href;
  const shareTitle = post ? localizePost(post, lang).title : "";

  const handleShare = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success(t.blog.linkCopied);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div role="status" aria-label={t.blog.loading} className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">{t.blog.loadError}</p>
          <button
            onClick={() => navigate("/Blog")}
            className="text-primary hover:underline"
          >
            {t.blog.back}
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">{t.blog.notFound}</p>
          <button
            onClick={() => navigate("/Blog")}
            className="text-primary hover:underline"
          >
            {t.blog.back}
          </button>
        </div>
      </div>
    );
  }

  const cover = blogCoverSrc(post);
  const text = localizePost(post, lang);
  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: text.title,
    description: text.excerpt,
    inLanguage: text.untranslated || lang !== "fr" ? "en" : "fr",
    image: cover ? (cover.startsWith("http") ? cover : `${SITE_URL}${cover}`) : undefined,
    datePublished: post.published_date,
    dateModified: post.updated_at || post.published_date,
    keywords: (post.tags || []).join(", "),
    articleSection: post.category,
    mainEntityOfPage: `${SITE_URL}/blogpost?id=${post.id}`,
    author: { "@type": "Person", name: "Albert Tchaptchet Womga", url: SITE_URL },
  };

  return (
    <div className="pt-24 pb-20">
      <Seo
        title={text.title}
        description={text.excerpt}
        image={cover}
        type="article"
        publishedTime={post.published_date}
        jsonLd={postJsonLd}
      />
      <div className="max-w-4xl mx-auto px-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/Blog")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          {t.blog.back}
        </motion.button>

        {/* Cover Image */}
        {post.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl overflow-hidden"
          >
            <InkImage
              src={blogCoverSrc(post)}
              alt={text.coverAlt}
              caption={text.title}
              width={800}
              height={400}
              priority
              zoomable
              className="w-full h-64 md:h-96 rounded-2xl"
            />
          </motion.div>
        )}

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <span
            className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-4"
            style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}
          >
            {blogCategoryLabel(post.category, t.blog.categories)}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">{text.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.published_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.published_date), lang === "fr" ? "d MMMM yyyy" : "MMMM d, yyyy", dateLocale)}
              </span>
            )}
            {post.read_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.read_time} {t.blog.minRead}
              </span>
            )}
          </div>
        </motion.div>

        {/* Social Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8 pb-8 border-b border-border"
        >
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Share2 className="w-4 h-4" aria-hidden="true" /> {t.blog.share}
          </span>
          <button
            type="button"
            onClick={() => handleShare("twitter")}
            className={shareBtn}
            aria-label={t.blog.shareOn.replace("{network}", "Twitter")}
            title={t.blog.shareOn.replace("{network}", "Twitter")}
          >
            <Twitter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleShare("linkedin")}
            className={shareBtn}
            aria-label={t.blog.shareOn.replace("{network}", "LinkedIn")}
            title={t.blog.shareOn.replace("{network}", "LinkedIn")}
          >
            <Linkedin className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => handleShare("facebook")}
            className={shareBtn}
            aria-label={t.blog.shareOn.replace("{network}", "Facebook")}
            title={t.blog.shareOn.replace("{network}", "Facebook")}
          >
            <Facebook className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={copyLink}
            className={shareBtn}
            aria-label={t.blog.copyLink}
            title={t.blog.copyLink}
          >
            <LinkIcon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </motion.div>

        {text.untranslated && (
          <p className="mb-6 rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            {t.blog.untranslated}
          </p>
        )}

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold text-foreground mt-8 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold text-foreground mt-6 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold text-foreground mt-5 mb-2">{children}</h3>,
              p: ({ node, children }) => {
                // A YouTube / X / LinkedIn link alone in its paragraph becomes a rich card.
                const kids = (node?.children || []).filter((c) => !(c.type === "text" && !c.value.trim()));
                const only = kids.length === 1 && kids[0].type === "element" && kids[0].tagName === "a" ? kids[0] : null;
                const href = only ? sanitizeUrl(String(only.properties?.href || "")) : "";
                if (href && sourceKind(href)) {
                  const label = (only.children || []).map((c) => (c.type === "text" ? c.value : "")).join("") || href;
                  return <SourceCard href={href} label={label} />;
                }
                return <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>;
              },
              ul: ({ children }) => <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
              a: ({ children, href }) => {
                const safe = sanitizeUrl(href) || "#";
                if (safe.startsWith("/")) {
                  return <Link to={safe} className="text-primary hover:underline">{children}</Link>;
                }
                return (
                  <a href={safe} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                );
              },
              img: ({ src, alt }) => (
                <InkImage
                  src={sanitizeUrl(src) || undefined}
                  alt={alt || ""}
                  caption={alt}
                  // Diagrams (SVG) keep their colours so labels stay readable.
                  ink={!/\.svg$/i.test(src || "")}
                  zoomable
                  imgClassName="object-contain"
                  className="my-6 rounded-xl border border-border bg-background"
                />
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">{children}</table>
                </div>
              ),
              code: ({ className, children }) =>
                /language-/.test(className || "") ? (
                  <code className="block bg-card text-foreground/80 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </code>
                ) : (
                  <code className="bg-card text-primary px-1.5 py-0.5 rounded text-sm">{children}</code>
                ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {text.content}
          </ReactMarkdown>
        </motion.article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border"
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-card border border-border text-muted-foreground text-xs px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}