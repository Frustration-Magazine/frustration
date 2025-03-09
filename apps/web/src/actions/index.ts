import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

import { addSubscriberToNewsletter } from "./add-to-newsletter";

export const server = {
  addSubscriberToNewsletter: defineAction({
    accept: "form",
    input: z.object({
      email: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }),
    handler: addSubscriberToNewsletter,
  }),
};
