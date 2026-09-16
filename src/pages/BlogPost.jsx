import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Facebook, Link as LinkIcon } from "lucide-react";
import { sanitizeUrl } from "@/lib/sanitize";
import { format } from "date-fns";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function BlogPost() {
  const navigate = useNavigate();
  const [postId, setPostId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPostId(params.get("id"));
  }, []);

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
  const shareTitle = post?.title || "";

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
    toast.success("Link copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Failed to load post</p>
          <button
            onClick={() => navigate("/Blog")}
            className="text-teal-400 hover:underline"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Post not found</p>
          <button
            onClick={() => navigate("/Blog")}
            className="text-teal-400 hover:underline"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/Blog")}
          className="flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </motion.button>

        {/* Cover Image */}
        {post.cover_image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl overflow-hidden"
          >
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
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
            style={{ background: "#00d4b815", color: "#00d4b8" }}
          >
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {post.published_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.published_date), "MMMM d, yyyy")}
              </span>
            )}
            {post.read_time && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.read_time} min read
              </span>
            )}
          </div>
        </motion.div>

        {/* Social Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8 pb-8 border-b border-[#1e2a3a]"
        >
          <span className="text-sm text-gray-500 flex items-center gap-2">
            <Share2 className="w-4 h-4" /> Share:
          </span>
          <button
            onClick={() => handleShare("twitter")}
            className="w-9 h-9 rounded-lg bg-[#111827] border border-[#1e2a3a] flex items-center justify-center hover:border-teal-500 transition-colors"
            title="Share on Twitter"
          >
            <Twitter className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="w-9 h-9 rounded-lg bg-[#111827] border border-[#1e2a3a] flex items-center justify-center hover:border-teal-500 transition-colors"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="w-9 h-9 rounded-lg bg-[#111827] border border-[#1e2a3a] flex items-center justify-center hover:border-teal-500 transition-colors"
            title="Share on Facebook"
          >
            <Facebook className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={copyLink}
            className="w-9 h-9 rounded-lg bg-[#111827] border border-[#1e2a3a] flex items-center justify-center hover:border-teal-500 transition-colors"
            title="Copy link"
          >
            <LinkIcon className="w-4 h-4 text-gray-400" />
          </button>
        </motion.div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-3xl font-bold text-white mt-8 mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-2xl font-bold text-white mt-6 mb-3">{children}</h2>,
              h3: ({ children }) => <h3 className="text-xl font-bold text-white mt-5 mb-2">{children}</h3>,
              p: ({ children }) => <p className="text-gray-400 leading-relaxed mb-4">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside text-gray-400 mb-4 space-y-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside text-gray-400 mb-4 space-y-2">{children}</ol>,
              li: ({ children }) => <li className="text-gray-400">{children}</li>,
              a: ({ children, href }) => (
                <a href={sanitizeUrl(href) || "#"} className="text-teal-400 hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="bg-[#111827] text-teal-400 px-1.5 py-0.5 rounded text-sm">{children}</code>
                ) : (
                  <code className="block bg-[#111827] text-gray-300 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </code>
                ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-teal-500 pl-4 italic text-gray-500 my-4">
                  {children}
                </blockquote>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </motion.article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-[#1e2a3a]"
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-[#111827] border border-[#1e2a3a] text-gray-400 text-xs px-3 py-1 rounded-full"
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