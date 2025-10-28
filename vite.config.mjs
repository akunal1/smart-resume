import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Check if we should use local backend
  const useLocalBackend =
    !process.env.VITE_API_BASE_URL ||
    process.env.VITE_API_BASE_URL.includes("localhost");

  return {
    plugins: [react()],
    server: {
      port: 5174, // Update to match current running port
      // Only use proxy when connecting to local backend
      ...(mode === "development" &&
        useLocalBackend && {
          proxy: {
            "/api": {
              target: "http://localhost:3002",
              changeOrigin: true,
            },
          },
        }),
    },
    build: {
      outDir: "dist",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
