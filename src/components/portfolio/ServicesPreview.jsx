import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Brain, TrendingUp, MessageSquare, Search, BarChart2, Users, ArrowRight } from "lucide-react";

const services = [
  {
    Icon: Brain,
    title: "Machine Learning Solutions",
    desc: "Custom ML models tailored to your business — classification, regression, clustering, and anomaly detection.",
  },
  {
    Icon: TrendingUp,
    title: "Predictive Analytics",
    desc: "Time series forecasting and predictive modeling using ARIMA, SARIMA, and deep learning architectures.",
  },
  {
    Icon: MessageSquare,
    title: "NLP & Text Analytics",
    desc: "Sentiment analysis, text classification, and language models to unlock insights from unstructured data.",
  },
  {
    Icon: Search,
    title: "Data Analysis & EDA",
    desc: "Deep exploratory data analysis, statistical modeling, and visualization for actionable business insights.",
  },
  {
    Icon: BarChart2,
    title: "Computer Vision",
    desc: "CNN-based image classification and behavior detection using sensor data and visual inputs.",
  },
  {
    Icon: Users,
    title: "AI Strategy Consulting",
    desc: "Strategic AI roadmaps for companies in North America and Europe looking to leverage data-driven decisions.",
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"#00d4b8"}}>What I Offer</span>
        <h2 className="text-3xl md:text-4xl font-black mt-3 text-white">My Services</h2>
        <p className="text-gray-500 mt-4 max-w-xl mx-auto">
          End-to-end data science and AI solutions for businesses ready to compete in the modern economy.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="card-hover bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6 group"
          >
            <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{background:"rgba(0,212,184,0.1)"}}>
              <s.Icon className="w-6 h-6" style={{color:"#00d4b8"}} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link to={createPageUrl("Services")} className="inline-flex items-center gap-2 text-teal-400 font-semibold hover:gap-3 transition-all" style={{color:"#00d4b8"}}>
          View All Services <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}