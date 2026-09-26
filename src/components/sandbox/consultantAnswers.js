// Canned answers for the demo AI Consultant, matched on keywords in both
// languages. A production version would replace this with a RAG pipeline;
// the shape (keywords per language → markdown answer per language) stays the same.

const DEMO_NOTE = {
  en: "\n\n> 💡 *Demo mode — keyword-based response.*",
  fr: "\n\n> 💡 *Mode démo — réponse basée sur des mots-clés.*",
};

/** @type {{ keys: { en: string[], fr: string[] }, answer: { en: string, fr: string } }[]} */
export const ANSWERS = [
  {
    keys: {
      en: ["skill", "expertise", "tech stack", "tool", "technolog"],
      fr: ["compétence", "competence", "expertise", "stack", "outil", "technolog", "savoir-faire"],
    },
    answer: {
      en: `Albert's core technical skills include:\n\n**Languages:** Python, SQL, R\n\n**ML/AI:** scikit-learn, XGBoost, Random Forest, DistilBERT, Transformers, LSTM/GRU, RAG + LangChain, NLP\n\n**Data & Statistics:** PySpark, ETL, ARIMA/SARIMA, Hypothesis Testing, Statistical Modelling\n\n**Visualization:** Power BI, Tableau, Matplotlib, Seaborn, Jupyter\n\n**Infrastructure:** Git/GitHub, REST APIs`,
      fr: `Les compétences techniques d'Albert :\n\n**Langages :** Python, SQL, R\n\n**ML/IA :** scikit-learn, XGBoost, Random Forest, DistilBERT, Transformers, LSTM/GRU, RAG + LangChain, NLP\n\n**Données et statistiques :** PySpark, ETL, ARIMA/SARIMA, tests d'hypothèses, modélisation statistique\n\n**Visualisation :** Power BI, Tableau, Matplotlib, Seaborn, Jupyter\n\n**Infrastructure :** Git/GitHub, API REST`,
    },
  },
  {
    keys: {
      en: ["cm avocat", "legal", "nlp", "document"],
      fr: ["cm avocat", "juridique", "avocat", "droit", "tal", "document"],
    },
    answer: {
      en: `The **CM Avocats project** was a full-stack legal platform built for a law firm in Gatineau, QC, Canada.\n\n**Key achievements:**\n- Built the complete **cmavocats.ca** platform from scratch\n- Integrated a **two-stage NLP classification pipeline** (DistilBERT + XGBoost) that automated legal document categorization across 6 classes\n- Reduced document routing time from **3–4 minutes to under 2 seconds**\n- Integrated **RAG + LangChain** document querying into the production platform`,
      fr: `Le **projet CM Avocats** est une plateforme juridique complète conçue pour un cabinet de Gatineau (Québec).\n\n**Réalisations clés :**\n- Conception intégrale de la plateforme **cmavocats.ca**\n- Intégration d'un **pipeline de classification NLP en deux étapes** (DistilBERT + XGBoost) automatisant le tri des documents juridiques en 6 catégories\n- Temps d'acheminement des documents réduit de **3–4 minutes à moins de 2 secondes**\n- Intégration d'une recherche documentaire **RAG + LangChain** en production`,
    },
  },
  {
    keys: {
      en: ["dashboard", "executive", "agent", "orchestrat", "analyzer", "langgraph"],
      fr: ["tableau de bord", "exécutif", "executif", "agent", "orchestrat", "analyseur", "langgraph"],
    },
    answer: {
      en: `The **AI Executive Dashboard** is Albert's multi-agent system — and Phase 1 is now shipping:\n\n**✅ GitHub Project Analyzer (LIVE on this page)**\nA real **LangGraph.js** pipeline on Supabase Edge Functions that fetches any public repo, runs structural analysis, and synthesizes an executive report with an LLM — with 24h caching, per-IP rate limits, and a deterministic fallback so the demo never breaks.\n\n**Roadmap:**\n- **Sub-Agent 1:** Market Intelligence Analyst\n- **Sub-Agent 2:** Content Strategy & Creation Studio\n- **Sub-Agent 3:** Presentation Architect\n- **Sub-Agent 4:** Data Insight Engine`,
      fr: `Le **tableau de bord exécutif IA** est le système multi-agents d'Albert — et la phase 1 est déjà livrée :\n\n**✅ Analyseur de projets GitHub (en ligne sur cette page)**\nUn véritable pipeline **LangGraph.js** sur Supabase Edge Functions : il récupère n'importe quel dépôt public, réalise une analyse structurelle et rédige un rapport exécutif avec un LLM — avec cache de 24 h, limite de débit par IP et repli déterministe pour que la démo ne casse jamais.\n\n**Feuille de route :**\n- **Sous-agent 1 :** analyste de veille marché\n- **Sous-agent 2 :** studio de stratégie et création de contenu\n- **Sous-agent 3 :** architecte de présentations\n- **Sous-agent 4 :** moteur d'analyse de données`,
    },
  },
  {
    keys: {
      en: ["biostat", "medical", "clinical", "medicine", "health"],
      fr: ["biostat", "médical", "medical", "clinique", "médecine", "medecine", "santé", "sante"],
    },
    answer: {
      en: `Albert has extensive biostatistics experience:\n\n- Statistical consultancy for research teams at the **Faculty of Medicine, University of Yaoundé I**\n- **Study design**, multivariate analysis, and clinical modelling for medical publications and ethics submissions\n- Mentored graduate students in statistical methodology\n\nHis Master's degree is in **Applied Statistics**, giving him a strong theoretical foundation.`,
      fr: `Albert possède une solide expérience en biostatistique :\n\n- Conseil statistique auprès des équipes de recherche de la **Faculté de médecine de l'Université de Yaoundé I**\n- **Plans d'étude**, analyses multivariées et modélisation clinique pour publications médicales et soumissions aux comités d'éthique\n- Encadrement d'étudiants de cycle supérieur en méthodologie statistique\n\nSon master porte sur les **statistiques appliquées**, ce qui lui donne des bases théoriques solides.`,
    },
  },
  {
    keys: {
      en: ["business", "help", "service", "hire", "consult", "price", "cost", "quote", "budget"],
      fr: ["entreprise", "aide", "aider", "service", "embauch", "recrut", "conseil", "prix", "tarif", "coût", "cout", "devis", "budget"],
    },
    answer: {
      en: `Albert can help your organization in several ways:\n\n**AI/ML Solutions:** Custom end-to-end ML pipelines\n\n**Predictive Analytics:** Time series forecasting, demand prediction, anomaly detection\n\n**NLP & Text Analytics:** Document classification, sentiment analysis, chatbots\n\n**AI Strategy Consulting:** AI readiness assessment, data strategy, team training\n\n**Full-Stack AI Apps:** Complete web applications with integrated AI\n\nHe serves clients in **Canada and Cameroon**, and works remotely worldwide. Response time is within 24 hours — you can also [book a free 30-minute call](/booking).`,
      fr: `Albert peut aider votre organisation de plusieurs façons :\n\n**Solutions IA/ML :** pipelines de bout en bout sur mesure\n\n**Analyse prédictive :** prévision de séries temporelles, prévision de la demande, détection d'anomalies\n\n**NLP et analyse de texte :** classification de documents, analyse de sentiment, agents conversationnels\n\n**Conseil en stratégie IA :** diagnostic de maturité, stratégie de données, formation des équipes\n\n**Applications IA complètes :** applications web avec IA intégrée\n\nIl accompagne des clients au **Canada et au Cameroun**, et travaille à distance partout dans le monde. Réponse sous 24 h — vous pouvez aussi [réserver un appel gratuit de 30 minutes](/booking).`,
    },
  },
  {
    keys: {
      en: ["experience", "background", "work", "career", "cv", "resume"],
      fr: ["expérience", "experience", "parcours", "carrière", "carriere", "cv", "profil"],
    },
    answer: {
      en: `Albert has **15+ years of experience** across government, healthcare, and legal tech:\n\n1. **AI Assistance / Data Scientist** — CM Avocats, Gatineau, QC (2024–present)\n2. **Senior Data Scientist / Business Insights Lead** — Ministry of Secondary Education, Cameroon (2011–2024)\n3. **Biostatistician** — Faculty of Medicine, University of Yaoundé I (2010–2018)\n\nHe holds a **Master's in Applied Statistics** and is completing a Post-Graduate Diploma in AI & Machine Learning at CIMT College, Ottawa.`,
      fr: `Albert cumule **plus de 15 ans d'expérience** dans le secteur public, la santé et le legal tech :\n\n1. **Assistance IA / data scientist** — CM Avocats, Gatineau (QC), depuis 2024\n2. **Data scientist senior / responsable business insights** — Ministère des Enseignements secondaires, Cameroun (2011–2024)\n3. **Biostatisticien** — Faculté de médecine, Université de Yaoundé I (2010–2018)\n\nIl est titulaire d'un **master en statistiques appliquées** et termine un diplôme d'études supérieures en IA et apprentissage automatique au CIMT College d'Ottawa.`,
    },
  },
  {
    keys: {
      en: ["project", "portfolio", "github", "repo"],
      fr: ["projet", "portfolio", "réalisation", "realisation", "github", "dépôt", "depot"],
    },
    answer: {
      en: `Albert's key projects include:\n\n1. **GitHub Project Analyzer** — live LangGraph.js agent (try it on this page!)\n2. **Energy ARIMA Forecasting** — U.S. energy production forecasting with FRED data\n3. **NLP Document Classifier** — legal document routing (DistilBERT + XGBoost)\n4. **Transformer Time Series Prediction**\n5. **Behavior Detection from Sensor Data**\n6. **ConvNet on CIFAR-10** — CNN built from scratch\n7. **Student Plurilingual Representation** — NLP research collaboration\n\nAll are on GitHub at **github.com/womgaalbert**.`,
      fr: `Les principaux projets d'Albert :\n\n1. **Analyseur de projets GitHub** — agent LangGraph.js en direct (essayez-le sur cette page !)\n2. **Prévision énergétique ARIMA** — production d'énergie aux États-Unis à partir des données FRED\n3. **Classificateur de documents NLP** — tri de documents juridiques (DistilBERT + XGBoost)\n4. **Prévision de séries temporelles par Transformer**\n5. **Détection de comportements à partir de capteurs**\n6. **ConvNet sur CIFAR-10** — CNN construit de zéro\n7. **Représentation plurilingue des élèves** — collaboration de recherche en NLP\n\nTout est sur GitHub : **github.com/womgaalbert**.`,
    },
  },
  {
    keys: {
      en: ["contact", "email", "reach", "call", "meeting", "book", "appointment", "available"],
      fr: ["contact", "courriel", "mail", "joindre", "appel", "rendez-vous", "réserver", "reserver", "disponib"],
    },
    answer: {
      en: `The quickest ways to reach Albert:\n\n- **Email:** contact@albwt.com (reply within 24 hours)\n- **Book a call:** [a free 30-minute discovery call](/booking)\n- **LinkedIn:** linkedin.com/in/albert-womga-009a7931/\n- **X:** @albtchap\n\nHe is currently **available for new projects**, in Canada, Cameroon, and remotely worldwide.`,
      fr: `Les moyens les plus rapides de joindre Albert :\n\n- **Courriel :** contact@albwt.com (réponse sous 24 h)\n- **Réserver un appel :** [un appel découverte gratuit de 30 minutes](/booking)\n- **LinkedIn :** linkedin.com/in/albert-womga-009a7931/\n- **X :** @albtchap\n\nIl est actuellement **disponible pour de nouveaux projets**, au Canada, au Cameroun et à distance partout dans le monde.`,
    },
  },
];

