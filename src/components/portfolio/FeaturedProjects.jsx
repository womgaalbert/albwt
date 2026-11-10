import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ExternalLink, Star, ArrowRight, Sparkles } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";
import ProjectMotionMedia from "@/components/media/ProjectMotionMedia";

const projects = [
  {
    title: { en: "CLEARY CLEANING", fr: "CLEARY CLEANING" },
    desc: {
      en: "A complete bilingual cleaning service I designed and built end to end — brand, website and booking flow — for Ottawa and Gatineau. Customers send a request, see their price upfront and book in under three minutes, and their contact with their cleaner stays private through a masked number and a chat that closes after the job.",
      fr: "Un service de ménage bilingue que j'ai conçu et construit de bout en bout — marque, site web et réservation — pour Ottawa et Gatineau. Le client envoie une demande, voit son prix à l'avance et réserve en moins de trois minutes, et son contact avec son aide-ménagère reste privé grâce à un numéro masqué et à une messagerie qui se ferme après le travail.",
    },
    tags: {
      en: ["Bilingual EN/FR", "Booking Platform", "Brand & Logo", "12 Services", "Video Series", "Ottawa & Gatineau"],
      fr: ["Bilingue EN/FR", "Plateforme de réservation", "Marque & Logo", "12 services", "Série vidéo", "Ottawa & Gatineau"],
    },
    category: "Live Client Project",
    categoryFr: "Projet Client en Ligne",
    motionType: "browser",
    loop: "/videos/projects/cleary-cleaning-loop.mp4",
    video: "/videos/projects/cleary-cleaning.mp4",
    image: "/images/projects/cleary-cleaning-poster.webp",
    outcome: {
      en: "Live Business · Upfront Pricing & <3min Booking",
      fr: "Entreprise en Ligne · Prix Transparent & Réservation <3min",
    },
    stars: 0,
    lang: "Live Platform · Full Stack",
    url: "https://clearycleaning.ca",
    color: "#0284c7",
  },
  {
    title: { en: "MIALINE GIFTED HANDS", fr: "MIALINE GIFTED HANDS" },
    desc: {
      en: "A bilingual resto-bar website I designed and built end to end for a Cameroonian restaurant at Carrefour Obili, Yaoundé. The full menu is online with prices, customers build a cart on the site and send their order through a WhatsApp form — for eating in, taking away, or delivery to home or office — and the catering pages take bookings for birthdays, weddings and company events.",
      fr: "Le site web d'un resto-bar camerounais que j'ai conçu et construit de bout en bout, au Carrefour Obili à Yaoundé. Le menu complet est en ligne avec les prix, les clients composent leur panier sur le site et envoient leur commande par un formulaire WhatsApp — sur place, à emporter ou en livraison à domicile ou au bureau — et les pages traiteur prennent les réservations pour anniversaires, mariages et événements d'entreprise.",
    },
    tags: {
      en: ["Bilingual FR/EN", "Menu & Ordering", "WhatsApp Cart", "Catering", "Yaoundé", "Cameroon"],
      fr: ["Bilingue FR/EN", "Menu & Commande", "Panier WhatsApp", "Traiteur", "Yaoundé", "Cameroun"],
    },
    category: "Live Client Project",
    categoryFr: "Projet Client en Ligne",
    motionType: "restaurant",
    loop: "/videos/projects/mialine-loop.mp4",
    video: "/videos/projects/mialine-presentation-60s.mp4",
    image: "/images/projects/mialine-poster.webp",
    outcome: {
      en: "Live Client Business · 45 Menu Items & WhatsApp Cart",
      fr: "Activité Client en Ligne · 45 Plats & Panier WhatsApp",
    },
    stars: 0,
    lang: "Live Platform · Full Stack",
    url: "https://mialinegiftedhands.com",
    color: "#e11d48",
  },
  {
    title: { en: "CM Avocat — Legal Tech Practice", fr: "CM Avocat — Plateforme Juridique" },
    desc: {
      en: "Bilingual legal technology platform for Cabinet CM Avocat (led by Me Charles Mbakop, offices in Gatineau & Calgary). Integrates automated legal intake across immigration, business, civil, penal, and family law, 20–30 min evaluation consultation booking, and an NLP classification pipeline routing cases in 0.4 seconds.",
      fr: "Plateforme technologique bilingue pour le Cabinet CM Avocat (dirigé par Me Charles Mbakop, bureaux à Gatineau & Calgary). Intègre l'accueil automatisé en droit de l'immigration, des affaires, civil, pénal et familial, la réservation de consultation (20-30 min) et un pipeline NLP routant les dossiers en 0.4 seconde.",
    },
    tags: {
      en: ["Legal Tech", "NLP Triage", "Gatineau & Calgary", "Immigration Law", "Bilingual EN/FR"],
      fr: ["Legal Tech", "Triage NLP", "Gatineau & Calgary", "Immigration", "Bilingue FR/EN"],
    },
    category: "Live Client Project",
    categoryFr: "Projet Client en Ligne",
    motionType: "browser",
    loop: "/videos/projects/cmavocat-loop.mp4",
    video: "/videos/projects/cmavocat-presentation-60s.mp4",
    image: "/images/projects/cmavocat-poster.webp",
    outcome: {
      en: "AI Document Routing · 0.4s Latency | Gatineau & Calgary",
      fr: "Routage IA de Documents · Latence 0.4s | Gatineau & Calgary",
    },
    stars: 0,
    lang: "Full Stack · AI Triage",
    url: "https://cmavocat.ca",
    color: "#6366f1",
  },
  {
    title: {
      en: "French Learning — Databricks ML",
      fr: "Apprentissage du Français — Databricks ML",
    },
    desc: {
      en: "Production machine-learning platform on Databricks serverless built for doctoral research on Cameroonian students' plurilingual representations of French. Runs full lakehouse lifecycle: Delta Lake & Unity Catalog, 8-task Databricks Workflows, MLflow registry, and a unified scale-to-zero Model Serving endpoint powering a live Streamlit app.",
      fr: "Plateforme ML de production sur Databricks serverless conçue pour une recherche doctorale sur les représentations plurilingues du français au Cameroun. Cycle lakehouse complet : Delta Lake & Unity Catalog, Workflow à 8 tâches, registre MLflow et Model Serving unifié alimentant une application Streamlit en direct.",
    },
    tags: {
      en: ["Databricks", "Unity Catalog", "Delta Lake", "MLflow", "Model Serving", "Streamlit"],
      fr: ["Databricks", "Unity Catalog", "Delta Lake", "MLflow", "Model Serving", "Streamlit"],
    },
    category: "Machine Learning",
    categoryFr: "Machine Learning",
    motionType: "pipeline",
    image: "/images/projects/student-plurilingual-databricks.webp",
    outcome: {
      en: "Databricks Lakehouse · Unity Catalog + Streamlit Live",
      fr: "Lakehouse Databricks · Unity Catalog + Streamlit Live",
    },
    stars: 0,
    lang: "Databricks · Python",
    url: "https://github.com/womgaalbert/Student-Plurilingual-Representation-French-Learning-Databricks",
    demoUrl: "https://student-plurilingual-representation-french-learning-htyukpvkoo.streamlit.app/",
    color: "#10b981",
  },
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
    category: "Forecasting",
    categoryFr: "Prévision",
    motionType: "forecast",
    image: "/images/projects/energy-arima-forecasting.svg",
    outcome: {
      en: "FRED 1939–2025 · Multi-step Forecast",
      fr: "FRED 1939–2025 · Prévision Multi-étapes",
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
    category: "Sensor Fusion",
    categoryFr: "Fusion de Capteurs",
    motionType: "sensor",
    image: "/images/projects/bfrb-sensor-fusion.svg",
    outcome: {
      en: "LSTM + Transformer · 98.4% Accuracy",
      fr: "LSTM + Transformer · Précision 98.4%",
    },
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Detect-Behavior-with-Sensor-Data",
    color: "hsl(var(--brand-blue))",
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
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
            {t.featured.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 text-white">{t.featured.title}</h2>
          <p className="text-footer-foreground/80 mt-4 max-w-xl mx-auto">
            {t.featured.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-hover bg-card border border-border rounded-2xl overflow-hidden flex flex-col group shadow-lg"
            >
              {/* Motion Media Top Container */}
              <ProjectMotionMedia
                project={{
                  ...p,
                  title: tr(p.title),
                  categoryLabel: lang === "fr" && p.categoryFr ? p.categoryFr : p.category,
                }}
                containerClassName="relative h-48 overflow-hidden bg-black/40"
              />

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-foreground font-bold text-lg leading-snug">{tr(p.title)}</h3>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground/70 hover:text-foreground transition-colors p-1"
                    aria-label={`Open ${tr(p.title)}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Outcome Badge */}
                <div className="mb-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-semibold"
                    style={{
                      background: `color-mix(in srgb, ${p.color} 14%, transparent)`,
                      color: p.color,
                      border: `1px solid color-mix(in srgb, ${p.color} 25%, transparent)`,
                    }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {tr(p.outcome)}
                  </span>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{tr(p.desc)}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {trList(p.tags).map((tag) => (
                    <span key={tag} className="bg-background border border-border text-muted-foreground text-xs px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground/70 pt-3 border-t border-border mt-auto">
                  <span className="font-mono">{p.lang}</span>
                  <div className="flex items-center gap-2">
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold hover:underline"
                        style={{ color: p.color }}
                      >
                        {lang === "fr" ? "Tester l'app" : "Try live app"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {p.url && !p.url.includes("github.com") ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold hover:underline"
                        style={{ color: p.color }}
                      >
                        {lang === "fr" ? "Voir le site" : "Visit site"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    ) : p.stars > 0 ? (
                      <span className="flex items-center gap-1 font-mono">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {p.stars}
                      </span>
                    ) : (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-muted-foreground hover:text-foreground hover:underline"
                      >
                        GitHub <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to={createPageUrl("Projects")}
            className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all"
            style={{ color: "hsl(var(--primary))" }}
          >
            {t.featured.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
