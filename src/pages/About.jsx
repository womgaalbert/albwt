import { motion } from "framer-motion";
import { Github, Linkedin, MapPin, Calendar, Award, Quote } from "lucide-react";
import { useLang, renderRich } from "@/lib/LanguageContext";
import Seo from "@/components/Seo";

const skills = [
  "Python", "SQL", "R", "Git/GitHub", "REST APIs",
  "XGBoost", "Random Forest", "Scikit-learn", "Feature Engineering", "A/B Testing",
  "DistilBERT", "Transformers", "LSTM/GRU", "RAG + LangChain", "NLP",
  "ARIMA/SARIMA", "Hypothesis Testing", "Statistical Modelling", "Stochastic Analysis",
  "PySpark", "Spark", "ETL", "Data Pipelines",
  "Power BI", "Tableau", "Matplotlib", "Seaborn", "Jupyter",
];

const linkedInEndorsements = [
  {
    quote: {
      en: "Albert provided outstanding statistical consultancy to our research teams. His expertise in biostatistics — from study design and multivariate analysis to clinical modelling — significantly elevated the rigour of our publications and ethics submissions. A rare combination of deep statistical knowledge and genuine pedagogy.",
      fr: "Albert a fourni un accompagnement statistique remarquable à nos équipes de recherche. Son expertise en biostatistique — du plan d'étude à l'analyse multivariée et à la modélisation clinique — a nettement renforcé la rigueur de nos publications et de nos soumissions au comité d'éthique. Une combinaison rare de savoir statistique approfondi et de véritable pédagogie.",
    },
    name: "Prof. Koki Ndoumbo",
    title: { en: "Professor & Dean", fr: "Professeur et doyen" },
    org: { en: "Faculty of Medicine, University of Yaoundé I", fr: "Faculté de médecine, Université de Yaoundé I" },
    initials: "KN",
    color: "#f59e0b",
    relation: { en: "Managed Albert directly", fr: "A encadré Albert directement" },
  },
  {
    quote: {
      en: "Albert built the entire cmavocats.ca platform and integrated an AI document classification system that transformed how we handle legal documents. His NLP pipeline reduced our routing time from minutes to seconds. Remarkable technical depth, clear communication, and genuine commitment to delivering value.",
      fr: "Albert a construit l'intégralité de la plateforme cmavocats.ca et y a intégré un système de classification documentaire par IA qui a transformé notre gestion des documents juridiques. Son pipeline NLP a réduit notre temps d'acheminement de plusieurs minutes à quelques secondes. Une profondeur technique remarquable, une communication claire et un réel souci du résultat.",
    },
    name: "C.M. Avocats",
    title: { en: "Legal Technology Partner", fr: "Partenaire en technologies juridiques" },
    org: { en: "CM Avocats — Gatineau, QC, Canada", fr: "CM Avocats — Gatineau (QC), Canada" },
    initials: "CM",
    color: "#8b5cf6",
    relation: { en: "Client · Legal Tech", fr: "Client · Legal tech" },
  },
  {
    quote: {
      en: "Over more than a decade, Albert consistently delivered institutional analytics of the highest quality. His dashboards and insight reports directly shaped our education policy and budget decisions. He has an exceptional ability to translate complex data into actionable strategy for senior decision-makers.",
      fr: "Pendant plus de dix ans, Albert a livré sans faillir des analyses institutionnelles de très haute qualité. Ses tableaux de bord et ses rapports ont directement orienté notre politique éducative et nos décisions budgétaires. Il a une capacité exceptionnelle à traduire des données complexes en stratégie actionnable pour les décideurs.",
    },
    name: { en: "Ministry Analytics Office", fr: "Bureau d'analyse du ministère" },
    title: { en: "Government Analytics Division", fr: "Division de l'analyse gouvernementale" },
    org: { en: "Ministry of Secondary Education — Cameroon", fr: "Ministère des Enseignements secondaires — Cameroun" },
    initials: "MS",
    color: "#10b981",
    relation: { en: "Senior Stakeholder · 13 years", fr: "Partie prenante · 13 ans" },
  },
  {
    quote: {
      en: "Thank you to Albert Womga for the remarkable development work that turned research data into an interactive dashboard combining machine learning and natural language processing. This collaboration shows what becomes possible when language didactics and artificial intelligence work together in the service of education research.",
      fr: "Merci à Albert Womga pour le remarquable travail de développement qui a permis de transformer des données de recherche en un dashboard interactif intégrant des méthodes de machine learning et de traitement automatique des langues. Cette collaboration illustre les possibilités offertes par le dialogue entre didactique des langues et intelligence artificielle au service de la recherche en éducation.",
    },
    name: "Chancelline Armelle (Fodouop) Nongni Kendjio",
    title: { en: "PhD candidate in French language didactics", fr: "Doctorante en didactique du FLES" },
    org: {
      en: "Student Plurilingual Representation — French Learning Research",
      fr: "Représentation plurilingue des élèves — recherche sur l'apprentissage du français",
    },
    initials: "CA",
    color: "hsl(var(--brand-blue))",
    relation: { en: "Research collaborator · NLP & education", fr: "Collaboratrice de recherche · NLP et éducation" },
  },
];

