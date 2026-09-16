import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sanitizeUrl, MAX_INPUT_LENGTHS } from "@/lib/sanitize";

const KNOWLEDGE_BASE = `
You are Albert Womga's AI Consultant — an intelligent assistant that answers questions about Albert's professional background, skills, projects, and services. Be concise, confident, and technical when appropriate. Always speak in first person as if you ARE Albert's representative.

=== PROFESSIONAL PROFILE ===
Name: Albert Tchaptchet Womga
Title: Data Scientist & AI/ML Specialist
Location: Ottawa, Canada (serving Canada & Cameroon)
Email: contact@albwt.com
LinkedIn: linkedin.com/in/albert-womga-009a7931/
GitHub: github.com/womgaalbert

=== EDUCATION ===
- M.Sc. Applied Statistics — University of Yaoundé I, Cameroon
- B.Sc. Mathematics & Statistics — University of Yaoundé I, Cameroon
- Certifications: IBM Data Science Professional Certificate, DeepLearning.AI ML Specialization, Google Data Analytics

=== CORE SKILLS ===
Languages: Python (expert), R (expert), SQL, JavaScript
ML/AI: scikit-learn, TensorFlow, PyTorch, Hugging Face, LangChain, LangGraph
Data: Pandas, NumPy, Spark, dbt, PostgreSQL, MongoDB
Visualization: Plotly, Dash, Streamlit, Tableau, Power BI, Recharts
Cloud & DevOps: AWS, GCP, Docker, Kubernetes, FastAPI
Statistics: Time series (ARIMA, Prophet), Survival analysis, Bayesian methods, Biostatistics, Causal inference

=== WORK EXPERIENCE ===
1. Data Scientist & Biostatistical Consultant — Faculty of Medicine, University of Yaoundé I
2. Data Analyst / Statistical Officer — Ministry of Secondary Education, Cameroon (10+ years)
3. Full-Stack Developer & AI Integrator — CM Avocats, Gatineau, QC, Canada
4. Freelance AI/ML Consultant — Canada & Cameroon (Ongoing)

=== PROJECTS ===
1. Time Series Forecasting (ARIMA/Prophet)
2. NLP Document Classifier — Legal document routing for CM Avocats (cmavocats.ca)
3. AI Executive Dashboard — Multi-agent system (LangGraph + FastAPI + React)
4. Education Analytics Platform — Cameroon Ministry of Secondary Education
5. Biostatistics Research Support — Faculty of Medicine, University of Yaoundé I
6. Sentiment Analysis API — Real-time text sentiment scoring
7. Computer Vision Classifier — Image classification using fine-tuned CNNs

=== SERVICES OFFERED ===
- Machine Learning Solutions
- Predictive Analytics & Time Series Forecasting
- Natural Language Processing & Text Analytics
- Computer Vision Systems
- Data Analysis, Visualization & Dashboard Development
- AI Strategy Consulting & ML Roadmap Design
- Biostatistics & Research Consultancy
- Full-Stack AI-powered Web Applications

=== AVAILABILITY ===
Available for new projects. Response time within 24 hours.
Focus markets: Canada (Ottawa/Quebec) and Cameroon.
Open to remote work globally.
`;

const SUGGESTED_QUESTIONS = [
  "What are Albert's core AI/ML skills?",
  "Tell me about the CM Avocats project",
  "What is the AI Executive Dashboard?",
  "How can Albert help my business?",
  "What's Albert's experience in biostatistics?",
  "What tech stack does Albert use?",
];

/**
 * Mock LLM response generator for the AI Consultant.
 * Uses keyword matching against the knowledge base to return relevant excerpts.
 */
function getMockResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  if (msg.includes('skill') || msg.includes('expertise') || msg.includes('tech stack') || msg.includes('tool')) {
    return `Albert's core technical skills include:\n\n**Languages:** Python (expert), R (expert), SQL, JavaScript\n\n**ML/AI:** scikit-learn, TensorFlow, PyTorch, Hugging Face, LangChain, LangGraph\n\n**Data:** Pandas, NumPy, Spark, dbt, PostgreSQL, MongoDB\n\n**Cloud & DevOps:** AWS, GCP, Docker, Kubernetes, FastAPI\n\n**Statistics:** Time series (ARIMA, Prophet), Survival analysis, Bayesian methods, Biostatistics, Causal inference\n\n> 💡 *This is a demo response from a keyword-matching engine. In production, this would be powered by a RAG pipeline with a real LLM.*`;
  }

  if (msg.includes('cm avocat') || msg.includes('legal') || msg.includes('nlp') || msg.includes('document')) {
    return `The **CM Avocats project** was a full-stack legal platform built for a law firm in Gatineau, QC, Canada.\n\n**Key achievements:**\n- Built the complete **cmavocats.ca** platform from scratch\n- Integrated a **two-stage NLP classification pipeline** (DistilBERT + XGBoost) that automated legal document categorization across 6 classes\n- Reduced document routing time from **3–4 minutes to under 2 seconds**\n- Integrated **RAG + LangChain** document querying into the production platform\n\nThis project demonstrates full-stack AI integration in a real legal practice setting.\n\n> 💡 *Demo mode — keyword-based response.*`;
  }

  if (msg.includes('dashboard') || msg.includes('executive') || msg.includes('agent') || msg.includes('orchestrat')) {
    return `The **AI Executive Dashboard** is Albert's flagship multi-agent system concept:\n\n**Architecture:**\n- **Orchestrator Agent** (Chief AI Officer) using LangGraph/AutoGen — decomposes tasks and delegates to sub-agents\n- **Sub-Agent 1:** Market Intelligence Analyst — web scanning, competitive analysis\n- **Sub-Agent 2:** Content Strategy & Creation Studio — LinkedIn, Twitter, blog drafts\n- **Sub-Agent 3:** Presentation Architect — auto slide deck generation\n- **Sub-Agent 4:** Data Insight Engine — live data analysis + interactive visualizations\n\n**Tech Stack:** LangGraph, FastAPI, React, pgvector/Pinecone (RAG), Docker, Kubernetes, AWS/GCP\n\n> 💡 *Demo mode — keyword-based response.*`;
  }

  if (msg.includes('biostat') || msg.includes('medical') || msg.includes('clinical') || msg.includes('medicine')) {
    return `Albert has extensive biostatistics experience:\n\n- Provided statistical consultancy to research teams at the **Faculty of Medicine, University of Yaoundé I** under Prof. Koki Ndoumbo\n- **Study design**, multivariate analysis, and clinical modelling for medical publications and ethics submissions\n- Elevated the rigour of research output and grant applications\n- Mentored graduate students in statistical methodology\n\nHis Master's degree is in **Applied Statistics**, giving him a strong theoretical foundation.\n\n> 💡 *Demo mode — keyword-based response.*`;
  }

  if (msg.includes('business') || msg.includes('help') || msg.includes('service') || msg.includes('hire') || msg.includes('consult')) {
    return `Albert can help your organization in several ways:\n\n**AI/ML Solutions:** Custom end-to-end ML pipelines tailored to your business challenges\n\n**Predictive Analytics:** Time series forecasting, demand prediction, anomaly detection\n\n**NLP & Text Analytics:** Document classification, sentiment analysis, chatbot development\n\n**AI Strategy Consulting:** AI readiness assessment, data strategy, use case identification, team training\n\n**Full-Stack AI Apps:** Complete web applications with integrated AI capabilities\n\nHe serves clients in **Canada and Cameroon** with availability for remote work globally. Response time is within 24 hours.\n\n> 💡 *Demo mode — keyword-based response.*`;
  }

  if (msg.includes('experience') || msg.includes('background') || msg.includes('work') || msg.includes('career')) {
    return `Albert has **15+ years of experience** across government, healthcare, and legal tech:\n\n1. **Data Scientist & Biostatistical Consultant** — Faculty of Medicine, University of Yaoundé I\n2. **Data Analyst / Statistical Officer** — Ministry of Secondary Education, Cameroon (10+ years)\n3. **Full-Stack Developer & AI Integrator** — CM Avocats, Gatineau, QC, Canada\n4. **Freelance AI/ML Consultant** — Canada & Cameroon (Ongoing)\n\nHe holds a **Master's in Applied Statistics** and is completing a Post-Graduate Diploma in AI & Machine Learning at CIMT College, Ottawa.\n\n> 💡 *Demo mode — keyword-based response.*`;
  }

  if (msg.includes('project') || msg.includes('portfolio')) {
    return `Albert's key projects include:\n\n1. **Time Series Forecasting (ARIMA/Prophet)** — Energy & telecom demand forecasting\n2. **NLP Document Classifier** — Legal document routing for CM Avocats\n3. **AI Executive Dashboard** — Multi-agent automation system\n4. **Education Analytics Platform** — Dashboards for Cameroon Ministry of Education\n5. **Biostatistics Research Support** — Clinical study design & analysis\n6. **Sentiment Analysis API** — Real-time text sentiment scoring\n7. **Computer Vision Classifier** — CNN-based image classification\n\nAll projects are on GitHub at **github.com/womgaalbert**.\n\n> 💡 *Demo mode — keyword-based response.*`;
  }

  // Fallback
  return `Thanks for your question! Based on Albert's profile, I can tell you that he's a Data Scientist & AI/ML Specialist with 15+ years of experience in Python, ML/AI, and statistical analysis — serving clients in Canada and Cameroon.\n\nFor more specific information, try asking about:\n- His **core skills** and tech stack\n- The **CM Avocats** legal AI project\n- The **AI Executive Dashboard** concept\n- His **biostatistics** experience\n- How he can **help your business**\n\n> 💡 *Demo mode — this is a keyword-based mock. A production version would use a RAG pipeline with a real LLM for more nuanced responses.*`;
}

