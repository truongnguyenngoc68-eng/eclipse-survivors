import React from "react";
import { createRoot } from "react-dom/client";
import "./pixel-ui.css";
import { App } from "./App";

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
