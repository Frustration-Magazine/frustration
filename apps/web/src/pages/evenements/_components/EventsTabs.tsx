import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardEvent } from "./CardEvent";
import { cn } from "@/lib/utils";

export const EventsTabs = ({
  futureEvents,
  pastEvents,
  children: image,
}: {
  futureEvents: any[];
  pastEvents: any[];
  children: any;
}) => {
  return (
    <section>
      <Tabs
        defaultValue="future"
        className="gap-6"
      >
        <TabsList
          className={cn(
            "mx-auto h-fit bg-slate-100",
            "[&_button]:data-[state=active]:font-bold",
            "[&_button]:data-[state=active]:bg-logo-yellow",
            "[&_button]:data-[state=active]:text-black",
          )}
        >
          <TabsTrigger
            value="future"
            className="cursor-pointer px-4 py-2"
          >
            📅 Événements à venir ({futureEvents.length})
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className="cursor-pointer px-4 py-2"
          >
            ⌛ Événements passés ({pastEvents.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="future">
          <div className="relative space-y-16">
            {futureEvents.length ? (
              <>
                {futureEvents.map((event, index) => (
                  <div
                    className="relative z-10"
                    key={event.id}
                  >
                    <div className="absolute z-10 opacity-5" />
                    <CardEvent event={event}>{image}</CardEvent>
                    {index > 0 && (
                      <div className="after-top-[-5px] after-left-1/2 after-transform bg-logo-yellow absolute left-1/2 top-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                    )}
                  </div>
                ))}
                <div className="mt-0! bg-logo-yellow absolute left-1/2 top-0 h-full w-2 -translate-x-1/2" />
              </>
            ) : (
              <p className="text-center">
                Aucun événement à venir pour l'instant, n'hésitez pas à nous suivre sur nos réseaux sociaux pour ne rien
                rater de l'actualité de Frustration Magazine 😁
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="relative space-y-16">
            {pastEvents.length && (
              <>
                {pastEvents.map((event, index) => (
                  <div
                    className="relative z-10"
                    key={event.id}
                  >
                    <div className="absolute z-10 opacity-5" />
                    <CardEvent event={event}>{image}</CardEvent>
                    {index > 0 && (
                      <div className="after-top-[-5px] after-left-1/2 after-transform bg-logo-yellow absolute left-1/2 top-0 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                    )}
                  </div>
                ))}
                <div className="mt-0! bg-logo-yellow absolute left-1/2 top-0 h-full w-2 -translate-x-1/2" />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};
