import { RichText } from "../components/RichText.jsx";
import { content } from "../content/index.js";
import { asset } from "../lib/assets.js";

export function Services({ lang }) {
  const t = content[lang].services;
  return (
    <section className="leaf-services leaf-container">
      <h1 className="leaf-page-title">{t.title}</h1>
      <div className="leaf-services-grid">
        {t.items.map((item, index) => (
          <article key={index}>
            <h2>
              {index + 1}. {item.title}
            </h2>
            <p>
              <RichText>{item.body}</RichText>
            </p>
            {item.guide && (
              <a
                className="leaf-button"
                href={asset("assets/LEAF-Golden-Visa.pdf")}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.guideLabel}
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
