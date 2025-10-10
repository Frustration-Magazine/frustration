"use client";

import React, { useState, useMemo } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardEvent } from "./CardEvent";
import { SortToggle } from "./SortToggle";
import { AddEvent } from "./AddEvent";

import { type events as Event } from "@prisma/client";
import { cn } from "@/lib/utils";

const now = new Date();
now.setHours(19, 0, 0, 0);

type SortOrder = "asc" | "desc";

export const EventsPage = ({ events: initialEvents }: { events: Event[] }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [futureSortOrder, setFutureSortOrder] = useState<SortOrder>("asc");
  const [pastSortOrder, setPastSortOrder] = useState<SortOrder>("desc");
  const [activeTab, setActiveTab] = useState<"future" | "past">("future");

  const sortEvents = (eventsList: Event[], sortOrder: SortOrder) => {
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
      <header className="grid grid-cols-4">
        <AddEvent
          setEvents={setEvents}
          className="col-span-1 mr-auto h-full"
        />

        <TabsList className="col-span-2 mx-auto h-full bg-black/90">
          <TabsTrigger
            value="future"
            className={cn(
              "cursor-pointer px-4 text-lg text-white",
              "data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-black",
            )}
          >
            Événements à venir ({futureEvents.length})
          </TabsTrigger>
          <TabsTrigger
            value="past"
            className={cn(
              "cursor-pointer px-4 text-lg text-white",
              "data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-black",
            )}
          >
            Événements passés ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <SortToggle
          onToggle={handleToggleSort}
          sortOrder={currentSortOrder}
          disabled={isSortingDisabled}
          activeTab={activeTab}
          className="col-span-1 ml-auto h-full"
        />
      </header>

      <section className="scrollbar-none mask-t-from-97% mask-b-from-97% mx-auto overflow-auto">
        <TabsContent
          value="future"
          className="space-y-5 py-4"
        >
          {sortedFutureEvents.map((event) => (
            <CardEvent
              key={event.id}
              event={event}
              setEvents={setEvents}
            />
          ))}
        </TabsContent>
        <TabsContent
          value="past"
          className="space-y-5 py-4"
        >
          {sortedPastEvents.map((event) => (
            <CardEvent
              key={event.id}
              event={event}
              setEvents={setEvents}
            />
          ))}
        </TabsContent>
      </section>
    </Tabs>
  );
};
