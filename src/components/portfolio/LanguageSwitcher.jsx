import { useLang } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center bg-[#1a2235] border border-[#2a3a55] rounded-full p-1 gap-0.5">
      <button
        onClick={() => setLang("en")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          lang === "en" ? "bg-white/10 text-white shadow" : "text-gray-400 hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("fr")}
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
          lang === "fr" ? "bg-white/10 text-white shadow" : "text-gray-400 hover:text-white"
        }`}
      >
        FR
      </button>
    </div>
  );
}
