import React, { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { menu } from "../data/site.js";
import { routes } from "../data/routes.js";

export function Header({ lang, pageKey }) {
  const paired = routes[pageKey] || routes.home;
  const activePage = pageKey.startsWith("property-") ? "buy" : pageKey;
  const [open, setOpen] = useState(false);
  const navigationId = useId();
  const toggle = useRef(null);
  const location = useLocation();
  const el = lang === "el";
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  function handleKeyDown(event) {
    if (event.key === "Escape" && open) {
      setOpen(false);
      toggle.current?.focus();
    }
  }
  return (
    <header className="site-header leaf-header" onKeyDown={handleKeyDown}>
      <div className="leaf-topbar">
        <div className="leaf-topbar-inner">
          <p className="leaf-topbar-location">
            <span className="leaf-location-dot" aria-hidden="true" />
            <span className="leaf-topbar-name">
              PROPERTIES &amp; PARTNERS<span aria-hidden="true"> / </span>
            </span>
            ATHENS
          </p>
          <nav
            className="leaf-language-nav"
            aria-label={el ? "Επιλέξτε μια γλώσσα" : "Choose a language"}
          >
            {["el", "en"].map((code) => (
              <Link
                key={code}
                to={paired[code]}
                lang={code}
                hrefLang={code}
                className={code === lang ? "is-current" : ""}
                aria-current={code === lang ? "true" : undefined}
              >
                {code === "el" ? "Ελληνικά" : "English"}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className="leaf-header-row">
        <div className="leaf-header-inner">
          <Link className="leaf-brand" to={routes.home[lang]} aria-label="LEAF">
            <span className="leaf-brand-word">
              LEAF
              <span className="logo-leaf-icon" aria-hidden="true" />
            </span>
            <span className="leaf-brand-caption">
              PROPERTIES &amp; PARTNERS
            </span>
          </Link>
          <button
            ref={toggle}
            type="button"
            className="leaf-menu-toggle"
            aria-expanded={open}
            aria-controls={navigationId}
            aria-label={
              open
                ? el
                  ? "Κλείσιμο μενού"
                  : "Close menu"
                : el
                  ? "Άνοιγμα μενού"
                  : "Open menu"
            }
            onClick={() => setOpen(!open)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
          <nav
            id={navigationId}
            className={`leaf-header-nav ${open ? "is-open" : ""}`}
            aria-label={el ? "Κεντρικό μενού" : "Main menu"}
          >
            <ul>
              {menu.map((item) => (
                <li key={item.key}>
                  <Link
                    to={routes[item.key][lang]}
                    className={
                      item.key === "contact" ? "leaf-header-contact" : undefined
                    }
                    aria-current={item.key === activePage ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item[lang]}
                    {item.key === "contact" && (
                      <span aria-hidden="true">↗</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
