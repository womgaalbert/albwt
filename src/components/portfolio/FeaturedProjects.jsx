import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ExternalLink, Star, ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Energy ARIMA Forecasting",
    desc: "Time series analysis and ARIMA/SARIMA modeling to forecast U.S. industrial energy production (1939–2025) using Federal Reserve (FRED) data.",
    tags: ["Time Series", "ARIMA", "SARIMA", "Python"],
    stars: 1,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Energy-ARIMA-Forecasting",
    color: "#00d4b8",
  },
  {
    title: "Behavior Detection (Sensors)",
    desc: "Analyzing and interpreting sensor data to identify specific behavioral patterns. Building structured models that classify and predict behaviors.",
    tags: ["Sensor Data", "Classification", "ML", "Python"],
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Detect-Behavior-with-Sensor-Data",
    color: "#0066ff",
  },
  {
    title: "Transformer Time Series Prediction",
    desc: "Proof of concept for a transformer-based time series prediction model — bringing NLP architecture to temporal data forecasting.",
    tags: ["Transformers", "Deep Learning", "Forecasting"],
    stars: 0,
    lang: "Python",
    url: "https://github.com/womgaalbert/transformer-time-series-prediction",
    color: "#8b5cf6",
  },
  {
    title: "ConvNet on CIFAR-10",
    desc: "CNN built from scratch to classify CIFAR-10 images, starting with pixel normalization. Uses stacked convolutional blocks with pooling and dropout.",
    tags: ["CNN", "Computer Vision", "CIFAR-10"],
    stars: 0,
    lang: "Jupyter Notebook",
    url: "https://github.com/womgaalbert/Convnet-On-CIFAR-10",
    color: "#f59e0b",
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-24 bg-[#060b16]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{color:"#00d4b8"}}>Portfolio</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 text-white">Featured Projects</h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Real-world AI and data science projects showcasing expertise in forecasting, NLP, and computer vision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-3 h-3 rounded-full mt-1" style={{backgroundColor: p.color}} />
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {p.tags.map(tag => (
                  <span key={tag} className="bg-[#0a0f1e] border border-[#1e2a3a] text-gray-400 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {p.stars}</span>
                <span>{p.lang}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to={createPageUrl("Projects")} className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{color:"#00d4b8"}}>
            View All Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}