import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { createPageUrl } from "@/utils";
import { useLang } from "@/lib/LanguageContext";
import { trackEvent } from "@/lib/analytics";
import AgentTeardown from "@/components/three/AgentTeardown";

export default function AgentTeardownBand() {
  const { t } = useLang();
  const copy = t.teardown;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-10 items-center">
        <div>
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">{copy.badge}</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 text-foreground">{copy.title}</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">{copy.subtitle}</p>
          <Link
            to={createPageUrl("Booking")}
            onClick={() => trackEvent("cta_click", { source: "agent_teardown" })}
            className="btn-primary inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full font-semibold text-white"
          >
            {copy.cta} <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <AgentTeardown />
      </div>
    </section>
  );
}
