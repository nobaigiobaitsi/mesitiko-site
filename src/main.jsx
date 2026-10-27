import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { App } from "./App.jsx";
import "./styles/source.css";
import "./styles/app.css";
import "./styles/chrome.css";

const Router =
  import.meta.env.VITE_ROUTER_MODE === "history" ? BrowserRouter : HashRouter;
const basename =
  import.meta.env.VITE_ROUTER_MODE === "history"
    ? import.meta.env.BASE_URL === "./"
      ? "/"
      : import.meta.env.BASE_URL
    : undefined;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router basename={basename}>
      <App />
    </Router>
  </React.StrictMode>,
);
