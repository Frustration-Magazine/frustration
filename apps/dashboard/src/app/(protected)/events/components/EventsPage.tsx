"use client";

import React, { useState, useMemo } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "./EventCard";
import { SortToggle } from "./SortToggle";
import { AddEvent } from "./AddEvent";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { EventWithImage } from "../page";

const now = new Date();
now.setHours(19, 0, 0, 0);

type SortOrder = "asc" | "desc";

export const EventsPage = ({ events: initialEvents }: { events: EventWithImage[] }) => {
  const [events, setEvents] = useState<EventWithImage[]>(initialEvents);
  const [futureSortOrder, setFutureSortOrder] = useState<SortOrder>("asc");
  const [pastSortOrder, setPastSortOrder] = useState<SortOrder>("desc");
  const [activeTab, setActiveTab] = useState<"future" | "past">("future");
  const isMobile = useIsMobile();

  const sortEvents = (eventsList: EventWithImage[], sortOrder: SortOrder) => {
    return [...eventsList].sort((a, b) => {
      const timeA = a.date.getTime();
      const timeB = b.date.getTime();
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });
  };

  const futureEvents = events.filter((event) => event.date >= new Date());
  const pastEvents = events.filter((event) => event.date < new Date());
  const sortedFutureEvents = useMemo(() => sortEvents(futureEvents, futureSortOrder), [futureEvents, futureSortOrder]);
  const sortedPastEvents = useMemo(() => sortEvents(pastEvents, pastSortOrder), [pastEvents, pastSortOrder]);
  const currentSortOrder = activeTab === "future" ? futureSortOrder : pastSortOrder;
  const isSortingDisabled =
    (activeTab === "future" && futureEvents.length === 0) || (activeTab === "past" && pastEvents.length === 0);

  const eventsToDisplay = useMemo(() => {
    return [
      { tab: "future", label: "à venir", events: sortedFutureEvents },
      { tab: "past", label: "passés", events: sortedPastEvents },
    ];
  }, [sortedFutureEvents, sortedPastEvents]);

  const handleToggleSort = () => {
    if (activeTab === "future") {
      setFutureSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else if (activeTab === "past") {
      setPastSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as "future" | "past")}
      className="h-full w-full space-y-4"
    >
      <header className="flex flex-wrap gap-3 lg:grid lg:grid-cols-4 lg:gap-0">
        <AddEvent
          setEvents={setEvents}
          className="order-1 flex-1 lg:order-none lg:col-span-1 lg:mr-auto lg:h-full lg:flex-none"
        />

        <TabsList className="order-3 mx-auto w-full bg-black/90 lg:order-none lg:col-span-2 lg:h-full lg:w-auto">
          {eventsToDisplay.map(({ tab, label, events }) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                "flex-1 cursor-pointer px-2 text-sm text-white lg:flex-none lg:px-4 lg:text-lg",
                "data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-black",
              )}
            >
              {isMobile ? label : `Événements ${label}`} ({events.length})
            </TabsTrigger>
          ))}
        </TabsList>

        <SortToggle
          onToggle={handleToggleSort}
          sortOrder={currentSortOrder}
          disabled={isSortingDisabled}
          activeTab={activeTab}
          className="order-2 flex-1 lg:order-none lg:col-span-1 lg:ml-auto lg:h-full lg:flex-none"
        />
      </header>

      <section className="scrollbar-none mask-t-from-97% mask-b-from-97% mx-auto overflow-auto">
        {eventsToDisplay.map(({ tab, events }) => (
          <TabsContent
            key={tab}
            value={tab}
            className="space-y-5 py-4"
          >
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                setEvents={setEvents}
              />
            ))}
          </TabsContent>
        ))}
      </section>
    </Tabs>
  );
};
