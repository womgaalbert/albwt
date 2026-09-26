import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, Bot, Search, PenTool, BarChart2, Presentation,
  GitBranch, Database, Layers, Zap, CheckCircle, ChevronRight,
  Globe, Cpu, MessageSquare, TrendingUp, FileText, Star
} from "lucide-react";
import AIConsultantChat from "@/components/sandbox/AIConsultantChat";
import RepoAnalyzer from "@/components/sandbox/RepoAnalyzer";
import { useLang } from "@/lib/LanguageContext";
import Seo from "@/components/Seo";

const agents = [
  {
    id: "orchestrator",
    role: { en: "Orchestrator", fr: "Orchestrateur" },
    name: { en: "Chief AI Officer", fr: "Directeur IA" },
    icon: Brain,
    color: "hsl(var(--primary))",
    description: {
      en: "Receives high-level commands, decomposes tasks, delegates to sub-agents, and synthesizes final outputs.",
      fr: "Reçoit les commandes de haut niveau, décompose les tâches, délègue aux sous-agents et synthétise les résultats finaux.",
    },
    tech: ["LangGraph", "AutoGen", "FastAPI"],
  },
  {
    id: "market",
    role: { en: "Sub-Agent 1", fr: "Sous-agent 1" },
    name: { en: "Market Intelligence Analyst", fr: "Analyste de veille marché" },
    icon: Search,
    color: "hsl(var(--brand-blue))",
    description: {
      en: "Scans the web for AI/ML trends, generates competitive analysis reports, and identifies content gaps in target industries.",
      fr: "Parcourt le web à la recherche des tendances IA/ML, produit des analyses concurrentielles et repère les angles de contenu inexploités.",
    },
    tech: ["SerpAPI", "Tavily", "BeautifulSoup"],
  },
  {
    id: "content",
    role: { en: "Sub-Agent 2", fr: "Sous-agent 2" },
    name: { en: "Content Strategy & Creation Studio", fr: "Studio de stratégie et création de contenu" },
    icon: PenTool,
    color: "#8b5cf6",
    description: {
      en: "Plans and drafts LinkedIn posts, Twitter/X threads, and long-form blog articles — adapting tone and style per platform.",
      fr: "Planifie et rédige des publications LinkedIn, des fils X et des articles de fond — en adaptant le ton et le style à chaque plateforme.",
    },
    tech: ["GPT-4o", "Claude", "LangChain"],
  },
  {
    id: "presentation",
    role: { en: "Sub-Agent 3", fr: "Sous-agent 3" },
    name: { en: "Presentation Architect", fr: "Architecte de présentations" },
    icon: Presentation,
    color: "#f59e0b",
    description: {
      en: "Transforms project summaries and research papers into compelling slide decks and visual narratives automatically.",
      fr: "Transforme automatiquement des résumés de projets et des articles de recherche en présentations et récits visuels convaincants.",
    },
    tech: ["python-pptx", "Marp", "D3.js"],
  },
  {
    id: "data",
    role: { en: "Sub-Agent 4", fr: "Sous-agent 4" },
    name: { en: "Data Insight Engine", fr: "Moteur d'analyse de données" },
    icon: BarChart2,
    color: "#ef4444",
    description: {
      en: "Connects to live data science projects, runs analyses on new data, generates result summaries, and creates interactive visualizations.",
      fr: "Se connecte aux projets de data science en cours, analyse les nouvelles données, résume les résultats et crée des visualisations interactives.",
    },
    tech: ["Pandas", "Plotly", "scikit-learn"],
  },
];

const techStack = [
  { layer: { en: "Agent Framework", fr: "Framework d'agents" }, tools: ["LangGraph", "AutoGen"], icon: Bot, color: "hsl(var(--primary))" },
  { layer: { en: "Backend API", fr: "API backend" }, tools: ["Python", "FastAPI", "Pydantic"], icon: Cpu, color: "hsl(var(--brand-blue))" },
  { layer: { en: "Frontend", fr: "Frontend" }, tools: ["React", "Tailwind CSS", "Recharts"], icon: Globe, color: "#8b5cf6" },
  { layer: { en: "Vector Memory", fr: "Mémoire vectorielle" }, tools: ["pgvector", "Pinecone", "RAG"], icon: Database, color: "#f59e0b" },
  { layer: { en: "Deployment", fr: "Déploiement" }, tools: ["Docker", "Kubernetes", "AWS/GCP"], icon: Layers, color: "#10b981" },
];

