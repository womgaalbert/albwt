import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Brain, TrendingUp, MessageSquare, Search, BarChart2, Users, CheckCircle, ArrowRight, MapPin } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import Seo from "@/components/Seo";

const serviceIcons = [Brain, TrendingUp, MessageSquare, BarChart2, Search, Users];
const serviceColors = [
  "hsl(var(--primary))",
  "hsl(var(--brand-blue))",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#10b981",
];

export default function Services() {
  const { t } = useLang();
  const markets = [
    { ...t.services.markets.canada, flag: "🇨🇦", color: "#ef4444" },
    { ...t.services.markets.cameroon, flag: "🇨🇲", color: "hsl(var(--primary))" },
  ];

  return (
    <div className="pt-24 pb-20">
      <Seo
        title={{ en: "AI/ML Services", fr: "Services IA/ML" }}
        description={{
          en: "Hire a freelance AI/ML engineer: LLM agents & RAG, ML model development, MLOps deployment, NLP, forecasting and data-science consulting.",
          fr: "Engagez un ingénieur IA/ML indépendant : agents LLM & RAG, développement de modèles ML, déploiement MLOps, NLP, prévision et conseil en data science.",
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">

          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>{t.services.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-foreground">{t.services.title}</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            {t.services.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {t.services.services.map((s, i) => {
            const Icon = serviceIcons[i % serviceIcons.length];
            const color = serviceColors[i % serviceColors.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-hover bg-card border border-border rounded-2xl p-6">

                <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 8%, transparent)` }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="text-foreground font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">{s.desc}</p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Markets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>{t.services.markets.badge}</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 text-foreground">{t.services.markets.title}</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            {t.services.markets.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-20 max-w-4xl mx-auto">
          {markets.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover bg-card border border-border rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${m.color}, transparent)` }} />
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">{m.flag}</span>
                <div>
                  <h3 className="text-foreground font-bold text-2xl">{m.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{m.tagline}</p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <ul className="space-y-2.5">
                  {m.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: m.color }} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to={createPageUrl("Contact")} className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-lg">
            {t.services.cta} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>);
}
