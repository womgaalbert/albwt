import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, GitBranch, Github, ChevronRight } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import ProjectComments from "@/components/projects/ProjectComments";

const projects = [
  {
    slug: "energy-arima-forecasting",
    title: "Energy ARIMA Forecasting",
    titleFr: "Prévision ARIMA de l'Énergie",
    desc: "Applies time series analysis and ARIMA/SARIMA modeling to forecast U.S. industrial energy production (1939–2025). Uses historical data from the Federal Reserve (FRED), identifying long-term trends and seasonal patterns.",
    descFr: "Applique l'analyse de séries temporelles et la modélisation ARIMA/SARIMA pour prévoir la production industrielle d'énergie aux États-Unis (1939–2025). Utilise les données historiques de la Réserve Fédérale (FRED).",
    highlights: ["ARIMA/SARIMA multi-step forecasting", "Full statistical validation framework", "U.S. industrial energy production (1939–2025)"],
    highlightsFr: ["Prévision multi-étapes ARIMA/SARIMA", "Framework de validation statistique complète", "Production industrielle US (1939–2025)"],
    tags: ["ARIMA", "SARIMA", "Forecasting", "Python"],
    stars: 1,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Energy-ARIMA-Forecasting",
    color: "#00d4b8",
    category: "Forecasting",
    categoryFr: "Prévision",
    image: `https://placehold.co/600x400/1e2a3a/00d4b8?text=${encodeURIComponent("Energy ARIMA")}`,
    year: "2024",
  },
  {
    slug: "bfrb-sensor-fusion",
    title: "BFRB Sensor Fusion — Multimodal Behaviour Analytics",
    titleFr: "Fusion de Capteurs BFRB — Analytique Comportementale Multimodale",
    desc: "Implemented multimodal time-series classification using LSTM/Transformer architectures, sliding-window segmentation, and sensor fusion — methodology applicable to fraud detection and customer journey analytics.",
    descFr: "Classification multimodale de séries temporelles avec des architectures LSTM/Transformer, segmentation par fenêtre glissante et fusion de capteurs — applicable à la détection de fraude et à l'analytique parcours client.",
    highlights: ["LSTM/Transformer multimodal classification", "Sliding-window segmentation for time-series", "Sensor fusion methodology"],
    highlightsFr: ["Classification multimodale LSTM/Transformer", "Segmentation par fenêtre glissante", "Méthodologie de fusion de capteurs"],
    tags: ["LSTM", "Transformer", "Sensor Fusion", "Time-Series"],
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Detect-Behavior-with-Sensor-Data",
    color: "#0066ff",
    category: "Deep Learning",
    categoryFr: "Deep Learning",
    image: `https://placehold.co/600x400/1e2a3a/0066ff?text=${encodeURIComponent("BFRB Sensor Fusion")}`,
    year: "2025",
  },
  {
    slug: "transformer-time-series",
    title: "Transformer Time Series Prediction",
    titleFr: "Prédiction de Séries Temporelles par Transformer",
    desc: "Proof of concept for a transformer-based time series prediction model — bringing NLP architecture to temporal data forecasting. Demonstrates the power of attention mechanisms for sequence data.",
    descFr: "Preuve de concept pour un modèle de prédiction de séries temporelles basé sur les transformers — appliquant l'architecture NLP aux données temporelles. Démontre la puissance des mécanismes d'attention.",
    highlights: ["Transformer architecture for time-series", "Attention mechanism applied to sequential data", "NLP-to-forecasting transfer"],
    highlightsFr: ["Architecture Transformer pour séries temporelles", "Mécanisme d'attention sur données séquentielles", "Transfert NLP → prévision"],
    tags: ["Transformers", "Deep Learning", "Attention", "Forecasting"],
    stars: 0,
    lang: "Python",
    url: "https://github.com/womgaalbert/transformer-time-series-prediction",
    color: "#8b5cf6",
    category: "Deep Learning",
    categoryFr: "Deep Learning",
    image: `https://placehold.co/600x400/1e2a3a/8b5cf6?text=${encodeURIComponent("Transformer Time Series")}`,
    year: "2024",
  },
  {
    slug: "convnet-cifar10",
    title: "ConvNet on CIFAR-10",
    titleFr: "ConvNet sur CIFAR-10",
    desc: "CNN built from scratch to classify CIFAR-10 images. Features pixel normalization, stacked convolutional blocks with pooling and dropout regularization for improved generalization.",
    descFr: "CNN construit de zéro pour classifier les images CIFAR-10. Comprend la normalisation des pixels, des blocs convolutifs empilés avec pooling et régularisation par dropout.",
    highlights: ["Custom CNN architecture from scratch", "Dropout + pooling regularization", "CIFAR-10 benchmark classification"],
    highlightsFr: ["Architecture CNN personnalisée", "Régularisation Dropout + Pooling", "Classification benchmark CIFAR-10"],
    tags: ["CNN", "Computer Vision", "CIFAR-10", "PyTorch"],
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Convnet-On-CIFAR-10",
    color: "#f59e0b",
    category: "Computer Vision",
    categoryFr: "Vision par Ordinateur",
    image: `https://placehold.co/600x400/1e2a3a/f59e0b?text=${encodeURIComponent("ConvNet CIFAR-10")}`,
    year: "2023",
  },
  {
    slug: "student-plurilingual",
    title: "Student Plurilingual Representation — French Learning",
    titleFr: "Représentation Plurilingue des Étudiants — Apprentissage du Français",
    desc: "Ongoing MLOps pipeline (Level 0 → Level 1) analyzing student perceptions of French learning. XGBoost classification with SMOTE balancing, MLflow experiment tracking, and hypothesis-driven modeling (H1–H4).",
    descFr: "Pipeline MLOps (Niveau 0 → Niveau 1) analysant les perceptions des étudiants sur l'apprentissage du français. Classification XGBoost avec équilibrage SMOTE, suivi MLflow et modélisation par hypothèses (H1–H4).",
    highlights: ["XGBoost + SMOTE for imbalanced classification", "MLflow experiment tracking & model registry", "Hypothesis-driven pipeline (H1–H4)"],
    highlightsFr: ["XGBoost + SMOTE pour données déséquilibrées", "Suivi MLflow & registre de modèles", "Pipeline par hypothèses (H1–H4)"],
    tags: ["XGBoost", "MLOps", "MLflow", "NLP", "Python"],
    stars: 0,
    lang: "Python",
    url: "https://github.com/womgaalbert/Student-Plurilingual-Representation-French-Learning",
    color: "#10b981",
    category: "Machine Learning",
    categoryFr: "Machine Learning",
    image: `https://placehold.co/600x400/1e2a3a/10b981?text=${encodeURIComponent("Student Plurilingual")}`,
    year: "2025 🔄",
  },
  {
    slug: "portfolio-website",
    title: "albert.womga.io — Portfolio",
    titleFr: "albert.womga.io — Portfolio",
    desc: "My personal GitHub Pages website — a digital presence showcasing projects and professional background as a Data Scientist and AI Specialist.",
    descFr: "Mon site GitHub Pages personnel — une présence digitale présentant mes projets et mon parcours professionnel en tant que Data Scientist et Spécialiste IA.",
    highlights: ["Personal brand & digital presence", "Project showcase platform", "GitHub Pages deployment"],
    highlightsFr: ["Marque personnelle & présence digitale", "Plateforme de présentation de projets", "Déploiement GitHub Pages"],
    tags: ["Portfolio", "GitHub Pages", "Web"],
    stars: 0,
    lang: "HTML/CSS",
    url: "https://github.com/womgaalbert/albert.womga.io",
    color: "#ef4444",
    category: "Web",
    categoryFr: "Web",
    image: `https://placehold.co/600x400/1e2a3a/ef4444?text=${encodeURIComponent("Portfolio Website")}`,
    year: "2023",
  },
  {
    slug: "cmavocate-legal-platform",
    title: "cmavocate.ca — Legal Aid Web Platform",
    titleFr: "cmavocate.ca — Plateforme Web d'Aide Juridique",
    desc: "Designed and developed cmavocate.ca, a professional legal aid web platform providing accessible legal resources and services for Canadian users.",
    descFr: "Conception et développement de cmavocate.ca, une plateforme web d'aide juridique professionnelle offrant des ressources et services juridiques accessibles aux utilisateurs canadiens.",
    highlights: ["Full web platform design & development", "Accessible legal resource hub for Canada", "Professional UX/UI for legal services"],
    highlightsFr: ["Conception & développement web complet", "Hub de ressources juridiques accessible", "UX/UI professionnel pour services juridiques"],
    tags: ["Web", "React", "UX/UI", "Legal Tech"],
    stars: 0,
    lang: "JavaScript",
    url: "https://cmavocate.ca",
    color: "#6366f1",
    category: "Web",
    categoryFr: "Web",
    image: `https://placehold.co/600x400/1e2a3a/6366f1?text=${encodeURIComponent("CM Avocate")}`,
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
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#00d4b8" }}>
            {t.projects.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-white">{t.projects.title}</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">{t.projects.subtitle}</p>
        </motion.div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: activeCategory === cat ? "linear-gradient(135deg,#00d4b8,#0066ff)" : "#111827",
                color: activeCategory === cat ? "white" : "#9ca3af",
                border: activeCategory === cat ? "none" : "1px solid #1e2a3a",
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
              className="card-hover bg-[#111827] border border-[#1e2a3a] rounded-2xl overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/40 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                    style={{ background: `${p.color}20`, color: p.color, borderColor: `${p.color}40` }}
                  >
                    {lang === "fr" ? p.categoryFr : p.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 text-gray-400 text-xs font-mono">{p.year}</div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-xl mb-2">
                  {lang === "fr" ? p.titleFr : p.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {lang === "fr" ? p.descFr : p.desc}
                </p>

                {/* Highlights */}
                <ul className="space-y-1.5 mb-5">
                  {(lang === "fr" ? p.highlightsFr : p.highlights).map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-400">
                      <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: p.color }} />
                      {h}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map(tag => (
                    <span key={tag} className="bg-[#0a0f1e] border border-[#1e2a3a] text-gray-400 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#1e2a3a] mt-auto">
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {p.stars}</span>
                    <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> {p.lang}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleComments(p.slug)}
                      className="text-xs font-medium transition-colors"
                      style={{ color: expandedComments[p.slug] ? p.color : "#6b7280" }}
                    >
                      {expandedComments[p.slug] ? "Hide comments" : "Comments"}
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