export default function AIConsultantChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm Albert's AI Consultant. I'm trained on his resume, projects, and expertise. Ask me anything about his background, services, or how he can help your organization. *(Demo mode — keyword-based responses)*",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    setError(null);

    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      const response = getMockResponse(userText);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (err) {
      setError("Failed to get a response. Please try again.");
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reset = () => {
    setMessages([{
      role: "assistant",
      content: "Hi! I'm Albert's AI Consultant. I'm trained on his resume, projects, and expertise. Ask me anything about his background, services, or how he can help your organization. *(Demo mode — keyword-based responses)*",
    }]);
    setInput("");
    setError(null);
  };

  return (
    <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl overflow-hidden flex flex-col" style={{ height: "600px" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a3a]" style={{ background: "#0a0f1e" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#00d4b820" }}>
            <Bot className="w-5 h-5" style={{ color: "#00d4b8" }} />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Albert's AI Consultant</p>
            <p className="text-gray-500 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Demo mode · Keyword-based responses
            </p>
          </div>
        </div>
        <button onClick={reset} className="text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-[#1e2a3a]" title="Reset chat">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {SUGGESTED_QUESTIONS.map(q => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#1e2a3a] text-gray-400 hover:text-white hover:border-teal-500/50 transition-all bg-[#0a0f1e]"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: msg.role === "user" ? "#0066ff20" : "#00d4b820",
                }}
              >
                {msg.role === "user"
                  ? <User className="w-4 h-4" style={{ color: "#0066ff" }} />
                  : <Sparkles className="w-4 h-4" style={{ color: "#00d4b8" }} />
                }
              </div>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#0066ff15] border border-[#0066ff30] text-gray-200 rounded-tr-sm"
                    : "bg-[#0a0f1e] border border-[#1e2a3a] text-gray-300 rounded-tl-sm"
                }`}
              >
                {msg.role === "assistant"
                  ? <ReactMarkdown
                      className="prose prose-sm prose-invert max-w-none"
                      components={{
                        a: ({ children, href }) => (
                          <a href={sanitizeUrl(href) || "#"} target="_blank" rel="noopener noreferrer" style={{color: "#00d4b8"}}>
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  : msg.content
                }
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {error && (
          <div className="text-red-400 text-xs text-center py-2">{error}</div>
        )}

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#00d4b820" }}>
              <Sparkles className="w-4 h-4" style={{ color: "#00d4b8" }} />
            </div>
            <div className="bg-[#0a0f1e] border border-[#1e2a3a] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-[#1e2a3a]" style={{ background: "#0a0f1e" }}>
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Albert's skills, projects, or services..."
            rows={1}
            className="flex-1 bg-[#111827] border border-[#1e2a3a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-colors resize-none placeholder-gray-600"
            maxLength={MAX_INPUT_LENGTHS.chatMessage}
            style={{ maxHeight: "100px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #00d4b8, #0066ff)" }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        <p className="text-gray-600 text-xs mt-2 text-center">Press Enter to send · Shift+Enter for new line · Demo mode</p>
      </div>
    </div>
  );
}