export default function About() {
  const { t, lang } = useLang();
  /** @param {any} v */
  const tr = (v) => (v && typeof v === "object" ? v[lang] || v.en : v);

  return (
    <div className="pt-24 pb-20">
      <Seo
        title={{ en: "About — AI/ML Engineer", fr: "À propos — Ingénieur IA/ML" }}
        description={{
          en: "Background, skills and experience of Albert Tchaptchet Womga: Data Scientist III, machine learning, LLMs and MLOps.",
          fr: "Parcours, compétences et expérience d'Albert Tchaptchet Womga : Data Scientist III, machine learning, LLM et MLOps.",
        }}
      />
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"hsl(var(--primary))"}}>{t.about.badge}</span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-foreground">{t.about.title}</h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
            {t.about.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Bio + Experience */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-card border border-border rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black text-white" style={{background:"linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))"}}>
                  AW
                </div>
                <div>
                  <h2 className="text-foreground font-bold text-xl">Albert Womga</h2>
                  <p className="text-muted-foreground text-sm">{t.about.role}</p>
                  <div className="flex items-center gap-1 text-muted-foreground/70 text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{t.about.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-4">
                {renderRich(t.about.bio1)}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {renderRich(t.about.bio2)}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {t.about.bio3}
              </p>

              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/womgaalbert" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-background border border-border text-foreground/80 hover:text-foreground hover:border-primary/50 transition-colors px-4 py-2 rounded-xl text-sm">
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/albert-womga-009a7931/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-background border border-border text-foreground/80 hover:text-foreground hover:border-primary/50 transition-colors px-4 py-2 rounded-xl text-sm">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>

            {/* Experience */}
            <h3 className="text-foreground font-bold text-lg mb-4">{t.about.experienceLabel}</h3>
            <div className="space-y-4">
              {t.about.experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{exp.period}</span>
                  </div>
                  <h4 className="text-foreground font-semibold">{exp.role}</h4>
                  <p className="text-sm font-medium mb-2" style={{color:"hsl(var(--primary))"}}>{exp.company}</p>
                  <p className="text-muted-foreground text-sm">{exp.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Skills + Education + Certs */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-card border border-border rounded-2xl p-8 mb-6">
              <h3 className="text-foreground font-bold text-lg mb-6 flex items-center gap-2">
                <Award className="w-5 h-5" style={{color:"hsl(var(--primary))"}} />
                {t.about.skillsLabel}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="bg-background border border-border text-foreground/80 text-sm px-3 py-1.5 rounded-lg hover:border-primary/50 hover:text-primary transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-card border border-border rounded-2xl p-8 mb-6">
              <h3 className="text-foreground font-bold text-lg mb-4">{t.about.educationLabel}</h3>
              {t.about.education.map((ed, i) => (
                <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor:"hsl(var(--primary))"}} />
                  <div>
                    <p className="text-foreground font-medium text-sm">{ed.title}</p>
                    <p className="text-muted-foreground text-xs">{ed.org} · {ed.year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="bg-card border border-border rounded-2xl p-8">
              <h3 className="text-foreground font-bold text-lg mb-4">{t.about.certsLabel}</h3>
              {t.about.certifications.map((cert, i) => (
                <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor:"hsl(var(--brand-blue))"}} />
                  <div>
                    <p className="text-foreground font-medium text-sm">{cert.title}</p>
                    <p className="text-muted-foreground text-xs">{cert.org} · {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* LinkedIn Endorsements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"hsl(var(--primary))"}}>{t.about.endorsementsBadge}</span>
              <h2 className="text-2xl font-black text-foreground mt-1">{t.about.endorsementsTitle}</h2>
            </div>
            <a
              href="https://www.linkedin.com/in/albert-womga-009a7931/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/50 px-4 py-2 rounded-xl transition-colors"
            >
              <Linkedin className="w-4 h-4" style={{color:"#0a66c2"}} /> {t.about.viewLinkedIn}
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {linkedInEndorsements.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4 relative"
              >
                <div className="absolute top-5 right-5 opacity-10" style={{color: e.color}}>
                  <Quote className="w-9 h-9" />
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">"{tr(e.quote)}"</p>
                <div className="border-t border-border" />
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{background: `linear-gradient(135deg, ${e.color}, color-mix(in srgb, ${e.color} 53%, transparent))`}}
                  >
                    {e.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold text-sm">{tr(e.name)}</p>
                    <p className="text-muted-foreground text-xs truncate">{tr(e.title)} · {tr(e.org)}</p>
                  </div>
                  <span className="text-xs text-muted-foreground/70 bg-background border border-border px-2 py-1 rounded-full flex-shrink-0">{tr(e.relation)}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://www.linkedin.com/in/albert-womga-009a7931/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-4 h-4" style={{color:"#0a66c2"}} />
              {t.about.seeAll}
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
