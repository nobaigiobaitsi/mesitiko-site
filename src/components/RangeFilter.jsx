import { useRef } from "react";
import { formatNumber } from "../lib/listings.js";

// Two real range inputs support keyboard, pointer, touch and assistive tools.
export function RangeFilter({
  label,
  unit,
  ceiling,
  step,
  values,
  onChange,
  lang,
}) {
  const track = useRef(null);
  const minPercent = (values[0] / ceiling) * 100;
  const maxPercent = (values[1] / ceiling) * 100;
  const valueLabel = (value) =>
    `${formatNumber(value, lang)}${unit}${value === ceiling ? " (+)" : ""}`;
  function moveNearest(event) {
    if (event.target.tagName === "INPUT") return;
    const bounds = track.current.getBoundingClientRect();
    const value = Math.max(
      0,
      Math.min(
        ceiling,
        Math.round(
          (((event.clientX - bounds.left) / bounds.width) * ceiling) / step,
        ) * step,
      ),
    );
    const index =
      Math.abs(value - values[0]) <= Math.abs(value - values[1]) ? 0 : 1;
    onChange(
      index === 0
        ? [Math.min(value, values[1]), values[1]]
        : [values[0], Math.max(value, values[0])],
    );
  }
  return (
    <div className="lpl-slider-block">
      <span className="range-label">
        {label}:{" "}
        <span className="lpl-slider-val">
          {valueLabel(values[0])} – {valueLabel(values[1])}
        </span>
      </span>
      <div
        className="lpl-rs leaf-range"
        ref={track}
        onPointerDown={moveNearest}
      >
        <div className="lpl-rs-track" />
        <div
          className="lpl-rs-fill"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        <input
          className="leaf-range-input"
          aria-label={`${label} - ${lang === "el" ? "Ελάχιστο" : "Minimum"}`}
          type="range"
          min="0"
          max={ceiling}
          step={step}
          value={values[0]}
          onChange={(event) =>
            onChange([
              Math.min(Number(event.target.value), values[1]),
              values[1],
            ])
          }
          style={{ zIndex: values[0] >= ceiling * 0.95 ? 5 : 3 }}
        />
        <input
          className="leaf-range-input"
          aria-label={`${label} - ${lang === "el" ? "Μέγιστο" : "Maximum"}`}
          type="range"
          min="0"
          max={ceiling}
          step={step}
          value={values[1]}
          onChange={(event) =>
            onChange([
              values[0],
              Math.max(Number(event.target.value), values[0]),
            ])
          }
        />
      </div>
      <div className="lpl-rs-ticks">
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
          <span key={fraction}>{valueLabel(ceiling * fraction)}</span>
        ))}
      </div>
    </div>
  );
}
