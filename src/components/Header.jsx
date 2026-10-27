import React from "react";
import { Link } from "react-router-dom";
import { menu } from "../data/site.js";
import { routes } from "../data/routes.js";

export function Header({ lang, pageKey }) {
  const paired = routes[pageKey] || routes.home;
  return (
    <header className="site-header wp-block-template-part">
      <div className="wp-block-columns is-layout-flex wp-container-core-columns-is-layout-7094c525 wp-block-columns-is-layout-flex">
        <div
          className="wp-block-column is-layout-flow wp-block-column-is-layout-flow"
          style={{ flexBasis: "100%" }}
        >
          <nav
            className="has-custom-css wp-custom-css-8fd0f2cb"
            aria-label={
              lang === "el" ? "Επιλέξτε μια γλώσσα" : "Choose a language"
            }
          >
            <ul className="wp-custom-css-8fd0f2cb wp-block-polylang-language-switcher">
              {["el", "en"].map((code) => (
                <li
                  key={code}
                  className={`lang-item lang-item-${code} ${code === lang ? "current-lang" : ""}`}
                >
                  <Link
                    to={paired[code]}
                    lang={code}
                    hrefLang={code}
                    aria-current={code === lang ? "true" : undefined}
                  >
                    <span>{code === "el" ? "Ελληνικά" : "English"}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="header-wrapper">
            <div className="top-accent-line" />
            <div className="minimal-header">
              <Link
                to={routes.home[lang]}
                className="logo-leaf"
                aria-label="LEAF"
              >
                LEAF
                <span className="logo-leaf-icon" />
              </Link>
              <nav aria-label={lang === "el" ? "Κεντρικό μενού" : "Main menu"}>
                <ul className="nav-links">
                  {menu.map((item) => (
                    <li key={item.key}>
                      <Link
                        to={routes[item.key][lang]}
                        aria-current={item.key === pageKey ? "page" : undefined}
                      >
                        {item[lang]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
