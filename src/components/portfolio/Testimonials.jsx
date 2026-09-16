import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "We needed a forecasting model to optimize our energy procurement. Albert delivered an ARIMA-based solution that outperformed our previous vendor's tool. Highly recommend for any data science engagement.",
    name: "Sarah Okonkwo",
    title: "Head of Analytics",
    company: "Nexen Energy Corp",
    country: "🇨🇦 Canada",
    initials: "SO",
    color: "#0066ff",
  },
  {
    quote: "Albert built an analytics dashboard for our government ministry that transformed how we track education outcomes across 5,000+ schools. The insights now directly inform our policy and budget decisions.",
    name: "Dr. Angèle Otou",
    title: "Senior Director",
    company: "Ministry of Education — Cameroon",
    country: "🇨🇲 Cameroon",
    initials: "AO",
    color: "#10b981",
  },
  {
    quote: "Albert built the entire cmavocats.ca platform and integrated an AI document classification system that cut our document routing time from minutes to seconds. Remarkable technical depth and professionalism.",
    name: "C.M. Avocats Team",
    title: "Legal Technology",
    company: "CM Avocats — Gatineau, QC",
    country: "🇨🇦 Canada",
    initials: "CM",
    color: "#8b5cf6",
  },
  {
    quote: "Albert provided outstanding statistical consultancy to our research teams at the Faculty of Medicine. His expertise in biostatistics — from study design and multivariate analysis to clinical modelling — significantly elevated the rigour of our publications and ethics submissions. A rare combination of deep statistical knowledge and genuine pedagogy.",
    name: "Prof. Koki Ndoumbo",
    title: "Faculty of Medicine",
    company: "University of Yaoundé I — Cameroon",
    country: "🇨🇲 Cameroon",
    initials: "KN",
    color: "#f59e0b",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#060b16]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#00d4b8" }}>
            Client Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 text-white">
            Trusted by Teams Across the Globe
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            From startups to enterprises — here's what clients say about working with me.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover bg-[#111827] border border-[#1e2a3a] rounded-2xl p-6 flex flex-col gap-4 relative"
            >
              {/* Quote icon */}
              <div
                className="absolute top-5 right-5 opacity-10"
                style={{ color: t.color }}
              >
                <Quote className="w-10 h-10" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-400 text-sm leading-relaxed flex-1">
                "{t.quote}"
              </p>

              {/* Divider */}
              <div className="border-t border-[#1e2a3a]" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.title} · {t.company}</p>
                </div>
                <span className="ml-auto text-base" title={t.country}>{t.country.split(" ")[0]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}