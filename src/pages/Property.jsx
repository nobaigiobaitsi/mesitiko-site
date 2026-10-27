import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ContactForm } from "../components/ContactForm.jsx";
import { site } from "../data/site.js";
import { routes } from "../data/routes.js";
import { asset } from "../lib/assets.js";
import { formatNumber, formatPrice } from "../lib/listings.js";

function Gallery({ photos, lang, title }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const dialog = useRef(null);
  const trigger = useRef(null);
  const touchX = useRef(null);
  const el = lang === "el";
  const next = () => setActive((index) => (index + 1) % photos.length);
  const prev = () =>
    setActive((index) => (index - 1 + photos.length) % photos.length);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else if (dialog.current?.open) {
      dialog.current.close();
      trigger.current?.focus();
    }
  }, [open]);
  function keys(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  }
  return (
    <>
      <div
        className="lpd-slider"
        onKeyDown={keys}
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchX.current === null) return;
          const delta = touchX.current - event.changedTouches[0].clientX;
          if (Math.abs(delta) > 50) delta > 0 ? next() : prev();
          touchX.current = null;
        }}
      >
        <div className="lpd-slide-track">
          <img
            ref={trigger}
            className="lpd-slide-img active"
            src={asset(photos[active].src)}
            alt={photos[active].alt || title}
            decoding="async"
            role="button"
            tabIndex={0}
            aria-label={el ? "Μεγέθυνση φωτογραφίας" : "Enlarge photo"}
            onClick={() => setOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setOpen(true);
              }
            }}
          />
        </div>
        <button
          type="button"
          className="lpd-slide-arrow lpd-slide-prev"
          aria-label={el ? "Προηγούμενη φωτογραφία" : "Previous photo"}
          onClick={prev}
        >
          ❮
        </button>
        <button
          type="button"
          className="lpd-slide-arrow lpd-slide-next"
          aria-label={el ? "Επόμενη φωτογραφία" : "Next photo"}
          onClick={next}
        >
          ❯
        </button>
        <div className="lpd-slide-counter" aria-live="polite">
          {active + 1} / {photos.length}
        </div>
        <div className="lpd-slide-dots">
          {photos.map((photo, index) => (
            <button
              type="button"
              key={photo.src}
              className={`lpd-dot ${index === active ? "active" : ""}`}
              aria-label={`${el ? "Φωτογραφία" : "Photo"} ${index + 1}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      </div>
      <dialog
        className="leaf-lightbox"
        ref={dialog}
        aria-label={el ? "Φωτογραφίες ακινήτου" : "Property photos"}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
        onKeyDown={keys}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <button
          type="button"
          className="leaf-lightbox-close"
          aria-label={el ? "Κλείσιμο φωτογραφιών" : "Close photos"}
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <button
          type="button"
          className="leaf-lightbox-prev"
          aria-label={el ? "Προηγούμενη φωτογραφία" : "Previous photo"}
          onClick={prev}
        >
          ❮
        </button>
        <img
          src={open ? asset(photos[active].src) : undefined}
          alt={photos[active].alt || title}
        />
        <button
          type="button"
          className="leaf-lightbox-next"
          aria-label={el ? "Επόμενη φωτογραφία" : "Next photo"}
          onClick={next}
        >
          ❯
        </button>
        <p className="leaf-lightbox-counter" aria-live="polite">
          {active + 1} / {photos.length}
        </p>
      </dialog>
    </>
  );
}

export function Property({ property, lang }) {
  const data = property.locales[lang];
  const el = lang === "el";
  return (
    <div className="lpd-wrap">
      <div className="lpd-breadcrumb">
        {el ? "Αρχική / Αγορά" : "Home / Buy"} / {data.title}
      </div>
      <Link className="lpd-back" to={routes.buy[lang]}>
        {el ? "← Πίσω στα Ακίνητα" : "← Back to Properties"}
      </Link>
      <div className="lpd-layout">
        <div className="lpd-left-col">
          <div className="lpd-photo-col">
            <Gallery photos={data.photos} lang={lang} title={data.title} />
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
                {property.status === "sold"
                  ? el
                    ? "ΠΩΛΗΘΗΚΕ"
                    : "SOLD"
                  : data.statusText}
              </span>
              <h1>{data.title}</h1>
              <p className="lpd-address">{data.address}</p>
            </div>
            <div className="lpd-header-price">
              <div className="lpd-price">
                {formatPrice(property.price, lang)}
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
                {data.facts.map((fact, index) => (
                  <div className="lpd-fact" key={index}>
                    <span>{fact.icon}</span>
                    <strong>
                      {index === 0
                        ? `${formatNumber(property.sqm, lang)} ${el ? "τ.μ." : "m²"}`
                        : fact.value}
                    </strong>
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
                src={data.mapUrl}
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