const features = [
  {
    icon: Zap,
    title: { en: "Live Agent Dashboard", fr: "Tableau de bord des agents en direct" },
    description: {
      en: "Visual interface showing the Orchestrator's workflow, sub-agent statuses, and chain-of-thought as tasks are processed in real time.",
      fr: "Interface visuelle montrant le flux de l'orchestrateur, l'état des sous-agents et leur raisonnement pendant le traitement en temps réel.",
    },
    color: "hsl(var(--primary))",
  },
  {
    icon: GitBranch,
    title: { en: "Automated Project Spotlight", fr: "Mise en avant automatique des projets" },
    description: {
      en: "Push to GitHub → Orchestrator auto-triggers Data Insight + Content Studio agents to generate a blog post and social media thread.",
      fr: "Un push sur GitHub déclenche les agents Analyse de données et Studio de contenu pour produire un article de blogue et un fil social.",
    },
    color: "hsl(var(--brand-blue))",
  },
  {
    icon: TrendingUp,
    title: { en: "Dynamic AI Readiness Score", fr: "Score de maturité IA dynamique" },
    description: {
      en: "Market Intelligence Agent analyzes your LinkedIn & GitHub presence against current industry trends and provides actionable recommendations.",
      fr: "L'agent de veille marché compare votre présence LinkedIn et GitHub aux tendances du secteur et propose des recommandations concrètes.",
    },
    color: "#8b5cf6",
  },
  {
    icon: MessageSquare,
    title: { en: "Interactive AI Consultant", fr: "Consultant IA interactif" },
    description: {
      en: "Public-facing RAG chatbot trained on your résumé, publications, and codebases — answering technical questions about your work.",
      fr: "Agent conversationnel RAG public, nourri de votre CV, de vos publications et de votre code — il répond aux questions techniques sur vos travaux.",
    },
    color: "#f59e0b",
  },
];

const workflow = [
  {
    step: 1,
    label: { en: "User Command", fr: "Commande de l'utilisateur" },
    desc: { en: "High-level instruction received by the Orchestrator", fr: "Instruction de haut niveau reçue par l'orchestrateur" },
    icon: MessageSquare,
  },
  {
    step: 2,
    label: { en: "Task Decomposition", fr: "Décomposition des tâches" },
    desc: { en: "Orchestrator breaks down the goal into atomic sub-tasks", fr: "L'orchestrateur découpe l'objectif en sous-tâches élémentaires" },
    icon: FileText,
  },
  {
    step: 3,
    label: { en: "Agent Delegation", fr: "Délégation aux agents" },
    desc: { en: "Sub-agents assigned and executed in parallel or sequence", fr: "Les sous-agents sont assignés puis exécutés en parallèle ou en séquence" },
    icon: Bot,
  },
  {
    step: 4,
    label: { en: "Result Integration", fr: "Intégration des résultats" },
    desc: { en: "Outputs merged, validated, and formatted by the Orchestrator", fr: "Les sorties sont fusionnées, validées et mises en forme par l'orchestrateur" },
    icon: CheckCircle,
  },
  {
    step: 5,
    label: { en: "Delivery", fr: "Livraison" },
    desc: { en: "Final artifact returned to user (report, post, slide deck…)", fr: "Le livrable final est remis à l'utilisateur (rapport, publication, présentation…)" },
    icon: Star,
  },
];

