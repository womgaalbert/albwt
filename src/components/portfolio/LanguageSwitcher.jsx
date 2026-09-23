import { useLang } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center bg-card border border-border rounded-full p-1 gap-0.5">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          lang === "en" ? "bg-foreground/10 text-foreground shadow" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("fr")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          lang === "fr" ? "bg-foreground/10 text-foreground shadow" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        FR
      </button>
    </div>
  );
}
