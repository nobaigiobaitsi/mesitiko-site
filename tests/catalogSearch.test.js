import { test } from "node:test";
import assert from "node:assert/strict";
import {
  emptySearch,
  readSearch,
  writeSearch,
  searchCatalog,
  rangeError,
} from "../src/lib/catalogSearch.js";
const home = {
  id: "1",
  reference: "LEAF-001",
  transaction: "buy",
  status: "available",
  area: "pagkrati",
  type: "diamerisma",
  price: 950000,
  sqm: 450,
  rooms: 3,
  locales: {
    el: { title: "Διαμέρισμα στο Παγκράτι", description: "Φωτεινός χώρος" },
    en: { title: "Apartment in Pagrati" },
  },
};
test("No implicit ceiling; explicit high price and area limits remain exact", () => {
  assert.equal(searchCatalog([home], emptySearch, "buy").length, 1);
  assert.equal(
    searchCatalog([home], { ...emptySearch, maxPrice: "900000" }, "buy").length,
    0,
  );
  assert.equal(
    searchCatalog([home], { ...emptySearch, maxSqm: "400" }, "buy").length,
    0,
  );
});
test("Shared searches round-trip and preserve unrelated parameters", () => {
  const state = {
    ...emptySearch,
    q: "Παγκράτι",
    maxPrice: "1000000",
    rooms: "3",
    includeClosed: true,
    sort: "price-asc",
  };
  const params = writeSearch(state, "utm_source=test");
  assert.deepEqual(readSearch(params), state);
  assert.equal(params.get("utm_source"), "test");
  assert.equal(writeSearch(emptySearch, params).toString(), "utm_source=test");
});
test("Invalid numeric queries are ignored and inverted ranges are detected", () => {
  assert.equal(
    readSearch("maxPrice=Infinity&minSqm=-5&rooms=nope").maxPrice,
    "",
  );
  assert.equal(readSearch("minSqm=-5").minSqm, "");
  assert.equal(readSearch("sort=unknown").sort, "");
  assert.equal(
    rangeError({ ...emptySearch, minPrice: "100", maxPrice: "50" }),
    true,
  );
  assert.equal(rangeError({ ...emptySearch, minPrice: "100" }), false);
});
test("Search matches accents, final sigma, English and reference; all terms must match", () => {
  for (const q of ["παγκρατι", "φωτεινοσ", "Pagrati", "leaf-001"])
    assert.equal(searchCatalog([home], { ...emptySearch, q }, "buy").length, 1);
  assert.equal(
    searchCatalog([home], { ...emptySearch, q: "Παγκράτι κήπος" }, "buy")
      .length,
    0,
  );
});
test("Hidden never appears, closed opt-in, transactions and sorting remain separate", () => {
  const catalog = [
    home,
    { ...home, id: "2", status: "sold", price: 500000 },
    { ...home, id: "3", status: "hidden" },
    { ...home, id: "4", transaction: "rent" },
  ];
  assert.deepEqual(
    searchCatalog(catalog, emptySearch, "buy").map((p) => p.id),
    ["1"],
  );
  assert.deepEqual(
    searchCatalog(
      catalog,
      { ...emptySearch, includeClosed: true, sort: "price-asc" },
      "buy",
    ).map((p) => p.id),
    ["2", "1"],
  );
  assert.equal(catalog[0].id, "1");
});

test("Price per square metre sorting remains supported", () => {
  const other = { ...home, id: "2", price: 500000, sqm: 100 };
  const filters = readSearch("sort=ppsqm-desc");
  assert.deepEqual(
    searchCatalog([home, other], filters, "buy").map((p) => p.id),
    ["2", "1"],
  );
});

test("municipality filters group different captions and preserve known old search URLs", async () => {
  const { municipalities, legacyMunicipalityId } = await import("../src/data/municipalities.js");
  const { propertyFacts } = await import("../src/lib/listings.js");
  assert.equal(new Set(municipalities.map((m) => m.id)).size, 332);
  assert.equal(legacyMunicipalityId("Δήμος Ηρακλείου"), "");
  const place = "Παράδεισος Αμαρουσίου, στα σύνορα με Χαλάνδρι";
  const first = { ...home, id: "A", area: place, additionalFacts: [] };
  const second = { ...first, id: "B", municipalityId: "marousi", area: "Κέντρο" };
  const third = { ...first, id: "C", municipalityId: "chalandri" };
  const unknown = { ...first, id: "D", area: "κοντά σε δύο δήμους" };
  const catalog = [first, second, third, unknown];
  const ids = (area) => searchCatalog(catalog, { ...emptySearch, area }, "buy").map((p) => p.id);
  assert.deepEqual(ids("marousi"), ["A", "B"]);
  assert.deepEqual(ids("chalandri"), ["C"]);
  assert.deepEqual(ids("all"), ["A", "B", "C", "D"]);
  assert.deepEqual(ids("kalamata"), []);
  assert.equal(readSearch(new URLSearchParams({ area: place })).area, "marousi");
  for (const [lang, name] of [["el", "Μαρούσι"], ["en", "Marousi"]])
    assert.equal(propertyFacts(second, lang).find((f) => f.key === "municipality").value, name);
});
