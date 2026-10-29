import { useEffect, useRef, useState } from "react";
import { asset } from "../lib/assets.js";

export function Gallery({ photos, lang, title }) {
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
          <button
            ref={trigger}
            type="button"
            className="lpd-gallery-open"
            aria-label={el ? "Μεγέθυνση φωτογραφίας" : "Enlarge photo"}
            onClick={() => setOpen(true)}
          >
            <img
              className="lpd-slide-img active"
              src={asset(photos[active].src)}
              alt={photos[active].alt || title}
              decoding="async"
            />
          </button>
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
