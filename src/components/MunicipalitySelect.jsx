import Select from "react-select";
import {
  municipalities,
  municipalityById,
  foldPlace,
} from "../data/municipalities.js";

const sorted = Object.fromEntries(
  ["el", "en"].map((lang) => [
    lang,
    [...municipalities].sort((a, b) => a[lang].localeCompare(b[lang], lang)),
  ]),
);

export function MunicipalitySelect({
  id,
  label,
  value,
  onChange,
  lang = "el",
  required = false,
  disabled = false,
  availableIds = null,
}) {
  const el = lang === "el";
  const all = sorted[lang];
  const hasAvailability = availableIds?.size > 0;
  const options = hasAvailability
    ? [
        {
          label: el ? "Δήμοι με ακίνητα" : "Municipalities with listings",
          options: all.filter((m) => availableIds.has(m.id)),
        },
        {
          label: el ? "Υπόλοιποι δήμοι" : "Other municipalities",
          options: all.filter((m) => !availableIds.has(m.id)),
        },
      ]
    : all;
  const selected =
    municipalityById(value) ||
    (value
      ? {
          id: value,
          el: "Παλαιότερο φίλτρο περιοχής",
          en: "Previous location filter",
        }
      : null);
  return (
    <Select
      inputId={id}
      instanceId={id}
      aria-label={label}
      className="municipality-select"
      classNamePrefix="municipality"
      options={options}
      value={selected}
      onChange={(place) => onChange(place?.id || "")}
      getOptionValue={(place) => place.id}
      getOptionLabel={(place) => place[lang]}
      filterOption={({ data }, query) =>
        foldPlace(query)
          .split(" ")
          .every((word) => data.searchText.includes(word))
      }
      isClearable={!required}
      isDisabled={disabled}
      required={required}
      placeholder={
        required
          ? el
            ? "Επιλέξτε δήμο…"
            : "Select a municipality…"
          : el
            ? "Όλοι οι δήμοι"
            : "All municipalities"
      }
      noOptionsMessage={() =>
        el ? "Δεν βρέθηκε δήμος" : "No matching municipality"
      }
      menuPlacement="auto"
      maxMenuHeight={265}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: "#315642",
          primary25: "#edf3ef",
          primary50: "#d5e3da",
        },
      })}
    />
  );
}
