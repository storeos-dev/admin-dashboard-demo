import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const gateway = (env.STOREOS_GATEWAY_URL || "https://api.storeos.dev").replace(
    /\/$/,
    "",
  );

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
      },
    },
    server: {
      port: 3020,
      // Gateway has no CORS — proxy so the browser stays same-origin.
      proxy: {
        "/core": { target: gateway, changeOrigin: true },
      },
    },
  };
});
