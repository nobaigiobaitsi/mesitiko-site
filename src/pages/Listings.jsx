import { useState, useSyncExternalStore } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { properties } from "../data/properties.js";
import { routes } from "../data/routes.js";
import { site } from "../data/site.js";
import { PropertyCard } from "../components/PropertyCard.jsx";
import {
  emptySearch,
  readSearch,
  writeSearch,
  rangeError,
  searchCatalog,
} from "../lib/catalogSearch.js";
import { formatNumber } from "../lib/listings.js";

const subscribe = () => () => {};
const areaNames = {
  peristeri: ["Περιστέρι", "Peristeri"],
  kalamata: ["Καλαμάτα", "Kalamata"],
  "roda-kerkyra": ["Ρόδα Κέρκυρας", "Roda, Corfu"],
  ekali: ["Εκάλη", "Ekali"],
  pagkrati: ["Παγκράτι", "Pagrati"],
};
const typeNames = {
  diamerisma: ["Διαμέρισμα", "Apartment"],
  monokatoikia: ["Μονοκατοικία", "Detached house"],
  oikopedo: ["Οικόπεδο", "Plot"],
};
function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  );
}

export function Listings({ lang, transaction = "buy" }) {
  const [params, setParams] = useSearchParams();
  // Match the prerendered HTML first, then restore shared/bookmarked filters.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const search = hydrated ? params.toString() : "";
  return (
    <Catalog
      key={`${transaction}-${search}`}
      lang={lang}
      transaction={transaction}
      search={search}
      onChange={(next) => setParams(writeSearch(next, params))}
    />
  );
}
function Catalog({ lang, transaction, search, onChange }) {
  const el = lang === "el";
  const t = (gr, en) => (el ? gr : en);
  const active = readSearch(search);
  const [draft, setDraft] = useState(active);
  const [error, setError] = useState(false);
  const set = (key, value) => {
    setDraft((old) => ({ ...old, [key]: value }));
    setError(false);
  };
  const catalog = properties.filter(
    (p) => p.transaction === transaction && p.status !== "hidden",
  );
  const areas = [
    ...new Map(
      catalog.map((p) => [
        p.area,
        areaNames[p.area]?.[el ? 0 : 1] ||
          p.locales[lang].cardAddress.replace(/^📍\s*/, "") ||
          p.locales[lang].location ||
          p.area,
      ]),
    ).entries(),
  ].sort((a, b) => a[1].localeCompare(b[1], lang));
  const types = [...new Set(catalog.map((p) => p.type))].map((key) => [
    key,
    typeNames[key]?.[el ? 0 : 1] || key,
  ]);
  const results = searchCatalog(properties, active, transaction);
  const areaLabel = (value) =>
    areas.find(([key]) => key === value)?.[1] || value;
  const typeLabel = (value) =>
    types.find(([key]) => key === value)?.[1] || value;
  const chipLabels = {
    q: t("Αναζήτηση: ", "Search: ") + active.q,
    area: areaLabel(active.area),
    type: typeLabel(active.type),
    minPrice:
      t("Από ", "From ") + formatNumber(Number(active.minPrice), lang) + " €",
    maxPrice:
      t("Έως ", "Up to ") + formatNumber(Number(active.maxPrice), lang) + " €",
    minSqm: t("Από ", "From ") + active.minSqm + t(" τ.μ.", " m²"),
    maxSqm: t("Έως ", "Up to ") + active.maxSqm + t(" τ.μ.", " m²"),
    rooms: active.rooms + t("+ υπνοδωμάτια", "+ bedrooms"),
    includeClosed: t("Και μη διαθέσιμα", "Including unavailable"),
  };
  const chips = Object.keys(chipLabels).filter(
    (key) => active[key] !== emptySearch[key],
  );
  const advanced =
    active.minSqm !== "" ||
    active.maxSqm !== "" ||
    active.rooms !== "" ||
    active.includeClosed;
  function submit(event) {
    event.preventDefault();
    if (rangeError(draft)) {
      setError(true);
      return;
    }
    onChange(draft);
  }
  function numberInput(key, label, placeholder) {
    return (
      <label className="lpl-field" htmlFor={`search-${key}`}>
        <span>{label}</span>
        <input
          id={`search-${key}`}
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={draft[key]}
          placeholder={placeholder}
          onChange={(event) => set(key, event.target.value)}
        />
      </label>
    );
  }
  return (
    <div className="lpl-wrap">
      <header className="lpl-hero">
        <div>
          <p className="lpl-eyebrow">
            LEAF PROPERTIES · {t("ΑΚΙΝΗΤΑ", "PROPERTIES")}
          </p>
          <h1>
            {transaction === "buy"
              ? t("Βρείτε το επόμενο σπίτι σας.", "Find your next home.")
              : t("Ο επόμενος χώρος σας, εδώ.", "Your next place starts here.")}
          </h1>
          <p>
            {t(
              "Κατοικίες και οικόπεδα. Αναζητήστε με βάση όσα έχουν σημασία για εσάς.",
              "Homes and land. Search by what matters most to you.",
            )}
          </p>
        </div>
        <a className="lpl-help-link" href={site.phoneHref}>
          {t("Χρειάζεστε βοήθεια;", "Need a hand?")} <span>{site.phone} ↗</span>
        </a>
      </header>
      <section
        className="lpl-search"
        aria-label={t("Αναζήτηση ακινήτων", "Property search")}
      >
        <nav
          className="lpl-tabs"
          aria-label={t("Τύπος συναλλαγής", "Transaction type")}
        >
          <Link
            to={routes.buy[lang]}
            aria-current={transaction === "buy" ? "page" : undefined}
          >
            {t("Αγορά", "Buy")}
          </Link>
          <Link
            to={routes.rent[lang]}
            aria-current={transaction === "rent" ? "page" : undefined}
          >
            {t("Ενοικίαση", "Rent")}
          </Link>
        </nav>
        <form onSubmit={submit}>
          <div className="lpl-primary-fields">
            <label className="lpl-field">
              <span>{t("Περιοχή", "Location")}</span>
              <select
                value={draft.area}
                onChange={(event) => set("area", event.target.value)}
              >
                <option value="all">
                  {t("Όλες οι περιοχές", "All locations")}
                </option>
                {!areas.some(([key]) => key === draft.area) &&
                  draft.area !== "all" && (
                    <option value={draft.area}>{draft.area}</option>
                  )}
                {areas.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="lpl-field">
              <span>{t("Τύπος ακινήτου", "Property type")}</span>
              <select
                value={draft.type}
                onChange={(event) => set("type", event.target.value)}
              >
                <option value="all">
                  {t("Όλοι οι τύποι", "All property types")}
                </option>
                {!types.some(([key]) => key === draft.type) &&
                  draft.type !== "all" && (
                    <option value={draft.type}>{draft.type}</option>
                  )}
                {types.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {numberInput("minPrice", t("Τιμή από (€)", "Min. price (€)"), "0")}
            {numberInput(
              "maxPrice",
              t("Τιμή έως (€)", "Max. price (€)"),
              t("Χωρίς όριο", "No limit"),
            )}
            <button className="lpl-submit" type="submit">
              <SearchIcon />
              {t("Αναζήτηση", "Search")}
            </button>
          </div>
          <div className="lpl-secondary-fields">
            <label className="lpl-keyword">
              <SearchIcon />
              <span className="lpl-sr-only">
                {t(
                  "Λέξη-κλειδί ή κωδικός ακινήτου",
                  "Keyword or property reference",
                )}
              </span>
              <input
                type="search"
                value={draft.q}
                maxLength={160}
                onChange={(event) => set("q", event.target.value)}
                placeholder={t(
                  "Λέξη-κλειδί ή κωδικός ακινήτου",
                  "Keyword or property reference",
                )}
              />
            </label>
            <span className="lpl-search-note">
              {transaction === "rent"
                ? t(
                    "Οι τιμές αφορούν μηνιαίο μίσθωμα.",
                    "Prices are monthly rent.",
                  )
                : t(
                    "Προσαρμόστε τα κριτήρια και πατήστε Αναζήτηση.",
                    "Set your criteria, then select Search.",
                  )}
            </span>
          </div>
          <details className="lpl-more" open={advanced || undefined}>
            <summary>
              {t("Περισσότερα φίλτρα", "More filters")}{" "}
              <span aria-hidden="true">＋</span>
            </summary>
            <div className="lpl-advanced">
              {numberInput(
                "minSqm",
                t("Επιφάνεια από (τ.μ.)", "Min. area (m²)"),
                "0",
              )}
              {numberInput(
                "maxSqm",
                t("Επιφάνεια έως (τ.μ.)", "Max. area (m²)"),
                t("Χωρίς όριο", "No limit"),
              )}
              <label className="lpl-field">
                <span>{t("Υπνοδωμάτια", "Bedrooms")}</span>
                <select
                  value={draft.rooms}
                  onChange={(event) => set("rooms", event.target.value)}
                >
                  <option value="">
                    {t("Οποιοσδήποτε αριθμός", "Any number")}
                  </option>
                  {[
                    "1",
                    "2",
                    "3",
                    "4",
                    "5",
                    ...(!["", "1", "2", "3", "4", "5"].includes(draft.rooms)
                      ? [draft.rooms]
                      : []),
                  ].map((n) => (
                    <option key={n} value={n}>
                      {n}+
                    </option>
                  ))}
                </select>
              </label>
              <label className="lpl-checkbox">
                <input
                  type="checkbox"
                  checked={draft.includeClosed}
                  onChange={(event) =>
                    set("includeClosed", event.target.checked)
                  }
                />
                <span>
                  {t(
                    "Εμφάνιση και πωλημένων / ενοικιασμένων",
                    "Include sold / rented properties",
                  )}
                </span>
              </label>
            </div>
          </details>
          {error && (
            <p className="lpl-error" role="alert">
              {t(
                "Το «από» δεν μπορεί να είναι μεγαλύτερο από το «έως». Ελέγξτε την τιμή και την επιφάνεια.",
                "Minimum values cannot exceed maximum values. Check price and floor area.",
              )}
            </p>
          )}
        </form>
      </section>
      <section
        className="lpl-results"
        aria-label={t("Αποτελέσματα αναζήτησης", "Search results")}
      >
        <div className="lpl-results-bar">
          <div>
            <h2 aria-live="polite" aria-atomic="true">
              {results.length}{" "}
              {results.length === 1
                ? t("ακίνητο", "property")
                : t("ακίνητα", "properties")}{" "}
              <span>
                {transaction === "buy"
                  ? t("προς πώληση", "for sale")
                  : t("προς ενοικίαση", "to rent")}
              </span>
            </h2>
            <p>
              {active.includeClosed
                ? t(
                    "Περιλαμβάνονται και μη διαθέσιμα ακίνητα.",
                    "Unavailable properties are also included.",
                  )
                : t(
                    "Εμφανίζονται μόνο διαθέσιμα ακίνητα.",
                    "Showing available properties only.",
                  )}
            </p>
          </div>
          <label className="lpl-sort">
            <span>{t("Ταξινόμηση", "Sort by")}</span>
            <select
              value={active.sort}
              onChange={(event) =>
                onChange({ ...active, sort: event.target.value })
              }
            >
              <option value="">
                {t("Προτεινόμενη σειρά", "Default order")}
              </option>
              <option value="price-asc">
                {t("Τιμή: χαμηλή → υψηλή", "Price: low to high")}
              </option>
              <option value="price-desc">
                {t("Τιμή: υψηλή → χαμηλή", "Price: high to low")}
              </option>
              <option value="ppsqm-asc">
                {t("Τιμή/τ.μ.: χαμηλή → υψηλή", "Price/m²: low to high")}
              </option>
              <option value="ppsqm-desc">
                {t("Τιμή/τ.μ.: υψηλή → χαμηλή", "Price/m²: high to low")}
              </option>
              <option value="sqm-asc">
                {t("Επιφάνεια: μικρή → μεγάλη", "Area: small to large")}
              </option>
              <option value="sqm-desc">
                {t("Επιφάνεια: μεγάλη → μικρή", "Area: large to small")}
              </option>
            </select>
          </label>
        </div>
        {chips.length > 0 && (
          <div
            className="lpl-chips"
            aria-label={t("Ενεργά φίλτρα", "Active filters")}
          >
            {chips.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ ...active, [key]: emptySearch[key] })}
                aria-label={`${t("Αφαίρεση φίλτρου", "Remove filter")}: ${chipLabels[key]}`}
              >
                {chipLabels[key]} <span aria-hidden="true">×</span>
              </button>
            ))}
            <button
              className="lpl-clear"
              type="button"
              onClick={() => onChange({ ...emptySearch })}
            >
              {t("Καθαρισμός όλων", "Clear all")}
            </button>
          </div>
        )}
        <div className="lpl-grid">
          {results.map((property) => (
            <PropertyCard key={property.id} property={property} lang={lang} />
          ))}
        </div>
        {!results.length && (
          <div className="lpl-empty">
            <SearchIcon />
            <h3>
              {t(
                "Δεν βρέθηκε ακίνητο με αυτά τα κριτήρια.",
                "No properties match your search.",
              )}
            </h3>
            <p>
              {catalog.length
                ? t(
                    "Δοκιμάστε άλλη περιοχή ή μεγαλύτερο εύρος τιμής. Μπορούμε επίσης να σας βοηθήσουμε προσωπικά.",
                    "Try another location or a wider price range. We can also help you personally.",
                  )
                : t(
                    "Δεν υπάρχουν αγγελίες σε αυτή την κατηγορία αυτή τη στιγμή. Πείτε μας τι αναζητάτε.",
                    "There are no listings in this category at the moment. Tell us what you are looking for.",
                  )}
            </p>
            {chips.length > 0 && (
              <button
                className="lpl-submit"
                onClick={() => onChange({ ...emptySearch })}
              >
                {t("Καθαρισμός φίλτρων", "Clear filters")}
              </button>
            )}
            <Link to={routes.contact[lang]}>
              {t("Επικοινωνήστε μαζί μας →", "Contact our team →")}
            </Link>
          </div>
        )}
      </section>
      <aside className="lpl-contact-strip">
        <div>
          <p className="lpl-eyebrow">
            {t("ΑΣ ΤΟ ΒΡΟΥΜΕ ΜΑΖΙ", "LET’S FIND IT TOGETHER")}
          </p>
          <h2>
            {t(
              "Δεν βρήκατε αυτό που ψάχνετε;",
              "Still looking for the right place?",
            )}
          </h2>
          <p>
            {t(
              "Πείτε μας περιοχή, προϋπολογισμό και ανάγκες. Η ομάδα της LEAF είναι εδώ για να βοηθήσει.",
              "Tell us your preferred location, budget and needs. The LEAF team is here to help.",
            )}
          </p>
        </div>
        <Link to={routes.contact[lang]}>
          {t("Πείτε μας τι αναζητάτε", "Tell us what you need")}{" "}
          <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </div>
  );
}