export default function Sandbox() {
  const { t, lang } = useLang();
  const [activeAgent, setActiveAgent] = useState("orchestrator");
  const selected = agents.find(a => a.id === activeAgent);
  /** @param {any} v */
  const tr = (v) => (v && typeof v === "object" ? v[lang] || v.en : v);

  return (
    <div className="pt-24 pb-20">
      <Seo
        title={{ en: "AI Sandbox — Live Demos", fr: "Bac à sable IA — Démos en direct" }}
        description={{
          en: "Try live AI demos: a GitHub repository analyzer agent running on serverless infrastructure, and more.",
          fr: "Essayez des démos IA en direct : un agent d'analyse de dépôts GitHub sur infrastructure serverless, et plus encore.",
        }}
      />
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
            {t.sandbox.pageBadge}
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-foreground">{t.sandbox.pageTitle}</h1>
          <p className="text-muted-foreground mt-4 max-w-3xl mx-auto text-lg leading-relaxed">
            {t.sandbox.pageIntro}
          </p>
        </motion.div>

        {/* LIVE Demo — GitHub Project Analyzer */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> {t.sandbox.title}
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-3xl">{t.sandbox.subtitle}</p>
          <RepoAnalyzer />
        </motion.div>

        {/* Agent Architecture */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> {t.sandbox.ecosystem}
          </h2>
          <div className="grid lg:grid-cols-5 gap-4 mb-6">
            {agents.map((agent, i) => {
              const Icon = agent.icon;
              const isActive = activeAgent === agent.id;
              return (
                <motion.button
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setActiveAgent(agent.id)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    isActive ? "border-opacity-60 bg-card" : "border-border bg-card hover:border-primary/50"
                  }`}
                  style={{ borderColor: isActive ? agent.color : undefined }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `color-mix(in srgb, ${agent.color} 12%, transparent)` }}>
                    <Icon className="w-5 h-5" style={{ color: agent.color }} />
                  </div>
                  <p className="text-xs font-semibold mb-1" style={{ color: agent.color }}>{tr(agent.role)}</p>
                  <h3 className="text-foreground font-bold text-sm leading-tight">{tr(agent.name)}</h3>
                  {agent.id === "orchestrator" && (
                    <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-700 dark:text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> {t.sandbox.active}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Agent Detail Panel */}
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 grid md:grid-cols-3 gap-6"
              style={{ borderColor: `color-mix(in srgb, ${selected.color} 19%, transparent)` }}
            >
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${selected.color} 12%, transparent)` }}>
                    <selected.icon className="w-5 h-5" style={{ color: selected.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: selected.color }}>{tr(selected.role)}</p>
                    <h3 className="text-foreground font-bold">{tr(selected.name)}</h3>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{tr(selected.description)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">{t.sandbox.techStack}</p>
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map(t => (
                    <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-background border border-border text-foreground/80">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Workflow Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> {t.sandbox.decomposition}
          </h2>
          <div className="flex flex-col md:flex-row gap-0">
            {workflow.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="flex-1 flex md:flex-col items-start md:items-center gap-3 md:gap-2 group">
                  <div className="flex md:flex-col items-center md:w-full">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "hsl(var(--primary) / 0.13)", border: "1px solid hsl(var(--primary) / 0.25)" }}>
                      <Icon className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                    </div>
                    {i < workflow.length - 1 && (
                      <div className="flex-1 h-0.5 md:w-full md:h-0.5 w-0.5 md:mt-0 bg-gradient-to-r from-teal-500/40 to-transparent hidden md:block" />
                    )}
                  </div>
                  <div className="pb-4 md:pb-0 md:text-center md:px-2">
                    <p className="text-foreground font-semibold text-sm">{tr(step.label)}</p>
                    <p className="text-muted-foreground text-xs mt-1">{tr(step.desc)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Star className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> {t.sandbox.dashboardFeatures}
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={tr(f.title)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="bg-card border border-border rounded-2xl p-6 flex gap-4"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `color-mix(in srgb, ${f.color} 8%, transparent)` }}>
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold mb-1">{tr(f.title)}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{tr(f.description)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> {t.sandbox.techStack}
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {techStack.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <motion.div
                  key={tr(layer.layer)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="bg-card border border-border rounded-2xl p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `color-mix(in srgb, ${layer.color} 8%, transparent)` }}>
                    <Icon className="w-5 h-5" style={{ color: layer.color }} />
                  </div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">{tr(layer.layer)}</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {layer.tools.map(t => (
                      <span key={t} className="text-xs text-foreground font-medium bg-background px-2 py-0.5 rounded-full border border-border">{t}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Consultant Chat */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-16">
          <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} /> {t.sandbox.consultant}
          </h2>
          <p className="text-muted-foreground text-sm mb-6">{t.sandbox.consultantIntro}</p>
          <AIConsultantChat />
        </motion.div>

        {/* MVP Roadmap CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderColor: "hsl(var(--primary) / 0.19)" }}
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "hsl(var(--primary))" }}>{t.sandbox.roadmap}</p>
            <h3 className="text-foreground font-black text-xl mb-2">{t.sandbox.phase1}</h3>
            <p className="text-muted-foreground text-sm max-w-xl">{t.sandbox.roadmapText}</p>
          </div>
          <a
            href="https://github.com/womgaalbert"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm flex-shrink-0"
          >
            <GitBranch className="w-4 h-4" /> {t.sandbox.viewOnGithub} <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </div>
  );
}