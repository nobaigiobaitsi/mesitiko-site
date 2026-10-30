import { Link } from "react-router-dom";
import { routes } from "../data/routes.js";
import { asset } from "../lib/assets.js";
import { formatPrice, propertyMeta, propertyStatus } from "../lib/listings.js";

export function PropertyCard({ property, lang }) {
  const el = lang === "el";
  const localized = property.locales[lang];
  return (
    <article className="lpl-card">
      <Link
        className="lpl-photo"
        to={routes[`property-${property.id}`][lang]}
        aria-label={localized.cardTitle + " — " + localized.cardAddress}
      >
        <img
          src={asset(property.cover)}
          alt={localized.cardTitle}
          loading="lazy"
          decoding="async"
        />
      </Link>
      <div className="lpl-card-body">
        <div className="lpl-card-top">
          <span className="lpl-price">
            {formatPrice(property.price, lang)}
            {property.transaction === "rent" && (
              <small>{el ? " / μήνα" : " / month"}</small>
            )}
          </span>
          <span className="lpl-badge">{propertyStatus(property, lang)}</span>
        </div>
        <p className="lpl-reference">
          {el ? "Κωδικός" : "Reference"}: {property.reference || property.id}
        </p>
        <h2>{localized.cardTitle}</h2>
        <p className="lpl-address">{localized.cardAddress}</p>
        <div className="lpl-meta">
          {propertyMeta(property, lang).map((meta, index) => (
            <span key={index}>{meta.replace(/^[^\p{L}\p{N}]+/u, "")}</span>
          ))}
        </div>
        <Link className="lpl-cta" to={routes[`property-${property.id}`][lang]}>
          {el ? "Δείτε το ακίνητο →" : "View property →"}
        </Link>
      </div>
    </article>
  );
}
