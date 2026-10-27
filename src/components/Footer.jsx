import React, { useId, useState } from "react";
import { Link } from "react-router-dom";
import { site, menu } from "../data/site.js";
import { routes } from "../data/routes.js";
import { Icon } from "./Icon.jsx";
import { emailDraft, sendRequest } from "../lib/contact.js";

function Newsletter({ lang }) {
  const id = useId();
  const [state, setState] = useState("idle");
  const el = lang === "el";
  const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT?.trim();
  async function submit(event) {
    event.preventDefault();
    const payload = {
      email: new FormData(event.currentTarget).get("email"),
      kind: "newsletter",
      language: lang,
    };
    if (!endpoint) {
      window.location.href = emailDraft({
        ...payload,
        message: "I would like to subscribe to the LEAF newsletter.",
      });
      setState("draft");
      return;
    }
    setState("sending");
    try {
      await sendRequest(payload, endpoint);
      setState("sent");
    } catch {
      setState("error");
    }
  }
  return (
    <div className="hostinger-reach-block-subscription-form-wrapper has-custom-css wp-custom-css-ef57dad1">
      <form
        className="hostinger-reach-block-subscription-form"
        onSubmit={submit}
        aria-label="Newsletter"
      >
        <div className="hostinger-reach-block-form-fields">
          <div className="hostinger-reach-block-form-field">
            <label htmlFor={id}>
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id={id}
              name="email"
              autoComplete="email"
              required
            />
          </div>
          <button
            type="submit"
            disabled={state === "sending"}
            className="hostinger-reach-block-submit has-light-color has-color-3-background-color has-text-color has-background has-link-color"
          >
            {state === "sending" ? "…" : "Subscribe"}
          </button>
        </div>
        {!endpoint && (
          <p className="leaf-form-note">
            {el
              ? "Αίτημα εγγραφής μέσω της εφαρμογής email σου."
              : "Request a subscription through your email app."}
          </p>
        )}
        <p className="leaf-form-status" aria-live="polite">
          {state === "draft"
            ? el
              ? "Ολοκλήρωσε την αποστολή στην εφαρμογή email σου. Η εγγραφή δεν έχει γίνει αυτόματα."
              : "Send the draft in your email app. You have not been subscribed automatically."
            : state === "sent"
              ? el
                ? "Το αίτημα υποβλήθηκε."
                : "Request submitted."
              : state === "error"
                ? el
                  ? "Το αίτημα δεν στάλθηκε. Δοκίμασε ξανά."
                  : "Request failed. Please try again."
                : ""}
        </p>
      </form>
    </div>
  );
}

export function Footer({ lang }) {
  return (
    <footer className="site-footer wp-block-template-part">
      <div
        className="wp-block-group has-color-2-background-color has-background has-global-padding is-layout-constrained wp-block-group-is-layout-constrained"
        style={{
          paddingTop: "var(--wp--preset--spacing--60)",
          paddingBottom: "var(--wp--preset--spacing--60)",
        }}
      >
        <div className="wp-block-columns alignwide is-layout-flex wp-container-core-columns-is-layout-7094c525 wp-block-columns-is-layout-flex">
          <div
            className="wp-block-column is-layout-flow wp-block-column-is-layout-flow"
            style={{ flexBasis: "33.34%" }}
          >
            <h3 className="wp-block-heading hostinger-locale has-light-color has-text-color has-large-font-size">
              Menu
            </h3>
            <nav
              className="footer-navigation has-light-color"
              aria-label={lang === "el" ? "Μενού υποσέλιδου" : "Footer menu"}
            >
              <ul>
                {menu.map((item) => (
                  <li key={item.key}>
                    <Link to={routes[item.key][lang]}>{item[lang]}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div
            className="wp-block-column is-layout-flow wp-block-column-is-layout-flow"
            style={{ flexBasis: "33.34%" }}
          >
            <h3 className="wp-block-heading hostinger-locale has-light-color has-text-color has-large-font-size">
              Contacts
            </h3>
            <div className="ft-contacts">
              <div className="ft-contact-item">
                <span className="ft-contact-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m2 6 10 7 10-7" />
                  </svg>
                </span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
              <div className="ft-contact-item">
                <span className="ft-contact-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </span>
                <a href={site.phoneHref}>{site.phone}</a>
              </div>
            </div>
            <h3 className="wp-block-heading hostinger-locale has-light-color has-text-color has-large-font-size">
              Socials
            </h3>
            <ul className="wp-block-social-links has-icon-color is-style-logos-only is-layout-flex wp-container-core-social-links-is-layout-87452e7f wp-block-social-links-is-layout-flex">
              {site.socials.map((social) => (
                <li
                  key={social.key}
                  style={{ color: "#fff" }}
                  className={`wp-social-link wp-social-link-${social.key} has-light-color wp-block-social-link`}
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wp-block-social-link-anchor"
                    aria-label={social.name}
                  >
                    <Icon name={social.key} />
                    <span className="screen-reader-text">{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div
            className="wp-block-column has-light-color is-layout-flow wp-block-column-is-layout-flow"
            style={{ flexBasis: "33.33%" }}
          >
            <h3 className="wp-block-heading hostinger-locale has-light-color has-text-color has-large-font-size">
              {lang === "el"
                ? "Εγγραφείτε στο Newsletter μας"
                : "Subscribe to our Newsletter"}
            </h3>
            <Newsletter lang={lang} />
          </div>
        </div>
        <div
          className="wp-block-group alignwide is-content-justification-center is-layout-flex wp-container-core-group-is-layout-da6cc66d wp-block-group-is-layout-flex"
          style={{ marginTop: "var(--wp--preset--spacing--60)", padding: 0 }}
        >
          <p className="has-text-align-center has-light-color has-text-color has-small-font-size wp-block-paragraph">
            © 2026 LEAF PROPERTIES. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
