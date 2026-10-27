import { properties } from "./properties.js";

const pageRoutes = {
  home: {
    el: "/",
    en: "/en/",
  },
  buy: {
    el: "/αγορά/",
    en: "/en/buy-2/",
  },
  rent: {
    el: "/ενοικίαση/",
    en: "/en/rent/",
  },
  sell: {
    el: "/πώληση/",
    en: "/en/sale/",
  },
  services: {
    el: "/υπηρεσίες/",
    en: "/en/services/",
  },
  news: {
    el: "/νέα/",
    en: "/en/news/",
  },
  contact: {
    el: "/επικοινωνία/",
    en: "/en/contact/",
  },
  workflow: {
    el: "/η-οπτική-της-leaf-επιτόκια-αποδόσεις-2026/",
    en: "/en/the-leaf-workflow/",
  },
  privacy: {
    el: "/privacy-policy/",
    en: "/en/privacy-policy-2/",
  },
};

export const routes = {
  ...pageRoutes,
  ...Object.fromEntries(
    properties.map((property) => [
      `property-${property.id}`,
      { el: property.locales.el.path, en: property.locales.en.path },
    ]),
  ),
};
