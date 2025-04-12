import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@data-access/prisma";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});

export const signedIn = async () => !!(await auth())?.user;
