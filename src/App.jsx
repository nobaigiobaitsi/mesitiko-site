import React, { lazy, Suspense, useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Listings } from "./pages/Listings.jsx";
import { Property } from "./pages/Property.jsx";
import { properties } from "./data/properties.js";
import { routes } from "./data/routes.js";
import { pageMeta } from "./data/pageMeta.js";
import pageStyles from "./data/pageStyles.json";
import pageLayout from "./data/pageLayout.json";
import { localizeCss } from "./lib/assets.js";

const staticPages = {
  home: {
    el: lazy(() => import("./pages/static/HomeEL.jsx")),
    en: lazy(() => import("./pages/static/HomeEN.jsx")),
  },
  sell: {
    el: lazy(() => import("./pages/static/SellEL.jsx")),
    en: lazy(() => import("./pages/static/SellEN.jsx")),
  },
  services: {
    el: lazy(() => import("./pages/static/ServicesEL.jsx")),
    en: lazy(() => import("./pages/static/ServicesEN.jsx")),
  },
  news: {
    el: lazy(() => import("./pages/static/NewsEL.jsx")),
    en: lazy(() => import("./pages/static/NewsEN.jsx")),
  },
  contact: {
    el: lazy(() => import("./pages/static/ContactEL.jsx")),
    en: lazy(() => import("./pages/static/ContactEN.jsx")),
  },
  workflow: {
    el: lazy(() => import("./pages/static/WorkflowEL.jsx")),
    en: lazy(() => import("./pages/static/WorkflowEN.jsx")),
  },
  privacy: {
    el: lazy(() => import("./pages/static/PrivacyEL.jsx")),
    en: lazy(() => import("./pages/static/PrivacyEN.jsx")),
  },
};

function identify(pathname) {
  let path;
  try {
    path = decodeURIComponent(pathname);
  } catch {
    path = pathname;
  }
  if (!path.endsWith("/")) path += "/";
  for (const [key, pair] of Object.entries(routes)) {
    for (const lang of ["el", "en"])
      if (pair[lang].toLowerCase() === path.toLowerCase())
        return { pageKey: key, lang };
  }
  return { pageKey: "404", lang: path.startsWith("/en/") ? "en" : "el" };
}

export function App() {
  const location = useLocation();
  const { pageKey, lang } = identify(location.pathname);
  const property = pageKey.startsWith("property-")
    ? properties.find((item) => item.id === pageKey.slice(9))
    : null;
  const metadata = property
    ? {
        pageId: property.locales[lang].pageId,
        title: property.locales[lang].title,
      }
    : pageMeta[pageKey]?.[lang];
  const pageId = metadata?.pageId || 9;
  const layout = pageLayout[String(pageId)];
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      pageKey === "home"
        ? "LEAF Properties & Partners | Athens"
        : `${metadata?.title || "404"} | LEAF Properties`;
    document.body.className = layout?.bodyClass || "";
    window.scrollTo(0, 0);
  }, [location.pathname, lang, pageId, pageKey, metadata?.title]);
  return (
    <>
      <style>{localizeCss(pageStyles[String(pageId)] || "")}</style>
      <a
        href="#main-content"
        className="leaf-skip-link"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main-content");
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        {lang === "el" ? "Μετάβαση στο περιεχόμενο" : "Skip to content"}
      </a>
      <div className="wp-site-blocks">
        <Header lang={lang} pageKey={pageKey} />
        <main
          id="main-content"
          tabIndex={-1}
          className="wp-block-group is-layout-flow wp-block-group-is-layout-flow"
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          {layout?.title && (
            <div
              className="wp-block-group alignfull has-text-color has-link-color wp-elements-6bb2b050fdd67e8e6a2d28c355b243b5 has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
              style={{ paddingTop: 0, paddingBottom: 0 }}
            >
              <h1 className="has-text-align-center has-link-color hostinger-ai-page-title wp-elements-2d266627045914afbd88ec37ebfaf796 wp-block-post-title has-text-color has-dark-color has-x-large-font-size">
                {property
                  ? property.locales[lang].pageTitle ||
                    property.locales[lang].title
                  : layout.title}
              </h1>
            </div>
          )}
          <div
            className="entry-content wp-block-post-content has-global-padding is-layout-constrained wp-block-post-content-is-layout-constrained"
            key={`${pageKey}-${lang}`}
          >
            <Suspense
              fallback={
                <p role="status" className="leaf-loading">
                  {lang === "el" ? "Φόρτωση…" : "Loading…"}
                </p>
              }
            >
              <Routes>
                {Object.entries(routes).flatMap(([key, pair]) =>
                  ["el", "en"].map((code) => {
                    let content;
                    if (key === "buy" || key === "rent")
                      content = <Listings lang={code} transaction={key} />;
                    else if (key.startsWith("property-")) {
                      const listing = properties.find(
                        (item) => item.id === key.slice(9),
                      );
                      content =
                        listing && listing.status !== "hidden" ? (
                          <Property property={listing} lang={code} />
                        ) : (
                          <NotFound lang={code} />
                        );
                    } else {
                      const Component = staticPages[key]?.[code];
                      content = Component ? (
                        <Component />
                      ) : (
                        <NotFound lang={code} />
                      );
                    }
                    return (
                      <Route
                        key={`${key}-${code}`}
                        path={pair[code]}
                        element={content}
                      />
                    );
                  }),
                )}
                <Route
                  path="/en/buy/"
                  element={<Navigate to={routes.buy.en} replace />}
                />
                <Route
                  path="/en/αρχική-english/"
                  element={<Navigate to="/en/" replace />}
                />
                <Route path="*" element={<NotFound lang={lang} />} />
              </Routes>
            </Suspense>
          </div>
        </main>
        <Footer lang={lang} />
      </div>
    </>
  );
}

function NotFound({ lang }) {
  return (
    <div className="leaf-not-found">
      <h1>404</h1>
      <p>{lang === "el" ? "Η σελίδα δεν βρέθηκε." : "Page not found."}</p>
      <Link to={routes.home[lang]}>
        {lang === "el" ? "Επιστροφή στην αρχική" : "Back to home"}
      </Link>
    </div>
  );
}
