import { Link } from "react-router-dom";
import { content } from "../content/index.js";
import { ContentBlocks, RichText } from "../components/RichText.jsx";
import { routes } from "../data/routes.js";

export function Workflow({ lang }) {
  const t = content[lang].workflow;
  return (
    <article className="leaf-workflow leaf-container">
      <Link className="leaf-article-back" to={routes.news[lang]}>
        {t.back}
      </Link>
      <p className="leaf-eyebrow">{t.eyebrow}</p>
      <h1>{t.title}</h1>
      <h2>{t.heading}</h2>
      {t.intro.map((p, i) => (
        <p key={i}>
          <RichText>{p}</RichText>
        </p>
      ))}
      <ol className="leaf-workflow-steps">
        {t.steps.map((step, i) => (
          <li key={i}>
            <span className="leaf-step-number" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <section>
              <p className="leaf-eyebrow">{step.tag}</p>
              <h2>{step.title}</h2>
              <ContentBlocks blocks={step.blocks} />
            </section>
          </li>
        ))}
      </ol>
      <section className="leaf-workflow-closing">
        <h2>{t.closing.title}</h2>
        <p>
          <RichText>{t.closing.body}</RichText>
        </p>
        <Link className="leaf-button" to={routes.contact[lang]}>
          {t.closing.cta}
        </Link>
      </section>
    </article>
  );
}
