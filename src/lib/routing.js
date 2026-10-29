import { routes } from "../data/routes.js";
import { properties } from "../data/properties.js";

export const languages = ["el", "en"];
export const aliases = {
  "/en/buy/": routes.buy.en,
  "/en/αρχική-english/": routes.home.en,
};

export function normalizePath(pathname) {
  let path;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    path = pathname;
  }
  return `${path.replace(/\/+$/, "")}/`;
}

export function identifyRoute(pathname, catalog = properties) {
  const original = normalizePath(pathname);
  const path = aliases[original] || original;
  for (const [pageKey, pair] of Object.entries(routes)) {
    for (const lang of languages) {
      if (pair[lang].toLowerCase() !== path.toLowerCase()) continue;
      const property = pageKey.startsWith("property-")
        ? catalog.find((item) => item.id === pageKey.slice(9))
        : null;
      if (
        pageKey.startsWith("property-") &&
        (!property || property.status === "hidden")
      )
        break;
      return {
        pageKey,
        lang,
        property,
        path: pair[lang],
        activePage: property
          ? property.transaction
          : pageKey === "workflow"
            ? "news"
            : pageKey,
      };
    }
  }
  return {
    pageKey: "404",
    lang: path.toLowerCase().startsWith("/en/") ? "en" : "el",
    path: original,
    property: null,
    activePage: "",
  };
}

export function getStaticRoutes(catalog = properties) {
  const visible = new Set(
    catalog.filter((p) => p.status !== "hidden").map((p) => `property-${p.id}`),
  );
  return Object.entries(routes).flatMap(([key, pair]) =>
    key.startsWith("property-") && !visible.has(key)
      ? []
      : languages.map((lang) => ({ pageKey: key, lang, path: pair[lang] })),
  );
}

export function propertySection(property, lang) {
  const transaction = property.transaction === "rent" ? "rent" : "buy";
  return {
    key: transaction,
    path: routes[transaction][lang],
    label:
      transaction === "rent"
        ? lang === "el"
          ? "Ενοικίαση"
          : "Rent"
        : lang === "el"
          ? "Αγορά"
          : "Buy",
  };
}
