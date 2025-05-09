import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";

const manifest = {
  short_name: "Quiz",
  name: "Quizowisko",
  icons: [
    {
      src: "logo/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png",
    },
    {
      src: "logo/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      src: "logo/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "logo/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  start_url: ".",
  display: "standalone",
  theme_color: "#fff",
  background_color: "#6145ae",
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,ico}"],
      },
      devOptions: {
        enabled: true,
      },
      manifest: manifest,
    }),
  ],
});
