import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  return {
    base: env.VITE_BASE_PATH || "./",
    server: { host: "0.0.0.0", allowedHosts: true },
    build: { outDir: "dist", sourcemap: false },
  };
});
