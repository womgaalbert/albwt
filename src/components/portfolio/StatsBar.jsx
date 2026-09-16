import { motion } from "framer-motion";

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "500+", label: "Institutions Analyzed" },
  { value: "2", label: "Countries Served" },
  { value: "6", label: "GitHub Repositories" },
  { value: "M.Sc.", label: "Applied Statistics" },
];

export default function StatsBar() {
  return (
    <section className="bg-[#060b16] border-y border-[#1e2a3a] py-8">
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
              <div className="text-3xl font-black" style={{color:"#00d4b8"}}>{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}