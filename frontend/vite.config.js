import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: mode === "development"
      ? {
          "/api": {
            target: process.env.VITE_BACKEND_URL || "http://localhost:5000",
            changeOrigin: true,
          },
        }
      : {},
  },
}));
