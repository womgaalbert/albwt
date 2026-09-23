import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X } from "lucide-react";

const AWT_LOGO = "/logo-awt.png";
import { useLang } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/portfolio/LanguageSwitcher";
import ThemeToggle from "@/components/portfolio/ThemeToggle";

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
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-lg shadow-black/5 dark:shadow-black/30 border-b border-border" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
            <img src={AWT_LOGO} alt="AWT" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-bold text-lg text-foreground">Albert</span>
              <span className="teal-text font-bold text-lg"> Womga</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`nav-link text-sm font-medium ${currentPageName === link.page ? "active" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
            <ThemeToggle />
            <LanguageSwitcher />
            <Link to={createPageUrl("Contact")} className="btn-primary px-5 py-2 rounded-full text-sm font-semibold text-white">
              {t.nav.hire}
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button className="text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-card border-t border-border px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`nav-link text-sm font-medium ${currentPageName === link.page ? "active" : "text-muted-foreground"}`}
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
      <footer className="bg-footer border-t border-border py-10 mt-0">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={AWT_LOGO} alt="AWT" className="w-9 h-9 object-contain" />
            <span className="font-bold text-footer-foreground">Albert Womga</span>
            <span className="text-footer-foreground/60 text-sm ml-2">— {t.footer.tagline}</span>
          </div>
          <div className="flex gap-6 text-sm text-footer-foreground/60">
            {navLinks.map((link) => (
              <Link key={link.page} to={createPageUrl(link.page)} className="hover:text-primary transition-colors" style={{color: "inherit"}}>
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-footer-foreground/50 text-sm">{t.footer.rights}</p>
        </div>
      </footer>
    </div>
  );
}
