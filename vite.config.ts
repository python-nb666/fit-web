import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig((mode: any) => {
  return {
    base: mode === "production" ? "/fit-web/" : "/fit-web/",
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react(), tailwindcss()],
  };
});
