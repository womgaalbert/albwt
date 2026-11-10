import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Star,
  GitBranch,
  Github,
  ChevronRight,
  Sparkles,
  Globe,
  Layers,
  TrendingUp,
  Cpu,
  Eye,
  Play,
  ArrowUpRight,
} from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import ProjectComments from "@/components/projects/ProjectComments";
import ProjectMotionMedia from "@/components/media/ProjectMotionMedia";
import Seo from "@/components/Seo";

const projects = [
  {
    slug: "cleary-cleaning-platform",
    alt: {
      en: "CLEARY CLEANING logo and booking platform interface for Ottawa and Gatineau",
      fr: "Logo CLEARY CLEANING et interface de la plateforme de réservation pour Ottawa et Gatineau",
    },
    title: "CLEARY CLEANING — Bilingual Home Cleaning Platform",
    titleFr: "CLEARY CLEANING — Plateforme Bilingue de Ménage Résidentiel",
    desc: "A complete bilingual cleaning service I designed and built end to end — brand, website and booking flow — for Ottawa and Gatineau. Customers send a request, see their price upfront and book in under three minutes, and their contact with their cleaner stays private through a masked number and a chat that closes after the job.",
    descFr: "Un service de ménage bilingue que j'ai conçu et construit de bout en bout — marque, site web et réservation — pour Ottawa et Gatineau. Le client envoie une demande, voit son prix à l'avance et réserve en moins de trois minutes, et son contact avec son aide-ménagère reste privé grâce à un numéro masqué et à une messagerie qui se ferme après le travail.",
    highlights: [
      "Bilingual EN/FR platform across all 12 services & legal pages",
      "Ride-request style booking flow with upfront pricing in under 3 min",
      "Private masked phone number & auto-closing temporary chat",
      "Feasibility checks, cleaner acceptance windows & photo checklists",
    ],
    highlightsFr: [
      "Plateforme bilingue EN/FR sur l'ensemble des 12 services & pages légales",
      "Réservation fluide façon VTC avec prix transparent en moins de 3 min",
      "Numéro masqué privé & messagerie temporaire fermée après prestation",
      "Contrôle de faisabilité, fenêtres d'acceptation & checklists photos",
    ],
    tags: {
      en: ["Bilingual EN/FR", "Booking Platform", "Brand & Logo", "12 Services", "Video Series", "Ottawa & Gatineau"],
      fr: ["Bilingue EN/FR", "Plateforme de réservation", "Marque & Logo", "12 services", "Série vidéo", "Ottawa & Gatineau"],
    },
    stars: 0,
    lang: "Live Platform · Full Stack",
    url: "https://clearycleaning.ca",
    loop: "/videos/projects/cleary-cleaning-loop.mp4",
    video: "/videos/projects/cleary-cleaning.mp4",
    image: "/images/projects/cleary-cleaning-poster.webp",
    color: "#0284c7",
    category: "Web",
    categoryFr: "Web",
    motionType: "browser",
    outcome: "Live Business · Upfront Pricing & <3min Booking",
    outcomeFr: "Entreprise en Ligne · Prix Transparent & Réservation <3min",
    year: { en: "2025 · live", fr: "2025 · en ligne" },
  },
  {
    slug: "mialine-gifted-hands",
    alt: {
      en: "Mialine Gifted Hands resto-bar and catering web platform homepage screenshot showcasing bilingual menu and Yaoundé location",
      fr: "Capture d'écran de la plateforme web resto-bar et traiteur Mialine Gifted Hands présentant le menu bilingue et la localisation à Yaoundé",
    },
    title: "MIALINE GIFTED HANDS — Bilingual Restaurant & WhatsApp Ordering",
    titleFr: "MIALINE GIFTED HANDS — Restaurant Bilingue & Commande WhatsApp",
    desc: "A bilingual resto-bar website I designed and built end to end for a Cameroonian restaurant at Carrefour Obili, Yaoundé. The full menu is online with prices, customers build a cart on the site and send their order through a WhatsApp form — for eating in, taking away, or delivery to home or office — and the catering pages take bookings for birthdays, weddings and company events.",
    descFr: "Le site web d'un resto-bar camerounais que j'ai conçu et construit de bout en bout, au Carrefour Obili à Yaoundé. Le menu complet est en ligne avec les prix, les clients composent leur panier sur le site et envoient leur commande par un formulaire WhatsApp — sur place, à emporter ou en livraison à domicile ou au bureau — et les pages traiteur prennent les réservations pour anniversaires, mariages et événements d'entreprise.",
    highlights: [
      "Designed & built end to end: home, menu (45 dishes, 1,000–2,500 FCFA), cart & catering",
      "Bilingual FR/EN architecture with instant toggle for international & local diners",
      "Interactive digital cart with 1-click WhatsApp order dispatch for dine-in, takeaway & delivery",
      "Event catering booking flow & local Yaoundé / Obili geolocation SEO (open 7j/7, 7h–23h)",
    ],
    highlightsFr: [
      "Conçu & développé de bout en bout : accueil, menu (45 plats, 1 000–2 500 FCFA), panier & traiteur",
      "Architecture bilingue FR/EN avec bascule instantanée pour clientèle locale et internationale",
      "Panier digital interactif avec commande WhatsApp en 1 clic (sur place, à emporter, livraison)",
      "Module de réservation traiteur d'événements & référencement local Yaoundé / Obili (7j/7, 7h–23h)",
    ],
    tags: {
      en: ["Bilingual FR/EN", "Menu & Ordering", "WhatsApp Cart", "Catering", "Yaoundé", "Cameroon"],
      fr: ["Bilingue FR/EN", "Menu & Commande", "Panier WhatsApp", "Traiteur", "Yaoundé", "Cameroun"],
    },
    stars: 0,
    lang: "TypeScript · React PWA",
    url: "https://mialinegiftedhands.com",
    loop: "/videos/projects/mialine-loop.mp4",
    video: "/videos/projects/mialine-presentation-60s.mp4",
    image: "/images/projects/mialine-poster.webp",
    color: "#e11d48",
    category: "Web",
    categoryFr: "Web",
    motionType: "restaurant",
    outcome: "Live Client Business · 45 Menu Items & WhatsApp Cart",
    outcomeFr: "Activité Client en Ligne · 45 Plats & Panier WhatsApp",
    year: { en: "2026 · live", fr: "2026 · en ligne" },
  },
  {
    slug: "cmavocat-legal-platform",
    alt: {
      en: "CM Avocat law firm digital platform interface for Gatineau and Calgary",
      fr: "Interface de la plateforme digitale du cabinet d'avocats CM Avocat pour Gatineau et Calgary",
    },
    title: "CM Avocat — Canadian Legal Tech & Law Practice Platform",
    titleFr: "CM Avocat — Plateforme Juridique & Cabinet d'Avocats Canadien",
    desc: "Designed and built the bilingual digital platform for Cabinet CM Avocat (led by Me Charles Mbakop, with offices in Gatineau, QC and Calgary, AB). Features automated legal intake, case triage across immigration (Express Entry, study/work permits, sponsorship), corporate, civil, penal, and family law, and an online booking wizard for the initial 20–30 min evaluation consultation.",
    descFr: "Conception et développement de la plateforme digitale bilingue du Cabinet CM Avocat (dirigé par Me Charles Mbakop, bureaux à Gatineau et Calgary). Triage et accueil automatisés des dossiers en immigration (Entrée express, permis d'études/travail, parrainage), droit des affaires, civil, pénal et familial, avec module de réservation de la consultation initiale gratuite de 20 à 30 min.",
    highlights: [
      "Bilingual legal intake across Immigration, Corporate, Civil, Penal & Family Law",
      "Two-stage NLP triage pipeline (DistilBERT + XGBoost) routing cases in 0.4s vs 15m manual",
      "Integrated 20–30 min initial evaluation consultation booking flow (Gatineau & Calgary)",
      "Official law firm portal & secure client communication hubs (cmavocat.ca / cmavocat.com)",
    ],
    highlightsFr: [
      "Accueil juridique bilingue : immigration, droit des affaires, civil, pénal & familial",
      "Pipeline NLP de triage en 2 étapes (DistilBERT + XGBoost) routant les dossiers en 0.4s vs 15m",
      "Module de réservation en ligne pour la première consultation d'évaluation (20-30 min)",
      "Portails sécurisés et confidentiels pour les bureaux de Gatineau (QC) et Calgary (AB)",
    ],
    tags: {
      en: ["Legal Tech", "React", "NLP Triage", "Immigration Law", "Gatineau & Calgary", "Bilingual EN/FR"],
      fr: ["Legal Tech", "React", "Triage NLP", "Droit de l'immigration", "Gatineau & Calgary", "Bilingue FR/EN"],
    },
    stars: 0,
    lang: "Full Stack · AI Triage",
    url: "https://cmavocat.ca",
    loop: "/videos/projects/cmavocat-loop.mp4",
    video: "/videos/projects/cmavocat-presentation-60s.mp4",
    image: "/images/projects/cmavocat-poster.webp",
    color: "#6366f1",
    category: "Web",
    categoryFr: "Web",
    motionType: "browser",
    outcome: "AI Document Routing · 0.4s Latency | Gatineau & Calgary",
    outcomeFr: "Routage IA de Documents · Latence 0.4s | Gatineau & Calgary",
    year: "2024–2025",
  },
  {
    slug: "portfolio-website",
    alt: {
      en: "Cover illustration: stylised browser window of the portfolio website",
      fr: "Illustration : fenêtre de navigateur stylisée du site portfolio",
    },
    title: "albert.womga.io — Portfolio Platform",
    titleFr: "albert.womga.io — Plateforme Portfolio",
    desc: "My personal digital presence and portfolio platform showcasing client implementations, machine learning systems, and AI engineering expertise as a Senior Data Scientist.",
    descFr: "Mon site personnel et plateforme de présentation démontrant mes réalisations clients, systèmes de machine learning et compétences d'ingénierie IA en tant que Data Scientist Senior.",
    highlights: ["Personal brand & digital presence", "Project showcase platform", "Fast static architecture"],
    highlightsFr: ["Marque personnelle & présence digitale", "Plateforme de présentation de projets", "Architecture statique ultra-rapide"],
    tags: { en: ["Portfolio", "GitHub Pages", "Web"], fr: ["Portfolio", "GitHub Pages", "Web"] },
    stars: 0,
    lang: "HTML/CSS · JavaScript",
    url: "https://github.com/womgaalbert/albert.womga.io",
    color: "#ef4444",
    category: "Web",
    categoryFr: "Web",
    motionType: "browser",
    outcome: "Fast Static Architecture",
    outcomeFr: "Architecture Statique Rapide",
    loop: "/videos/projects/portfolio-website-loop.mp4",
    image: "/images/projects/portfolio-website-poster.webp",
    year: "2023",
  },
  {
    slug: "student-plurilingual-databricks",
    alt: {
      en: "Databricks lakehouse architecture diagram showing Unity Catalog, Workflows, MLflow, Model Serving and Streamlit dashboard",
      fr: "Diagramme d'architecture Databricks Lakehouse illustrant Unity Catalog, Workflows, MLflow, Model Serving et Streamlit",
    },
    title: "Student Plurilingual Representation — French Learning (Databricks)",
    titleFr: "Représentations Plurilingues des Étudiants — Apprentissage du Français (Databricks)",
    desc: "An end-to-end machine-learning platform built on Databricks in support of doctoral research (Chancelline Armelle Nongni Kendjio, Université Marie & Louis Pasteur de Besançon) analyzing Cameroonian secondary students' plurilingual representations of French. The full ML lifecycle runs on serverless compute: Delta Lake and Unity Catalog for data, 8-task Databricks Workflows, managed MLflow tracking, and a scale-to-zero Model Serving endpoint carrying all 8 hypothesis models to a live, bilingual Streamlit dashboard.",
    descFr: "Plateforme d'apprentissage automatique de bout en bout conçue sur Databricks en appui à la recherche doctorale de Chancelline Armelle Nongni Kendjio (Univ. Marie & Louis Pasteur de Besançon) sur les représentations du français en contexte plurilingue au Cameroun. Cycle ML complet sur compute serverless : Delta Lake & Unity Catalog, Workflow Databricks à 8 tâches, MLflow managé, et endpoint Model Serving unifié (scale-to-zero) alimentant un tableau de bord Streamlit bilingue en direct.",
    highlights: [
      "Full Lakehouse lifecycle: Unity Catalog (flp_catalog) + Delta Lake feature tables",
      "Orchestrated 8-task Databricks Workflow & 9 registered models in Unity Catalog",
      "Unified scale-to-zero pyfunc Model Serving endpoint (flp-all-models) bundling 8 models",
      "Live bilingual Streamlit dashboard with REST inference & CamemBERT/spaCy French NLP",
    ],
    highlightsFr: [
      "Cycle Lakehouse complet : Unity Catalog (flp_catalog) + tables de features Delta Lake",
      "Orchestration Databricks Workflow en 8 tâches & 9 modèles enregistrés sous Unity Catalog",
      "Endpoint Model Serving pyfunc unifié (scale-to-zero) regroupant les 8 modèles d'hypothèses",
      "Application Streamlit bilingue en direct avec inférence REST & NLP français (CamemBERT/spaCy)",
    ],
    tags: {
      en: ["Databricks", "Unity Catalog", "Delta Lake", "MLflow", "Model Serving", "Streamlit", "CamemBERT"],
      fr: ["Databricks", "Unity Catalog", "Delta Lake", "MLflow", "Model Serving", "Streamlit", "CamemBERT"],
    },
    stars: 0,
    lang: "Databricks · Python",
    url: "https://github.com/womgaalbert/Student-Plurilingual-Representation-French-Learning-Databricks",
    demoUrl: "https://student-plurilingual-representation-french-learning-htyukpvkoo.streamlit.app/",
    color: "#10b981",
    category: "Machine Learning",
    categoryFr: "Machine Learning",
    motionType: "pipeline",
    outcome: "Databricks Lakehouse · Unity Catalog + Streamlit Live",
    outcomeFr: "Lakehouse Databricks · Unity Catalog + Streamlit Live",
    image: "/images/projects/student-plurilingual-databricks.webp",
    year: { en: "2025 · doctoral research", fr: "2025 · recherche doctorale" },
  },
  {
    slug: "energy-arima-forecasting",
    alt: {
      en: "Cover illustration: long-run energy production curve with a forecast line extending past the historical data",
      fr: "Illustration : courbe de production d'énergie sur le long terme prolongée par une ligne de prévision",
    },
    title: "Energy ARIMA Forecasting",
    titleFr: "Prévision ARIMA de l'Énergie",
    desc: "Applies time series analysis and ARIMA/SARIMA modeling to forecast U.S. industrial energy production (1939–2025). Uses historical data from the Federal Reserve (FRED), identifying long-term trends and seasonal patterns.",
    descFr: "Applique l'analyse de séries temporelles et la modélisation ARIMA/SARIMA pour prévoir la production industrielle d'énergie aux États-Unis (1939–2025). Utilise les données historiques de la Réserve Fédérale (FRED).",
    highlights: [
      "ARIMA/SARIMA multi-step forecasting",
      "Full statistical validation framework",
      "U.S. industrial energy production (1939–2025)",
    ],
    highlightsFr: [
      "Prévision multi-étapes ARIMA/SARIMA",
      "Framework de validation statistique complète",
      "Production industrielle US (1939–2025)",
    ],
    tags: { en: ["ARIMA", "SARIMA", "Forecasting", "Python"], fr: ["ARIMA", "SARIMA", "Prévision", "Python"] },
    stars: 1,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Energy-ARIMA-Forecasting",
    color: "hsl(var(--primary))",
    category: "Forecasting",
    categoryFr: "Prévision",
    motionType: "forecast",
    outcome: "FRED 1939–2025 · Multi-step Forecast",
    outcomeFr: "FRED 1939–2025 · Prévision Multi-étapes",
    loop: "/videos/projects/energy-arima-forecasting-loop.mp4",
    image: "/images/projects/energy-arima-forecasting-poster.webp",
    year: "2024",
  },
  {
    slug: "bfrb-sensor-fusion",
    alt: {
      en: "Cover illustration: several overlapping sensor signal waveforms merged into one classification stream",
      fr: "Illustration : plusieurs signaux de capteurs superposés fusionnés en un seul flux de classification",
    },
    title: "BFRB Sensor Fusion — Multimodal Behaviour Analytics",
    titleFr: "Fusion de Capteurs BFRB — Analytique Comportementale Multimodale",
    desc: "Implemented multimodal time-series classification using LSTM/Transformer architectures, sliding-window segmentation, and sensor fusion — methodology applicable to fraud detection and customer journey analytics.",
    descFr: "Classification multimodale de séries temporelles avec des architectures LSTM/Transformer, segmentation par fenêtre glissante et fusion de capteurs — applicable à la détection de fraude et à l'analytique parcours client.",
    highlights: [
      "LSTM/Transformer multimodal classification",
      "Sliding-window segmentation for time-series",
      "Sensor fusion methodology",
    ],
    highlightsFr: [
      "Classification multimodale LSTM/Transformer",
      "Segmentation par fenêtre glissante",
      "Méthodologie de fusion de capteurs",
    ],
    tags: {
      en: ["LSTM", "Transformer", "Sensor Fusion", "Time-Series"],
      fr: ["LSTM", "Transformer", "Fusion de capteurs", "Séries temporelles"],
    },
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Detect-Behavior-with-Sensor-Data",
    color: "hsl(var(--brand-blue))",
    category: "Deep Learning",
    categoryFr: "Deep Learning",
    motionType: "sensor",
    outcome: "LSTM + Transformer · Multimodal Time Series",
    outcomeFr: "LSTM + Transformer · Séries Temporelles Multimodales",
    loop: "/videos/projects/bfrb-sensor-fusion-loop.mp4",
    image: "/images/projects/bfrb-sensor-fusion-poster.webp",
    year: "2025",
  },
  {
    slug: "transformer-time-series",
    alt: {
      en: "Cover illustration: attention connections linking points of a time series",
      fr: "Illustration : connexions d'attention reliant les points d'une série temporelle",
    },
    title: "Transformer Time Series Prediction",
    titleFr: "Prédiction de Séries Temporelles par Transformer",
    desc: "Proof of concept for a transformer-based time series prediction model — bringing NLP architecture to temporal data forecasting. Demonstrates the power of attention mechanisms for sequence data.",
    descFr: "Preuve de concept pour un modèle de prédiction de séries temporelles basé sur les transformers — appliquant l'architecture NLP aux données temporelles. Démontre la puissance des mécanismes d'attention.",
    highlights: [
      "Transformer architecture for time-series",
      "Attention mechanism applied to sequential data",
      "NLP-to-forecasting transfer",
    ],
    highlightsFr: [
      "Architecture Transformer pour séries temporelles",
      "Mécanisme d'attention sur données séquentielles",
      "Transfert NLP → prévision",
    ],
    tags: {
      en: ["Transformers", "Deep Learning", "Attention", "Forecasting"],
      fr: ["Transformers", "Apprentissage profond", "Attention", "Prévision"],
    },
    stars: 0,
    lang: "Python",
    url: "https://github.com/womgaalbert/transformer-time-series-prediction",
    color: "#8b5cf6",
    category: "Deep Learning",
    categoryFr: "Deep Learning",
    motionType: "attention",
    outcome: "Multi-Head Attention · Sequence Modeling",
    outcomeFr: "Attention Multi-Têtes · Modélisation Séquentielle",
    loop: "/videos/projects/transformer-time-series-loop.mp4",
    image: "/images/projects/transformer-time-series-poster.webp",
    year: "2024",
  },
  {
    slug: "convnet-cifar10",
    alt: {
      en: "Cover illustration: stacked convolutional layers turning an image grid into class predictions",
      fr: "Illustration : couches convolutives empilées transformant une grille d'image en prédictions de classes",
    },
    title: "ConvNet on CIFAR-10",
    titleFr: "ConvNet sur CIFAR-10",
    desc: "CNN built from scratch to classify CIFAR-10 images. Features pixel normalization, stacked convolutional blocks with pooling and dropout regularization for improved generalization.",
    descFr: "CNN construit de zéro pour classifier les images CIFAR-10. Comprend la normalisation des pixels, des blocs convolutifs empilés avec pooling et régularisation par dropout.",
    highlights: [
      "Custom CNN architecture from scratch",
      "Dropout + pooling regularization",
      "CIFAR-10 benchmark classification",
    ],
    highlightsFr: [
      "Architecture CNN personnalisée",
      "Régularisation Dropout + Pooling",
      "Classification benchmark CIFAR-10",
    ],
    tags: {
      en: ["CNN", "Computer Vision", "CIFAR-10", "PyTorch"],
      fr: ["CNN", "Vision par ordinateur", "CIFAR-10", "PyTorch"],
    },
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Convnet-On-CIFAR-10",
    color: "#f59e0b",
    category: "Computer Vision",
    categoryFr: "Vision par Ordinateur",
    motionType: "vision",
    outcome: "Custom CNN · CIFAR-10 Classification",
    outcomeFr: "CNN Personnalisé · Classification CIFAR-10",
    loop: "/videos/projects/convnet-cifar10-loop.mp4",
    image: "/images/projects/convnet-cifar10-poster.webp",
    year: "2023",
  },
];

