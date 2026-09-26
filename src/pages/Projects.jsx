import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, GitBranch, Github, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import ProjectComments from "@/components/projects/ProjectComments";
import InkImage from "@/components/media/InkImage";
import Seo from "@/components/Seo";

const projects = [
  {
    slug: "energy-arima-forecasting",
    alt: { en: "Cover illustration: long-run energy production curve with a forecast line extending past the historical data", fr: "Illustration : courbe de production d'énergie sur le long terme prolongée par une ligne de prévision" },
    title: "Energy ARIMA Forecasting",
    titleFr: "Prévision ARIMA de l'Énergie",
    desc: "Applies time series analysis and ARIMA/SARIMA modeling to forecast U.S. industrial energy production (1939–2025). Uses historical data from the Federal Reserve (FRED), identifying long-term trends and seasonal patterns.",
    descFr: "Applique l'analyse de séries temporelles et la modélisation ARIMA/SARIMA pour prévoir la production industrielle d'énergie aux États-Unis (1939–2025). Utilise les données historiques de la Réserve Fédérale (FRED).",
    highlights: ["ARIMA/SARIMA multi-step forecasting", "Full statistical validation framework", "U.S. industrial energy production (1939–2025)"],
    highlightsFr: ["Prévision multi-étapes ARIMA/SARIMA", "Framework de validation statistique complète", "Production industrielle US (1939–2025)"],
    tags: { en: ["ARIMA", "SARIMA", "Forecasting", "Python"], fr: ["ARIMA", "SARIMA", "Prévision", "Python"] },
    stars: 1,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Energy-ARIMA-Forecasting",
    color: "hsl(var(--primary))",
    category: "Forecasting",
    categoryFr: "Prévision",
    image: "/images/projects/energy-arima-forecasting.svg",
    year: "2024",
  },
  {
    slug: "bfrb-sensor-fusion",
    alt: { en: "Cover illustration: several overlapping sensor signal waveforms merged into one classification stream", fr: "Illustration : plusieurs signaux de capteurs superposés fusionnés en un seul flux de classification" },
    title: "BFRB Sensor Fusion — Multimodal Behaviour Analytics",
    titleFr: "Fusion de Capteurs BFRB — Analytique Comportementale Multimodale",
    desc: "Implemented multimodal time-series classification using LSTM/Transformer architectures, sliding-window segmentation, and sensor fusion — methodology applicable to fraud detection and customer journey analytics.",
    descFr: "Classification multimodale de séries temporelles avec des architectures LSTM/Transformer, segmentation par fenêtre glissante et fusion de capteurs — applicable à la détection de fraude et à l'analytique parcours client.",
    highlights: ["LSTM/Transformer multimodal classification", "Sliding-window segmentation for time-series", "Sensor fusion methodology"],
    highlightsFr: ["Classification multimodale LSTM/Transformer", "Segmentation par fenêtre glissante", "Méthodologie de fusion de capteurs"],
    tags: { en: ["LSTM", "Transformer", "Sensor Fusion", "Time-Series"], fr: ["LSTM", "Transformer", "Fusion de capteurs", "Séries temporelles"] },
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Detect-Behavior-with-Sensor-Data",
    color: "hsl(var(--brand-blue))",
    category: "Deep Learning",
    categoryFr: "Deep Learning",
    image: "/images/projects/bfrb-sensor-fusion.svg",
    year: "2025",
  },
  {
    slug: "transformer-time-series",
    alt: { en: "Cover illustration: attention connections linking points of a time series", fr: "Illustration : connexions d'attention reliant les points d'une série temporelle" },
    title: "Transformer Time Series Prediction",
    titleFr: "Prédiction de Séries Temporelles par Transformer",
    desc: "Proof of concept for a transformer-based time series prediction model — bringing NLP architecture to temporal data forecasting. Demonstrates the power of attention mechanisms for sequence data.",
    descFr: "Preuve de concept pour un modèle de prédiction de séries temporelles basé sur les transformers — appliquant l'architecture NLP aux données temporelles. Démontre la puissance des mécanismes d'attention.",
    highlights: ["Transformer architecture for time-series", "Attention mechanism applied to sequential data", "NLP-to-forecasting transfer"],
    highlightsFr: ["Architecture Transformer pour séries temporelles", "Mécanisme d'attention sur données séquentielles", "Transfert NLP → prévision"],
    tags: { en: ["Transformers", "Deep Learning", "Attention", "Forecasting"], fr: ["Transformers", "Apprentissage profond", "Attention", "Prévision"] },
    stars: 0,
    lang: "Python",
    url: "https://github.com/womgaalbert/transformer-time-series-prediction",
    color: "#8b5cf6",
    category: "Deep Learning",
    categoryFr: "Deep Learning",
    image: "/images/projects/transformer-time-series.svg",
    year: "2024",
  },
  {
    slug: "convnet-cifar10",
    alt: { en: "Cover illustration: stacked convolutional layers turning an image grid into class predictions", fr: "Illustration : couches convolutives empilées transformant une grille d'image en prédictions de classes" },
    title: "ConvNet on CIFAR-10",
    titleFr: "ConvNet sur CIFAR-10",
    desc: "CNN built from scratch to classify CIFAR-10 images. Features pixel normalization, stacked convolutional blocks with pooling and dropout regularization for improved generalization.",
    descFr: "CNN construit de zéro pour classifier les images CIFAR-10. Comprend la normalisation des pixels, des blocs convolutifs empilés avec pooling et régularisation par dropout.",
    highlights: ["Custom CNN architecture from scratch", "Dropout + pooling regularization", "CIFAR-10 benchmark classification"],
    highlightsFr: ["Architecture CNN personnalisée", "Régularisation Dropout + Pooling", "Classification benchmark CIFAR-10"],
    tags: { en: ["CNN", "Computer Vision", "CIFAR-10", "PyTorch"], fr: ["CNN", "Vision par ordinateur", "CIFAR-10", "PyTorch"] },
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Convnet-On-CIFAR-10",
    color: "#f59e0b",
    category: "Computer Vision",
    categoryFr: "Vision par Ordinateur",
    image: "/images/projects/convnet-cifar10.svg",
    year: "2023",
  },
  {
    slug: "student-plurilingual",
    alt: { en: "Cover illustration: MLOps pipeline stages from data to tracked model", fr: "Illustration : étapes d'un pipeline MLOps, des données au modèle suivi" },
    title: "Student Plurilingual Representation — French Learning",
    titleFr: "Représentation Plurilingue des Étudiants — Apprentissage du Français",
    desc: "Ongoing MLOps pipeline (Level 0 → Level 1) analyzing student perceptions of French learning. XGBoost classification with SMOTE balancing, MLflow experiment tracking, and hypothesis-driven modeling (H1–H4).",
    descFr: "Pipeline MLOps (Niveau 0 → Niveau 1) analysant les perceptions des étudiants sur l'apprentissage du français. Classification XGBoost avec équilibrage SMOTE, suivi MLflow et modélisation par hypothèses (H1–H4).",
    highlights: ["XGBoost + SMOTE for imbalanced classification", "MLflow experiment tracking & model registry", "Hypothesis-driven pipeline (H1–H4)"],
    highlightsFr: ["XGBoost + SMOTE pour données déséquilibrées", "Suivi MLflow & registre de modèles", "Pipeline par hypothèses (H1–H4)"],
    tags: { en: ["XGBoost", "MLOps", "MLflow", "NLP", "Python"], fr: ["XGBoost", "MLOps", "MLflow", "NLP", "Python"] },
    stars: 0,
    lang: "Python",
    url: "https://github.com/womgaalbert/Student-Plurilingual-Representation-French-Learning",
    color: "#10b981",
    category: "Machine Learning",
    categoryFr: "Machine Learning",
    image: "/images/projects/student-plurilingual.svg",
    year: { en: "2025 · ongoing", fr: "2025 · en cours" },
  },
  {
    slug: "portfolio-website",
    alt: { en: "Cover illustration: stylised browser window of the portfolio website", fr: "Illustration : fenêtre de navigateur stylisée du site portfolio" },
    title: "albert.womga.io — Portfolio",
    titleFr: "albert.womga.io — Portfolio",
    desc: "My personal GitHub Pages website — a digital presence showcasing projects and professional background as a Data Scientist and AI Specialist.",
    descFr: "Mon site GitHub Pages personnel — une présence digitale présentant mes projets et mon parcours professionnel en tant que Data Scientist et Spécialiste IA.",
    highlights: ["Personal brand & digital presence", "Project showcase platform", "GitHub Pages deployment"],
    highlightsFr: ["Marque personnelle & présence digitale", "Plateforme de présentation de projets", "Déploiement GitHub Pages"],
    tags: { en: ["Portfolio", "GitHub Pages", "Web"], fr: ["Portfolio", "GitHub Pages", "Web"] },
    stars: 0,
    lang: "HTML/CSS",
    url: "https://github.com/womgaalbert/albert.womga.io",
    color: "#ef4444",
    category: "Web",
    categoryFr: "Web",
    image: "/images/projects/portfolio-website.svg",
    year: "2023",
  },
  {
    slug: "cmavocate-legal-platform",
    alt: { en: "Cover illustration: stylised legal aid web platform interface", fr: "Illustration : interface stylisée de la plateforme web d'aide juridique" },
    title: "cmavocate.ca — Legal Aid Web Platform",
    titleFr: "cmavocate.ca — Plateforme Web d'Aide Juridique",
    desc: "Designed and developed cmavocate.ca, a professional legal aid web platform providing accessible legal resources and services for Canadian users.",
    descFr: "Conception et développement de cmavocate.ca, une plateforme web d'aide juridique professionnelle offrant des ressources et services juridiques accessibles aux utilisateurs canadiens.",
    highlights: ["Full web platform design & development", "Accessible legal resource hub for Canada", "Professional UX/UI for legal services"],
    highlightsFr: ["Conception & développement web complet", "Hub de ressources juridiques accessible", "UX/UI professionnel pour services juridiques"],
    tags: { en: ["Web", "React", "UX/UI", "Legal Tech"], fr: ["Web", "React", "UX/UI", "Legal tech"] },
    stars: 0,
    lang: "JavaScript",
    url: "https://cmavocate.ca",
    color: "#6366f1",
    category: "Web",
    categoryFr: "Web",
    image: "/images/projects/cm-avocats-platform.svg",
    year: "2024",
  },
];

