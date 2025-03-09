import Resend from "next-auth/providers/resend";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "redaction@frustrationmagazine.fr",
    }),
  ],
} satisfies NextAuthConfig;
