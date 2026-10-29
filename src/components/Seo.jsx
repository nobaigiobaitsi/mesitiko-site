import { useEffect } from "react";

// The build writes the same metadata into each HTML head. This keeps it current
// after client-side navigation; crawlers do not have to run this effect.
export function Seo({ meta }) {
  useEffect(() => {
    document.title = meta.title;
    document.documentElement.lang = meta.lang;
    document.head
      .querySelectorAll("[data-leaf-seo]")
      .forEach((node) => node.remove());
    const add = (tag, attributes) => {
      const node = document.createElement(tag);
      Object.entries(attributes).forEach(([key, value]) =>
        node.setAttribute(key, value),
      );
      node.setAttribute("data-leaf-seo", "");
      document.head.append(node);
    };
    add("meta", { name: "description", content: meta.description });
    add("meta", { name: "robots", content: meta.robots });
    if (meta.canonical) add("link", { rel: "canonical", href: meta.canonical });
    meta.alternates.forEach((item) =>
      add("link", { rel: "alternate", hreflang: item.lang, href: item.href }),
    );
    if (meta.alternates.length)
      add("link", {
        rel: "alternate",
        hreflang: "x-default",
        href: meta.alternates[0].href,
      });
    Object.entries({
      title: meta.title,
      description: meta.description,
      type: meta.type,
      image: meta.image,
      locale: meta.lang === "el" ? "el_GR" : "en_GB",
      ...(meta.canonical ? { url: meta.canonical } : {}),
    }).forEach(([key, value]) =>
      add("meta", { property: `og:${key}`, content: value }),
    );
    add("meta", { name: "twitter:card", content: "summary_large_image" });
  }, [meta]);
  return null;
}
