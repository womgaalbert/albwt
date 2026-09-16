import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X } from "lucide-react";

const AWT_LOGO = "/logo-awt.png";
import { useLang } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/portfolio/LanguageSwitcher";

export default function Layout({ children, currentPageName }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, page: "Home" },
    { label: t.nav.about, page: "About" },
    { label: t.nav.services, page: "Services" },
    { label: t.nav.projects, page: "Projects" },
    { label: t.nav.blog, page: "Blog" },
    { label: t.nav.sandbox, page: "Sandbox" },
    { label: t.nav.contact, page: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Inter', sans-serif; }
        :root {
          --teal: #00d4b8;
          --teal-dark: #00b09b;
          --navy: #0a0f1e;
          --navy-card: #111827;
          --navy-border: #1e2a3a;
        }
        .teal-gradient { background: linear-gradient(135deg, #00d4b8, #0066ff); }
        .teal-text { color: #00d4b8; }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #00d4b8; }
        .nav-link.active { color: #00d4b8; }
        .btn-primary {
          background: linear-gradient(135deg, #00d4b8, #0066ff);
          transition: opacity 0.2s, transform 0.2s;
        }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .card-hover { transition: transform 0.3s, box-shadow 0.3s; }
        .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,212,184,0.15); }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .grid-bg {
          background-image: linear-gradient(rgba(0,212,184,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,184,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .section-divider {
          border-color: rgba(0,212,184,0.2);
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #00d4b8; border-radius: 3px; }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0f1e]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-[#1e2a3a]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
            <img src={AWT_LOGO} alt="AWT" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-bold text-lg text-white">Albert</span>
              <span className="teal-text font-bold text-lg"> Womga</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`nav-link text-sm font-medium ${currentPageName === link.page ? "active" : "text-gray-300"}`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link to={createPageUrl("Contact")} className="btn-primary px-5 py-2 rounded-full text-sm font-semibold text-white">
              {t.nav.hire}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#111827] border-t border-[#1e2a3a] px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`nav-link text-sm font-medium ${currentPageName === link.page ? "active" : "text-gray-300"}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Link to={createPageUrl("Contact")} className="btn-primary px-5 py-2.5 rounded-full text-sm font-semibold text-white text-center">
              {t.nav.hire}
            </Link>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-[#060b16] border-t border-[#1e2a3a] py-10 mt-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={AWT_LOGO} alt="AWT" className="w-9 h-9 object-contain" />
            <span className="font-bold text-white">Albert Womga</span>
            <span className="text-gray-500 text-sm ml-2">— Data Scientist & AI Specialist</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            {navLinks.map((link) => (
              <Link key={link.page} to={createPageUrl(link.page)} className="hover:text-teal-400 transition-colors" style={{color: "inherit"}}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-gray-600 text-sm">{t.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}