import { content } from "../content/index.js";
import { ContentBlocks } from "../components/RichText.jsx";

export function Privacy({ lang }) {
  const t = content[lang].privacy;
  return (
    <article className="leaf-privacy leaf-container">
      <h1>{t.title}</h1>
      <ContentBlocks blocks={t.blocks} />
    </article>
  );
}
