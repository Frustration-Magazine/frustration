import { defineAction } from "astro:actions";
import { z } from "astro:schema";

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
