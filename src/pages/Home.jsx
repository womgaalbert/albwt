import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, BarChart2, Brain, Database, TrendingUp, Cpu } from "lucide-react";
import StatsBar from "@/components/portfolio/StatsBar";
import ServicesPreview from "@/components/portfolio/ServicesPreview";
import FeaturedProjects from "@/components/portfolio/FeaturedProjects";
import WhyChooseMe from "@/components/portfolio/WhyChooseMe";
import CTABanner from "@/components/portfolio/CTABanner";
import Testimonials from "@/components/portfolio/Testimonials";
import InteractiveDataViz from "@/components/portfolio/InteractiveDataViz";
import RegionalExpertise from "@/components/portfolio/RegionalExpertise";

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center grid-bg overflow-hidden">
        {/* Interactive Data Visualization */}
        <InteractiveDataViz />
        
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" style={{animationDelay:"3s"}} />
          {/* Floating data nodes */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full opacity-50"
              style={{
                backgroundColor: "hsl(var(--primary))",
                top: `${10 + (i * 7.5) % 80}%`,
                left: `${5 + (i * 8.3) % 90}%`,
                animationDelay: `${i * 0.5}s`,
                animation: `float ${4 + (i % 3)}s ease-in-out infinite`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-primary text-sm font-medium">Available for Freelance Projects</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Data Scientist &<br />
              <span style={{background:"linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"}}>
                AI Specialist
              </span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-xl">
              Hi, I'm <strong className="text-foreground">Albert Womga</strong> — Data Scientist with a <strong className="text-primary">Master's in Applied Statistics</strong> and 15+ years of experience across government, healthcare, and legal tech. Based in Ottawa, serving clients in <strong className="text-foreground">Canada & Cameroon</strong>.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={createPageUrl("Contact")} className="btn-primary flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white">
                Work With Me <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={createPageUrl("Projects")} className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-foreground/80 border border-gray-600 hover:border-primary hover:text-primary transition-colors">
                View Projects
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 mt-8">
              {["Python", "TensorFlow", "Scikit-learn", "SQL", "NLP", "Deep Learning"].map(tag => (
                <span key={tag} className="bg-card border border-border text-muted-foreground text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Visual right side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:flex justify-center items-center"
          >
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-spin" style={{animationDuration:"20s"}} />
              <div className="absolute inset-6 rounded-full border border-blue-500/15 animate-spin" style={{animationDuration:"15s", animationDirection:"reverse"}} />
              <div className="absolute inset-12 rounded-full border border-primary/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
                  <Brain className="w-20 h-20" style={{color:"hsl(var(--primary))"}} />
                </div>
              </div>
              {/* Orbiting icons */}
              {[
                { Icon: BarChart2, angle: 0 },
                { Icon: Database, angle: 90 },
                { Icon: TrendingUp, angle: 180 },
                { Icon: Cpu, angle: 270 },
              ].map(({ Icon, angle }, i) => {
                const rad = (angle * Math.PI) / 180;
                const r = 130;
                const x = 160 + r * Math.cos(rad) - 20;
                const y = 160 + r * Math.sin(rad) - 20;
                return (
                  <div
                    key={i}
                    className="absolute w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center"
                    style={{ left: x, top: y }}
                  >
                    <Icon className="w-5 h-5" style={{color:"hsl(var(--primary))"}} />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/70">
          <span className="text-xs">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>

      <StatsBar />
      <RegionalExpertise />
      <ServicesPreview />
      <FeaturedProjects />
      <WhyChooseMe />
      <Testimonials />
      <CTABanner />
    </div>
  );
}