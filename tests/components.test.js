import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { createServer } from "vite";
import { properties } from "../src/data/properties.js";
import { identifyRoute } from "../src/lib/routing.js";

let server, Property, PropertyCard, Header;
before(async () => {
  // Vite transpiles JSX for these server-side component regression checks;
  // middlewareMode does not start an HTTP listener.
  server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  ({ Property } = await server.ssrLoadModule("/src/pages/Property.jsx"));
  ({ PropertyCard } = await server.ssrLoadModule(
    "/src/components/PropertyCard.jsx",
  ));
  ({ Header } = await server.ssrLoadModule("/src/components/Header.jsx"));
});
after(async () => {
  await server?.close();
});

const render = (Component, props) =>
  renderToStaticMarkup(
    createElement(
      StaticRouter,
      { location: "/" },
      createElement(Component, props),
    ),
  );

test("Editing the canonical room count changes both rendered components", () => {
  const edited = { ...properties[0], rooms: 4 };
  const card = render(PropertyCard, { property: edited, lang: "en" });
  const detail = render(Property, { property: edited, lang: "en" });
  assert.ok(card.includes("🛏 4 Bedrooms"));
  assert.ok(detail.includes("<strong>4</strong>"));
  assert.ok(!card.includes("🛏 3 Bedrooms"));
  assert.equal((detail.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(detail, /<iframe[^>]+src="https:\/\/www.google.com\/maps\?/);
});

test("A rendered rental detail links back to rent and marks Rent active in the header", () => {
  const rental = { ...properties[0], transaction: "rent", price: 1200 };
  const route = identifyRoute(rental.locales.en.path, [rental]);
  const detail = render(Property, { property: rental, lang: "en" });
  const header = render(Header, route);
  assert.match(detail, /class="lpd-back" href="\/en\/rent\/"/);
  assert.ok(detail.includes(" / month"));
  assert.match(header, /<a[^>]*aria-current="page"[^>]*>Rent<\/a>/);
  assert.doesNotMatch(header, /<a[^>]*aria-current="page"[^>]*>Buy<\/a>/);
});
