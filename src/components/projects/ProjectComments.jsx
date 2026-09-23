import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send } from "lucide-react";
import { MAX_INPUT_LENGTHS } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";

export default function ProjectComments({ projectSlug, accentColor }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ author_name: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const loadComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('project_comments')
        .select('*')
        .eq('project_slug', projectSlug)
        .order('created_at', { ascending: false });
      if (queryError) throw queryError;
      setComments(data);
    } catch (err) {
      setError("Failed to load comments. Please try again later.");
      setComments([]);
    }
    setLoading(false);
  }, [projectSlug]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.author_name.trim() || !form.content.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const { error: insertError } = await supabase
        .from('project_comments')
        .insert({
          project_slug: projectSlug,
          author_name: form.author_name.trim(),
          content: form.content.trim(),
        });
      if (insertError) throw insertError;
      setForm({ author_name: "", content: "" });
      await loadComments();
    } catch (err) {
      setSubmitError("Failed to post comment. Please try again.");
    }
    setSubmitting(false);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4" style={{ color: accentColor }} />
        <span className="text-foreground font-semibold text-sm">
          {comments.length} Comment{comments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-5 space-y-3">
        <input
          value={form.author_name}
          onChange={e => setForm({ ...form, author_name: e.target.value })}
          placeholder="Your name"
          maxLength={MAX_INPUT_LENGTHS.commentAuthor}
          className="w-full bg-background border border-border text-foreground rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors placeholder-muted-foreground/60"
        />
        <div className="flex gap-2">
          <textarea
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder="Share your thoughts on this project..."
            rows={2}
            maxLength={MAX_INPUT_LENGTHS.commentContent}
            className="flex-1 bg-background border border-border text-foreground rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary transition-colors resize-none placeholder-muted-foreground/60"
          />
          <button
            type="submit"
            disabled={submitting || !form.author_name.trim() || !form.content.trim()}
            className="px-3 rounded-xl text-white disabled:opacity-40 flex items-center justify-center self-start py-2.5"
            style={{ background: `linear-gradient(135deg, ${accentColor}, hsl(var(--brand-blue)))` }}
          >
            {submitting
              ? <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
              : <Send className="w-3 h-3" />
            }
          </button>
        </div>
        {submitError && (
          <p className="text-red-400 text-xs">{submitError}</p>
        )}
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="text-muted-foreground/70 text-xs">Loading comments...</div>
      ) : error ? (
        <div className="text-red-400 text-xs">{error}</div>
      ) : (
        <div>
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: `${accentColor}30`, border: `1px solid ${accentColor}50`, color: accentColor }}
              >
                {c.author_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-foreground text-xs font-semibold">{c.author_name}</span>
                  <span className="text-muted-foreground/70 text-xs">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-muted-foreground/70 text-xs">Be the first to comment on this project.</p>
          )}
        </div>
      )}
    </div>
  );
}
