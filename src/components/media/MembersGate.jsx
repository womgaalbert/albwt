import { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";

// Overlay shown on a members-only image when the visitor is signed out.
// Sign-in is a Supabase magic link, which doubles as a lead-capture step.
export default function MembersGate() {
  const { t } = useLang();
  const { signInWithEmail } = useAuth();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const { error } = await signInWithEmail(email.trim());
    setStatus(error ? "error" : "sent");
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-background/40 backdrop-blur-sm">
      <div className="bg-card/95 border border-border rounded-xl p-4 max-w-xs w-full text-center shadow-lg">
        <Lock className="w-5 h-5 mx-auto mb-2 text-primary" aria-hidden="true" />
        <p className="font-semibold text-foreground text-sm">{t.media.membersTitle}</p>
        <p className="text-xs text-muted-foreground mt-1 mb-3">{t.media.membersBody}</p>
        {status === "sent" ? (
          <p role="status" className="text-xs text-primary">{t.media.linkSent}</p>
        ) : open ? (
          <form onSubmit={submit} className="flex flex-col gap-2">
            <label htmlFor="members-email" className="sr-only">{t.media.emailLabel}</label>
            <input
              id="members-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.media.emailLabel}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-primary rounded-lg px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {t.media.sendLink}
            </button>
            {status === "error" && <p role="alert" className="text-xs text-destructive">{t.media.linkError}</p>}
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white"
          >
            <Mail className="w-3.5 h-3.5" aria-hidden="true" /> {t.media.membersCta}
          </button>
        )}
      </div>
    </div>
  );
}