const FALLBACK = {
  en: `Thanks for your question! Albert is a Data Scientist & AI/ML Specialist with 15+ years of experience in Python, ML/AI, and statistical analysis — serving clients in Canada and Cameroon.\n\nTry asking about:\n- His **core skills** and tech stack\n- The **CM Avocats** legal AI project\n- The **AI Executive Dashboard**\n- His **biostatistics** experience\n- How he can **help your business**\n\n> 💡 *Demo mode — this is a keyword-based mock. A production version would use a RAG pipeline with a real LLM.*`,
  fr: `Merci pour votre question ! Albert est data scientist et spécialiste IA/ML, avec plus de 15 ans d'expérience en Python, en IA/ML et en analyse statistique — auprès de clients au Canada et au Cameroun.\n\nEssayez de demander :\n- ses **compétences** et sa stack technique\n- le projet juridique **CM Avocats**\n- le **tableau de bord exécutif IA**\n- son expérience en **biostatistique**\n- comment il peut **aider votre entreprise**\n\n> 💡 *Mode démo — réponse basée sur des mots-clés. Une version en production utiliserait un pipeline RAG avec un vrai LLM.*`,
};

/**
 * Keyword match against the demo knowledge base, in either language.
 * @param {string} userMessage
 * @param {string} lang
 */
export function getMockResponse(userMessage, lang = "en") {
  const msg = userMessage.toLowerCase();
  const l = lang === "fr" ? "fr" : "en";
  for (const entry of ANSWERS) {
    // Questions can be asked in either language whatever the interface language.
    const keys = [...entry.keys.en, ...entry.keys.fr];
    if (keys.some((k) => msg.includes(k))) return entry.answer[l] + DEMO_NOTE[l];
  }
  return FALLBACK[l];
}
