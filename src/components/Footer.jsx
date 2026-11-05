import { Link } from "react-router-dom";
import { site, menu } from "../data/site.js";
import { routes } from "../data/routes.js";
import { Icon } from "./Icon.jsx";

function ContactIcon({ phone = false }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {phone ? (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      ) : (
        <>
          <rect x="2" y="4" width="20" height="16" rx="3" />
          <path d="m2 6 10 7 10-7" />
        </>
      )}
    </svg>
  );
}
function Newsletter({ lang }) {
  return (
    <iframe
      src="https://8d2b83f8.sibforms.com/serve/MUIFAC1L1CibkOxejr0elemTptIWjCoOhNr5j_218BKdFO1s6hynIpbQISw01poQps-iuEiShLf9afov1-pmMAqonluj25RtKozJlopujoIu5gdZZsLJnl5usIqg0lbj3GFqJaeqgQaK72tjSVcsdOCSJIC2IkyNr9ZmcHbM2GI8MBwDkEjOsi6TYH4t52gIJNImou3j66Zpt_j7tg=="
      title={
        lang === "el"
          ? "Εγγραφή στο newsletter"
          : "Newsletter signup"
      }
      width="100%"
      height="800"
      loading="lazy"
      style={{ border: 0, display: "block" }}
    />
  );
}
export function Footer({ lang }) {
  const el = lang === "el";
  return (
    <footer className="site-footer leaf-footer">
      <div className="leaf-footer-inner">
        <div className="leaf-footer-grid">
          <div className="leaf-footer-brand-block">
            <Link
              className="leaf-brand leaf-brand-footer"
              to={routes.home[lang]}
              aria-label="LEAF"
            >
              <span className="leaf-brand-word">
                LEAF
                <span className="logo-leaf-icon" aria-hidden="true" />
              </span>
              <span className="leaf-brand-caption">
                PROPERTIES &amp; PARTNERS
              </span>
            </Link>
            <p className="leaf-footer-description">
              {el
                ? "Ακίνητα με προοπτική.\nΣυνεργασίες με αξία."
                : "Properties with potential.\nPartnerships that matter."}
            </p>
            <p className="leaf-footer-location">
              <span aria-hidden="true" />
              ATHENS, GREECE
            </p>
          </div>
          <div className="leaf-footer-menu-block">
            <h3 className="leaf-footer-heading">
              {el ? "Ανακαλύψτε" : "Discover"}
            </h3>
            <nav
              className="leaf-footer-navigation"
              aria-label={el ? "Μενού υποσέλιδου" : "Footer menu"}
            >
              <ul>
                {menu.map((item) => (
                  <li key={item.key}>
                    <Link to={routes[item.key][lang]}>
                      <span
                        className="leaf-footer-link-arrow"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                      {item[lang]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="leaf-footer-contact-block">
            <h3 className="leaf-footer-heading">
              {el ? "Ας μιλήσουμε" : "Let’s talk"}
            </h3>
            <a className="leaf-footer-contact" href={`mailto:${site.email}`}>
              <span className="leaf-footer-contact-icon">
                <ContactIcon />
              </span>
              <span className="leaf-footer-contact-copy">
                <span className="leaf-footer-contact-label">EMAIL</span>
                <span>{site.email}</span>
              </span>
            </a>
            <a className="leaf-footer-contact" href={site.phoneHref}>
              <span className="leaf-footer-contact-icon">
                <ContactIcon phone />
              </span>
              <span className="leaf-footer-contact-copy">
                <span className="leaf-footer-contact-label">
                  {el ? "Τηλέφωνο" : "Phone"}
                </span>
                <span>{site.phone}</span>
              </span>
            </a>
          </div>
          <div className="leaf-footer-newsletter-block">
            <h3 className="leaf-footer-heading">
              {el ? "Μείνετε σε επαφή" : "Stay in the loop"}
            </h3>
            <p className="leaf-footer-newsletter-intro">
              {el
                ? "Νέα ακίνητα, ιδέες και ενημερώσεις από τη LEAF."
                : "New properties, ideas and updates from LEAF."}
            </p>
            <Newsletter lang={lang} />
          </div>
        </div>
        <div className="leaf-footer-bottom">
          <div className="leaf-footer-legal">
            <p>© {new Date().getFullYear()} LEAF PROPERTIES.</p>
            <Link to={routes.privacy[lang]}>
              {el ? "Πολιτική Απορρήτου" : "Privacy Policy"}
            </Link>
          </div>
          <div className="leaf-footer-social-area">
            <span className="leaf-footer-social-label">
              {el ? "Ακολουθήστε μας" : "Follow us"}
            </span>
            <ul
              className="leaf-footer-socials"
              aria-label={el ? "Κοινωνικά δίκτυα" : "Social media"}
            >
              {site.socials.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                  >
                    <Icon name={social.key} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
