import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useLang } from "@/lib/LanguageContext";

export default function CTABanner() {
  const { t } = useLang();
  return (
    <section className="py-20 bg-footer">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-card border border-border rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl opacity-10" style={{background:"linear-gradient(135deg, hsl(var(--primary)), hsl(var(--brand-blue)))"}} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                {t.cta.title1}<br />{t.cta.title2}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                {t.cta.subtitle}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to={createPageUrl("Contact")} className="btn-primary flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white">
                  <Mail className="w-4 h-4" /> {t.cta.getInTouch} <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://github.com/womgaalbert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-foreground/80 border border-border hover:border-primary hover:text-primary transition-colors"
                >
                  {t.cta.viewGitHub}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}