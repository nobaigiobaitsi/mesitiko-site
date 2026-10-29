import test from "node:test";
import assert from "node:assert/strict";
import { defaultFilters, selectProperties } from "../src/lib/listings.js";
import { properties } from "../src/data/properties.js";
import { emailDraft } from "../src/lib/contact.js";
import { routes } from "../src/data/routes.js";
import fs from "node:fs";
import path from "node:path";

// Fixed business cases keep routine content edits from breaking filter tests.
const fixtures = [
  {
    id: "001",
    type: "monokatoikia",
    area: "ekali",
    price: 530000,
    rooms: 3,
    sqm: 280,
  },
  {
    id: "002",
    type: "diamerisma",
    area: "kalamata",
    price: 250000,
    rooms: 1,
    sqm: 40,
  },
  {
    id: "003",
    type: "diamerisma",
    area: "kalamata",
    price: 250000,
    rooms: 1,
    sqm: 40,
  },
  {
    id: "004",
    type: "monokatoikia",
    area: "peristeri",
    price: 130000,
    rooms: 1,
    sqm: 65,
  },
  {
    id: "005",
    type: "oikopedo",
    area: "roda-kerkyra",
    price: 695000,
    rooms: 0,
    sqm: 5060,
  },
  {
    id: "006",
    type: "diamerisma",
    area: "pagkrati",
    price: 270000,
    rooms: 2,
    sqm: 89,
  },
].map((property) => ({ ...property, transaction: "buy", status: "available" }));

test("Default filters include the 5,060 m² plot because 300+ is unbounded", () => {
  assert.equal(selectProperties(fixtures).length, 6);
  assert.ok(
    selectProperties(fixtures).some((property) => property.id === "005"),
  );
});

test("A finite area ceiling excludes the plot; upper limits are inclusive", () => {
  const found = selectProperties(fixtures, { ...defaultFilters, maxSqm: 89 });
  assert.deepEqual(
    found.map((property) => property.id),
    ["002", "003", "004", "006"],
  );
});

test("Combined location, type, rooms and price criteria must all match", () => {
  const filters = {
    ...defaultFilters,
    area: "pagkrati",
    type: "diamerisma",
    rooms: 2,
    minPrice: 270000,
    maxPrice: 270000,
  };
  assert.deepEqual(
    selectProperties(fixtures, filters).map((property) => property.id),
    ["006"],
  );
  assert.equal(selectProperties(fixtures, { ...filters, rooms: 3 }).length, 0);
});

test("Sorting price per square metre uses numeric ratios and does not mutate data", () => {
  const before = fixtures.map((property) => property.id);
  assert.equal(
    selectProperties(fixtures, defaultFilters, "ppsqm-asc")[0].id,
    "005",
  );
  assert.equal(
    selectProperties(fixtures, defaultFilters, "price-asc")[0].id,
    "004",
  );
  assert.equal(
    selectProperties(fixtures, defaultFilters, "price-desc")[0].id,
    "005",
  );
  assert.deepEqual(
    fixtures.map((property) => property.id),
    before,
  );
});

test("Rent has an honest empty state and hidden listings disappear", () => {
  assert.equal(
    selectProperties(fixtures, defaultFilters, "", "rent").length,
    0,
  );
  const hidden = fixtures.map((property) => ({
    ...property,
    status: "hidden",
  }));
  assert.equal(selectProperties(hidden).length, 0);
});

test("Every bilingual property has a valid route and every bundled image exists", () => {
  assert.equal(
    new Set(properties.map((property) => property.id)).size,
    properties.length,
    "Property IDs must be unique",
  );
  const paths = properties.flatMap((property) =>
    ["el", "en"].map((lang) => property.locales[lang].path),
  );
  assert.equal(
    new Set(paths.map((path) => path.toLowerCase())).size,
    paths.length,
    "Property paths must be unique",
  );
  for (const property of properties) {
    assert.ok(fs.existsSync(path.join("public", property.cover)));
    for (const lang of ["el", "en"]) {
      assert.ok(routes[`property-${property.id}`][lang]);
      const data = property.locales[lang];
      assert.ok(
        data.title &&
          data.description &&
          data.features.length &&
          property.photos.length,
      );
      for (const photo of property.photos)
        assert.ok(fs.existsSync(path.join("public", photo.src)), photo.src);
      assert.match(property.mapUrl, /^https:\/\/www\.google\.com\/maps\?/);
    }
  }
});

test("Email drafts preserve Greek, punctuation, property ID and phone", () => {
  const draft = emailDraft({
    name: "Άννα & Νίκος",
    email: "test@example.com",
    phone: "+30 6900000000",
    propertyId: "001",
    message: "Θέλω ραντεβού; 50% ενδιαφέρον!",
  });
  const url = new URL(draft);
  assert.equal(url.searchParams.get("subject"), "LEAF - Property #001");
  const body = url.searchParams.get("body");
  assert.ok(body.includes("Άννα & Νίκος"));
  assert.ok(body.includes("Θέλω ραντεβού; 50% ενδιαφέρον!"));
  assert.ok(body.includes("+30 6900000000"));
});
