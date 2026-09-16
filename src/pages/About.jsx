import { motion } from "framer-motion";
import { Github, Linkedin, MapPin, Calendar, Award, Quote } from "lucide-react";

const skills = [
  "Python", "SQL", "R", "Git/GitHub", "REST APIs",
  "XGBoost", "Random Forest", "Scikit-learn", "Feature Engineering", "A/B Testing",
  "DistilBERT", "Transformers", "LSTM/GRU", "RAG + LangChain", "NLP",
  "ARIMA/SARIMA", "Hypothesis Testing", "Statistical Modelling", "Stochastic Analysis",
  "PySpark", "Spark", "ETL", "Data Pipelines",
  "Power BI", "Tableau", "Matplotlib", "Seaborn", "Jupyter",
];

const experiences = [
  {
    period: "2024 – Present",
    role: "AI Assistance / Data Scientist",
    company: "CM Avocats — Gatineau, QC, Canada",
    desc: "Led end-to-end conception, development, and launch of cmavocats.ca. Built a two-stage NLP classification pipeline (DistilBERT + XGBoost) to automate legal document categorisation across 6 classes — reducing routing time from 3–4 min to under 2 seconds. Integrated RAG + LangChain document querying into the production platform.",
  },
  {
    period: "2011 – 2024",
    role: "Senior Data Scientist / Business Insights Lead",
    company: "Ministry of Secondary Education — Cameroon",
    desc: "Managed a large-scale analytics portfolio covering 5,000+ institutions. Translated complex government objectives into predictive models, dashboards, and insight reports informing policy, budget, and operational strategy at the senior level.",
  },
  {
    period: "2010 – 2018",
    role: "Biostatistician",
    company: "Faculty of Medicine, University of Yaoundé I — Cameroon",
    desc: "Delivered statistical advisory to medical researchers. Designed predictive clinical models, multivariate analyses, and data mining pipelines for large-scale healthcare research. Mentored graduate students in statistical methodology.",
  },
];

const education = [
  { title: "Post-Graduate Diploma — AI & Machine Learning", org: "CIMT College, Ottawa", year: "2025–2026" },
  { title: "Master's Degree — Applied Statistics", org: "National Advanced School of Engineering, Cameroon", year: "2006–2007" },
  { title: "Diploma in Mathematics", org: "University of Yaoundé", year: "2005–2006" },
];

const linkedInEndorsements = [
  {
    quote: "Albert provided outstanding statistical consultancy to our research teams. His expertise in biostatistics — from study design and multivariate analysis to clinical modelling — significantly elevated the rigour of our publications and ethics submissions. A rare combination of deep statistical knowledge and genuine pedagogy.",
    name: "Prof. Koki Ndoumbo",
    title: "Professor & Dean",
    org: "Faculty of Medicine, University of Yaoundé I",
    initials: "KN",
    color: "#f59e0b",
    relation: "Managed Albert directly",
  },
  {
    quote: "Albert built the entire cmavocats.ca platform and integrated an AI document classification system that transformed how we handle legal documents. His NLP pipeline reduced our routing time from minutes to seconds. Remarkable technical depth, clear communication, and genuine commitment to delivering value.",
    name: "C.M. Avocats",
    title: "Legal Technology Partner",
    org: "CM Avocats — Gatineau, QC, Canada",
    initials: "CM",
    color: "#8b5cf6",
    relation: "Client · Legal Tech",
  },
  {
    quote: "Over more than a decade, Albert consistently delivered institutional analytics of the highest quality. His dashboards and insight reports directly shaped our education policy and budget decisions. He has an exceptional ability to translate complex data into actionable strategy for senior decision-makers.",
    name: "Ministry Analytics Office",
    title: "Government Analytics Division",
    org: "Ministry of Secondary Education — Cameroon",
    initials: "MS",
    color: "#10b981",
    relation: "Senior Stakeholder · 13 years",
  },
  {
    quote: "Merci à Albert Womga pour le remarquable travail de développement qui a permis de transformer des données de recherche en un dashboard interactif intégrant des méthodes de machine learning et de traitement automatique des langues. Cette collaboration illustre les possibilités offertes par le dialogue entre didactique des langues et intelligence artificielle au service de la recherche en éducation.",
    name: "Chancelline Armelle (Fodouop) Nongni Kendjio",
    title: "Doctorante en Didactique du FLES",
    org: "Student Plurilingual Representation — French Learning Research",
    initials: "CA",
    color: "#0066ff",
    relation: "Research Collaborator · NLP & Education",
  },
];

