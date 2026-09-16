import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

const categories = ["All", "Tutorials", "Opinion", "Case Studies", "Research", "Industry Insights"];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
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

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#00d4b8" }}>
            Thought Leadership
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-white">AI & Data Science Blog</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Insights, tutorials, and case studies on Machine Learning, AI, and Data Science.
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111827] border border-[#1e2a3a] text-white rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeCategory === cat ? "linear-gradient(135deg,#00d4b8,#0066ff)" : "#111827",
                color: activeCategory === cat ? "white" : "#9ca3af",
                border: activeCategory === cat ? "none" : "1px solid #1e2a3a",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No articles found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/BlogPost?id=${post.id}`}>
                  <div className="card-hover bg-[#111827] border border-[#1e2a3a] rounded-2xl overflow-hidden h-full flex flex-col">
                    {post.cover_image && (
                      <div className="h-48 overflow-hidden bg-[#0a0f1e]">
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{ background: "#00d4b815", color: "#00d4b8" }}
                        >
                          {post.category}
                        </span>
                        {post.read_time && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.read_time} min read
                          </span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-[#1e2a3a] text-xs text-gray-600">
                        {post.published_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(post.published_date), "MMM d, yyyy")}
                          </span>
                        )}
                        <span className="text-teal-400 flex items-center gap-1 font-medium">
                          Read More <ArrowRight className="w-3 h-3" />
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