import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain, Bot, Search, PenTool, BarChart2, Presentation,
  GitBranch, Database, Layers, Zap, CheckCircle, ChevronRight,
  Globe, Cpu, MessageSquare, TrendingUp, FileText, Star
} from "lucide-react";
import AIConsultantChat from "@/components/sandbox/AIConsultantChat";

const agents = [
  {
    id: "orchestrator",
    role: "Orchestrator",
    name: "Chief AI Officer",
    icon: Brain,
    color: "#00d4b8",
    description: "Receives high-level commands, decomposes tasks, delegates to sub-agents, and synthesizes final outputs.",
    tech: ["LangGraph", "AutoGen", "FastAPI"],
    status: "active",
  },
  {
    id: "market",
    role: "Sub-Agent 1",
    name: "Market Intelligence Analyst",
    icon: Search,
    color: "#0066ff",
    description: "Scans the web for AI/ML trends, generates competitive analysis reports, and identifies content gaps in target industries.",
    tech: ["SerpAPI", "Tavily", "BeautifulSoup"],
    status: "idle",
  },
  {
    id: "content",
    role: "Sub-Agent 2",
    name: "Content Strategy & Creation Studio",
    icon: PenTool,
    color: "#8b5cf6",
    description: "Plans and drafts LinkedIn posts, Twitter/X threads, and long-form blog articles — adapting tone and style per platform.",
    tech: ["GPT-4o", "Claude", "LangChain"],
    status: "idle",
  },
  {
    id: "presentation",
    role: "Sub-Agent 3",
    name: "Presentation Architect",
    icon: Presentation,
    color: "#f59e0b",
    description: "Transforms project summaries and research papers into compelling slide decks and visual narratives automatically.",
    tech: ["python-pptx", "Marp", "D3.js"],
    status: "idle",
  },
  {
    id: "data",
    role: "Sub-Agent 4",
    name: "Data Insight Engine",
    icon: BarChart2,
    color: "#ef4444",
    description: "Connects to live data science projects, runs analyses on new data, generates result summaries, and creates interactive visualizations.",
    tech: ["Pandas", "Plotly", "scikit-learn"],
    status: "idle",
  },
];

const techStack = [
  { layer: "Agent Framework", tools: ["LangGraph", "AutoGen"], icon: Bot, color: "#00d4b8" },
  { layer: "Backend API", tools: ["Python", "FastAPI", "Pydantic"], icon: Cpu, color: "#0066ff" },
  { layer: "Frontend", tools: ["React", "Tailwind CSS", "Recharts"], icon: Globe, color: "#8b5cf6" },
  { layer: "Vector Memory", tools: ["pgvector", "Pinecone", "RAG"], icon: Database, color: "#f59e0b" },
  { layer: "Deployment", tools: ["Docker", "Kubernetes", "AWS/GCP"], icon: Layers, color: "#10b981" },
];

const features = [
  {
    icon: Zap,
    title: "Live Agent Dashboard",
    description: "Visual interface showing the Orchestrator's workflow, sub-agent statuses, and chain-of-thought as tasks are processed in real time.",
    color: "#00d4b8",
  },
  {
    icon: GitBranch,
    title: "Automated Project Spotlight",
    description: "Push to GitHub → Orchestrator auto-triggers Data Insight + Content Studio agents to generate a blog post and social media thread.",
    color: "#0066ff",
  },
  {
    icon: TrendingUp,
    title: "Dynamic AI Readiness Score",
    description: "Market Intelligence Agent analyzes your LinkedIn & GitHub presence against current industry trends and provides actionable recommendations.",
    color: "#8b5cf6",
  },
  {
    icon: MessageSquare,
    title: "Interactive AI Consultant",
    description: "Public-facing RAG chatbot trained on your résumé, publications, and codebases — answering technical questions about your work.",
    color: "#f59e0b",
  },
];

const workflow = [
  { step: 1, label: "User Command", desc: "High-level instruction received by the Orchestrator", icon: MessageSquare },
  { step: 2, label: "Task Decomposition", desc: "Orchestrator breaks down the goal into atomic sub-tasks", icon: FileText },
  { step: 3, label: "Agent Delegation", desc: "Sub-agents assigned and executed in parallel or sequence", icon: Bot },
  { step: 4, label: "Result Integration", desc: "Outputs merged, validated, and formatted by the Orchestrator", icon: CheckCircle },
  { step: 5, label: "Delivery", desc: "Final artifact returned to user (report, post, slide deck…)", icon: Star },
];

