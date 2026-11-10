import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageContext";
import { localizePost } from "@/lib/blog";
import BlogMotionMedia from "@/components/media/BlogMotionMedia";

export default function HomeBlogPreview() {
  const { lang } = useLang();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["homeBlogPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_date", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading || posts.length === 0) {
    return null;
  }

  const badgeText = lang === "fr" ? "Publications & Veille" : "Articles & Insights";
  const titleText = lang === "fr" ? "Derniers articles techniques" : "Latest Engineering Articles";
  const subtitleText =
    lang === "fr"
      ? "Retours d'expérience sur les agents LLM, les pipelines MLOps et la modélisation prédictive en production."
      : "Field notes on production LLM agents, MLOps architectures, and industrial predictive modeling.";
  const viewAllText = lang === "fr" ? "Voir tous les articles" : "View All Articles";
  const readArticleText = lang === "fr" ? "Lire l'article" : "Read Article";

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
          {badgeText}
        </span>
        <h2 className="text-3xl md:text-4xl font-black mt-3 text-foreground">{titleText}</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">{subtitleText}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, i) => {
          const localized = localizePost(post, lang);
          const publishedDate = post.published_date
            ? format(new Date(post.published_date), "MMMM d, yyyy", { locale: lang === "fr" ? frLocale : undefined })
            : "";

          return (
            <motion.article
              key={post.id || post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover bg-card border border-border rounded-2xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-all"
            >
              <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden bg-muted/40">
                <BlogMotionMedia
                  post={post}
                  title={localized.title}
                  alt={localized.coverAlt}
                  className="h-48 w-full"
                  priority={i < 2}
                />
              </Link>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-mono">
                  {publishedDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {publishedDate}
                    </span>
                  )}
                  {post.read_time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.read_time}
                    </span>
                  )}
                </div>

                <h3 className="text-foreground font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  <Link to={`/blog/${post.slug}`}>{localized.title}</Link>
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {localized.excerpt}
                </p>

                <div className="pt-4 border-t border-border mt-auto">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all"
                  >
                    {readArticleText} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all"
          style={{ color: "hsl(var(--primary))" }}
        >
          <BookOpen className="w-4 h-4" />
          {viewAllText} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
