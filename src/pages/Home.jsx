import { Link } from "react-router-dom";
import { menu } from "../data/site.js";
import { routes } from "../data/routes.js";
import { content } from "../content/index.js";
import { asset } from "../lib/assets.js";

function HomeIcon({ type }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      fill="currentColor"
      aria-hidden="true"
    >
      {type === "buy" ? (
        <path d="M12 3 3 10.5V21h6v-7h6v7h6V10.5Z" />
      ) : type === "rent" ? (
        <path d="M7 4a5 5 0 1 0 4.77 6.5H15V14h2v-3.5h2V15h2V7.5h-9.23A5 5 0 0 0 7 4Zm0 2.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
      ) : (
        <path
          fillRule="evenodd"
          d="m2 12 7-8h12v16H9Zm12.4-3a1.4 1.4 0 1 0-2.8 0 1.4 1.4 0 0 0 2.8 0Z"
        />
      )}
    </svg>
  );
}

export function Home({ lang }) {
  const t = content[lang].home;
  return (
    <section className="leaf-home-hero" aria-labelledby="home-heading">
      <img
        className="leaf-home-image"
        src={asset(
          "assets/9bc4d933-Gemini_Generated_Image_2er9w42er9w42er9-2048x1143.webp",
        )}
        alt=""
        width="2048"
        height="1143"
        fetchPriority="high"
      />
      <div className="leaf-home-overlay" />
      <nav className="leaf-home-actions" aria-label={t.navLabel}>
        {menu
          .filter((item) => ["buy", "rent", "sell"].includes(item.key))
          .map((item) => (
            <Link key={item.key} to={routes[item.key][lang]}>
              <HomeIcon type={item.key} />
              {item[lang]}
            </Link>
          ))}
      </nav>
      <h1 id="home-heading">{t.heading}</h1>
    </section>
  );
}
