import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { getStaticRoutes } from "../src/lib/routing.js";
import { properties } from "../src/data/properties.js";

// Inspect shipped HTML rather than trusting the browser-only React tree.
const routes = getStaticRoutes();
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
  if (route.pageKey.startsWith("property-")) {
    const listing = properties.find(
      (item) => `property-${item.id}` === route.pageKey,
    );
    assert.ok(html.includes(listing.locales[route.lang].title), file);
    assert.ok(html.includes(listing.photos[0].src), file);
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
const sitemap = await readFile("dist/sitemap.xml", "utf8");
assert.equal((sitemap.match(/<loc>/g) || []).length, routes.length);
assert.doesNotMatch(sitemap, /\/404\/|#\//);
console.log(
  `Verified shipped HTML, metadata and local bundles for ${routes.length} pages; 404 and sitemap passed.`,
);
