import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";

const { BACKOFFICE_DOMAIN, YOUTUBE_IMAGES_DOMAIN } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  "",
);

import vercel from "@astrojs/vercel";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";

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
  plugins: ["prettier-plugin-astro"],
  env: {
    schema: {
      // ...
    },
  },
});
