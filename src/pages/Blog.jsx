import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { format } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageContext";
import InkImage from "@/components/media/InkImage";
import Seo from "@/components/Seo";
import { blogCoverSrc, blogCategoryLabel, localizePost, BLOG_CATEGORY_DB_VALUES as categoryDbValues } from "@/lib/blog";

const categoryKeys = Object.keys(categoryDbValues);

export default function Blog() {
  const { t, lang } = useLang();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const query = searchTerm.toLowerCase();
  const filteredPosts = posts
    .map((post) => ({ post, text: localizePost(post, lang) }))
    .filter(({ post, text }) => {
      const matchesCategory = activeCategory === "all" || post.category === categoryDbValues[activeCategory];
      const matchesSearch = text.title.toLowerCase().includes(query) || text.excerpt.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

  return (
    <div className="pt-24 pb-20">
      <Seo
        title={t.blog.title}
        description={{
          en: "Articles on production ML, LLM agents, MLOps, NLP and time-series forecasting by Albert Womga, freelance AI/ML engineer.",
          fr: "Articles sur le ML en production, les agents LLM, le MLOps, le NLP et la prévision de séries temporelles par Albert Womga, ingénieur IA/ML indépendant.",
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
            {t.blog.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-foreground">{t.blog.title}</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            {t.blog.subtitle}
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-10"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="blog-search" className="sr-only">{t.blog.searchLabel}</label>
            <input
              id="blog-search"
              type="search"
              placeholder={t.blog.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-border text-foreground rounded-xl pl-12 pr-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categoryKeys.map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={activeCategory === key}
              onClick={() => setActiveCategory(key)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                background: activeCategory === key ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))" : "hsl(var(--card))",
                color: activeCategory === key ? "white" : "hsl(var(--muted-foreground))",
                border: activeCategory === key ? "none" : "1px solid hsl(var(--border))",
              }}
            >
              {t.blog.categories[key]}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">{t.blog.noResults}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(({ post, text }, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/BlogPost?id=${post.id}`} className="block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <div className="ink-reveal card-hover bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col">
                    {post.cover_image && (
                      <InkImage
                        src={blogCoverSrc(post)}
                        alt={text.coverAlt}
                        width={800}
                        height={400}
                        priority={i < 3}
                        className="h-52 bg-background"
                      />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{ background: "hsl(var(--primary) / 0.08)", color: "hsl(var(--primary))" }}
                        >
                          {blogCategoryLabel(post.category, t.blog.categories)}
                        </span>
                        {post.read_time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.read_time} {t.blog.minRead}
                          </span>
                        )}
                      </div>
                      <h3 className="text-foreground font-bold text-lg mb-2 line-clamp-2">{text.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                        {text.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground/70">
                        {post.published_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(post.published_date), lang === "fr" ? "d MMM yyyy" : "MMM d, yyyy", lang === "fr" ? { locale: frLocale } : undefined)}
                          </span>
                        )}
                        <span className="text-primary flex items-center gap-1 font-medium">
                          {t.blog.readMore} <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}