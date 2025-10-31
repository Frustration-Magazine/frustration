import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type EventWithImage } from "../index.astro";
import { EventCard } from "./EventCard";
import { cn } from "@/lib/utils";

export const EventsTabs = ({ events }: { events: EventWithImage[] }) => {
  const eventsToDisplay = [
    {
      value: "future" as const,
      label: "➡️ Événements à venir",
      events: events.filter(({ date }) => date >= new Date()).sort((a, b) => a.date.getTime() - b.date.getTime()),
      emptyMessage:
        "Aucun événement à venir pour l'instant, n'hésitez pas à nous suivre sur nos réseaux sociaux pour ne rien rater de l'actualité de Frustration Magazine 😁",
    },
    {
      value: "past" as const,
      label: "⌛ Événements passés",
      events: events.filter(({ date }) => date < new Date()).sort((a, b) => b.date.getTime() - a.date.getTime()),
      emptyMessage: null,
    },
  ];

  return (
    <section>
      <Tabs
        defaultValue="future"
        className="gap-6"
      >
        <TabsList className={cn("mx-auto h-fit flex-wrap bg-slate-100")}>
          {eventsToDisplay.map(({ value, label, events }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "cursor-pointer px-4 py-2",
                "data-[state=active]:font-bold",
                "data-[state=active]:bg-logo-yellow",
                "data-[state=active]:text-black",
              )}
            >
              {label} ({events.length})
            </TabsTrigger>
          ))}
        </TabsList>

        {eventsToDisplay.map(({ value, events, emptyMessage }) => {
          return (
            <TabsContent
              key={value}
              value={value}
            >
              <div className="relative space-y-8 md:space-y-16">
                {events.length ? (
                  <>
                    {events.map((event, index) => (
                      <div
                        className="relative z-10"
                        key={event.id}
                      >
                        <div className="absolute z-10 opacity-5" />
                        <EventCard event={event} />

                        {/* Disk */}
                        {index > 0 && (
                          <div className="after-top-[-5px] after-left-1/2 after-transform bg-logo-yellow absolute left-1/2 top-0 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full md:size-5" />
                        )}
                      </div>
                    ))}
                    <div className="mt-0! bg-logo-yellow absolute left-1/2 top-0 h-full w-1.5 -translate-x-1/2 md:w-2" />
                  </>
                ) : (
                  emptyMessage && <p className="text-center">{emptyMessage}</p>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
};
