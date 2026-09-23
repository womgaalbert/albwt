import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-20 bg-[#0c1428]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-[#1a2947] border border-[#2d4166] rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl opacity-10" style={{background:"linear-gradient(135deg, #00d4b8, #0066ff)"}} />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Ready to unlock the power<br />of your data?
              </h2>
              <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                Let's discuss how AI and machine learning can transform your business. Available for projects in North America & Africa.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to={createPageUrl("Contact")} className="btn-primary flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-white">
                  <Mail className="w-4 h-4" /> Get In Touch <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://github.com/womgaalbert"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-gray-200 border border-gray-600 hover:border-teal-500 hover:text-teal-400 transition-colors"
                >
                  View GitHub
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}