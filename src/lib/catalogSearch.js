// Empty upper bounds mean unlimited; explicit bounds are always respected.
export const emptySearch = {
  q: "",
  area: "all",
  type: "all",
  minPrice: "",
  maxPrice: "",
  minSqm: "",
  maxSqm: "",
  rooms: "",
  includeClosed: false,
  sort: "",
};
export const searchSorts = [
  "price-asc",
  "price-desc",
  "sqm-asc",
  "sqm-desc",
  "ppsqm-asc",
  "ppsqm-desc",
];
const numericKeys = ["minPrice", "maxPrice", "minSqm", "maxSqm", "rooms"];
export function readSearch(search = "") {
  const params = new URLSearchParams(search);
  const result = { ...emptySearch };
  for (const key of ["q", "area", "type"])
    if (params.get(key)?.trim())
      result[key] = params.get(key).trim().slice(0, 160);
  for (const key of numericKeys) {
    const value = params.get(key);
    if (
      value !== null &&
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0
    )
      result[key] = String(Number(value));
  }
  result.includeClosed = params.get("includeClosed") === "1";
  result.sort = searchSorts.includes(params.get("sort"))
    ? params.get("sort")
    : "";
  return result;
}
export function writeSearch(filters, existing = "") {
  const params = new URLSearchParams(existing);
  for (const [key, fallback] of Object.entries(emptySearch)) {
    params.delete(key);
    if (
      filters[key] !== fallback &&
      filters[key] != null &&
      filters[key] !== ""
    )
      params.set(
        key,
        key === "includeClosed" ? "1" : String(filters[key]).trim(),
      );
  }
  return params;
}
export function rangeError(filters) {
  return [
    ["minPrice", "maxPrice"],
    ["minSqm", "maxSqm"],
  ].some(
    ([min, max]) =>
      filters[min] !== "" &&
      filters[max] !== "" &&
      Number(filters[min]) > Number(filters[max]),
  );
}
export function normalizeSearch(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("el")
    .replace(/ς/g, "σ");
}
export function searchCatalog(catalog, filters, transaction) {
  const terms = normalizeSearch(filters.q).split(/\s+/).filter(Boolean);
  const results = catalog.filter((p) => {
    if (p.transaction !== transaction || p.status === "hidden") return false;
    if (!filters.includeClosed && ["sold", "rented"].includes(p.status))
      return false;
    if (filters.area !== "all" && p.area !== filters.area) return false;
    if (filters.type !== "all" && p.type !== filters.type) return false;
    if (filters.rooms !== "" && p.rooms < Number(filters.rooms)) return false;
    for (const [field, min, max] of [
      ["price", "minPrice", "maxPrice"],
      ["sqm", "minSqm", "maxSqm"],
    ]) {
      if (filters[min] !== "" && p[field] < Number(filters[min])) return false;
      if (filters[max] !== "" && p[field] > Number(filters[max])) return false;
    }
    const text = normalizeSearch(
      [
        p.reference,
        p.id,
        ...Object.values(p.locales).flatMap((l) => [
          l.title,
          l.cardTitle,
          l.cardAddress,
          l.location,
          l.description,
        ]),
      ].join(" "),
    );
    return terms.every((term) => text.includes(term));
  });
  if (searchSorts.includes(filters.sort)) {
    const field = filters.sort.startsWith("sqm") ? "sqm" : "price";
    const value = (p) =>
      filters.sort.startsWith("ppsqm")
        ? p.sqm > 0
          ? p.price / p.sqm
          : 0
        : p[field];
    results.sort(
      (a, b) =>
        (filters.sort.endsWith("desc") ? -1 : 1) * (value(a) - value(b)) ||
        String(a.id).localeCompare(String(b.id)),
    );
  }
  return results;
}
