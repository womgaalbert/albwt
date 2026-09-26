import { motion } from "framer-motion";
import { Quote, Star, ExternalLink } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

export const testimonials = [
  {
    quote: {
      en: "Albert built an analytics dashboard for our government ministry that transformed how we track education outcomes across 5,000+ schools. The insights now directly inform our policy and budget decisions.",
      fr: "Albert a conçu pour notre ministère un tableau de bord analytique qui a transformé notre suivi des résultats scolaires dans plus de 5 000 établissements. Ces analyses orientent désormais directement nos décisions de politique et de budget.",
    },
    name: "Dr. Angèle Otou",
    title: { en: "Senior Director", fr: "Directrice principale" },
    company: { en: "Ministry of Education — Cameroon", fr: "Ministère de l'Éducation — Cameroun" },
    country: { en: "🇨🇲 Cameroon", fr: "🇨🇲 Cameroun" },
    initials: "AO",
    color: "#10b981",
  },
  {
    quote: {
      en: "Albert built the entire cmavocats.ca platform and integrated an AI document classification system that cut our document routing time from minutes to seconds. Remarkable technical depth and professionalism.",
      fr: "Albert a construit toute la plateforme cmavocats.ca et y a intégré un système de classification documentaire par IA qui a réduit notre temps d'acheminement de plusieurs minutes à quelques secondes. Une profondeur technique et un professionnalisme remarquables.",
    },
    name: { en: "C.M. Avocats Team", fr: "Équipe C.M. Avocats" },
    title: { en: "Legal Technology", fr: "Technologies juridiques" },
    company: { en: "CM Avocats — Gatineau, QC", fr: "CM Avocats — Gatineau (QC)" },
    country: { en: "🇨🇦 Canada", fr: "🇨🇦 Canada" },
    initials: "CM",
    color: "#8b5cf6",
  },
  {
    quote: {
      en: "Albert provided outstanding statistical consultancy to our research teams at the Faculty of Medicine. His expertise in biostatistics — from study design and multivariate analysis to clinical modelling — significantly elevated the rigour of our publications and ethics submissions. A rare combination of deep statistical knowledge and genuine pedagogy.",
      fr: "Albert a fourni un accompagnement statistique remarquable à nos équipes de recherche de la Faculté de médecine. Son expertise en biostatistique — du plan d'étude à l'analyse multivariée et à la modélisation clinique — a nettement renforcé la rigueur de nos publications et de nos soumissions au comité d'éthique. Une combinaison rare de savoir statistique approfondi et de véritable pédagogie.",
    },
    name: "Prof. Koki Ndoumbo",
    title: { en: "Faculty of Medicine", fr: "Faculté de médecine" },
    company: { en: "University of Yaoundé I — Cameroon", fr: "Université de Yaoundé I — Cameroun" },
    country: { en: "🇨🇲 Cameroon", fr: "🇨🇲 Cameroun" },
    initials: "KN",
    color: "#f59e0b",
  },
];

export default function Testimonials() {
  const { t, lang } = useLang();
  /** @param {any} v */
  const tr = (v) => (v && typeof v === "object" ? v[lang] || v.en : v);
  return (
    <section className="py-24 bg-footer">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
            {t.testimonials.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 text-foreground">
            {t.testimonials.title}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            {t.testimonials.subtitle}
          </p>
          <a
            href="https://www.linkedin.com/in/albert-womga-009a7931/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium mt-4 hover:underline"
            style={{ color: "hsl(var(--primary))" }}
          >
            {t.testimonials.seeAll} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 relative"
            >
              {/* Quote icon */}
              <div
                className="absolute top-5 right-5 opacity-10"
                style={{ color: item.color }}
              >
                <Quote className="w-10 h-10" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-700 dark:text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                "{tr(item.quote)}"
              </p>

              {/* Divider */}
              <div className="border-t border-border" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${item.color}, color-mix(in srgb, ${item.color} 53%, transparent))` }}
                >
                  {item.initials}
                </div>
                <div>
                  <p className="text-foreground font-semibold text-sm">{tr(item.name)}</p>
                  <p className="text-muted-foreground text-xs">{tr(item.title)} · {tr(item.company)}</p>
                </div>
                <span className="ml-auto text-base" title={tr(item.country)}>{tr(item.country).split(" ")[0]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}