export default function Projects() {
  const { lang, t } = useLang();
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedComments, setExpandedComments] = useState({});

  const categories = ["All", "Forecasting", "Machine Learning", "Deep Learning", "Computer Vision", "Fundamentals", "Web"];
  const categoryLabels = {
    All: lang === "fr" ? "Tous" : "All",
    Forecasting: lang === "fr" ? "Prévision" : "Forecasting",
    "Machine Learning": "Machine Learning",
    "Deep Learning": "Deep Learning",
    "Computer Vision": lang === "fr" ? "Vision par Ordinateur" : "Computer Vision",
    Fundamentals: lang === "fr" ? "Fondamentaux" : "Fundamentals",
    Web: "Web",
  };

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const toggleComments = (slug) => {
    setExpandedComments(prev => ({ ...prev, [slug]: !prev[slug] }));
  };

  return (
    <div className="pt-24 pb-20">
      <Seo
        title={t.projects.title}
        description={{
          en: "Machine learning, deep learning, forecasting and computer vision projects by Albert Womga — freelance AI/ML engineer (Canada & Cameroon).",
          fr: "Projets de machine learning, deep learning, prévision et vision par ordinateur d'Albert Womga — ingénieur IA/ML indépendant (Canada & Cameroun).",
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
            {t.projects.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-foreground">{t.projects.title}</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">{t.projects.subtitle}</p>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                background: activeCategory === cat ? "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))" : "hsl(var(--card))",
                color: activeCategory === cat ? "white" : "hsl(var(--muted-foreground))",
                border: activeCategory === cat ? "none" : "1px solid hsl(var(--border))",
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="ink-reveal card-hover bg-card border border-border rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden">
                <InkImage
                  src={p.image}
                  alt={p.alt}
                  caption={lang === "fr" ? p.titleFr : p.title}
                  width={600}
                  height={400}
                  priority={i < 2}
                  zoomable
                  className="w-full h-full"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                <div className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-card/85 backdrop-blur"
                    style={{ color: p.color, borderColor: `color-mix(in srgb, ${p.color} 40%, transparent)` }}
                  >
                    {lang === "fr" ? p.categoryFr : p.category}
                  </span>
                </div>
                <div className="pointer-events-none absolute top-4 right-4 z-20 text-foreground text-xs font-mono bg-card/85 backdrop-blur px-2 py-0.5 rounded">{typeof p.year === "object" ? p.year[lang] || p.year.en : p.year}</div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-foreground font-bold text-xl mb-2">
                  {lang === "fr" ? p.titleFr : p.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {lang === "fr" ? p.descFr : p.desc}
                </p>

                {/* Highlights */}
                <ul className="space-y-1.5 mb-5">
                  {(lang === "fr" ? p.highlightsFr : p.highlights).map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: p.color }} />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(Array.isArray(p.tags) ? p.tags : p.tags[lang] || p.tags.en).map(tag => (
                    <span key={tag} className="bg-background border border-border text-muted-foreground text-xs px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {p.stars}</span>
                    <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> {p.lang}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleComments(p.slug)}
                      aria-expanded={!!expandedComments[p.slug]}
                      className="text-xs font-medium transition-colors"
                      style={{ color: expandedComments[p.slug] ? p.color : "hsl(var(--muted-foreground))" }}
                    >
                      {expandedComments[p.slug] ? t.projects.hideComments : t.projects.comments}
                    </button>
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                      style={{ color: p.color }}
                    >
                      {t.projects.viewProject} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Comments section */}
                <AnimatePresence>
                  {expandedComments[p.slug] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ overflow: "hidden" }}
                    >
                      <ProjectComments projectSlug={p.slug} accentColor={p.color} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        <div className="text-center mt-12">
          <a
            href="https://github.com/womgaalbert"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white"
          >
            <Github className="w-4 h-4" /> {t.projects.viewAll}
          </a>
        </div>
      </div>
    </div>
  );
}