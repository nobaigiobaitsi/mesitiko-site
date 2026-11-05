import { newsletter } from "../data/newsletter.js";

export async function subscribeToNewsletter(formData, { signal } = {}) {
  // Same multipart POST and AJAX response as Brevo's generated main.js.
  // The public form endpoint owns list selection, Turnstile verification
  // and the double opt-in email. No Brevo API/secret key belongs here.
  const url = new URL(newsletter.endpoint);
  url.searchParams.set("isAjax", "1");
  const response = await fetch(url.href, {
    method: "POST",
    body: formData,
    signal,
  });
  const result = await response.json();
  if (!response.ok || result.success !== true) {
    const error = new Error("Newsletter subscription failed");
    error.field = Object.keys(result.errors || {})[0];
    throw error;
  }
}
