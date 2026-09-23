import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Brain, TrendingUp, MessageSquare, Search, BarChart2, Users, ArrowRight } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const icons = [Brain, TrendingUp, MessageSquare, Search, BarChart2, Users];

export default function ServicesPreview() {
  const { t } = useLang();

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"hsl(var(--primary))"}}>{t.servicesPreview.badge}</span>
        <h2 className="text-3xl md:text-4xl font-black mt-3 text-foreground">{t.servicesPreview.title}</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          {t.servicesPreview.subtitle}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.servicesPreview.services.map((s, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card-hover bg-card border border-border rounded-2xl p-6 group"
            >
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-foreground font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <Link to={createPageUrl("Services")} className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all text-primary">
          {t.servicesPreview.viewAll} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
