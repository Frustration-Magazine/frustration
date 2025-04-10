"use server";

type State = {
  success: string | null;
  error: string | null;
};

const ERROR = {
  success: null,
  error: "Il y a une erreur",
};

import { EventFormSchema } from "../models/models";

/* **************** */
/* Update dashboard */
/* **************** */
export async function updateEvent(prevState: State, data: FormData): Promise<State> {
  const formData = Object.fromEntries(data);
  const parsed = EventFormSchema.safeParse(formData);

  if (!parsed.success) return ERROR;

  let result = null;
  // result = await updateBalance();
  // if (result.error) return result;
  // result = await updatePayments({ updateMethod: parsed.data.method });
  result = {
    success: null,
    error: null,
  };
  return result;
}
