"use server";

import { prisma } from "data-access/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DEFAULT_RESPONSE_STATUS, ResponseStatus } from "@/actions/_models";
import { signInSchema } from "@/app/(auth)/signin/_models";

export const signInMagicLinkAction = async (
  currentState: ResponseStatus,
  formData: FormData,
): Promise<ResponseStatus> => {
  let response = { ...DEFAULT_RESPONSE_STATUS };

  const { success, data: { email } = {} } = signInSchema.safeParse(Object.fromEntries(formData));
  if (!success || !email)
    return {
      ...response,
      error: "Adresse e-mail invalide.",
    };

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return { ...response, error: "Cet e-mail n'est pas autorisé à se connecter." };

  try {
    await auth.api.signInMagicLink({
      body: {
        email,
        // name: user.name,
        callbackURL: "/income",
        // newUserCallbackURL: "/income",
        errorCallbackURL: "/signin",
      },
      headers: await headers(),
    });

    return { ...response, success: "Un lien de connexion vous a été envoyé !" };
  } catch (error) {
    console.error(error);
    return { ...response, error: "Erreur lors de l'envoi du lien de connexion." };
  }
};