const CATEGORY_GROUPS = [
  {
    id: "Web",
    icon: Globe,
    titleEn: "Client Platforms & Live Web Systems",
    titleFr: "Plateformes Web & Activités Clients en Production",
    descEn: "Live commercial client platforms, upfront booking engines, and custom business portals built end to end.",
    descFr: "Plateformes clients en production, moteurs de réservation instantanée et portails d'entreprise sur mesure.",
    color: "#0284c7",
  },
  {
    id: "Machine Learning",
    icon: Layers,
    titleEn: "Machine Learning & MLOps Lakehouse",
    titleFr: "Machine Learning & Lakehouse MLOps",
    descEn: "Production Databricks workflows, Unity Catalog governance, experiment tracking, and scale-to-zero model serving.",
    descFr: "Workflows Databricks de production, gouvernance Unity Catalog, suivi d'expériences et serving de modèles à grande échelle.",
    color: "#10b981",
  },
  {
    id: "Forecasting",
    icon: TrendingUp,
    titleEn: "Time-Series & Predictive Analytics",
    titleFr: "Prévision & Séries Temporelles",
    descEn: "Multi-step statistical forecasting with ARIMA/SARIMA models and long-horizon econometric validation.",
    descFr: "Modélisation et prévision statistique multi-étapes ARIMA/SARIMA avec validation économétrique long terme.",
    color: "hsl(var(--primary))",
  },
  {
    id: "Deep Learning",
    icon: Cpu,
    titleEn: "Deep Learning & Sensor Analytics",
    titleFr: "Deep Learning & Fusion de Capteurs",
    descEn: "Multimodal LSTM and Transformer sequence models with sliding-window attention and sensor fusion.",
    descFr: "Modèles séquentiels multimodaux LSTM et Transformers avec fenêtres glissantes et fusion de capteurs.",
    color: "#8b5cf6",
  },
  {
    id: "Computer Vision",
    icon: Eye,
    titleEn: "Computer Vision & Pattern Recognition",
    titleFr: "Vision par Ordinateur & Reconnaissance de Formes",
    descEn: "Custom convolutional neural network architectures from scratch with regularized benchmark training.",
    descFr: "Architectures de réseaux neuronaux convolutifs personnalisées avec régularisation et benchmarks de référence.",
    color: "#f59e0b",
  },
];

