import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { App } from "./App.jsx";
import { getStaticRoutes, identifyRoute, aliases } from "./lib/routing.js";
import { getSeo } from "./lib/seo.js";
import { withBase } from "./lib/urls.js";

export { getStaticRoutes, aliases };
export function renderRoute(path, config) {
  const html = renderToString(
    <StrictMode>
      <StaticRouter
        basename={config.base}
        location={withBase(path, config.base)}
      >
        <App />
      </StaticRouter>
    </StrictMode>,
  );
  return { html, meta: getSeo(identifyRoute(path), config) };
}
