import { site } from "../data/site.js";

export function emailDraft(payload) {
  const subject =
    payload.subject ||
    (payload.propertyId
      ? `LEAF - Property #${payload.propertyId}`
      : payload.kind === "newsletter"
        ? "LEAF - Newsletter subscription request"
        : "LEAF - Contact request");
  const body = [
    payload.propertyId ? `Property: #${payload.propertyId}` : "",
    `Name: ${[payload.name, payload.lastName].filter(Boolean).join(" ")}`,
    payload.email ? `Email: ${payload.email}` : "",
    payload.phone ? `Phone: ${payload.phone}` : "",
    "",
    payload.message || "",
  ]
    .filter((value) => value !== undefined)
    .join("\r\n");
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function sendRequest(payload, endpoint) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Request failed");
  } finally {
    clearTimeout(timeout);
  }
}
