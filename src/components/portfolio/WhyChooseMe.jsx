import { motion } from "framer-motion";
import { ShieldCheck, Globe, Zap, BookOpen, MessageCircle, Target } from "lucide-react";

const reasons = [
  {
    Icon: ShieldCheck,
    title: "15+ Years of Proven Expertise",
    desc: "Deep experience in AI, ML, and data science across multiple industries and domains.",
  },
  {
    Icon: Globe,
    title: "North America & Africa Focused",
    desc: "Deep understanding of markets in Canada and Cameroon — culture, compliance, and local business context built in.",
  },
  {
    Icon: Zap,
    title: "Fast, Scalable Delivery",
    desc: "Agile methodology and modern tooling to deliver production-ready solutions on time.",
  },
  {
    Icon: BookOpen,
    title: "Research-Backed Approach",
    desc: "Work grounded in academic rigor — transformer models, ARIMA, CNNs applied practically.",
  },
  {
    Icon: MessageCircle,
    title: "Clear Communication",
    desc: "Bilingual (English/French) professional with transparent reporting and regular updates.",
  },
  {
    Icon: Target,
    title: "ROI-Driven Solutions",
    desc: "Every model and analysis is built with clear business objectives and measurable outcomes.",
  },
];

export default function WhyChooseMe() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"#00d4b8"}}>Differentiators</span>
        <h2 className="text-3xl md:text-4xl font-black mt-3 text-white">Why Choose Me?</h2>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          Chez Kamarange — a dedicated partner who combines technical excellence with strategic business thinking.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reasons.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-4 p-6 bg-[#111827] border border-[#1e2a3a] rounded-2xl card-hover"
          >
            <div className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center" style={{background:"rgba(0,212,184,0.1)"}}>
              <r.Icon className="w-5 h-5" style={{color:"#00d4b8"}} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}