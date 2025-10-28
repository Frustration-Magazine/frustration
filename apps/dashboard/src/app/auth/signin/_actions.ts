"use server";

import { signIn } from "@/auth";
import { prisma } from "data-access/prisma";
import { schema } from "./_models";
import { type ResponseStatus } from "@/actions/models";

// 💬 Form status
const INVALID: ResponseStatus = {
  success: null,
  error: "Adresse e-mail invalide.",
};

const UNAUTHORIZED: ResponseStatus = {
  success: null,
  error: "Cet e-mail n'est pas autorisé à se connecter.",
};

const NOT_FOUND: ResponseStatus = {
  success: null,
  error: "Impossible de retrouver les adresses e-mail autorisées.",
};

const validMail: (email: string) => ResponseStatus = (email) => ({
  success: `Vous allez recevoir un message à ${email} contenant un lien de connexion.`,
  error: null,
});

const error = (error: any): ResponseStatus => ({
  success: null,
  error: String(error),
});

// 📀 Query datatabase
const emails: { email: string }[] = await prisma.user.findMany({
  select: {
    email: true,
  },
});

function parse(data: FormData) {
  const formData = Object.fromEntries(data);
  const parsed = schema.safeParse(formData);
  return parsed;
}

/* ------------------------ */
/*   📨 SEND MAGIC LINK     */
/* ------------------------ */

export async function sendLink(currentState: ResponseStatus, formData: FormData): Promise<ResponseStatus> {
  // 🔎
  const { success, data: { email } = {} } = parse(formData);

  // ❌
  // Parsing failed
  if (!success) return INVALID;

  //  Emails  not found
  if (emails.length === 0) return NOT_FOUND;

  //  Unauthorized
  const authorized = emails.map(({ email }) => email).includes(email as string);
  if (!authorized) return UNAUTHORIZED;

  // 🔁 SIGN IN
  try {
    await signIn("resend", { email, redirect: false });
    return validMail(email as string);
  } catch (e) {
    return error(e);
  }
}
