import { Link } from "react-router-dom";
import { ContactForm } from "../components/ContactForm.jsx";
import { Gallery } from "../components/Gallery.jsx";
import { site } from "../data/site.js";
import { routes } from "../data/routes.js";
import {
  formatNumber,
  formatPrice,
  propertyFacts,
  propertyStatus,
} from "../lib/listings.js";
import { propertySection } from "../lib/routing.js";

export function Property({ property, lang }) {
  const data = property.locales[lang];
  const el = lang === "el";
  const section = propertySection(property, lang);
  const photos = property.photos.map((photo) => ({
    src: photo.src,
    alt: photo.alt[lang],
  }));
  return (
    <div className="lpd-wrap">
      <nav
        className="lpd-breadcrumb"
        aria-label={el ? "Διαδρομή πλοήγησης" : "Breadcrumb"}
      >
        <Link to={routes.home[lang]}>{el ? "Αρχική" : "Home"}</Link> /{" "}
        <Link to={section.path}>{section.label}</Link> / {data.title}
      </nav>
      <Link className="lpd-back" to={section.path}>
        {el ? "← Πίσω στα Ακίνητα" : "← Back to Properties"}
      </Link>
      <div className="lpd-layout">
        <div className="lpd-left-col">
          <div className="lpd-photo-col">
            <Gallery photos={photos} lang={lang} title={data.title} />
          </div>
          <div className="lpd-side-col lpd-side-col--under-photos">
            <div className="lpd-agent-card">
              <div className="lpd-agent-photo" aria-hidden="true">
                👤
              </div>
              <h3>{site.name}</h3>
              <p className="lpd-agent-role">
                {el ? "Σύμβουλος Ακινήτων" : "Real Estate Consultant"}
              </p>
              <a className="lpd-btn" href={site.phoneHref}>
                📞 {site.phone}
              </a>
              <a
                className="lpd-btn lpd-btn-outline"
                href={`mailto:${site.email}?subject=${encodeURIComponent(`Property #${property.id}`)}`}
              >
                ✉ {el ? "Αποστολή Email" : "Send Email"}
              </a>
              <hr />
              <ContactForm
                lang={lang}
                kind="appointment"
                propertyId={property.id}
                propertyTitle={data.title}
              />
            </div>
          </div>
        </div>
        <div className="lpd-content-col">
          <div className="lpd-header">
            <div className="lpd-header-main">
              <span className="lpd-badge">
                {propertyStatus(property, lang)}
              </span>
              <h1>{data.title}</h1>
              <p className="lpd-address">{data.address}</p>
            </div>
            <div className="lpd-header-price">
              <div className="lpd-price">
                {formatPrice(property.price, lang)}
                {property.transaction === "rent" && (
                  <small>{el ? " / μήνα" : " / month"}</small>
                )}
              </div>
              <div className="lpd-price-per">
                ≈ {formatNumber(property.price / property.sqm, lang)} €/
                {el ? "τ.μ." : "m²"}
              </div>
            </div>
          </div>
          <div className="lpd-body">
            <div className="lpd-main-col">
              <div className="lpd-facts">
                {propertyFacts(property, lang).map((fact) => (
                  <div className="lpd-fact" key={fact.key}>
                    <span>{fact.icon}</span>
                    <strong>{fact.value}</strong>
                    <small>{fact.label}</small>
                  </div>
                ))}
              </div>
              <h2>{el ? "Περιγραφή" : "Description"}</h2>
              <p>{data.description}</p>
              <h2>
                {el ? "Χαρακτηριστικά & Παροχές" : "Features & Amenities"}
              </h2>
              <ul className="lpd-features">
                {data.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <h2>{el ? "Τοποθεσία" : "Location"}</h2>
              <p>{data.location}</p>
              <iframe
                className="lpd-map-frame"
                title={`${el ? "Χάρτης" : "Map"} - ${data.title}`}
                src={`${property.mapUrl}&hl=${lang}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <p className="lpd-map-note">{data.mapNote}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
