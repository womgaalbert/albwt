import { motion } from "framer-motion";
import { ShieldCheck, Globe, Zap, BookOpen, MessageCircle, Target } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

const icons = [ShieldCheck, Globe, Zap, BookOpen, MessageCircle, Target];

export default function WhyChooseMe() {
  const { t } = useLang();

  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"hsl(var(--primary))"}}>{t.why.badge}</span>
        <h2 className="text-3xl md:text-4xl font-black mt-3 text-foreground">{t.why.title}</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          {t.why.subtitle}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {t.why.reasons.map((r, i) => {
          const Icon = icons[i % icons.length];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-6 bg-card border border-border rounded-2xl card-hover"
            >
              <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-foreground font-semibold mb-1">{r.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