export default function Sandbox() {
  const [activeAgent, setActiveAgent] = useState("orchestrator");
  const selected = agents.find(a => a.id === activeAgent);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#00d4b8" }}>
            System Architecture
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-white">AI Executive Dashboard</h1>
          <p className="text-gray-400 mt-4 max-w-3xl mx-auto text-lg leading-relaxed">
            A modular, agent-based platform where a central <span style={{ color: "#00d4b8" }} className="font-semibold">Orchestrator Agent</span> manages a team of
            specialized sub-agents to automate professional content and project workflows.
          </p>
        </motion.div>

        {/* Agent Architecture */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain className="w-5 h-5" style={{ color: "#00d4b8" }} /> Agentic Ecosystem
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
                    isActive ? "border-opacity-60 bg-[#111827]" : "border-[#1e2a3a] bg-[#111827] hover:border-gray-600"
                  }`}
                  style={{ borderColor: isActive ? agent.color : undefined }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${agent.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: agent.color }} />
                  </div>
                  <p className="text-xs font-semibold mb-1" style={{ color: agent.color }}>{agent.role}</p>
                  <h3 className="text-white font-bold text-sm leading-tight">{agent.name}</h3>
                  {agent.id === "orchestrator" && (
                    <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Active
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
              className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6 grid md:grid-cols-3 gap-6"
              style={{ borderColor: `${selected.color}30` }}
            >
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${selected.color}20` }}>
                    <selected.icon className="w-5 h-5" style={{ color: selected.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: selected.color }}>{selected.role}</p>
                    <h3 className="text-white font-bold">{selected.name}</h3>
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{selected.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map(t => (
                    <span key={t} className="px-3 py-1 rounded-full text-xs font-medium bg-[#0a0f1e] border border-[#1e2a3a] text-gray-300">{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Workflow Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5" style={{ color: "#00d4b8" }} /> Task Decomposition Engine
          </h2>
          <div className="flex flex-col md:flex-row gap-0">
            {workflow.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="flex-1 flex md:flex-col items-start md:items-center gap-3 md:gap-2 group">
                  <div className="flex md:flex-col items-center md:w-full">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#00d4b820", border: "1px solid #00d4b840" }}>
                      <Icon className="w-4 h-4" style={{ color: "#00d4b8" }} />
                    </div>
                    {i < workflow.length - 1 && (
                      <div className="flex-1 h-0.5 md:w-full md:h-0.5 w-0.5 md:mt-0 bg-gradient-to-r from-teal-500/40 to-transparent hidden md:block" />
                    )}
                  </div>
                  <div className="pb-4 md:pb-0 md:text-center md:px-2">
                    <p className="text-white font-semibold text-sm">{step.label}</p>
                    <p className="text-gray-500 text-xs mt-1">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5" style={{ color: "#00d4b8" }} /> Dashboard Features
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6 flex gap-4"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-5 h-5" style={{ color: "#00d4b8" }} /> Tech Stack
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {techStack.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <motion.div
                  key={layer.layer}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-5 text-center"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${layer.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: layer.color }} />
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{layer.layer}</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {layer.tools.map(t => (
                      <span key={t} className="text-xs text-white font-medium bg-[#0a0f1e] px-2 py-0.5 rounded-full border border-[#1e2a3a]">{t}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Consultant Chat */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-16">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" style={{ color: "#00d4b8" }} /> Interactive AI Consultant
          </h2>
          <p className="text-gray-500 text-sm mb-6">Ask anything about Albert's background, projects, or services — powered by a RAG-style knowledge base.</p>
          <AIConsultantChat />
        </motion.div>

        {/* MVP Roadmap CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ borderColor: "#00d4b830" }}
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#00d4b8" }}>MVP Roadmap</p>
            <h3 className="text-white font-black text-xl mb-2">Starting with the Core</h3>
            <p className="text-gray-400 text-sm max-w-xl">
              Phase 1 focuses on the <strong className="text-white">Orchestrator + Content Studio + GitHub Project Analyzer</strong> using LangGraph —
              deployed with Docker on AWS. Iterate from there.
            </p>
          </div>
          <a
            href="https://github.com/womgaalbert"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white text-sm flex-shrink-0"
          >
            <GitBranch className="w-4 h-4" /> View on GitHub <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

      </div>
    </div>
  );
}