import type { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";

export default {
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.MAIL_FROM,
    }),
  ],
} satisfies NextAuthConfig;
