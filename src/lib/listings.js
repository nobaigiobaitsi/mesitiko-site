export const defaultFilters = {
  area: "all",
  type: "all",
  rooms: 0,
  minPrice: 0,
  maxPrice: 800000,
  minSqm: 0,
  maxSqm: 300,
};

export function listingLimits(transaction = "buy") {
  return transaction === "rent"
    ? { price: 5000, step: 50 }
    : { price: 800000, step: 5000 };
}

export function initialFilters(transaction = "buy") {
  return { ...defaultFilters, maxPrice: listingLimits(transaction).price };
}

export function selectProperties(
  properties,
  filters = defaultFilters,
  sort = "",
  transaction = "buy",
) {
  const priceCeiling =
    filters.maxPrice >= listingLimits(transaction).price
      ? Infinity
      : filters.maxPrice;
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
  const el = lang === "el";
  const area = `📐 ${formatNumber(property.sqm, lang)} ${el ? "τ.μ." : "m²"}`;
  if (property.type === "oikopedo") {
    return [
      area,
      ...property.additionalFacts
        .filter((fact) => ["frontage", "seaDistance"].includes(fact.key))
        .map(
          (fact) =>
            `${fact.icon} ${formatNumber(fact.value, lang)} ${el ? "μ." : "m"} ${fact.key === "frontage" ? (el ? "πρόσοψη" : "frontage") : el ? "από θάλασσα" : "from the sea"}`,
        ),
    ];
  }
  return [
    `🛏 ${formatNumber(property.rooms, lang)} ${el ? "Δωμ." : property.rooms === 1 ? "Bedroom" : "Bedrooms"}`,
    `🛁 ${formatNumber(property.bathrooms, lang)} ${el ? (property.bathrooms === 1 ? "Μπάνιο" : "Μπάνια") : property.bathrooms === 1 ? "Bathroom" : "Bathrooms"}`,
    area,
  ];
}

export function propertyFacts(property, lang) {
  const el = lang === "el";
  const facts = [
    {
      key: "sqm",
      icon: "📐",
      value: `${formatNumber(property.sqm, lang)} ${el ? "τ.μ." : "m²"}`,
      label: el ? "Συνολική Επιφάνεια" : "Total Area",
    },
  ];
  if (property.type !== "oikopedo")
    facts.push(
      {
        key: "rooms",
        icon: "🛏",
        value: formatNumber(property.rooms, lang),
        label: el ? "Υπνοδωμάτια" : "Bedrooms",
      },
      {
        key: "bathrooms",
        icon: "🛁",
        value: `${formatNumber(property.bathrooms, lang)}${property.wc ? ` (+${property.wc} WC)` : ""}`,
        label: el ? "Μπάνια" : "Bathrooms",
      },
    );
  return [
    ...facts,
    ...property.additionalFacts.map((fact) => {
      const number =
        typeof fact.value === "number"
          ? formatNumber(fact.value, lang)
          : fact.value[lang];
      const units = {
        sqm: el ? "τ.μ." : "m²",
        metres: el ? "μ." : "m",
        levels: el ? "Επίπεδα" : "Levels",
      };
      // Years are identifiers, not quantities (1985, rather than 1,985).
      const value =
        fact.format === "number"
          ? String(fact.value)
          : `${number}${units[fact.format] ? ` ${units[fact.format]}` : ""}`;
      return { key: fact.key, icon: fact.icon, value, label: fact.label[lang] };
    }),
  ];
}

export function propertyStatus(property, lang) {
  const labels = {
    sold: { el: "ΠΩΛΗΘΗΚΕ", en: "SOLD" },
    rented: { el: "ΕΝΟΙΚΙΑΣΤΗΚΕ", en: "RENTED" },
    available: { el: "ΔΙΑΘΕΣΙΜΟ", en: "AVAILABLE" },
  };
  return (labels[property.status] || labels.available)[lang];
}
