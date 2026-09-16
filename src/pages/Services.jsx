import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Brain, TrendingUp, MessageSquare, Search, BarChart2, Users, CheckCircle, ArrowRight } from "lucide-react";

const services = [
{
  Icon: Brain,
  title: "Machine Learning Solutions",
  desc: "Custom end-to-end ML pipelines tailored to your business challenges. From data preparation to model deployment.",
  features: ["Supervised & Unsupervised Learning", "Model Selection & Hyperparameter Tuning", "Feature Engineering", "MLOps & Deployment", "Model Monitoring & Retraining"],
  color: "#00d4b8"
},
{
  Icon: TrendingUp,
  title: "Predictive Analytics & Forecasting",
  desc: "Time series analysis and forecasting models to predict demand, energy, markets, and operational metrics.",
  features: ["ARIMA / SARIMA Models", "LSTM Neural Networks", "Transformer-based Forecasting", "Anomaly Detection", "U.S. Federal Reserve Data Integration"],
  color: "#0066ff"
},
{
  Icon: MessageSquare,
  title: "NLP & Text Analytics",
  desc: "Extract intelligence from text data — from customer reviews to research documents.",
  features: ["Sentiment Analysis", "Text Classification & Clustering", "Named Entity Recognition", "Language Model Fine-tuning", "Chatbot Development"],
  color: "#8b5cf6"
},
{
  Icon: BarChart2,
  title: "Computer Vision",
  desc: "CNN-based models for image classification, object detection, and behavioral analysis.",
  features: ["Image Classification (CIFAR, custom)", "Convolutional Neural Networks", "Behavior Detection from Visual Data", "Transfer Learning", "Model Optimization"],
  color: "#f59e0b"
},
{
  Icon: Search,
  title: "Data Analysis & Visualization",
  desc: "Deep exploratory data analysis, statistical modeling, and compelling dashboards for decision-makers.",
  features: ["Exploratory Data Analysis (EDA)", "Statistical Hypothesis Testing", "Interactive Dashboards", "Tableau / Power BI Reports", "Python Visualization (Matplotlib, Seaborn)"],
  color: "#ef4444"
},
{
  Icon: Users,
  title: "AI Strategy Consulting",
  desc: "Strategic guidance for organizations looking to adopt AI and data science at scale.",
  features: ["AI Readiness Assessment", "Data Strategy & Governance", "Use Case Identification", "Team Training & Workshops", "ROI Measurement Frameworks"],
  color: "#10b981"
}];


const markets = ["USA", "Canada", "United Kingdom", "France", "Germany", "Belgium", "Switzerland", "Netherlands"];

export default function Services() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16">
          
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#00d4b8" }}>What I Do</span>
          <h1 className="text-4xl md:text-5xl font-black mt-3 text-white">Services</h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">
            Comprehensive data science and AI solutions grounded in 15+ years of real-world delivery across government, healthcare, and legal tech — in Canada and Cameroon.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {services.map((s, i) =>
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="card-hover bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6">
            
              <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center" style={{ background: `${s.color}15` }}>
                <s.Icon className="w-6 h-6" style={{ color: s.color }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.desc}</p>
              <ul className="space-y-2">
                {s.features.map((f) =>
              <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: s.color }} />
                    {f}
                  </li>
              )}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Markets */}
        












        

        {/* CTA */}
        <div className="text-center">
          <Link to={createPageUrl("Contact")} className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-lg">
            Start a Project <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>);

}