import { z } from "zod";

export type Event = {
  id?: number;
  date: Date;
  displayHour: boolean;
  description: string;
  city: string;
  place: string;
  contact?: string;
  displayContact?: boolean;
  displayEvent: boolean;
};

export const EventFormSchema = z.object({
  id: z.number().optional(),
  date: z
    .date({
      required_error: "Une date est requise",
    })
    .refine((date) => !isNaN(date.getTime()), {
      message: "Date invalide",
    }),
  displayHour: z.boolean({
    required_error: "Veuillez indiquer si l'heure doit être affichée",
  }),
  description: z
    .string({
      required_error: "Une description de l'événement est attendue",
    })
    .min(1),
  city: z
    .string({
      required_error: "Veuillez renseigner une ville",
    })
    .min(1),
  place: z
    .string({
      required_error: "Veuillez renseigner un lieu précis",
    })
    .min(1),
  contact: z.string().refine((val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Veuillez renseigner un email valide",
  }),
  displayContact: z.boolean({
    required_error: "Veuillez indiquer si le contact doit être affiché",
  }),
  displayEvent: z.boolean({
    required_error: "Veuillez indiquer si l'événement doit être affiché",
  }),
});
