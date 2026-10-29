import { Link } from "react-router-dom";
import { content } from "../content/index.js";
import { routes } from "../data/routes.js";
import { asset } from "../lib/assets.js";

export function News({ lang }) {
  const t = content[lang].news;
  return (
    <section className="leaf-news leaf-container">
      <h1 className="leaf-page-title">{t.title}</h1>
      <article className="leaf-news-card">
        <img
          src={asset("assets/669203d4-living-room-new-909x1024.webp")}
          alt=""
          width="909"
          height="1024"
          loading="lazy"
        />
        <div>
          <h2>{t.articleTitle}</h2>
          <p>{t.excerpt}</p>
          <Link className="leaf-button" to={routes.workflow[lang]}>
            {t.readMore} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    </section>
  );
}
