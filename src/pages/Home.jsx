import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import StatsBar from "@/components/portfolio/StatsBar";
import ServicesPreview from "@/components/portfolio/ServicesPreview";
import FeaturedProjects from "@/components/portfolio/FeaturedProjects";
import HomeBlogPreview from "@/components/portfolio/HomeBlogPreview";
import WhyChooseMe from "@/components/portfolio/WhyChooseMe";
import CTABanner from "@/components/portfolio/CTABanner";
import Testimonials from "@/components/portfolio/Testimonials";
import GoogleReviews from "@/components/portfolio/GoogleReviews";
import InteractiveDataViz from "@/components/portfolio/InteractiveDataViz";
import RegionalExpertise from "@/components/portfolio/RegionalExpertise";
import AgentTeardownBand from "@/components/portfolio/AgentTeardownBand";
import LazyVideo from "@/components/media/LazyVideo";
import { useLang, renderRich } from "@/lib/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import Seo from "@/components/Seo";

export default function Home() {
  const { t } = useLang();
  return (
    <div>
      <Seo
        description={{
          en: "Freelance AI/ML engineer & data scientist in Ottawa, serving Canada & Cameroon. LLM agents, MLOps, NLP, forecasting and computer vision — built for production.",
          fr: "Ingénieur IA/ML et data scientist indépendant à Ottawa, au service du Canada et du Cameroun. Agents LLM, MLOps, NLP, prévision et vision par ordinateur — prêts pour la production.",
        }}
      />
      {/* HERO */}
      <section className="relative min-h-screen flex items-center grid-bg overflow-hidden">
        {/* Interactive Data Visualization */}
        <InteractiveDataViz />
        
        {/* Aurora gradient mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="aurora w-[36rem] h-[36rem] bg-primary/40 -top-40 -right-40 animate-float" />
          <div className="aurora w-[30rem] h-[30rem] bg-brand-blue/40 -bottom-32 -left-32" />
          <div className="aurora w-[24rem] h-[24rem] bg-chart-3/25 top-1/3 left-1/2" />
          {/* Floating data nodes */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="hero-dot absolute w-1.5 h-1.5 rounded-full opacity-60"
              style={{
                backgroundColor: "hsl(var(--primary))",
                boxShadow: "0 0 8px hsl(var(--primary) / 0.8)",
                top: `${10 + (i * 7.5) % 80}%`,
                left: `${5 + (i * 8.3) % 90}%`,
                animation: `float ${4 + (i % 3)}s ease-in-out ${i * 0.5}s infinite`
              }}
            />
          ))}
        </div>

        {/* Bottom fade into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-footer pointer-events-none z-[5]" />

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-sm font-medium">{t.home.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              {t.home.title1}<br />
              <span style={{background:"linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
                {t.home.title2}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
              {renderRich(t.home.description)}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to={createPageUrl("Booking")}
                onClick={() => trackEvent("cta_click", { source: "hero" })}
                className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white"
              >
                {t.home.bookCta} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={createPageUrl("Projects")} className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-foreground/80 border border-border hover:border-primary hover:text-primary transition-colors">
                {t.home.viewProjects}
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {["Python", "TensorFlow", "Scikit-learn", "SQL", "NLP", "Deep Learning"].map(tag => (
                <span key={tag} className="bg-card border border-border text-muted-foreground text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Visual right side: Looping Hero Video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Glow backdrop */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
                style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.5), transparent 70%)" }}
              />
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-primary/30 shadow-2xl bg-card group">
              <LazyVideo
                src="/videos/hero-loop.mp4"
                poster="/images/hero-poster.webp"
                label={t.home.heroVideoLabel}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-white/15" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[6] flex flex-col items-center gap-1 text-footer-foreground/80">
          <span className="text-xs">{t.home.scroll}</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      <StatsBar />
      <RegionalExpertise />
      <ServicesPreview />
      <FeaturedProjects />
      <AgentTeardownBand />
      <HomeBlogPreview />
      <WhyChooseMe />
      <Testimonials />
      <GoogleReviews />
      <CTABanner />
    </div>
  );
}