import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PaperItemWithRelations } from "../index.astro";
import { PaperItemCard } from "./PaperItemCard.tsx";
import { cn } from "@/lib/utils";
import { ListIcon, BookIcon, NewspaperIcon } from "lucide-react";

export const PaperItemTabs = ({ paperItems }: { paperItems: PaperItemWithRelations[] }) => {
  const paperItemsToDisplay = [
    {
      value: "all",
      label: "Tous",
      Icon: ListIcon,
      paperItems: paperItems,
    },
    {
      value: "future",
      label: "Livres",
      Icon: BookIcon,
      paperItems: paperItems.filter((item) => item.type === "book"),
    },
    {
      value: "past",
      label: "Magazines",
      Icon: NewspaperIcon,
      paperItems: paperItems.filter((item) => item.type === "magazine"),
    },
  ] as const;

  return (
    <section>
      <Tabs
        defaultValue="all"
        className="gap-6"
      >
        <TabsList className={cn("mx-auto h-fit flex-wrap bg-slate-100")}>
          {paperItemsToDisplay.map(({ value, label, Icon, paperItems }) => (
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
              <Icon className="size-4" />
              {label} ({paperItems.length})
            </TabsTrigger>
          ))}
        </TabsList>

        {paperItemsToDisplay.map(({ value, paperItems }) => {
          return (
            <TabsContent
              key={value}
              value={value}
            >
              <div className="relative space-y-8 md:space-y-16">
                {paperItems.length ? (
                  <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
                    {paperItems.map((item) => (
                      <PaperItemCard
                        key={item.title}
                        item={item}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-lg text-gray-600">Aucun article disponible pour le moment.</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Revenez bientôt pour découvrir nos nouvelles publications !
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
};
