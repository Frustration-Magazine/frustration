"use client";

import { useMemo, useState } from "react";

import { BookIcon, HelpCircle, List, Newspaper } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { type BadgeProps } from "@/components/ui/badge";
import { PaperItemCard } from "./PaperItemCard";
import { AddPaperItem } from "./AddPaperItem";

import { cn } from "@/lib/utils";
import { type PaperItemType } from "@prisma/client";
import { type PaperItemWithRelations } from "../page";

export const paperItemTypes: Record<
  PaperItemType,
  { label: string; plural: string; Icon: React.ElementType; badgeVariant: BadgeProps["variant"] }
> = {
  book: { label: "Livre", plural: "Livres", Icon: BookIcon, badgeVariant: "secondary" },
  magazine: { label: "Magazine", plural: "Magazines", Icon: Newspaper, badgeVariant: "default" },
  other: { label: "Autre", plural: "Autres", Icon: HelpCircle, badgeVariant: "outline" },
};

export const PaperItemsPage = ({ paperItems: initialPaperItems }: { paperItems: PaperItemWithRelations[] }) => {
  const [paperItems, setPaperItems] = useState<PaperItemWithRelations[]>(initialPaperItems);

  const paperItemsToDisplay = useMemo(() => {
    return [
      { tab: "all", label: "Tous", Icon: List, items: paperItems },
      ...Object.entries(paperItemTypes).map(([type, { plural, Icon }]) => ({
        tab: type,
        label: plural,
        Icon,
        items: paperItems.filter((paperItem) => paperItem.type === type),
      })),
    ];
  }, [paperItems]);

  return (
    <Tabs
      defaultValue="all"
      className="h-full w-full space-y-4"
    >
      <header className="flex flex-wrap gap-3 lg:grid lg:grid-cols-4 lg:gap-0">
        <AddPaperItem
          setPaperItems={setPaperItems}
          className="order-1 flex-1 lg:order-none lg:col-span-1 lg:mr-auto lg:h-full lg:flex-none"
        />

        <TabsList className="order-3 mx-auto w-full bg-black/90 lg:order-none lg:col-span-2 lg:h-full lg:w-auto">
          {paperItemsToDisplay.map(({ tab, label, Icon, items }) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className={cn(
                "flex-1 cursor-pointer px-2 text-sm text-white lg:flex-none lg:px-4 lg:text-lg",
                "data-[state=active]:bg-white data-[state=active]:font-bold data-[state=active]:text-black",
              )}
            >
              <Icon className="size-4" />
              {label} ({items.length})
            </TabsTrigger>
          ))}
        </TabsList>
      </header>

      <section className="scrollbar-none mask-t-from-97% mask-b-from-97% mx-auto overflow-auto py-5">
        {paperItemsToDisplay.map(({ tab, items }) => (
          <TabsContent
            key={tab}
            value={tab}
            className="mx-auto grid w-fit grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
          >
            {items.map((item) => (
              <PaperItemCard
                key={item.id}
                paperItem={item}
                setPaperItems={setPaperItems}
              />
            ))}
          </TabsContent>
        ))}
      </section>
    </Tabs>
  );
};
