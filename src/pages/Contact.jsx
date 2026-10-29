import { content } from "../content/index.js";
import { ContactForm } from "../components/ContactForm.jsx";
import { Icon } from "../components/Icon.jsx";
import { site } from "../data/site.js";
import { asset } from "../lib/assets.js";

export function Contact({ lang }) {
  const t = content[lang].contact;
  return (
    <section className="leaf-contact leaf-container">
      <h1 className="leaf-page-title">{t.title}</h1>
      <div className="leaf-contact-grid">
        <div className="leaf-contact-info">
          <img
            src={asset("assets/ec6e36b0-leaf-properties-logo.webp")}
            alt="LEAF Properties & Partners"
            width="440"
            height="180"
          />
          <h2>{t.findUs}</h2>
          <p>{t.intro}</p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.phoneHref}>{site.phone}</a>
          <ul
            className="leaf-contact-socials"
            aria-label={lang === "el" ? "Κοινωνικά δίκτυα" : "Social media"}
          >
            {site.socials.map((social) => (
              <li key={social.key}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <Icon name={social.key} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="leaf-form-card">
          <h2>{t.formTitle}</h2>
          <ContactForm lang={lang} />
        </div>
      </div>
    </section>
  );
}
