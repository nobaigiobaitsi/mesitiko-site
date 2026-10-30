import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "../data/routes.js";
import { asset } from "../lib/assets.js";
import { formatPrice, propertyFacts, propertyStatus } from "../lib/listings.js";

export function PropertyCard({ property, lang }) {
  const el = lang === "el";
  const localized = property.locales[lang];
  const photos = [
    { src: property.cover, alt: { [lang]: localized.cardTitle } },
    ...property.photos.filter((photo) => photo.src !== property.cover),
  ];
  const [photoIndex, setPhotoIndex] = useState(0);
  const touchStart = useRef(null);
  const index = photoIndex % photos.length;
  const move = (direction) =>
    setPhotoIndex((old) => (old + direction + photos.length) % photos.length);
  const facts = propertyFacts(property, lang).filter((fact) =>
    (property.type === "oikopedo"
      ? ["sqm", "frontage", "seaDistance"]
      : ["sqm", "rooms", "bathrooms"]
    ).includes(fact.key),
  );
  return (
    <article className="lpl-card">
      <div
        className="lpl-photo lpl-card-gallery"
        role="group"
        aria-label={`${el ? "Φωτογραφίες" : "Photos"}: ${localized.cardTitle} — ${property.reference || property.id}`}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
        onTouchStart={(event) => {
          touchStart.current =
            event.touches.length === 1 ? event.touches[0].clientX : null;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStart.current;
          touchStart.current = null;
          if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1);
        }}
        onTouchCancel={() => {
          touchStart.current = null;
        }}
      >
        <img
          src={asset(photos[index].src)}
          alt={photos[index].alt[lang] || localized.cardTitle}
          loading="lazy"
          decoding="async"
        />
        {photos.length > 1 && (
          <>
            <button
              type="button"
              className="lpl-gallery-arrow lpl-gallery-prev"
              onClick={() => move(-1)}
              aria-label={el ? "Προηγούμενη φωτογραφία" : "Previous photo"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m14 6-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              className="lpl-gallery-arrow lpl-gallery-next"
              onClick={() => move(1)}
              aria-label={el ? "Επόμενη φωτογραφία" : "Next photo"}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m10 6 6 6-6 6" />
              </svg>
            </button>
            <span
              className="lpl-gallery-count"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className="lpl-sr-only">
                {el ? "Φωτογραφία" : "Photo"}{" "}
              </span>
              {index + 1} / {photos.length}
            </span>
          </>
        )}
      </div>
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
        <h2>
          <Link to={routes[`property-${property.id}`][lang]}>
            {localized.cardTitle}
          </Link>
        </h2>
        <p className="lpl-address">{localized.cardAddress}</p>
        <dl className="lpl-card-facts">
          {facts.map((fact) => (
            <div key={fact.key}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <Link className="lpl-cta" to={routes[`property-${property.id}`][lang]}>
          {el ? "Δείτε το ακίνητο →" : "View property →"}
        </Link>
      </div>
    </article>
  );
}
