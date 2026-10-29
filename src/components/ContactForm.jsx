import { useId, useState } from "react";
import { emailDraft, sendRequest } from "../lib/contact.js";
import { site } from "../data/site.js";

export function ContactForm({
  lang = "el",
  kind = "contact",
  propertyId,
  propertyTitle,
}) {
  const id = useId();
  const [state, setState] = useState("idle");
  const [draft, setDraft] = useState("");
  const el = lang === "el";
  const appointment = kind === "appointment";
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim();
  const t = el
    ? {
        name: "Όνομα",
        lastName: "Επώνυμο",
        email: "Email",
        phone: "Τηλέφωνο",
        subject: "Θέμα",
        message: "Το Μήνυμά σας",
        submit: appointment ? "Κλείσε Ραντεβού" : "Αποστολή Μηνύματος",
        note: "Η φόρμα ανοίγει έτοιμο email στην εφαρμογή σου. Πάτησε «Αποστολή» εκεί για να σταλεί.",
        ready:
          "Το προσχέδιο είναι έτοιμο. Αν δεν άνοιξε εφαρμογή email, χρησιμοποίησε τον σύνδεσμο ή γράψε μας απευθείας.",
        error: "Δεν στάλθηκε το αίτημα. Δοκίμασε ξανά ή στείλε μας email.",
        success: "Το αίτημά σου υποβλήθηκε.",
      }
    : {
        name: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        subject: "Subject",
        message: "Your message",
        submit: appointment ? "Book a Viewing" : "Send Message",
        note: "This form opens an email draft in your email app. Press Send there to send it.",
        ready:
          "Your draft is ready. If your email app did not open, use the link below or email us directly.",
        error: "Your request was not sent. Try again or email us.",
        success: "Your request was submitted.",
      };

  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.website) return;
    delete values.website;
    const payload = {
      ...values,
      kind,
      language: lang,
      ...(propertyId ? { propertyId } : {}),
    };
    if (!endpoint) {
      const href = emailDraft(payload);
      setDraft(href);
      setState("draft");
      window.location.href = href;
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

  function field(
    name,
    { type = "text", required = false, value, rows, autoComplete } = {},
  ) {
    const props = {
      id: `${id}-${name}`,
      name,
      required,
      defaultValue: value,
      autoComplete,
      maxLength: name === "message" ? 2500 : 200,
    };
    return (
      <div className="leaf-field">
        <div className="leaf-field-label">
          <label htmlFor={props.id}>
            {t[name]}
            {required && <span aria-hidden="true"> *</span>}
          </label>
        </div>
        <div className="leaf-field-control">
          {rows ? (
            <textarea {...props} rows={rows} className="leaf-input" />
          ) : (
            <input {...props} type={type} className="leaf-input" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`leaf-form-wrap ${appointment ? "leaf-form-wrap--appointment" : ""}`}
    >
      <form
        className="leaf-contact-form"
        onSubmit={submit}
        aria-label={
          appointment ? t.submit : el ? "Φόρμα Επικοινωνίας" : "Contact Form"
        }
      >
        {field("name", { required: appointment, autoComplete: "given-name" })}
        {kind === "contact" &&
          field("lastName", { autoComplete: "family-name" })}
        {!appointment &&
          field("email", {
            type: "email",
            required: true,
            autoComplete: "email",
          })}
        {(kind === "contact" || appointment) &&
          field("phone", { type: "tel", required: true, autoComplete: "tel" })}
        {kind === "contact" && field("subject")}
        {field("message", {
          required: !appointment,
          rows: appointment ? 5 : 4,
          value: appointment
            ? `${el ? "Ενδιαφέρομαι για το ακίνητο" : "I am interested in the property"}: ${propertyTitle}`
            : "",
        })}
        <div className="leaf-honeypot" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        {!endpoint && <p className="leaf-form-note">{t.note}</p>}
        <div className="leaf-form-actions">
          <button
            className="leaf-form-submit"
            type="submit"
            disabled={state === "sending"}
          >
            {state === "sending" ? (el ? "Αποστολή…" : "Sending…") : t.submit}
          </button>
        </div>
        <div aria-live="polite" className="leaf-form-status">
          {state === "draft" && (
            <p>
              {t.ready}{" "}
              <a href={draft}>{el ? "Άνοιγμα email" : "Open email"}</a> ·{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          )}
          {state === "sent" && <p>{t.success}</p>}
          {state === "error" && (
            <p role="alert">
              {t.error} <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
