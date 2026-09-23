import { motion } from "framer-motion";
import { useLang } from "@/lib/LanguageContext";

const colors = ["#ef4444", "hsl(var(--primary))"];

export default function RegionalExpertise() {
  const { t } = useLang();

  return (
    <section className="py-16 bg-footer border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
            {t.regional.badge}
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 text-foreground">
            {t.regional.title}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm">
            {t.regional.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 max-w-sm mx-auto gap-4">
          {t.regional.regions.map((r, i) => (
            <motion.div
              key={r.country}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center text-center card-hover"
            >
              <span className="text-4xl mb-3">{r.flag}</span>
              <p className="text-foreground font-bold text-sm mb-1">{r.country}</p>
              <p className="text-muted-foreground text-xs leading-snug">{r.detail}</p>
              <div className="mt-3 w-6 h-0.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
