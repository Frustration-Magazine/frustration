import { Prisma } from "@prisma/client";

export const eventsQuery = {
  include: {
    image: true,
  },
  where: { displayEvent: true },
  orderBy: { date: "asc" as const },
} satisfies Prisma.eventsFindManyArgs;

export type EventWithImage = Prisma.eventsGetPayload<typeof eventsQuery>;
