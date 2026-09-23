import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  en: {
    nav: {
      home: "Home", about: "About", services: "Services", projects: "Projects",
      blog: "Blog", sandbox: "Sandbox", contact: "Contact", hire: "Hire Me",
    },
    home: {
      badge: "Available for Freelance Projects",
      title1: "Data Scientist &",
      title2: "AI Specialist",
      description: "Hi, I'm **Albert Womga** — Data Scientist with a **Master's in Applied Statistics** and 15+ years of experience across government, healthcare, and legal tech. Based in Ottawa, serving clients in **Canada & Cameroon**.",
      cta: "Work With Me",
      viewProjects: "View Projects",
      scroll: "Scroll",
    },
    stats: {
      years: "Years Experience",
      institutions: "Institutions Analyzed",
      countries: "Continents Served",
      repos: "GitHub Repositories",
      degree: "Applied Statistics",
    },
    regional: {
      badge: "Global Reach",
      title: "Markets I Serve",
      subtitle: "Hands-on experience delivering AI solutions across North America and Africa — with cultural and regulatory context built in.",
      regions: [
        { flag: "🇨🇦", country: "Canada", detail: "Legal tech, based in Ottawa" },
        { flag: "🇨🇲", country: "Cameroon", detail: "Government, healthcare & legal tech" },
      ],
    },
    servicesPreview: {
      badge: "What I Offer",
      title: "My Services",
      subtitle: "End-to-end data science and AI solutions for businesses ready to compete in the modern economy.",
      viewAll: "View All Services",
      services: [
        { title: "Machine Learning Solutions", desc: "Custom ML models tailored to your business — classification, regression, clustering, and anomaly detection." },
        { title: "Predictive Analytics", desc: "Time series forecasting and predictive modeling using ARIMA, SARIMA, and deep learning architectures." },
        { title: "NLP & Text Analytics", desc: "Sentiment analysis, text classification, and language models to unlock insights from unstructured data." },
        { title: "Data Analysis & EDA", desc: "Deep exploratory data analysis, statistical modeling, and visualization for actionable business insights." },
        { title: "Computer Vision", desc: "CNN-based image classification and behavior detection using sensor data and visual inputs." },
        { title: "AI Strategy Consulting", desc: "Strategic AI roadmaps for companies in North America and Europe looking to leverage data-driven decisions." },
      ],
    },
    featured: {
      badge: "Portfolio",
      title: "Featured Projects",
      subtitle: "Real-world AI and data science projects showcasing expertise in forecasting, NLP, and computer vision.",
      viewAll: "View All Projects",
    },
    why: {
      badge: "Differentiators",
      title: "Why Choose Me?",
      subtitle: "A dedicated partner who combines technical excellence with strategic business thinking.",
      reasons: [
        { title: "15+ Years of Proven Expertise", desc: "Deep experience in AI, ML, and data science across multiple industries and domains." },
        { title: "North America & Africa Focused", desc: "Deep understanding of markets in Canada and Cameroon — culture, compliance, and local business context built in." },
        { title: "Fast, Scalable Delivery", desc: "Agile methodology and modern tooling to deliver production-ready solutions on time." },
        { title: "Research-Backed Approach", desc: "Work grounded in academic rigor — transformer models, ARIMA, CNNs applied practically." },
        { title: "Clear Communication", desc: "Bilingual (English/French) professional with transparent reporting and regular updates." },
        { title: "ROI-Driven Solutions", desc: "Every model and analysis is built with clear business objectives and measurable outcomes." },
      ],
    },
    testimonials: {
      badge: "Client Testimonials",
      title: "Trusted by Teams Across the Globe",
      subtitle: "From startups to enterprises — here's what clients say about working with me.",
    },
    cta: {
      title1: "Ready to unlock the power",
      title2: "of your data?",
      subtitle: "Let's discuss how AI and machine learning can transform your business. Available for projects in North America & Africa.",
      getInTouch: "Get In Touch",
      viewGitHub: "View GitHub",
    },
    projects: {
      badge: "Portfolio",
      title: "My Projects",
      subtitle: "Real-world AI & data science projects demonstrating expertise across multiple domains.",
      viewAll: "View All on GitHub",
      viewProject: "View Project",
      highlights: "Highlights",
      categories: {
        all: "All", forecasting: "Forecasting", ml: "Machine Learning",
        dl: "Deep Learning", cv: "Computer Vision", fundamentals: "Fundamentals", web: "Web",
      },
    },
    contact: {
      badge: "Get In Touch",
      title: "Let's Work Together",
      subtitle: "Ready to transform your data into competitive advantage? I'm available for projects across North America and Africa.",
      info: "Contact Info",
      connect: "Connect",
      availability: "Availability",
      available: "Available for new projects",
      response: "Response time: within 24 hours",
      location: "Ottawa, Canada (Remote Worldwide)",
      regions: "North America & Africa",
      scheduleMeeting: "Schedule a Meeting",
      fullName: "Full Name",
      email: "Email Address",
      company: "Company / Organization",
      service: "Service Needed",
      message: "Message",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent!",
      successDesc: "Thank you for reaching out. I'll get back to you within 24 hours.",
      selectService: "Select a service...",
      placeholderName: "John Doe",
      placeholderEmail: "john@company.com",
      placeholderCompany: "Your company name",
      placeholderMessage: "Describe your project, goals, and timeline...",
      orEmail: "Or send directly via email →",
      rateLimit: "Please wait {s} seconds before sending again.",
      failed: "Failed to send message. Please try again later.",
      serviceOptions: [
        "Machine Learning Solutions",
        "Predictive Analytics & Forecasting",
        "NLP & Text Analytics",
        "Computer Vision",
        "Data Analysis & Visualization",
        "AI Strategy Consulting",
        "Other",
      ],
      mailtoSubject: "Project Inquiry from {name} — {service}",
    },
    blog: {
      badge: "Thought Leadership",
      title: "AI & Data Science Blog",
      subtitle: "Insights, tutorials, and case studies on Machine Learning, AI, and Data Science.",
      search: "Search articles...",
      noResults: "No articles found.",
      readMore: "Read More",
      minRead: "min read",
      categories: {
        all: "All", tutorials: "Tutorials", opinion: "Opinion",
        caseStudies: "Case Studies", research: "Research", industry: "Industry Insights",
      },
    },
    about: {
      badge: "About Me",
      title: "Albert Tchaptchet Womga",
      subtitle: "Data Scientist III · Business Insights & Analytics · AI/ML Specialist",
      role: "Data Scientist & AI/ML Specialist",
      location: "Toronto / Ottawa, Canada (Hybrid)",
      bio1: "Results-driven Data Scientist with **15+ years of experience** managing complex analytics portfolios, translating business objectives into data-driven solutions, and providing consultative insight to senior stakeholders.",
      bio2: "Master's degree in Applied Statistics. Proven track record leading end-to-end analytical initiatives — from business requirements through model development, platform deployment, and stakeholder communication — across **government, healthcare, and legal tech** environments.",
      bio3: "Currently completing a Post-Graduate Diploma in AI & Machine Learning at CIMT College, Ottawa.",
      experienceLabel: "Experience",
      experiences: [
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
      ],
      skillsLabel: "Technical Skills",
      educationLabel: "Education",
      education: [
        { title: "Post-Graduate Diploma — AI & Machine Learning", org: "CIMT College, Ottawa", year: "2025–2026" },
        { title: "Master's Degree — Applied Statistics", org: "National Advanced School of Engineering, Cameroon", year: "2006–2007" },
        { title: "Diploma in Mathematics", org: "University of Yaoundé", year: "2005–2006" },
      ],
      certsLabel: "Certifications",
      certifications: [
        { title: "Programming for Data Science with Python", org: "Udacity", year: "2021" },
        { title: "Python for Data Science", org: "DataQuest", year: "2021" },
        { title: "Claude Code — AI-Assisted Development", org: "Anthropic", year: "2026" },
      ],
      endorsementsBadge: "Professional Endorsements",
      endorsementsTitle: "LinkedIn Recommendations",
      viewLinkedIn: "View on LinkedIn",
      seeAll: "See all recommendations on LinkedIn →",
    },
    services: {
      badge: "What I Do",
      title: "Services",
      subtitle: "Comprehensive data science and AI solutions grounded in 15+ years of real-world delivery across government, healthcare, and legal tech — in Canada and Cameroon.",
      cta: "Start a Project",
      services: [
        {
          title: "Machine Learning Solutions",
          desc: "Custom end-to-end ML pipelines tailored to your business challenges. From data preparation to model deployment.",
          features: ["Supervised & Unsupervised Learning", "Model Selection & Hyperparameter Tuning", "Feature Engineering", "MLOps & Deployment", "Model Monitoring & Retraining"],
        },
        {
          title: "Predictive Analytics & Forecasting",
          desc: "Time series analysis and forecasting models to predict demand, energy, markets, and operational metrics.",
          features: ["ARIMA / SARIMA Models", "LSTM Neural Networks", "Transformer-based Forecasting", "Anomaly Detection", "U.S. Federal Reserve Data Integration"],
        },
        {
          title: "NLP & Text Analytics",
          desc: "Extract intelligence from text data — from customer reviews to research documents.",
          features: ["Sentiment Analysis", "Text Classification & Clustering", "Named Entity Recognition", "Language Model Fine-tuning", "Chatbot Development"],
        },
        {
          title: "Computer Vision",
          desc: "CNN-based models for image classification, object detection, and behavioral analysis.",
          features: ["Image Classification (CIFAR, custom)", "Convolutional Neural Networks", "Behavior Detection from Visual Data", "Transfer Learning", "Model Optimization"],
        },
        {
          title: "Data Analysis & Visualization",
          desc: "Deep exploratory data analysis, statistical modeling, and compelling dashboards for decision-makers.",
          features: ["Exploratory Data Analysis (EDA)", "Statistical Hypothesis Testing", "Interactive Dashboards", "Tableau / Power BI Reports", "Python Visualization (Matplotlib, Seaborn)"],
        },
        {
          title: "AI Strategy Consulting",
          desc: "Strategic guidance for organizations looking to adopt AI and data science at scale.",
          features: ["AI Readiness Assessment", "Data Strategy & Governance", "Use Case Identification", "Team Training & Workshops", "ROI Measurement Frameworks"],
        },
      ],
      markets: {
        badge: "Markets",
        title: "Where I Work",
        subtitle: "Deep regional expertise — with cultural, regulatory, and business context built into every delivery.",
        canada: {
          title: "Canada",
          tagline: "Based in Ottawa — serving clients from coast to coast",
          points: ["Legal tech & AI document automation", "Government & public sector analytics", "Healthcare & clinical research data", "Bilingual EN/FR delivery"],
        },
        cameroon: {
          title: "Cameroon",
          tagline: "13+ years leading national-scale analytics",
          points: ["Ministry-level education analytics (5,000+ institutions)", "Healthcare & biostatistics research", "Local business digital transformation", "On-the-ground cultural context"],
        },
      },
    },
    footer: {
      tagline: "Data Scientist & AI Specialist",
      rights: "© 2026 Albert Womga. All rights reserved.",
    },
  },
  fr: {
    nav: {
      home: "Accueil", about: "À propos", services: "Services", projects: "Projets",
      blog: "Blog", sandbox: "Sandbox", contact: "Contact", hire: "Me contacter",
    },
    home: {
      badge: "Disponible pour des projets freelance",
      title1: "Data Scientist &",
      title2: "Spécialiste IA",
      description: "Bonjour, je suis **Albert Womga** — Data Scientist titulaire d'un **Master en Statistique Appliquée** avec plus de 15 ans d'expérience dans les secteurs gouvernemental, de la santé et du legal tech. Basé à Ottawa, au service de clients au **Canada et au Cameroun**.",
      cta: "Travaillez avec moi",
      viewProjects: "Voir les projets",
      scroll: "Défiler",
    },
    stats: {
      years: "Années d'expérience",
      institutions: "Institutions analysées",
      countries: "Continents servis",
      repos: "Dépôts GitHub",
      degree: "Statistique appliquée",
    },
    regional: {
      badge: "Portée mondiale",
      title: "Marchés que je sers",
      subtitle: "Expérience concrète de livraison de solutions IA en Amérique du Nord et en Afrique — avec contexte culturel et réglementaire intégré.",
      regions: [
        { flag: "🇨🇦", country: "Canada", detail: "Legal tech, basé à Ottawa" },
        { flag: "🇨🇲", country: "Cameroun", detail: "Gouvernement, santé & legal tech" },
      ],
    },
    servicesPreview: {
      badge: "Ce que je propose",
      title: "Mes services",
      subtitle: "Solutions data science et IA de bout en bout pour les entreprises prêtes à rivaliser dans l'économie moderne.",
      viewAll: "Voir tous les services",
      services: [
        { title: "Solutions de Machine Learning", desc: "Modèles ML personnalisés adaptés à votre activité — classification, régression, clustering et détection d'anomalies." },
        { title: "Analyse prédictive", desc: "Prévision de séries temporelles et modélisation prédictive avec ARIMA, SARIMA et architectures de deep learning." },
        { title: "NLP & analyse de texte", desc: "Analyse de sentiment, classification de texte et modèles de langage pour révéler les insights de vos données non structurées." },
        { title: "Analyse de données & EDA", desc: "Analyse exploratoire approfondie, modélisation statistique et visualisation pour des insights métier actionnables." },
        { title: "Vision par ordinateur", desc: "Classification d'images par CNN et détection de comportements à partir de données capteurs et visuelles." },
        { title: "Conseil en stratégie IA", desc: "Feuilles de route IA stratégiques pour les entreprises d'Amérique du Nord et d'Europe cherchant à exploiter la décision pilotée par les données." },
      ],
    },
    featured: {
      badge: "Portfolio",
      title: "Projets en vedette",
      subtitle: "Projets IA et data science concrets illustrant une expertise en prévision, NLP et vision par ordinateur.",
      viewAll: "Voir tous les projets",
    },
    why: {
      badge: "Différenciateurs",
      title: "Pourquoi me choisir ?",
      subtitle: "Un partenaire dévoué qui allie excellence technique et vision stratégique des affaires.",
      reasons: [
        { title: "15+ ans d'expertise éprouvée", desc: "Expérience approfondie en IA, ML et data science dans plusieurs secteurs et domaines." },
        { title: "Focus Amérique du Nord & Afrique", desc: "Compréhension approfondie des marchés canadien et camerounais — culture, conformité et contexte local intégrés." },
        { title: "Livraison rapide et évolutive", desc: "Méthodologie agile et outillage moderne pour livrer à temps des solutions prêtes pour la production." },
        { title: "Approche fondée sur la recherche", desc: "Un travail ancré dans la rigueur académique — transformers, ARIMA et CNN appliqués concrètement." },
        { title: "Communication claire", desc: "Professionnel bilingue (anglais/français) avec reporting transparent et mises à jour régulières." },
        { title: "Solutions orientées ROI", desc: "Chaque modèle et analyse est construit avec des objectifs métier clairs et des résultats mesurables." },
      ],
    },
    testimonials: {
      badge: "Témoignages clients",
      title: "La confiance d'équipes du monde entier",
      subtitle: "De la startup à la grande entreprise — ce que disent mes clients de notre collaboration.",
    },
    cta: {
      title1: "Prêt à libérer toute",
      title2: "la puissance de vos données ?",
      subtitle: "Discutons de la manière dont l'IA et le machine learning peuvent transformer votre entreprise. Disponible pour des projets en Amérique du Nord et en Afrique.",
      getInTouch: "Me contacter",
      viewGitHub: "Voir GitHub",
    },
    projects: {
      badge: "Portfolio",
      title: "Mes Projets",
      subtitle: "Projets IA & data science démontrant une expertise dans plusieurs domaines.",
      viewAll: "Voir tout sur GitHub",
      viewProject: "Voir le projet",
      highlights: "Points clés",
      categories: {
        all: "Tous", forecasting: "Prévision", ml: "Machine Learning",
        dl: "Deep Learning", cv: "Vision par Ordinateur", fundamentals: "Fondamentaux", web: "Web",
      },
    },
    contact: {
      badge: "Me Contacter",
      title: "Travaillons Ensemble",
      subtitle: "Prêt à transformer vos données en avantage concurrentiel ? Disponible pour des projets en Amérique du Nord et en Afrique.",
      info: "Coordonnées",
      connect: "Réseaux",
      availability: "Disponibilité",
      available: "Disponible pour de nouveaux projets",
      response: "Délai de réponse : sous 24 heures",
      location: "Ottawa, Canada (À distance partout dans le monde)",
      regions: "Amérique du Nord & Afrique",
      scheduleMeeting: "Planifier une réunion",
      fullName: "Nom complet",
      email: "Adresse e-mail",
      company: "Entreprise / Organisation",
      service: "Service souhaité",
      message: "Message",
      send: "Envoyer le message",
      sending: "Envoi en cours...",
      successTitle: "Message envoyé !",
      successDesc: "Merci de m'avoir contacté. Je vous répondrai dans les 24 heures.",
      selectService: "Sélectionnez un service...",
      placeholderName: "Jean Dupont",
      placeholderEmail: "jean@entreprise.com",
      placeholderCompany: "Nom de votre entreprise",
      placeholderMessage: "Décrivez votre projet, vos objectifs et vos échéances...",
      orEmail: "Ou envoyez directement un e-mail →",
      rateLimit: "Veuillez patienter {s} secondes avant de renvoyer.",
      failed: "Échec de l'envoi du message. Veuillez réessayer plus tard.",
      serviceOptions: [
        "Solutions de Machine Learning",
        "Analyse prédictive & prévision",
        "NLP & analyse de texte",
        "Vision par ordinateur",
        "Analyse de données & visualisation",
        "Conseil en stratégie IA",
        "Autre",
      ],
      mailtoSubject: "Demande de projet de {name} — {service}",
    },
    blog: {
      badge: "Leadership Éclairé",
      title: "Blog IA & Data Science",
      subtitle: "Insights, tutoriels et études de cas sur le Machine Learning, l'IA et la Data Science.",
      search: "Rechercher des articles...",
      noResults: "Aucun article trouvé.",
      readMore: "Lire la suite",
      minRead: "min de lecture",
      categories: {
        all: "Tous", tutorials: "Tutoriels", opinion: "Opinion",
        caseStudies: "Études de cas", research: "Recherche", industry: "Analyses du secteur",
      },
    },
    about: {
      badge: "À propos",
      title: "Albert Tchaptchet Womga",
      subtitle: "Data Scientist III · Business Insights & Analytics · Spécialiste IA/ML",
      role: "Data Scientist & Spécialiste IA/ML",
      location: "Toronto / Ottawa, Canada (Hybride)",
      bio1: "Data Scientist orienté résultats avec **plus de 15 ans d'expérience** dans la gestion de portefeuilles analytiques complexes, la traduction d'objectifs métier en solutions pilotées par les données et la fourniture de conseils stratégiques aux parties prenantes senior.",
      bio2: "Titulaire d'un Master en Statistique Appliquée. Historique éprouvé de pilotage d'initiatives analytiques de bout en bout — des besoins métier au développement de modèles, au déploiement de plateformes et à la communication avec les parties prenantes — dans les secteurs **gouvernemental, de la santé et du legal tech**.",
      bio3: "Actuellement en formation post-universitaire en IA & Machine Learning au CIMT College, Ottawa.",
      experienceLabel: "Expérience",
      experiences: [
        {
          period: "2024 – Aujourd'hui",
          role: "Assistant IA / Data Scientist",
          company: "CM Avocats — Gatineau, QC, Canada",
          desc: "Pilotage de bout en bout de la conception, du développement et du lancement de cmavocats.ca. Construction d'un pipeline NLP de classification en deux étapes (DistilBERT + XGBoost) automatisant la catégorisation de documents juridiques en 6 classes — réduisant le temps de routage de 3–4 min à moins de 2 secondes. Intégration d'un système RAG + LangChain d'interrogation documentaire dans la plateforme de production.",
        },
        {
          period: "2011 – 2024",
          role: "Data Scientist Senior / Responsable Business Insights",
          company: "Ministère de l'Enseignement Secondaire — Cameroun",
          desc: "Gestion d'un portefeuille analytique à grande échelle couvrant plus de 5 000 établissements. Traduction d'objectifs gouvernementaux complexes en modèles prédictifs, tableaux de bord et rapports d'analyse éclairant la politique, le budget et la stratégie opérationnelle au niveau senior.",
        },
        {
          period: "2010 – 2018",
          role: "Biostatisticien",
          company: "Faculté de Médecine, Université de Yaoundé I — Cameroun",
          desc: "Conseil statistique auprès de chercheurs médicaux. Conception de modèles cliniques prédictifs, d'analyses multivariées et de pipelines de data mining pour la recherche santé à grande échelle. Encadrement d'étudiants gradués en méthodologie statistique.",
        },
      ],
      skillsLabel: "Compétences techniques",
      educationLabel: "Éducation",
      education: [
        { title: "Diplôme post-universitaire — IA & Machine Learning", org: "CIMT College, Ottawa", year: "2025–2026" },
        { title: "Master — Statistique Appliquée", org: "École Nationale Supérieure Polytechnique, Cameroun", year: "2006–2007" },
        { title: "Diplôme en Mathématiques", org: "Université de Yaoundé", year: "2005–2006" },
      ],
      certsLabel: "Certifications",
      certifications: [
        { title: "Programmation pour la Data Science avec Python", org: "Udacity", year: "2021" },
        { title: "Python pour la Data Science", org: "DataQuest", year: "2021" },
        { title: "Claude Code — Développement assisté par IA", org: "Anthropic", year: "2026" },
      ],
      endorsementsBadge: "Témoignages professionnels",
      endorsementsTitle: "Recommandations LinkedIn",
      viewLinkedIn: "Voir sur LinkedIn",
      seeAll: "Voir toutes les recommandations sur LinkedIn →",
    },
    services: {
      badge: "Ce que je fais",
      title: "Services",
      subtitle: "Solutions complètes de data science et d'IA fondées sur plus de 15 ans de livraison concrète dans les secteurs gouvernemental, de la santé et du legal tech — au Canada et au Cameroun.",
      cta: "Démarrer un projet",
      services: [
        {
          title: "Solutions de Machine Learning",
          desc: "Pipelines ML de bout en bout personnalisés selon vos défis métier. De la préparation des données au déploiement des modèles.",
          features: ["Apprentissage supervisé & non supervisé", "Sélection de modèles & optimisation des hyperparamètres", "Ingénierie des caractéristiques", "MLOps & déploiement", "Surveillance des modèles & réentraînement"],
        },
        {
          title: "Analyse prédictive & prévision",
          desc: "Analyse de séries temporelles et modèles de prévision pour anticiper la demande, l'énergie, les marchés et les indicateurs opérationnels.",
          features: ["Modèles ARIMA / SARIMA", "Réseaux de neurones LSTM", "Prévision par transformers", "Détection d'anomalies", "Intégration de données de la Réserve fédérale américaine"],
        },
        {
          title: "NLP & analyse de texte",
          desc: "Extrayez de l'intelligence de vos données textuelles — des avis clients aux documents de recherche.",
          features: ["Analyse de sentiment", "Classification & clustering de texte", "Reconnaissance d'entités nommées", "Affinage de modèles de langage", "Développement de chatbots"],
        },
        {
          title: "Vision par ordinateur",
          desc: "Modèles basés sur les CNN pour la classification d'images, la détection d'objets et l'analyse comportementale.",
          features: ["Classification d'images (CIFAR, personnalisé)", "Réseaux de neurones convolutifs", "Détection de comportements à partir de données visuelles", "Apprentissage par transfert", "Optimisation de modèles"],
        },
        {
          title: "Analyse de données & visualisation",
          desc: "Analyse exploratoire approfondie, modélisation statistique et tableaux de bord percutants pour les décideurs.",
          features: ["Analyse exploratoire des données (EDA)", "Tests d'hypothèses statistiques", "Tableaux de bord interactifs", "Rapports Tableau / Power BI", "Visualisation Python (Matplotlib, Seaborn)"],
        },
        {
          title: "Conseil en stratégie IA",
          desc: "Accompagnement stratégique pour les organisations souhaitant adopter l'IA et la data science à grande échelle.",
          features: ["Évaluation de maturité IA", "Stratégie data & gouvernance", "Identification de cas d'usage", "Formation d'équipes & ateliers", "Cadres de mesure du ROI"],
        },
      ],
      markets: {
        badge: "Marchés",
        title: "Où je travaille",
        subtitle: "Une expertise régionale approfondie — avec contexte culturel, réglementaire et métier intégré dans chaque livraison.",
        canada: {
          title: "Canada",
          tagline: "Basé à Ottawa — au service des clients d'un océan à l'autre",
          points: ["Legal tech & automatisation documentaire par IA", "Analyse pour le gouvernement & secteur public", "Données de santé & recherche clinique", "Livraison bilingue EN/FR"],
        },
        cameroon: {
          title: "Cameroun",
          tagline: "Plus de 13 ans de pilotage d'analyses à l'échelle nationale",
          points: ["Analyse éducative au niveau ministériel (5 000+ établissements)", "Recherche santé & biostatistique", "Transformation numérique des entreprises locales", "Contexte culturel de terrain"],
        },
      },
    },
    footer: {
      tagline: "Data Scientist & Spécialiste IA",
      rights: "© 2026 Albert Womga. Tous droits réservés.",
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("albwt-lang");
      return saved === "fr" || saved === "en" ? saved : "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("albwt-lang", lang);
    } catch {}
    document.documentElement.lang = lang;
  }, [lang]);

  const t = translations[lang];
  const changeLang = (newLang) => {
    if (newLang === "fr" || newLang === "en") setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

export function renderRich(text) {
  const parts = String(text).split("**");
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-foreground">{part}</strong> : part
  );
}
