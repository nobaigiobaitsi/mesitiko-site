import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { newsletter } from "../data/newsletter.js";
import { routes } from "../data/routes.js";
import { subscribeToNewsletter } from "../lib/newsletter.js";
import { loadTurnstile } from "../lib/turnstile.js";

const copy = {
  el: {
    label: "Το email σας",
    submit: "Εγγραφή",
    sending: "Αποστολή…",
    consent: "Θέλω να λαμβάνω νέα από τη LEAF και έχω διαβάσει την",
    privacy: "Πολιτική Απορρήτου",
    note: "Διαγραφή όποτε θελήσετε, από κάθε newsletter.",
    details: "Πώς χρησιμοποιούμε το email σας",
    processing:
      "Χρησιμοποιούμε το Brevo για την αποθήκευση των στοιχείων σας και την αποστολή ενημερώσεων, με δική μας ευθύνη και σύμφωνα με τις οδηγίες μας. Το Brevo μπορεί επίσης να επεξεργάζεται ορισμένα δεδομένα για την ασφάλεια της πλατφόρμας και την πρόληψη απάτης.",
    brevoPrivacy: "Πολιτική απορρήτου Brevo",
    checking: "Έλεγχος ασφαλείας…",
    verified: "Προστασία από ανεπιθύμητες εγγραφές με Cloudflare.",
    captchaError: "Ο έλεγχος ασφαλείας δεν ολοκληρώθηκε.",
    captchaRequired: "Περιμένετε να ολοκληρωθεί ο έλεγχος ασφαλείας.",
    retry: "Δοκιμάστε ξανά",
    success:
      "Σχεδόν έτοιμο! Ελέγξτε το email σας και πατήστε τον σύνδεσμο επιβεβαίωσης. Αν δεν το βρείτε, δείτε και τα ανεπιθύμητα.",
    error: "Η αποστολή δεν ολοκληρώθηκε. Δοκιμάστε ξανά σε λίγο.",
    EMAIL: "Ελέγξτε τη διεύθυνση email σας και δοκιμάστε ξανά.",
    OPT_IN: "Χρειάζεται η συγκατάθεσή σας για την εγγραφή.",
    fallback: "Ανοίξτε τη φόρμα εγγραφής",
  },
  en: {
    label: "Your email address",
    submit: "Subscribe",
    sending: "Sending…",
    consent: "I would like to receive news from LEAF and I have read the",
    privacy: "Privacy Policy",
    note: "Unsubscribe whenever you like, from any newsletter.",
    details: "How we use your email",
    processing:
      "We use Brevo to store your details and send updates under our responsibility and instructions. Brevo may also process some data for platform security and fraud prevention.",
    brevoPrivacy: "Brevo Privacy Policy",
    checking: "Security check…",
    verified: "Protected against automated signups by Cloudflare.",
    captchaError: "The security check could not be completed.",
    captchaRequired: "Please wait for the security check to finish.",
    retry: "Try again",
    success:
      "Almost there! Check your inbox and click the confirmation link. If it is missing, check your spam folder too.",
    error: "We could not submit your request. Please try again shortly.",
    EMAIL: "Please check your email address and try again.",
    OPT_IN: "Your consent is required to subscribe.",
    fallback: "Open the signup form",
  },
};

