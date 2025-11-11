import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // load env file for current mode, keys will be available as strings
  // (prefix is empty here because we use VITE_ prefixed variables in env files)
  const env = loadEnv(mode, process.cwd(), "");

  // helper parsers with sensible defaults
  const serverPort = env.VITE_DEV_SERVER_PORT ? Number(env.VITE_DEV_SERVER_PORT) : 5173;
  const previewPort = env.VITE_PREVIEW_PORT ? Number(env.VITE_PREVIEW_PORT) : 5173;
  const outDir = env.VITE_BUILD_OUTDIR || `dist/${mode}`;

  return {
    plugins: [react()],
    base: env.VITE_BASE_URL || "/",
    server: {
      port: serverPort
    },
    preview: {
      port: previewPort
    },
    build: {
      outDir
    },
    define: {
      // expose a small read-only indicator at build time if useful
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV || mode)
    }
  };
});
