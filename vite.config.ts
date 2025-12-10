import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig((mode: any) => {
  return {
    base: mode === "production" ? "/fit-web/" : "/",
    server: {
      port: 8080,
    },
    plugins: [react(), tailwindcss()],
  };
});
