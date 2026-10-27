export const defaultFilters = {
  area: "all",
  type: "all",
  rooms: 0,
  minPrice: 0,
  maxPrice: 800000,
  minSqm: 0,
  maxSqm: 300,
};

export function selectProperties(
  properties,
  filters = defaultFilters,
  sort = "",
  transaction = "buy",
) {
  const priceCeiling = filters.maxPrice >= 800000 ? Infinity : filters.maxPrice;
  const sqmCeiling = filters.maxSqm >= 300 ? Infinity : filters.maxSqm;
  const result = properties.filter(
    (property) =>
      property.transaction === transaction &&
      property.status !== "hidden" &&
      (filters.area === "all" || property.area === filters.area) &&
      (filters.type === "all" || property.type === filters.type) &&
      property.rooms >= Number(filters.rooms) &&
      property.price >= filters.minPrice &&
      property.price <= priceCeiling &&
      property.sqm >= filters.minSqm &&
      property.sqm <= sqmCeiling,
  );
  const value = (property) =>
    sort.startsWith("ppsqm") ? property.price / property.sqm : property.price;
  if (sort)
    result.sort(
      (a, b) =>
        (sort.endsWith("desc") ? -1 : 1) * (value(a) - value(b)) ||
        a.id.localeCompare(b.id),
    );
  return result;
}

export function formatNumber(value, lang = "el") {
  return new Intl.NumberFormat(lang === "el" ? "el-GR" : "en-GB", {
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPrice(value, lang = "el") {
  return `${formatNumber(value, lang)} €`;
}

export function propertyMeta(property, lang) {
  const numbers =
    property.type === "oikopedo"
      ? [property.sqm, null, null]
      : [property.rooms, property.bathrooms, property.sqm];
  return property.locales[lang].cardMeta.map((text, index) =>
    numbers[index] == null
      ? text
      : text.replace(/[\d.,]+/, formatNumber(numbers[index], lang)),
  );
}
