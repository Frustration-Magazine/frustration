import { cn } from "@/lib/utils";
import { BookIcon, HelpCircle, Newspaper, User, type LucideIcon } from "lucide-react";
import type { PaperItemType } from "@prisma/client";
import type { PaperItemWithRelations } from "../index.astro";

const paperItemTypes: Record<PaperItemType, { label: string; Icon: LucideIcon; color: string }> = {
  magazine: {
    label: "Magazine",
    Icon: Newspaper,
    color: "bg-pale-yellow text-black",
  },
  book: {
    label: "Livre",
    Icon: BookIcon,
    color: "bg-pale-purple text-white",
  },
  other: {
    label: "Autre",
    Icon: HelpCircle,
    color: "bg-gray-200 text-gray-600",
  },
};

export const PaperItemCard = ({ item }: { item: PaperItemWithRelations }) => {
  const PaperItemTypeIcon = paperItemTypes[item.type].Icon;

  return (
    <a
      href={item.link ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group mx-auto block w-64 overflow-hidden rounded-xl border bg-white shadow-sm sm:w-72 md:w-full",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
      )}
    >
      {/* Top part */}
      <div className="relative overflow-hidden">
        {item.image?.url ? (
          <img
            title={item.title}
            src={item.image.url}
            alt={item.title}
            className="h-72 w-full object-cover object-top transition-transform duration-300 group-hover:scale-105 sm:h-80 md:h-72"
          />
        ) : (
          <div className="h-72 bg-gray-200 sm:h-80 md:h-72" />
        )}

        {/* Type badge */}
        <div
          className={cn(
            "absolute left-2 top-2 flex items-center rounded-full px-2 py-1 text-xs font-medium",
            paperItemTypes[item.type].color,
          )}
        >
          <PaperItemTypeIcon
            size={12}
            className="mr-1"
          />
          <span>{paperItemTypes[item.type].label}</span>
        </div>

        {/* Author badge */}
        <div className="bg-primary absolute bottom-2 right-2 flex items-center rounded-full px-2 py-1 text-xs font-medium text-black">
          <User
            size={12}
            className="mr-1"
          />
          <span>{item.author?.name}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 p-4">
        <h3 className="group-hover:text-logo-yellow line-clamp-2 text-lg font-bold transition-colors">{item.title}</h3>
        {item.description ? <p className="line-clamp-3 text-sm text-gray-600">{item.description}</p> : null}
      </div>
    </a>
  );
};
