import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

const { BACKOFFICE_DOMAIN, YOUTUBE_IMAGES_DOMAIN } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  "",
);

/** @type {import("prettier").Config} */
// https://astro.build/config
export default defineConfig({
  output: "static",
  site: "https://frustrationmagazine.fr/",

  prefetch: true,

  adapter: vercel({
    webAnalytics: { enabled: true },
  }),

  vite: {
    plugins: [tailwindcss()],
    server: {
      // Only use this for local development
      // allowedHosts: ["test.frustrationmagazine.com"],
    },
  },

  integrations: [react(), sitemap()],
  image: {
    domains: [BACKOFFICE_DOMAIN, YOUTUBE_IMAGES_DOMAIN],
  },
  // plugins: ["prettier-plugin-astro"],
});
