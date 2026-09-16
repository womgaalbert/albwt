import { motion } from "framer-motion";

const regions = [
  {
    flag: "🇨🇦",
    country: "Canada",
    detail: "Legal Tech and Ottawa-based",
    color: "#ef4444",
  },
  {
    flag: "🇨🇲",
    country: "Cameroon",
    detail: "Government, healthcare & legal tech",
    color: "#00d4b8",
  },
];

export default function RegionalExpertise() {
  return (
    <section className="py-16 bg-[#060b16] border-t border-[#1e2a3a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#00d4b8" }}>
            Global Reach
          </span>
          <h2 className="text-2xl md:text-3xl font-black mt-2 text-white">
            Markets I Serve
          </h2>
          <p className="text-gray-500 mt-3 max-w-lg mx-auto text-sm">
            Hands-on experience delivering AI solutions across North America and Africa — with cultural and regulatory context built in.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 max-w-sm mx-auto gap-4">
          {regions.map((r, i) => (
            <motion.div
              key={r.country}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#111827] border border-[#1e2a3a] rounded-2xl p-5 flex flex-col items-center text-center card-hover"
            >
              <span className="text-4xl mb-3">{r.flag}</span>
              <p className="text-white font-bold text-sm mb-1">{r.country}</p>
              <p className="text-gray-500 text-xs leading-snug">{r.detail}</p>
              <div className="mt-3 w-6 h-0.5 rounded-full" style={{ backgroundColor: r.color }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}