function ProjectCard({ project: p, lang, t, expandedComments, toggleComments, priority = false }) {
  const isExternalLive = p.url && !p.url.includes("github.com");

  return (
    <motion.div
      key={p.slug}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.25 }}
      className="ink-reveal card-hover bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all"
    >
      {/* Media with Video / Motion Design */}
      <ProjectMotionMedia
        project={{
          ...p,
          title: lang === "fr" ? p.titleFr : p.title,
          categoryLabel: lang === "fr" ? p.categoryFr : p.category,
        }}
        containerClassName="relative h-60 overflow-hidden bg-black/40"
        priority={priority}
        zoomable
      />

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-foreground font-bold text-xl leading-snug">
            {lang === "fr" ? p.titleFr : p.title}
          </h3>
          <span className="text-foreground text-xs font-mono bg-muted/60 border border-border px-2 py-0.5 rounded flex-shrink-0">
            {typeof p.year === "object" ? p.year[lang] || p.year.en : p.year}
          </span>
        </div>

        {/* Outcome Badge */}
        {p.outcome && (
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold"
              style={{
                background: `color-mix(in srgb, ${p.color} 14%, transparent)`,
                color: `color-mix(in srgb, ${p.color} 55%, hsl(var(--foreground)))`,
                border: `1px solid color-mix(in srgb, ${p.color} 25%, transparent)`,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {lang === "fr" ? p.outcomeFr : p.outcome}
            </span>
          </div>
        )}

        <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">
          {lang === "fr" ? p.descFr : p.desc}
        </p>

        {/* Highlights */}
        <ul className="space-y-1.5 mb-5">
          {(lang === "fr" ? p.highlightsFr : p.highlights).map((h, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
              <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: p.color }} />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {(Array.isArray(p.tags) ? p.tags : p.tags[lang] || p.tags.en).map((tag) => (
            <span
              key={tag}
              className="bg-background border border-border text-muted-foreground text-xs px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Card Actions & Footer */}
        <div className="flex flex-col gap-3 pt-4 border-t border-border mt-auto">
          {/* Action Links Row */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-transform active:scale-95"
                  style={{ backgroundColor: `color-mix(in srgb, ${p.color} 65%, black)` }}
                >
                  <Play className="w-3 h-3 fill-white" />
                  {lang === "fr" ? "Tester le tableau de bord" : "Try Live Dashboard"}
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              )}

              {isExternalLive ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border hover:bg-muted/40"
                  style={{
                    color: `color-mix(in srgb, ${p.color} 55%, hsl(var(--foreground)))`,
                    borderColor: `color-mix(in srgb, ${p.color} 35%, transparent)`,
                  }}
                >
                  <Globe className="w-3 h-3" />
                  {lang === "fr" ? "Voir le site en direct" : "Visit Live Site"}
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ) : (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border border-border text-foreground hover:bg-muted/40"
                >
                  <Github className="w-3 h-3" />
                  {lang === "fr" ? "Voir sur GitHub" : "View Code on GitHub"}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={() => toggleComments(p.slug)}
              aria-expanded={!!expandedComments[p.slug]}
              className="text-xs font-medium transition-colors hover:text-foreground"
              style={{ color: expandedComments[p.slug] ? p.color : "hsl(var(--muted-foreground))" }}
            >
              {expandedComments[p.slug] ? t.projects.hideComments : t.projects.comments}
            </button>
          </div>

          {/* Sub-meta (stars, tech stack) */}
          <div className="flex items-center justify-between text-xs text-muted-foreground/70 font-mono pt-1">
            <span className="flex items-center gap-1">
              <GitBranch className="w-3 h-3" /> {p.lang}
            </span>
            {p.stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {p.stars}
              </span>
            )}
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
              className="mt-4 pt-4 border-t border-border"
            >
              <ProjectComments projectSlug={p.slug} accentColor={p.color} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const { lang, t } = useLang();
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedComments, setExpandedComments] = useState({});

  const categories = ["All", "Web", "Machine Learning", "Forecasting", "Deep Learning", "Computer Vision"];
  const categoryLabels = {
    All: lang === "fr" ? "Tous les types" : "All Types",
    Web: lang === "fr" ? "Plateformes Web" : "Web Platforms",
    "Machine Learning": "Machine Learning / MLOps",
    Forecasting: lang === "fr" ? "Prévision" : "Forecasting",
    "Deep Learning": "Deep Learning",
    "Computer Vision": lang === "fr" ? "Vision par Ordinateur" : "Computer Vision",
  };

  const toggleComments = (slug) => {
    setExpandedComments((prev) => ({ ...prev, [slug]: !prev[slug] }));
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

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{
                background:
                  activeCategory === cat
                    ? "linear-gradient(135deg, hsl(var(--cta-from)), hsl(var(--cta-to)))"
                    : "hsl(var(--card))",
                color: activeCategory === cat ? "white" : "hsl(var(--muted-foreground))",
                border: activeCategory === cat ? "none" : "1px solid hsl(var(--border))",
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Projects Presentation: Grouped when "All", Filtered when Category Selected */}
        {activeCategory === "All" ? (
          <div className="space-y-20">
            {CATEGORY_GROUPS.map((group) => {
              const groupProjects = projects.filter((p) => p.category === group.id);
              if (groupProjects.length === 0) return null;
              const Icon = group.icon;

              return (
                <section key={group.id} className="relative">
                  {/* Category Type Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-border/80">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{
                          background: `color-mix(in srgb, ${group.color} 12%, transparent)`,
                          color: group.color,
                          border: `1px solid color-mix(in srgb, ${group.color} 25%, transparent)`,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{lang === "fr" ? group.titleFr : group.titleEn}</span>
                      </div>
                      <p className="text-muted-foreground text-sm max-w-xl">
                        {lang === "fr" ? group.descFr : group.descEn}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-muted/60 text-muted-foreground w-fit">
                      {groupProjects.length} {lang === "fr" ? (groupProjects.length > 1 ? "projets" : "projet") : (groupProjects.length > 1 ? "projects" : "project")}
                    </span>
                  </div>

                  {/* Projects Grid for this Type */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {groupProjects.map((p, i) => (
                      <ProjectCard
                        key={p.slug}
                        project={p}
                        lang={lang}
                        t={t}
                        expandedComments={expandedComments}
                        toggleComments={toggleComments}
                        priority={i === 0 && group.id === "Web"}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {projects
                .filter((p) => p.category === activeCategory)
                .map((p, i) => (
                  <ProjectCard
                    key={p.slug}
                    project={p}
                    lang={lang}
                    t={t}
                    expandedComments={expandedComments}
                    toggleComments={toggleComments}
                    priority={i < 2}
                  />
                ))}
            </AnimatePresence>
          </div>
        )}

        <div className="text-center mt-16">
          <a
            href="https://github.com/womgaalbert"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Github className="w-4 h-4" /> {t.projects.viewAll}
          </a>
        </div>
      </div>
    </div>
  );
}
