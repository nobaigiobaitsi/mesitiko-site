import test from "node:test";
import assert from "node:assert/strict";
import { properties } from "../src/data/properties.js";
import { routes } from "../src/data/routes.js";
import {
  getStaticRoutes,
  identifyRoute,
  propertySection,
} from "../src/lib/routing.js";
import { getSeo } from "../src/lib/seo.js";
import { renderSeoHead } from "../src/lib/seoHead.js";
import {
  absoluteUrl,
  normalizeBasePath,
  legacyHashTarget,
} from "../src/lib/urls.js";
import {
  initialFilters,
  propertyFacts,
  propertyMeta,
  selectProperties,
} from "../src/lib/listings.js";
import { content } from "../src/content/index.js";

test("One edit updates rooms, bathrooms and area in cards, facts and filtering in both languages", () => {
  const edited = { ...properties[0], rooms: 4, bathrooms: 2, sqm: 291 };
  assert.ok(propertyMeta(edited, "el").includes("🛏 4 Δωμ."));
  assert.ok(propertyMeta(edited, "en").includes("🛏 4 Bedrooms"));
  assert.ok(propertyMeta(edited, "en").includes("🛁 2 Bathrooms"));
  for (const lang of ["el", "en"]) {
    const facts = propertyFacts(edited, lang);
    assert.equal(facts.find((fact) => fact.key === "rooms").value, "4");
    assert.equal(
      facts.find((fact) => fact.key === "bathrooms").value,
      "2 (+1 WC)",
    );
    assert.ok(
      facts.find((fact) => fact.key === "sqm").value.startsWith("291 "),
    );
    assert.equal(facts.find((fact) => fact.key === "yearBuilt").value, "1985");
  }
  assert.equal(
    selectProperties([edited], { ...initialFilters(), rooms: 4 }).length,
    1,
  );
  assert.equal(
    selectProperties([properties[0]], { ...initialFilters(), rooms: 4 }).length,
    0,
  );
});

test("All bilingual routes round-trip, including encoded Greek URLs and language pairs", () => {
  const pages = getStaticRoutes();
  assert.equal(pages.length, Object.keys(routes).length * 2);
  assert.equal(new Set(pages.map((page) => page.path)).size, pages.length);
  for (const page of pages) {
    const result = identifyRoute(encodeURI(page.path));
    assert.equal(result.pageKey, page.pageKey);
    assert.equal(result.lang, page.lang);
    const otherLang = page.lang === "el" ? "en" : "el";
    assert.equal(
      identifyRoute(routes[page.pageKey][otherLang]).pageKey,
      page.pageKey,
    );
  }
  assert.equal(identifyRoute("/en/buy/").pageKey, "buy");
  assert.equal(identifyRoute("/does-not-exist/").pageKey, "404");
  assert.equal(identifyRoute("/en/does-not-exist/").lang, "en");
  assert.equal(identifyRoute("/%E0%A4%A/").pageKey, "404");
});

test("Rent listings have rent navigation, monthly filtering and hidden listings stay out of static output", () => {
  const rental = { ...properties[0], transaction: "rent", price: 1200 };
  assert.equal(
    identifyRoute(rental.locales.en.path, [rental]).activePage,
    "rent",
  );
  assert.equal(propertySection(rental, "el").path, "/ενοικίαση/");
  assert.equal(propertySection(rental, "en").path, "/en/rent/");
  assert.equal(
    selectProperties(
      [rental],
      { ...initialFilters("rent"), minPrice: 1000, maxPrice: 1300 },
      "",
      "rent",
    ).length,
    1,
  );
  assert.equal(
    selectProperties(
      [rental],
      { ...initialFilters("rent"), maxPrice: 1100 },
      "",
      "rent",
    ).length,
    0,
  );
  const hidden = properties.map((item) => ({ ...item, status: "hidden" }));
  assert.ok(
    getStaticRoutes(hidden).every(
      (page) => !page.pageKey.startsWith("property-"),
    ),
  );
  assert.equal(
    identifyRoute(properties[0].locales.el.path, hidden).pageKey,
    "404",
  );
});

test("SEO keeps language pairs and a repository subpath, and excludes 404 from indexing", () => {
  const route = identifyRoute("/en/rent/");
  const config = {
    origin: "https://example.github.io",
    base: "/mesitiko-site/",
  };
  const meta = getSeo(route, config);
  assert.equal(
    meta.canonical,
    "https://example.github.io/mesitiko-site/en/rent/",
  );
  assert.equal(meta.alternates.length, 2);
  assert.equal(
    new URL(meta.alternates[0].href).pathname,
    "/mesitiko-site/" + encodeURI("ενοικίαση/"),
  );
  const html = renderSeoHead({
    ...meta,
    title: 'A "quoted" & <escaped> title',
  });
  assert.ok(html.includes("&quot;quoted&quot; &amp; &lt;escaped&gt;"));
  assert.ok(html.includes('hreflang="x-default"'));
  const missing = getSeo(identifyRoute("/missing/"), config);
  assert.equal(missing.robots, "noindex, nofollow");
  assert.equal(missing.canonical, null);
  assert.deepEqual(missing.alternates, []);
  assert.equal(
    absoluteUrl("/assets/photo.webp", config.origin, config.base),
    "https://example.github.io/mesitiko-site/assets/photo.webp",
  );
  assert.equal(normalizeBasePath("/mesitiko-site"), "/mesitiko-site/");
  assert.throws(() => normalizeBasePath("./"));
});

test("Both languages supply the same page and service/step structures", () => {
  assert.deepEqual(Object.keys(content.el), Object.keys(content.en));
  assert.equal(content.el.services.items.length, 7);
  assert.equal(content.en.services.items.length, 7);
  assert.equal(content.el.workflow.steps.length, 8);
  assert.equal(content.en.workflow.steps.length, 8);
});

test("Old hash bookmarks keep their route/query and respect a repository base", () => {
  assert.equal(legacyHashTarget("#/en/rent/"), "/en/rent/");
  assert.equal(
    legacyHashTarget("#/αγορά/?area=ekali", "/mesitiko-site/"),
    "/mesitiko-site/αγορά/?area=ekali",
  );
  assert.equal(legacyHashTarget("#main-content"), null);
  assert.equal(legacyHashTarget("#//example.com/"), null);
  assert.equal(legacyHashTarget("#/\\example.com/"), null);
});
