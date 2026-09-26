import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ExternalLink, Star, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const projects = [
  {
    title: { en: "Energy ARIMA Forecasting", fr: "Prévision énergétique ARIMA" },
    desc: {
      en: "Time series analysis and ARIMA/SARIMA modeling to forecast U.S. industrial energy production (1939–2025) using Federal Reserve (FRED) data.",
      fr: "Analyse de séries temporelles et modélisation ARIMA/SARIMA pour prévoir la production énergétique industrielle américaine (1939–2025) à partir des données de la Réserve fédérale (FRED).",
    },
    tags: {
      en: ["Time Series", "ARIMA", "SARIMA", "Python"],
      fr: ["Séries temporelles", "ARIMA", "SARIMA", "Python"],
    },
    stars: 1,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Energy-ARIMA-Forecasting",
    color: "hsl(var(--primary))",
  },
  {
    title: { en: "Behavior Detection (Sensors)", fr: "Détection de comportements (capteurs)" },
    desc: {
      en: "Analyzing and interpreting sensor data to identify specific behavioral patterns. Building structured models that classify and predict behaviors.",
      fr: "Analyse et interprétation de données de capteurs pour repérer des schémas comportementaux précis, avec des modèles structurés qui classent et prédisent les comportements.",
    },
    tags: {
      en: ["Sensor Data", "Classification", "ML", "Python"],
      fr: ["Données de capteurs", "Classification", "ML", "Python"],
    },
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Detect-Behavior-with-Sensor-Data",
    color: "hsl(var(--brand-blue))",
  },
  {
    title: { en: "Transformer Time Series Prediction", fr: "Prévision de séries temporelles par Transformer" },
    desc: {
      en: "Proof of concept for a transformer-based time series prediction model — bringing NLP architecture to temporal data forecasting.",
      fr: "Preuve de concept d'un modèle de prévision de séries temporelles fondé sur les Transformers — l'architecture du NLP appliquée aux données temporelles.",
    },
    tags: {
      en: ["Transformers", "Deep Learning", "Forecasting"],
      fr: ["Transformers", "Apprentissage profond", "Prévision"],
    },
    stars: 0,
    lang: "Python",
    url: "https://github.com/womgaalbert/transformer-time-series-prediction",
    color: "#8b5cf6",
  },
  {
    title: { en: "ConvNet on CIFAR-10", fr: "ConvNet sur CIFAR-10" },
    desc: {
      en: "CNN built from scratch to classify CIFAR-10 images, starting with pixel normalization. Uses stacked convolutional blocks with pooling and dropout.",
      fr: "Réseau de neurones convolutif construit de zéro pour classer les images CIFAR-10, de la normalisation des pixels aux blocs convolutifs empilés avec pooling et dropout.",
    },
    tags: {
      en: ["CNN", "Computer Vision", "CIFAR-10"],
      fr: ["CNN", "Vision par ordinateur", "CIFAR-10"],
    },
    stars: 0,
    lang: "Jupyter Notebook",
    color: "#f59e0b",
    url: "https://github.com/womgaalbert/Convnet-On-CIFAR-10",
  },
];

export default function FeaturedProjects() {
  const { t, lang } = useLang();
  /** @param {any} v */
  const tr = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] || v.en : v);
  /** @param {any} v */
  const trList = (v) => (Array.isArray(v) ? v : v[lang] || v.en);
  return (
    <section className="py-24 bg-footer">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"hsl(var(--primary))"}}>{t.featured.badge}</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 text-foreground">{t.featured.title}</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            {t.featured.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover bg-card border border-border rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-3 h-3 rounded-full mt-1" style={{backgroundColor: p.color}} />
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/70 hover:text-foreground transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <h3 className="text-foreground font-bold text-lg mb-2">{tr(p.title)}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{tr(p.desc)}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {trList(p.tags).map(tag => (
                  <span key={tag} className="bg-background border border-border text-muted-foreground text-xs px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {p.stars}</span>
                <span>{p.lang}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to={createPageUrl("Projects")} className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{color:"hsl(var(--primary))"}}>
            {t.featured.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}