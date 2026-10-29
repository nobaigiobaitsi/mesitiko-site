import { Link } from "react-router-dom";
import { ContactForm } from "../components/ContactForm.jsx";
import { content } from "../content/index.js";
import { routes } from "../data/routes.js";
import { asset } from "../lib/assets.js";

export function Sell({ lang }) {
  const t = content[lang].sell;
  return (
    <section className="leaf-sell leaf-container">
      <div className="leaf-sell-intro">
        <h1>{t.title}</h1>
        <p>{t.intro}</p>
        <Link className="leaf-button" to={routes.services[lang]}>
          {t.services}
        </Link>
      </div>
      <div
        className="leaf-sell-form-panel"
        style={{
          backgroundImage: `url("${asset("assets/f4e4a2e0-848677c64d0ab5163b2f783cfb6bff04-683x1024.webp")}")`,
        }}
      >
        <div className="leaf-form-card">
          <h2>{t.formTitle}</h2>
          <ContactForm lang={lang} kind="sell" />
        </div>
      </div>
    </section>
  );
}
