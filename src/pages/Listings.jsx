import { useMemo, useState } from "react";
import { properties } from "../data/properties.js";
import {
  initialFilters,
  listingLimits,
  selectProperties,
} from "../lib/listings.js";
import { PropertyCard } from "../components/PropertyCard.jsx";
import { RangeFilter } from "../components/RangeFilter.jsx";

const areas = [
  ["peristeri", "Περιστέρι", "Peristeri"],
  ["kalamata", "Καλαμάτα", "Kalamata"],
  ["roda-kerkyra", "Ρόδα Κέρκυρα", "Roda, Corfu"],
  ["ekali", "Έκαλη", "Ekali"],
  ["pagkrati", "Παγκράτι", "Pagrati"],
];
for (const property of properties) {
  if (areas.some(([value]) => value === property.area)) continue;
  areas.push([
    property.area,
    property.locales.el.cardAddress.replace(/^📍\s*/, ""),
    property.locales.en.cardAddress.replace(/^📍\s*/, ""),
  ]);
}
const types = [
  ["diamerisma", "Διαμέρισμα", "Apartment"],
  ["monokatoikia", "Μονοκατοικία", "Detached house"],
  ["oikopedo", "Οικόπεδο", "Plot"],
];

export function Listings({ lang, transaction = "buy" }) {
  const [filters, setFilters] = useState(() => initialFilters(transaction));
  const limits = listingLimits(transaction);
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState("");
  const el = lang === "el";
  const result = useMemo(
    () => selectProperties(properties, filters, sort, transaction),
    [filters, sort, transaction],
  );
  const set = (key, value) => setFilters((old) => ({ ...old, [key]: value }));
  function areaSelect(id) {
    return (
      <select
        id={id}
        className={id === "lpl-area-quick" ? "lpl-area-btn" : undefined}
        value={filters.area}
        onChange={(event) => set("area", event.target.value)}
      >
        <option value="all">{el ? "Όλες οι περιοχές" : "All areas"}</option>
        {areas.map(([value, gr, en]) => (
          <option key={value} value={value}>
            {el ? gr : en}
          </option>
        ))}
      </select>
    );
  }
  const sortLabels = el
    ? [
        "Αύξουσα Τιμή",
        "Φθίνουσα Τιμή",
        "Αύξουσα τιμή τ.μ.",
        "Φθίνουσα τιμή τ.μ.",
      ]
    : [
        "Price: Low to High",
        "Price: High to Low",
        "Price/m²: Low to High",
        "Price/m²: High to Low",
      ];
  return (
    <div className="lpl-wrap">
      <div className="lpl-hero">
        <p className="lpl-eyebrow">
          LEAF PROPERTIES / {el ? "ΑΚΙΝΗΤΑ" : "PROPERTIES"}
        </p>
        <h1>
          {transaction === "buy"
            ? el
              ? "Ακίνητα προς πώληση"
              : "Properties for sale"
            : el
              ? "Ακίνητα προς ενοικίαση"
              : "Properties to rent"}
        </h1>
        <p>
          {el
            ? "Αναζητήστε ακίνητα με βάση την περιοχή, την τιμή και τις ανάγκες σας."
            : "Explore properties by location, price and your requirements."}
        </p>
      </div>
      <div className="lpl-quickarea">
        <label htmlFor="lpl-area-quick">{el ? "Περιοχή" : "Area"}</label>
        <div className="lpl-select-wrap">{areaSelect("lpl-area-quick")}</div>
      </div>
      <div className="lpl-sliders-row">
        <RangeFilter
          label={el ? "Τιμή (€)" : "Price (€)"}
          unit="€"
          ceiling={limits.price}
          step={limits.step}
          lang={lang}
          values={[filters.minPrice, filters.maxPrice]}
          onChange={([minPrice, maxPrice]) =>
            setFilters((old) => ({ ...old, minPrice, maxPrice }))
          }
        />
        <RangeFilter
          label={el ? "Εμβαδόν (τ.μ.)" : "Area (m²)"}
          unit={el ? " τ.μ." : " m²"}
          ceiling={300}
          step={5}
          lang={lang}
          values={[filters.minSqm, filters.maxSqm]}
          onChange={([minSqm, maxSqm]) =>
            setFilters((old) => ({ ...old, minSqm, maxSqm }))
          }
        />
        <div className="lpl-more-wrap">
          <button
            type="button"
            className="lpl-more-btn"
            aria-expanded={expanded}
            aria-controls="lpl-more-panel"
            onClick={() => setExpanded(!expanded)}
          >
            {el ? "Περισσότερα Φίλτρα" : "More Filters"} {expanded ? "▴" : "▾"}
          </button>
          {expanded && (
            <div className="lpl-more-panel" id="lpl-more-panel">
              <div className="lpl-fgroup">
                <label htmlFor="lpl-type">
                  {el ? "Τύπος Ακινήτου" : "Property Type"}
                </label>
                <select
                  id="lpl-type"
                  value={filters.type}
                  onChange={(event) => set("type", event.target.value)}
                >
                  <option value="all">
                    {el ? "Όλοι οι τύποι" : "All types"}
                  </option>
                  {types.map(([value, gr, en]) => (
                    <option key={value} value={value}>
                      {el ? gr : en}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lpl-fgroup">
                <label htmlFor="lpl-area">
                  {el ? "Περιοχή (λεπτομερώς)" : "Area (detailed)"}
                </label>
                {areaSelect("lpl-area")}
              </div>
              <div className="lpl-fgroup">
                <label htmlFor="lpl-rooms">
                  {el ? "Δωμάτια (τουλάχιστον)" : "Bedrooms (minimum)"}
                </label>
                <select
                  id="lpl-rooms"
                  value={filters.rooms}
                  onChange={(event) => set("rooms", Number(event.target.value))}
                >
                  <option value="0">{el ? "Όλα" : "All"}</option>
                  {[1, 2, 3, 4, 5].map((number) => (
                    <option key={number} value={number}>
                      {number}+
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="lpl-reset-btn"
                onClick={() => {
                  setFilters(initialFilters(transaction));
                  setSort("");
                }}
              >
                {el ? "Επαναφορά Φίλτρων" : "Reset Filters"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="lpl-sort-wrap">
        <span className="lpl-sort-label">
          {el ? "ΤΑΞΙΝΟΜΗΣΗ:" : "SORT BY:"}
        </span>
        <select
          aria-label={el ? "Ταξινόμηση ακινήτων" : "Sort properties"}
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="">
            {el ? "Προτεινόμενη σειρά" : "Default order"}
          </option>
          {["price-asc", "price-desc", "ppsqm-asc", "ppsqm-desc"].map(
            (key, index) => (
              <option key={key} value={key}>
                {sortLabels[index]}
              </option>
            ),
          )}
        </select>
      </div>
      <div className="lpl-count" aria-live="polite">
        {result.length}{" "}
        {el
          ? result.length === 1
            ? "ακίνητο βρέθηκε"
            : "ακίνητα βρέθηκαν"
          : result.length === 1
            ? "property found"
            : "properties found"}
      </div>
      <div className="lpl-grid">
        {result.map((property) => (
          <PropertyCard key={property.id} property={property} lang={lang} />
        ))}
      </div>
      {!result.length && (
        <div className="lpl-empty">
          {transaction === "rent"
            ? el
              ? "Δεν υπάρχουν διαθέσιμα ακίνητα προς ενοικίαση αυτή τη στιγμή."
              : "There are no properties available for rent at the moment."
            : el
              ? "Δεν βρέθηκαν ακίνητα με αυτά τα κριτήρια. Δοκιμάστε να αλλάξετε τα φίλτρα."
              : "No properties match these criteria. Try adjusting your filters."}
        </div>
      )}
    </div>
  );
}
