export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function renderSeoHead(meta) {
  const tag = (name, attributes) =>
    `<${name} data-leaf-seo ${Object.entries(attributes)
      .map(([key, value]) => `${key}="${escapeHtml(value)}"`)
      .join(" ")}>`;
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    tag("meta", { name: "description", content: meta.description }),
    tag("meta", { name: "robots", content: meta.robots }),
    tag("meta", { property: "og:title", content: meta.title }),
    tag("meta", { property: "og:description", content: meta.description }),
    tag("meta", { property: "og:type", content: meta.type }),
    tag("meta", { property: "og:image", content: meta.image }),
    tag("meta", {
      property: "og:locale",
      content: meta.lang === "el" ? "el_GR" : "en_GB",
    }),
    tag("meta", { name: "twitter:card", content: "summary_large_image" }),
  ];
  if (meta.canonical)
    tags.push(
      tag("link", { rel: "canonical", href: meta.canonical }),
      tag("meta", { property: "og:url", content: meta.canonical }),
    );
  meta.alternates.forEach((item) =>
    tags.push(
      tag("link", { rel: "alternate", hreflang: item.lang, href: item.href }),
    ),
  );
  if (meta.alternates.length)
    tags.push(
      tag("link", {
        rel: "alternate",
        hreflang: "x-default",
        href: meta.alternates[0].href,
      }),
    );
  return tags.join("\n    ");
}