const certifications = [
  { title: "Programming for Data Science with Python", org: "Udacity", year: "2021" },
  { title: "Python for Data Science", org: "DataQuest", year: "2021" },
  { title: "Claude Code — AI-Assisted Development", org: "Anthropic", year: "2026" },
];

export default function About() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"#00d4b8"}}>About Me</span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-white">Albert Tchaptchet Womga</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Data Scientist III · Business Insights & Analytics · AI/ML Specialist
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Bio + Experience */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black" style={{background:"linear-gradient(135deg,#00d4b8,#0066ff)"}}>
                  AW
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">Albert Womga</h2>
                  <p className="text-gray-400 text-sm">Data Scientist & AI/ML Specialist</p>
                  <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>Toronto / Ottawa, Canada (Hybrid)</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed mb-4">
                Results-driven Data Scientist with <strong className="text-white">15+ years of experience</strong> managing complex analytics portfolios, translating business objectives into data-driven solutions, and providing consultative insight to senior stakeholders.
              </p>
              <p className="text-gray-400 leading-relaxed mb-4">
                Master's degree in Applied Statistics. Proven track record leading end-to-end analytical initiatives — from business requirements through model development, platform deployment, and stakeholder communication — across <strong className="text-white">government, healthcare, and legal tech</strong> environments.
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                Currently completing a Post-Graduate Diploma in AI & Machine Learning at CIMT College, Ottawa.
              </p>

              <div className="flex flex-wrap gap-3">
                <a href="https://github.com/womgaalbert" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#0a0f1e] border border-[#1e2a3a] text-gray-300 hover:text-white hover:border-gray-500 transition-colors px-4 py-2 rounded-xl text-sm">
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/albert-womga-009a7931/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#0a0f1e] border border-[#1e2a3a] text-gray-300 hover:text-white hover:border-gray-500 transition-colors px-4 py-2 rounded-xl text-sm">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>

            {/* Experience */}
            <h3 className="text-white font-bold text-lg mb-4">Experience</h3>
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-[#111827] border border-[#1e2a3a] rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs text-gray-500">{exp.period}</span>
                  </div>
                  <h4 className="text-white font-semibold">{exp.role}</h4>
                  <p className="text-sm font-medium mb-2" style={{color:"#00d4b8"}}>{exp.company}</p>
                  <p className="text-gray-500 text-sm">{exp.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Skills + Education + Certs */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-8 mb-6">
              <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Award className="w-5 h-5" style={{color:"#00d4b8"}} />
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="bg-[#0a0f1e] border border-[#1e2a3a] text-gray-300 text-sm px-3 py-1.5 rounded-lg hover:border-teal-500/50 hover:text-teal-400 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-8 mb-6">
              <h3 className="text-white font-bold text-lg mb-4">Education</h3>
              {education.map((ed, i) => (
                <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor:"#00d4b8"}} />
                  <div>
                    <p className="text-white font-medium text-sm">{ed.title}</p>
                    <p className="text-gray-500 text-xs">{ed.org} · {ed.year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-8">
              <h3 className="text-white font-bold text-lg mb-4">Certifications</h3>
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{backgroundColor:"#0066ff"}} />
                  <div>
                    <p className="text-white font-medium text-sm">{cert.title}</p>
                    <p className="text-gray-500 text-xs">{cert.org} · {cert.year}</p>
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
              <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"#00d4b8"}}>Professional Endorsements</span>
              <h2 className="text-2xl font-black text-white mt-1">LinkedIn Recommendations</h2>
            </div>
            <a
              href="https://www.linkedin.com/in/albert-womga-009a7931/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-[#1e2a3a] hover:border-gray-500 px-4 py-2 rounded-xl transition-colors"
            >
              <Linkedin className="w-4 h-4" style={{color:"#0a66c2"}} /> View on LinkedIn
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {linkedInEndorsements.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6 flex flex-col gap-4 relative"
              >
                <div className="absolute top-5 right-5 opacity-10" style={{color: e.color}}>
                  <Quote className="w-9 h-9" />
                </div>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">"{e.quote}"</p>
                <div className="border-t border-[#1e2a3a]" />
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{background: `linear-gradient(135deg, ${e.color}, ${e.color}88)`}}
                  >
                    {e.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{e.name}</p>
                    <p className="text-gray-500 text-xs truncate">{e.title} · {e.org}</p>
                  </div>
                  <span className="text-xs text-gray-600 bg-[#0a0f1e] border border-[#1e2a3a] px-2 py-1 rounded-full flex-shrink-0">{e.relation}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href="https://www.linkedin.com/in/albert-womga-009a7931/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" style={{color:"#0a66c2"}} />
              See all recommendations on LinkedIn →
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}