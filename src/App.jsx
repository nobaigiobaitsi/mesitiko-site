import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";
import { Seo } from "./components/Seo.jsx";
import { Home } from "./pages/Home.jsx";
import { Sell } from "./pages/Sell.jsx";
import { Services } from "./pages/Services.jsx";
import { Contact } from "./pages/Contact.jsx";
import { News } from "./pages/News.jsx";
import { Workflow } from "./pages/Workflow.jsx";
import { Privacy } from "./pages/Privacy.jsx";
import { Listings } from "./pages/Listings.jsx";
import { Property } from "./pages/Property.jsx";
import { routes } from "./data/routes.js";
import { identifyRoute, normalizePath } from "./lib/routing.js";
import { getSeo } from "./lib/seo.js";

const pages = {
  home: Home,
  sell: Sell,
  services: Services,
  contact: Contact,
  news: News,
  workflow: Workflow,
  privacy: Privacy,
};
const seoConfig = {
  origin: import.meta.env.VITE_SITE_URL || "https://leafproperties.net",
  base: import.meta.env.BASE_URL,
};

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const route = identifyRoute(location.pathname);
  const { pageKey, lang, property, activePage } = route;
  const Page = pages[pageKey];
  useEffect(() => {
    if (pageKey !== "404" && normalizePath(location.pathname) !== route.path)
      navigate(route.path, { replace: true });
    window.scrollTo(0, 0);
  }, [location.pathname, navigate, pageKey, route.path]);
  return (
    <>
      <Seo meta={getSeo(route, seoConfig)} />
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
      <div className="leaf-app-shell">
        <Header
          key={location.pathname}
          lang={lang}
          pageKey={pageKey}
          activePage={activePage}
        />
        <main id="main-content" tabIndex={-1}>
          <div key={`${pageKey}-${lang}`}>
            {property ? (
              <Property property={property} lang={lang} />
            ) : pageKey === "buy" || pageKey === "rent" ? (
              <Listings lang={lang} transaction={pageKey} />
            ) : Page ? (
              <Page lang={lang} />
            ) : (
              <NotFound lang={lang} />
            )}
          </div>
        </main>
        <Footer key={lang} lang={lang} />
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
