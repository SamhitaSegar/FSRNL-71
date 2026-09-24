import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // Forward API calls to the backend during development so the frontend
    // can use a relative "/api" base URL (no CORS, matches production where
    // the backend serves the built frontend).
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
