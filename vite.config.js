import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { normalizeBasePath } from "./src/lib/urls.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    base: normalizeBasePath(env.VITE_BASE_PATH || "/"),
    plugins: [react()],
    server: { host: "0.0.0.0", allowedHosts: true },
    build: { outDir: "dist", sourcemap: false },
  };
});
