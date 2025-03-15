import { z } from "zod";

export type Event = {
  id: number;
  date: Date;
  displayHour: boolean;
  description: string;
  city: string;
  place: string;
  contact: string;
  displayContact: boolean;
  displayEvent: boolean;
};

export const EventFormSchema = z.object({
  date: z.date().refine((date) => !isNaN(date.getTime()), {
    message: "Invalid date",
  }),
  displayHour: z.boolean(),
  description: z.string({
    required_error: "Une description de l'événement est attendue",
  }),
  city: z.string({
    required_error: "Veuillez renseigner une ville",
  }),
  place: z.string({
    required_error: "Veuillez renseigner un lieu précis",
  }),
  contact: z.string().optional(),
  displayContact: z.boolean().default(false),
  displayEvent: z.boolean().default(true),
});
