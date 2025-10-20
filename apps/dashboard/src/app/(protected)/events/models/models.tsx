import { z } from "zod";

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
  description: z.string().min(1, "Une description de l'événement est attendue"),
  city: z.string().min(1, "Veuillez renseigner une ville"),
  place: z.string().min(1, "Veuillez renseigner un lieu précis"),
  contact: z.string().refine((val) => val === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Veuillez renseigner un email valide",
  }),
  link: z.string().refine((val) => val === "" || z.string().url().safeParse(val).success, {
    message: "Veuillez renseigner un lien valide",
  }),
  entrance: z.string(),
  displayContact: z.boolean({
    required_error: "Veuillez indiquer si le contact doit être affiché",
  }),
  displayEvent: z.boolean({
    required_error: "Veuillez indiquer si l'événement doit être affiché",
  }),
});

export type EventFormType = z.infer<typeof EventFormSchema>;
