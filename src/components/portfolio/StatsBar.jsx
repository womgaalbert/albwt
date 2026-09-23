import { motion } from "framer-motion";
import { useLang } from "@/lib/LanguageContext";

export default function StatsBar() {
  const { t } = useLang();
  const stats = [
    { value: "15+", label: t.stats.years },
    { value: "500+", label: t.stats.institutions },
    { value: "2", label: t.stats.countries },
    { value: "6", label: t.stats.repos },
    { value: "M.Sc.", label: t.stats.degree },
  ];

  return (
    <section className="bg-footer border-y border-border py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl font-black" style={{color:"hsl(var(--primary))"}}>{stat.value}</div>
              <div className="text-muted-foreground text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
