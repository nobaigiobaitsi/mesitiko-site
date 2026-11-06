// Render only supported Google Maps embeds; empty/relative URLs load our own site.
export function propertyMapUrl(value, lang) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value);
    if (
      url.protocol !== "https:" ||
      !["www.google.com", "maps.google.com"].includes(url.hostname) ||
      url.username || url.password || url.port
    ) return null;
    const embed = /^\/maps\/embed(?:\/|$)/.test(url.pathname);
    const query = /^\/maps\/?$/.test(url.pathname) && url.searchParams.get("q")?.trim();
    if (!embed && !query) return null;
    if (query) url.searchParams.set("output", "embed");
    url.searchParams.set("hl", lang === "el" ? "el" : "en");
    return url.href;
  } catch {
    return null;
  }
}
