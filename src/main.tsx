import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initI18n } from "./lib/i18n";

// 🛡️ Pre-boot URL sanitization — removes sensitive tokens BEFORE React renders
const sanitizeURL = () => {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");
  if (token) {
    sessionStorage.setItem("q_vault_gate", token);
    url.searchParams.delete("token");
    window.history.replaceState({}, document.title, url.pathname + url.search + url.hash);
  }
};
sanitizeURL();

initI18n();

createRoot(document.getElementById("root")!).render(<App />);
