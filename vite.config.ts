import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    root: "client",

    plugins: isProd ? [react()] : [react(), expressPlugin()],

    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },

    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api/predict": {
          target: process.env.BACKEND_URL || "http://localhost:8000",
          changeOrigin: true,
        },
      },
    },

    define: {
      __BACKEND_URL__: JSON.stringify(
        process.env.VITE_API_URL || ""
      ),
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  };
});

// 👇 dev-only express plugin
function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve",
    async configureServer(server) {
      const { createServer } = await import("./server");
      const app = await createServer();
      server.middlewares.use(app);
    },
  };
}
