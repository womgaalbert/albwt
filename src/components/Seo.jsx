import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLang } from "@/lib/LanguageContext";

export const SITE_URL = "https://albwt.com";
const SITE_NAME = { en: "Albert Womga — AI/ML Engineer", fr: "Albert Womga — Ingénieur IA/ML" };
const DEFAULT_TITLE = {
  en: "Albert Womga — Freelance AI/ML Engineer & Data Scientist",
  fr: "Albert Womga — Ingénieur IA/ML et data scientist indépendant",
};
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href, hreflang) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function absolute(url) {
  if (!url) return DEFAULT_IMAGE;
  return url.startsWith("http") ? url : `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Per-route head tags for a client-rendered SPA. `title` / `description`
 * accept a string or { en, fr }. `jsonLd` is injected as a page-scoped
 * <script type="application/ld+json"> and removed on unmount.
 *
 * @param {object} props
 * @param {string | {en: string, fr: string}} [props.title]
 * @param {string | {en: string, fr: string}} [props.description]
 * @param {string | null} [props.image]
 * @param {string} [props.type]
 * @param {object} [props.jsonLd]
 * @param {string} [props.publishedTime]
 */
export default function Seo({ title, description, image, type = "website", jsonLd, publishedTime }) {
  const { lang } = useLang();
  const { pathname, search } = useLocation();

  const pick = (v) => (v && typeof v === "object" ? v[lang] ?? v.en : v);
  const pageTitle = pick(title);
  const fullTitle = pageTitle ? `${pageTitle} | Albert Womga` : pick(DEFAULT_TITLE);
  const desc = pick(description);
  const url = `${SITE_URL}${pathname.toLowerCase()}${search}`;
  const img = absolute(image);
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:site_name", pick(SITE_NAME));
    upsertMeta("property", "og:locale", lang === "fr" ? "fr_CA" : "en_CA");
    upsertMeta("property", "article:published_time", publishedTime);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", img);
    upsertLink("canonical", url);
    upsertLink("alternate", url, "en");
    upsertLink("alternate", url, "fr");
    upsertLink("alternate", url, "x-default");
  }, [fullTitle, desc, type, url, img, lang, publishedTime]);

  useEffect(() => {
    if (!jsonLdText) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.seo = "page";
    script.textContent = jsonLdText;
    document.head.appendChild(script);
    return () => script.remove();
  }, [jsonLdText]);

  return null;
}
