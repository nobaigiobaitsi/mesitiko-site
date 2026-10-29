import { build, loadEnv } from "vite";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { normalizeBasePath, absoluteUrl, withBase } from "../src/lib/urls.js";
import { escapeHtml, renderSeoHead } from "../src/lib/seoHead.js";

// React is rendered only during the build. Deploying dist/ needs no Node server.
const env = {
  ...loadEnv("production", process.cwd(), "VITE_"),
  ...process.env,
};
const base = normalizeBasePath(env.VITE_BASE_PATH || "/");
const origin = env.VITE_SITE_URL?.trim() || "https://leafproperties.net";
const parsedOrigin = new URL(origin);
if (
  !["https:", "http:"].includes(parsedOrigin.protocol) ||
  parsedOrigin.pathname !== "/" ||
  parsedOrigin.search ||
  parsedOrigin.hash
) {
  throw new Error(
    "VITE_SITE_URL must be an origin, e.g. https://example.com. Put a repository subpath in VITE_BASE_PATH.",
  );
}
const config = { origin: parsedOrigin.origin, base };
const dist = path.resolve("dist");
const serverOutput = path.resolve(".ssg");

try {
  await build();
  const template = await readFile(path.join(dist, "index.html"), "utf8");
  await build({
    publicDir: false,
    build: {
      ssr: "src/entry-server.jsx",
      outDir: serverOutput,
      emptyOutDir: true,
    },
  });
  const { renderRoute, getStaticRoutes, aliases } = await import(
    pathToFileURL(path.join(serverOutput, "entry-server.js"))
  );
  const routes = getStaticRoutes();
  const writePage = async (file, html) => {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  };
  for (const route of [...routes, { path: "/404/" }]) {
    const { html, meta } = renderRoute(route.path, config);
    const page = template
      .replace('<html lang="el">', `<html lang="${meta.lang}">`)
      .replace("<!--app-head-->", renderSeoHead(meta))
      .replace(
        '<div id="root"></div>',
        `<div id="root" data-route="${escapeHtml(route.path)}">${html}</div>`,
      );
    const file =
      route.path === "/404/"
        ? path.join(dist, "404.html")
        : path.join(dist, route.path.slice(1), "index.html");
    await writePage(file, page);
  }
  for (const [from, to] of Object.entries(aliases)) {
    const target = escapeHtml(withBase(to, base));
    await writePage(
      path.join(dist, from.slice(1), "index.html"),
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${escapeHtml(absoluteUrl(to, origin, base))}"><title>LEAF · Redirect</title></head><body><a href="${target}">Continue to LEAF</a></body></html>`,
    );
  }
  const urls = routes
    .map((route) => {
      const { meta } = renderRoute(route.path, config);
      const alternates = meta.alternates
        .map(
          (item) =>
            `<xhtml:link rel="alternate" hreflang="${item.lang}" href="${escapeHtml(item.href)}"/>`,
        )
        .join("");
      return `  <url><loc>${escapeHtml(meta.canonical)}</loc>${alternates}</url>`;
    })
    .join("\n");
  await writeFile(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  );
  await writeFile(
    path.join(dist, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl("/sitemap.xml", origin, base)}\n`,
  );
  await writeFile(path.join(dist, ".nojekyll"), "");
  await writeFile(
    path.join(dist, "_redirects"),
    `${base}* ${withBase("/404.html", base)} 404\n`,
  );
  await writeFile(
    path.join(dist, ".htaccess"),
    `DirectoryIndex index.html\nOptions -MultiViews\nErrorDocument 404 ${withBase("/404.html", base)}\n`,
  );
  console.log(
    `\nPrerendered ${routes.length} bilingual pages, 404, aliases, sitemap and robots.txt (base: ${base}).`,
  );
} finally {
  await rm(serverOutput, { recursive: true, force: true });
}
