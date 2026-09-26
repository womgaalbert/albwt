import { useLang } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div role="group" aria-label="Language / Langue" className="flex items-center bg-card border border-border rounded-full p-1 gap-0.5">
      <button
        type="button"
        lang="en"
        aria-pressed={lang === "en"}
        aria-label="English"
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          lang === "en" ? "bg-foreground/10 text-foreground shadow" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        lang="fr"
        aria-pressed={lang === "fr"}
        aria-label="Français"
        onClick={() => setLang("fr")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          lang === "fr" ? "bg-foreground/10 text-foreground shadow" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        FR
      </button>
    </div>
  );
}
