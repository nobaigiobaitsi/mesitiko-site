import { content } from "../content/index.js";
import { menu } from "../data/site.js";
import { routes } from "../data/routes.js";
import { absoluteUrl } from "./urls.js";
import { formatPrice, formatNumber } from "./listings.js";

export function getSeo(route, { origin, base = "/" }) {
  const { pageKey, lang, property } = route;
  const el = lang === "el";
  const page = content[lang][pageKey];
  const title = property
    ? property.locales[lang].title
    : page?.title || menu.find((item) => item.key === pageKey)?.[lang] || "404";
  const descriptions = {
    home: el
      ? "LEAF Properties & Partners | Athens. Αγορά, ενοικίαση και πώληση ακινήτων με υπεύθυνη διαχείριση."
      : "LEAF Properties & Partners | Athens. Buy, rent or sell property with responsible management and local expertise.",
    buy: el
      ? "Ανακαλύψτε τα ακίνητα προς πώληση της LEAF. Αναζήτηση ανά περιοχή, τιμή, επιφάνεια και αριθμό δωματίων."
      : "Explore LEAF properties for sale. Filter by area, price, floor area and bedrooms.",
    rent: el
      ? "Αναζητήστε ακίνητα προς ενοικίαση με τη LEAF Properties & Partners."
      : "Find properties to rent with LEAF Properties & Partners.",
    sell: page?.intro,
    services: el
      ? "Υπηρεσίες ακινήτων: εκτίμηση, έρευνα αγοράς, νομικός και τεχνικός έλεγχος, διαχείριση έργων και Golden Visa."
      : "Property services: valuation, market research, legal and technical due diligence, project management and Golden Visa support.",
    news: page?.excerpt,
    workflow: page?.heading,
    privacy: el
      ? "Η πολιτική απορρήτου της LEAF Properties & Partners. Πληροφορίες για την επεξεργασία και προστασία προσωπικών δεδομένων."
      : "LEAF Properties & Partners privacy policy. Information about the processing and protection of personal data.",
    contact: el
      ? "Επικοινωνήστε με τη LEAF Properties & Partners για αγορά, ενοικίαση, πώληση και υπηρεσίες ακινήτων."
      : "Contact LEAF Properties & Partners for buying, renting, selling and property services.",
  };
  const description = property
    ? `${property.locales[lang].title}. ${formatNumber(property.sqm, lang)} ${el ? "τ.μ." : "m²"} · ${formatPrice(property.price, lang)}${property.transaction === "rent" ? (el ? " / μήνα" : " / month") : ""}. ${property.locales[lang].description}`
    : descriptions[pageKey] ||
      (el ? "Η σελίδα δεν βρέθηκε." : "Page not found.");
  const pair = routes[pageKey];
  return {
    lang,
    title:
      pageKey === "home"
        ? "LEAF Properties & Partners | Athens"
        : `${title} | LEAF Properties`,
    description: description.replace(/\s+/g, " ").slice(0, 180),
    canonical: pair ? absoluteUrl(pair[lang], origin, base) : null,
    alternates: pair
      ? ["el", "en"].map((code) => ({
          lang: code,
          href: absoluteUrl(pair[code], origin, base),
        }))
      : [],
    image: absoluteUrl(
      property?.cover || "assets/ec6e36b0-leaf-properties-logo.webp",
      origin,
      base,
    ),
    robots: pageKey === "404" ? "noindex, nofollow" : "index, follow",
    type: pageKey === "workflow" ? "article" : "website",
  };
}
