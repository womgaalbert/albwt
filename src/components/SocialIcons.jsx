import { Linkedin } from "lucide-react";
import { GOOGLE_PROFILE_URL } from "@/lib/google";

export const LINKEDIN_URL = "https://www.linkedin.com/in/albert-womga-009a7931/";
export const X_URL = "https://x.com/albtchap";

/** X (formerly Twitter) brand mark — lucide-react has no X logo. */
export function XLogo({ className = "", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Google "G" mark in brand colours. */
export function GoogleLogo({ className = "", ...props }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

const SOCIALS = [
  { href: LINKEDIN_URL, label: "LinkedIn", Icon: Linkedin },
  { href: X_URL, label: "X (@albtchap)", Icon: XLogo },
  { href: GOOGLE_PROFILE_URL, label: "Google", Icon: GoogleLogo },
].filter((s) => s.href);

/** Compact row of social icon links (used in the footer). */
export function SocialLinks({ className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIALS.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          className="p-2 rounded-lg hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          style={{ color: "inherit" }}
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}
