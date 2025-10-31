import { EventsPage } from "./components/EventsPage";
import { RedeployButton } from "@/app/_components/RedeployButton";
import { prisma, Prisma } from "data-access/prisma";
import { redirectIfNotSignedIn } from "@/lib/auth";
import { isEnvironmentProduction } from "@/lib/utils";

const query = {
  include: {
    image: true,
  },
} satisfies Prisma.eventsDefaultArgs;

export type EventWithImage = Prisma.eventsGetPayload<typeof query>;

export default async function Page() {
  await redirectIfNotSignedIn();

  const events = await prisma.events.findMany(query);

  return (
    <>
      <EventsPage events={events} />
      {isEnvironmentProduction && <RedeployButton />}
    </>
  );
}
