import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const { BACKOFFICE_DOMAIN, YOUTUBE_IMAGES_DOMAIN } = loadEnv(
  process.env.NODE_ENV,
  process.cwd(),
  "",
);

import vercel from "@astrojs/vercel";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

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

  integrations: [react(), tailwind(), sitemap()],
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
