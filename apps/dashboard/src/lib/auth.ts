import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "data-access/prisma";
import { sendEmail } from "@/actions/email";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    magicLink({
      disableSignUp: true,
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          to: email,
          subject: "🔗 Lien de connexion au Dashboard de Frustration 🎛️",
          meta: {
            description: "⬇️ Cliquez sur le lien ci-dessous pour vous connecter au Dashboard de Frustration : ",
            link: url,
          },
        });
      },
    }),
    nextCookies(),
  ],
});

export const redirectIfNotSignedIn = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/signin");
};

export const redirectIfSignedIn = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) redirect("/");
};

export const requireSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");
};
