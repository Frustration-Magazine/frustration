/** @type {import('next').NextConfig} */

const { PrismaPlugin } = require("@prisma/nextjs-monorepo-workaround-plugin");

// Check https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-monorepo if you want more information about why this is needed

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }
    return config;
  },
  // 🧪 Experimental features
  experimental: {},
  // 🔗 Allow fetching images from external sources
  images: {
    remotePatterns: [
      // --- Youtube ---
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      // --- UploadThing ---
      // Production
      {
        protocol: "https",
        hostname: "wf254jojd1.ufs.sh",
      },
      // Development
      {
        protocol: "https",
        hostname: "pmdx9cesfv.ufs.sh",
      },
    ],
  },
};

module.exports = nextConfig;
