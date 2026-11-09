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
