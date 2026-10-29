import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App.jsx";
import { normalizePath } from "./lib/routing.js";
import { legacyHashTarget } from "./lib/urls.js";
import "./styles/base.css";
import "./styles/chrome.css";
import "./styles/pages.css";
import "./styles/forms.css";
import "./styles/listings.css";
import "./styles/property.css";

const base = import.meta.env.BASE_URL;
// Old bookmarked #/ routes continue to work after the move to clean URLs.
const legacyTarget = legacyHashTarget(window.location.hash, base);
if (legacyTarget) window.history.replaceState(null, "", legacyTarget);
const app = (
  <StrictMode>
    <BrowserRouter basename={base}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
const root = document.getElementById("root");
const path = normalizePath(window.location.pathname.slice(base.length - 1));
if (root.dataset.route === path) hydrateRoot(root, app);
else createRoot(root).render(app);
