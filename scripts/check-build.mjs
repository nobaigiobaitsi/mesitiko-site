import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { getStaticRoutes } from "../src/lib/routing.js";
import { loadEnv } from "vite";
import { normalizeBasePath } from "../src/lib/urls.js";

// Inspect shipped HTML rather than trusting the browser-only React tree.
const base = normalizeBasePath(process.env.VITE_BASE_PATH || loadEnv("production", process.cwd()).VITE_BASE_PATH);
const sitemap = await readFile("dist/sitemap.xml", "utf8");
const status = JSON.parse(await readFile("dist/publication-status.json", "utf8"));
const pages = getStaticRoutes([]);
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => {
  const pathname = decodeURI(new URL(url).pathname);
  assert.ok(pathname.startsWith(base), pathname);
  const route = "/" + pathname.slice(base.length);
  return { path: route, lang: route.startsWith("/en/") ? "en" : "el" };
});
const paths = new Set(routes.map(route => route.path));
assert.equal(paths.size, routes.length);
assert.equal(routes.length, pages.length + 2 * status.count);
for (const page of pages) assert.ok(paths.has(page.path), page.path);
for (const route of routes) {
  const file = path.join("dist", route.path.slice(1), "index.html");
  const html = await readFile(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  assert.ok(html.includes(`<html lang="${route.lang}">`), file);
  assert.equal(
    (html.match(/<h1[\s>]/g) || []).length,
    1,
    `Exactly one H1: ${file}`,
  );
  assert.match(head, /<title>.+?<\/title>/);
  assert.match(head, /name="description" content="[^"]+"/);
  assert.match(head, /rel="canonical" href="https?:\/\//);
  assert.match(head, /hreflang="el"/);
  assert.match(head, /hreflang="en"/);
  assert.doesNotMatch(html, /wp-block-|hostinger-|<!--app-head-->/);
  if (!pages.some(page => page.path === route.path)) {
    assert.match(html, /class="lpd-reference"/, file);
    assert.match(html, /src="[^"]*\/_crm\//, file);
  }
  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)].map(
    (match) => match[1],
  );
  assert.ok(assets.length >= 2, `Client JS/CSS links: ${file}`);
  for (const asset of assets) {
    const tail = asset.slice(asset.lastIndexOf("/assets/") + 1);
    await access(path.join("dist", tail));
  }
}
const notFound = await readFile("dist/404.html", "utf8");
assert.match(notFound, /content="noindex, nofollow"/);
assert.doesNotMatch(notFound, /rel="canonical"/);

assert.doesNotMatch(sitemap, /\/404\/|#\//);
console.log(
  `Verified shipped HTML, metadata and local bundles for ${routes.length} pages; 404 and sitemap passed.`,
);
