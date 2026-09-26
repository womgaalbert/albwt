import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send } from "lucide-react";
import { MAX_INPUT_LENGTHS } from "@/lib/sanitize";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/LanguageContext";

export default function ProjectComments({ projectSlug, accentColor }) {
  const { lang, t } = useLang();
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
      setError("load");
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
      setSubmitError("post");
    }
    setSubmitting(false);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(lang === "fr" ? "fr-CA" : "en-CA", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4" style={{ color: accentColor }} />
        <span className="text-foreground font-semibold text-sm">
          {t.projects.commentsCount.replace("{n}", comments.length)}
        </span>
      </div>

      {/* Comment form */}
      <form onSubmit={handleSubmit} className="mb-5 space-y-3">
        <label htmlFor={`comment-name-${projectSlug}`} className="sr-only">{t.projects.commentName}</label>
        <input
          id={`comment-name-${projectSlug}`}
          value={form.author_name}
          onChange={e => setForm({ ...form, author_name: e.target.value })}
          placeholder={t.projects.commentName}
          maxLength={MAX_INPUT_LENGTHS.commentAuthor}
          className="w-full bg-background border border-border text-foreground rounded-xl px-3 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors placeholder-muted-foreground/60"
        />
        <div className="flex gap-2">
          <label htmlFor={`comment-body-${projectSlug}`} className="sr-only">{t.projects.commentPlaceholder}</label>
          <textarea
            id={`comment-body-${projectSlug}`}
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder={t.projects.commentPlaceholder}
            rows={2}
            maxLength={MAX_INPUT_LENGTHS.commentContent}
            className="flex-1 bg-background border border-border text-foreground rounded-xl px-3 py-2.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-colors resize-none placeholder-muted-foreground/60"
          />
          <button
            type="submit"
            aria-label={t.projects.commentPost}
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
          <p role="alert" className="text-destructive text-xs">{t.projects.commentPostError}</p>
        )}
      </form>

      {/* Comments list */}
      {loading ? (
        <div className="text-muted-foreground/70 text-xs">{t.projects.commentsLoading}</div>
      ) : error ? (
        <div role="alert" className="text-destructive text-xs">{t.projects.commentsLoadError}</div>
      ) : (
        <div>
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2.5 mb-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: `color-mix(in srgb, ${accentColor} 19%, transparent)`, border: `1px solid color-mix(in srgb, ${accentColor} 31%, transparent)`, color: accentColor }}
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
            <p className="text-muted-foreground/70 text-xs">{t.projects.commentsEmpty}</p>
          )}
        </div>
      )}
    </div>
  );
}
