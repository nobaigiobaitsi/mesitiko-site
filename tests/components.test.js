import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { createServer } from "vite";
import { properties } from "../src/data/properties.js";
import { identifyRoute } from "../src/lib/routing.js";

let server, Property, PropertyCard, Header, Footer;
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
  ({ Footer } = await server.ssrLoadModule("/src/components/Footer.jsx"));
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
  assert.match(card, /<dt>Bedrooms<\/dt><dd>4<\/dd>/);
  assert.ok(detail.includes("<strong>4</strong>"));
  assert.doesNotMatch(card, /<dt>Bedrooms<\/dt><dd>3<\/dd>/);
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

test("Listing cards expose photo controls, a count and a separate detail link in both languages", () => {
  for (const lang of ["el", "en"]) {
    const card = render(PropertyCard, { property: properties[0], lang });
    assert.match(card, /class="lpl-gallery-arrow lpl-gallery-prev"/);
    assert.match(card, /class="lpl-gallery-arrow lpl-gallery-next"/);
    assert.match(card, /aria-live="polite" aria-atomic="true"/);
    assert.ok(card.includes(properties[0].cover));
    assert.match(card, /class="lpl-card-facts"/);
    assert.match(card, /class="lpl-cta" href=/);
    assert.doesNotMatch(card, /<a[^>]*class="lpl-photo/);
  }
});

test("Single-photo cards omit gallery controls and plot facts use land measurements", () => {
  const plot = properties.find((property) => property.type === "oikopedo");
  const single = {
    ...plot,
    photos: [plot.photos[0]],
    cover: plot.photos[0].src,
  };
  const card = render(PropertyCard, { property: single, lang: "en" });
  assert.doesNotMatch(card, /class="lpl-gallery-arrow/);
  assert.doesNotMatch(card, /<dt>Bedrooms/);
  assert.match(card, /5,060 m²/);
  assert.match(card, /<dt>[^<]+<\/dt><dd>65 m<\/dd>/);
});

test("The newsletter renders natively in both languages with required, unchecked consent", () => {
  for (const lang of ["el", "en"]) {
    const footer = render(Footer, { lang });
    assert.doesNotMatch(footer, /<iframe/);
    assert.match(
      footer,
      /<form[^>]+action="https:\/\/8d2b83f8\.sibforms\.com\/serve\//,
    );
    const email = footer.match(/<input\b[^>]*name="EMAIL"[^>]*>/)[0];
    const consent = footer.match(/<input\b[^>]*name="OPT_IN"[^>]*>/)[0];
    assert.match(email, /type="email"/);
    assert.match(email, /required=""/);
    assert.match(consent, /type="checkbox"/);
    assert.match(consent, /required=""/);
    assert.match(consent, /value="1"/);
    assert.doesNotMatch(consent, /checked/);
    assert.match(footer, /name="email_address_check"/);
    assert.match(footer, /<details class="leaf-newsletter-details">/);
    assert.ok(
      footer.includes(
        lang === "el"
          ? "Πώς χρησιμοποιούμε το email σας"
          : "How we use your email",
      ),
    );
    assert.ok(
      footer.includes(
        lang === "el"
          ? 'href="/privacy-policy/"'
          : 'href="/en/privacy-policy-2/"',
      ),
    );
    assert.match(footer, /aria-live="polite" aria-atomic="true"/);
  }
});

test("Missing or invalid property maps never embed the site itself", () => {
  for (const mapUrl of [undefined, "", "&hl=el", "/", "https://example.com/maps"]) {
    const property = { ...properties[0], mapUrl };
    const detail = render(Property, { property, lang: "el" });
    assert.doesNotMatch(detail, /<iframe/);
    assert.ok(detail.includes(property.locales.el.location || property.locales.el.address));
  }
});
