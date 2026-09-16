import { createContext, useContext, useState } from "react";

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
      description: "Hi, I'm Albert Womga — driven AI & Machine Learning specialist with 15+ years of experience in high-dimensional data analysis and AI-driven decision-making. Serving clients across North America & Africa.",
      cta: "Work With Me",
      viewProjects: "View Projects",
      scroll: "Scroll",
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
      fullName: "Full Name",
      email: "Email Address",
      company: "Company / Organization",
      service: "Service Needed",
      message: "Message",
      send: "Send Message",
      sending: "Sending...",
      successTitle: "Message Sent!",
      successDesc: "Thank you for reaching out. I'll get back to you within 24 hours.",
    },
    blog: {
      badge: "Thought Leadership",
      title: "AI & Data Science Blog",
      subtitle: "Insights, tutorials, and case studies on Machine Learning, AI, and Data Science.",
      search: "Search articles...",
      noResults: "No articles found.",
      readMore: "Read More",
    },
    about: {
      badge: "About Me",
      title: "The Story Behind the Data",
    },
    services: {
      badge: "What I Offer",
      title: "Services",
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
      description: "Bonjour, je suis Albert Womga — spécialiste IA & Machine Learning avec plus de 15 ans d'expérience en analyse de données et prise de décision guidée par l'IA. Au service de clients en Amérique du Nord et en Afrique.",
      cta: "Travaillez avec moi",
      viewProjects: "Voir les projets",
      scroll: "Défiler",
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
      fullName: "Nom complet",
      email: "Adresse e-mail",
      company: "Entreprise / Organisation",
      service: "Service souhaité",
      message: "Message",
      send: "Envoyer le message",
      sending: "Envoi en cours...",
      successTitle: "Message envoyé !",
      successDesc: "Merci de m'avoir contacté. Je vous répondrai dans les 24 heures.",
    },
    blog: {
      badge: "Leadership Éclairé",
      title: "Blog IA & Data Science",
      subtitle: "Insights, tutoriels et études de cas sur le Machine Learning, l'IA et la Data Science.",
      search: "Rechercher des articles...",
      noResults: "Aucun article trouvé.",
      readMore: "Lire la suite",
    },
    about: {
      badge: "À propos",
      title: "L'Histoire derrière les Données",
    },
    services: {
      badge: "Ce que je propose",
      title: "Services",
    },
    footer: {
      tagline: "Data Scientist & Spécialiste IA",
      rights: "© 2026 Albert Womga. Tous droits réservés.",
    },
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}