export function Newsletter({ lang }) {
  const text = copy[lang];
  const id = useId();
  const captcha = useRef(null);
  const widget = useRef(null);
  const request = useRef(null);
  const [attempt, setAttempt] = useState(0);
  const [captchaState, setCaptchaState] = useState("checking");
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let active = true;
    let widgetId;
    let api;
    const invalidate = (state) => {
      if (!active) return;
      setToken("");
      setCaptchaState(state);
    };

    loadTurnstile()
      .then((turnstile) => {
        if (!active) return;
        api = turnstile;
        widgetId = api.render(captcha.current, {
          sitekey: newsletter.turnstileSiteKey,
          theme: "dark",
          size: "compact",
          language: lang,
          // Keep the footer small; show Cloudflare's UI whenever interaction
          // is needed. The token is still mandatory and verified by Brevo.
          appearance: "interaction-only",
          callback: (value) => {
            if (!active) return;
            setToken(value);
            setCaptchaState("verified");
          },
          "expired-callback": () => invalidate("checking"),
          "timeout-callback": () => invalidate("error"),
          "error-callback": () => invalidate("error"),
          "unsupported-callback": () => invalidate("error"),
        });
        widget.current = { api, id: widgetId };
      })
      .catch(() => invalidate("error"));

    return () => {
      active = false;
      if (widgetId !== undefined) api.remove(widgetId);
      widget.current = null;
    };
  }, [lang, attempt]);

  useEffect(
    () => () => {
      request.current?.abort();
      request.current = null;
    },
    [],
  );

  function retryCaptcha() {
    setToken("");
    setCaptchaState("checking");
    setStatus(null);
    setAttempt((value) => value + 1);
  }

  async function submit(event) {
    event.preventDefault();
    if (request.current) return;
    if (!token) {
      setStatus({ type: "error", message: "captchaRequired" });
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("cf-turnstile-response", token);
    const controller = new AbortController();
    request.current = controller;
    const timeout = setTimeout(() => controller.abort(), 20000);
    setSending(true);
    setStatus(null);

    try {
      await subscribeToNewsletter(data, { signal: controller.signal });
      if (request.current !== controller) return;
      form.reset();
      setStatus({ type: "success", message: "success" });
    } catch (error) {
      if (request.current !== controller) return;
      const message = ["EMAIL", "OPT_IN"].includes(error.field)
        ? error.field
        : "error";
      setStatus({ type: "error", message });
    } finally {
      clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        setSending(false);
        setToken("");
        setCaptchaState("checking");
        if (widget.current) widget.current.api.reset(widget.current.id);
      }
    }
  }

  return (
    <form
      className="leaf-newsletter"
      action={newsletter.endpoint}
      method="POST"
      onSubmit={submit}
      aria-label={
        lang === "el" ? "Εγγραφή στο newsletter" : "Newsletter signup"
      }
      aria-busy={sending}
    >
      <label htmlFor={`${id}-email`}>{text.label}</label>
      <div className="leaf-newsletter-field">
        <input
          id={`${id}-email`}
          type="email"
          name="EMAIL"
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={sending}
          aria-describedby={`${id}-note`}
        />
        <button
          className="leaf-newsletter-submit"
          type="submit"
          disabled={sending}
        >
          {sending ? text.sending : text.submit}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M4 12h16m-6-6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <label className="leaf-newsletter-consent">
        <input
          type="checkbox"
          name="OPT_IN"
          value="1"
          required
          disabled={sending}
        />
        <span>
          {text.consent}{" "}
          <Link
            to={routes.privacy[lang]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text.privacy}
          </Link>
          .
        </span>
      </label>
      <p className="leaf-newsletter-note" id={`${id}-note`}>
        {text.note}
      </p>

      <div className="leaf-newsletter-captcha" ref={captcha} />
      <div className="leaf-newsletter-security" aria-live="polite">
        <p>
          {captchaState === "error" ? text.captchaError : text[captchaState]}
        </p>
        {captchaState === "error" && (
          <button type="button" onClick={retryCaptcha} disabled={sending}>
            {text.retry}
          </button>
        )}
      </div>

      <div
        className="leaf-newsletter-status"
        aria-live="polite"
        aria-atomic="true"
        data-status={status?.type}
      >
        {status && <p>{text[status.message]}</p>}
      </div>

      <details className="leaf-newsletter-details">
        <summary>{text.details}</summary>
        <p>
          {text.processing}{" "}
          <a
            href="https://www.brevo.com/en/legal/privacypolicy/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {text.brevoPrivacy}
          </a>
          .
        </p>
      </details>

      <div className="leaf-honeypot" aria-hidden="true">
        <input
          type="text"
          name="email_address_check"
          defaultValue=""
          tabIndex={-1}
          autoComplete="off"
          aria-label="Leave empty"
        />
      </div>
      <input type="hidden" name="locale" value="en" />
      <noscript>
        <a href={newsletter.endpoint}>{text.fallback}</a>
      </noscript>
    </form>
  );
}
