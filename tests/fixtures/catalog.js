// Synthetic data for routing and rendering tests, never included by the site build.
function listing(id, type) {
  const locales = Object.fromEntries(
    ["el", "en"].map((lang) => {
      const title = lang === "el" ? "Δοκιμαστική αγγελία" : "Sample listing";
      return [
        lang,
        {
          title,
          cardTitle: title,
          address: "Area",
          cardAddress: "Area",
          features: [],
          description: title,
          path: (lang === "el" ? "/" : "/en/") + id + "/",
        },
      ];
    }),
  );
  return {
    id,
    type,
    locales,
    transaction: "buy",
    status: "available",
    area: "sample",
    price: 400000,
    rooms: 3,
    bathrooms: 2,
    wc: 1,
    sqm: 280,
    cover: "assets/main_logo.webp",
    photos: ["assets/main_logo.webp", "assets/hero_image.webp"].map((src) => ({
      src,
      alt: { el: "Εικόνα", en: "Photo" },
    })),
    mapUrl: "https://www.google.com/maps?q=Athens",
    additionalFacts: [
      {
        key: "yearBuilt",
        format: "number",
        value: 1985,
        label: { el: "Έτος", en: "Year" },
      },
    ],
  };
}
const plot = listing("sample-plot", "oikopedo");
plot.sqm = 5060;
plot.additionalFacts = [
  {
    key: "frontage",
    format: "metres",
    value: 65,
    label: { el: "Πρόσοψη", en: "Frontage" },
  },
];
export const properties = [listing("sample-house", "monokatoikia"), plot];
