import test from "node:test";
import assert from "node:assert/strict";
import { propertyMapUrl } from "../src/lib/maps.js";

test("Google map queries become embeds with one language parameter", () => {
  const url = new URL(propertyMapUrl("https://www.google.com/maps?q=Marousi&hl=en", "el"));
  assert.equal(url.searchParams.get("output"), "embed");
  assert.deepEqual(url.searchParams.getAll("hl"), ["el"]);
});
test("Google embed links preserve their payload", () => {
  const url = new URL(propertyMapUrl("https://www.google.com/maps/embed?pb=example", "en"));
  assert.equal(url.searchParams.get("pb"), "example");
});
test("Invalid, relative and non-embed URLs are omitted", () => {
  for (const value of [null, "", "/maps", "javascript:alert(1)", "https://evil.com/maps?q=x", "https://www.google.com/maps/place/Marousi", "http://www.google.com/maps?q=x"]) {
    assert.equal(propertyMapUrl(value, "el"), null);
  }
});
