import MailButton from "./MailButton";
import AgendaButton from "./AgendaButton";
import React from "react";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoCloseSharp } from "react-icons/io5";

import { cn } from "@/lib/utils";

const CATEGORIES_TO_FILTER_OUT = ["chronique-de-nos-coeurs-mouvementes", "socialcast"];

type Props = {
  readonly categories: any[];
  readonly portalUrl: string;
};

function CategoriesOverlay({ categories, portalUrl }: Props) {
  const [opened, setOpened] = React.useState(false);
  const standaloneCategories = categories.filter(
    (category) => !category.parent && category.children.nodes.length === 0,
  );

  const sortedStandaloneCategories = standaloneCategories.filter(
    (category) => !CATEGORIES_TO_FILTER_OUT.includes(category.slug),
  );

  sortedStandaloneCategories.sort((a, b) => b.count - a.count);

  const categoriesWithChildren = categories.filter((category) => category.children.nodes.length > 0);

  const OpenButton = () => (
    <button
      type="button"
      title="Menu"
      className={cn("w-4 cursor-pointer", "md:w-5", "xl:w-6")}
      onClick={() => setOpened(true)}
      aria-label="Menu"
    >
      <HiOutlineMenuAlt3 size="100%" />
    </button>
  );

  const CloseButton = () => (
    <button
      type="button"
      title="Fermer"
      className={cn(
        "absolute right-5 top-5 cursor-pointer opacity-0 transition-opacity duration-1000",
        opened && "opacity-100",
      )}
      onClick={() => setOpened(false)}
      aria-label="Fermer"
    >
      <IoCloseSharp size="clamp(40px, 4vw, 64px)" />
    </button>
  );

  return (
    <>
      <OpenButton />
      <div
        className={cn(
          "absolute left-0 top-0 grid h-0 w-screen items-center overflow-hidden bg-black transition-all duration-1000",
          opened && "h-screen",
        )}
      >
        <CloseButton />
        <ul
          className={cn(
            "scrollbar-track-yellow scrollbar-thumb-yellow font-bakbak scrollbar flex h-full flex-col overflow-y-scroll py-[10dvh] text-center uppercase",
            "gap-2 text-xl",
            "sm:gap-3 sm:text-2xl",
            "md:gap-3 md:text-3xl",
          )}
        >
          {categoriesWithChildren.map((category) => (
            <details key={category.slug}>
              <summary className="mb-2 cursor-pointer">{category.name}</summary>
              <ul className="mx-auto flex flex-col gap-1">
                {category.children.nodes.map((categoryChildren: any) => (
                  <a
                    style={{ fontSize: ".8em" }}
                    key={categoryChildren.slug}
                    href={`/posts?category=${categoryChildren.slug}`}
                  >
                    {categoryChildren.name.replace(/^[^-]*-\s/, "")}
                  </a>
                ))}
              </ul>
            </details>
          ))}
          {sortedStandaloneCategories.map((category) => (
            <a
              className="mb-1"
              href={`/posts?category=${category.slug}`}
              key={category.slug}
            >
              {category.name}
            </a>
          ))}
          <a href="/evenements">Évènements</a>
          <a href="/contact">Contact</a>
          <a href={portalUrl}>Portail abonnés</a>
          <a
            className="mb-1"
            href={`/auteurs`}
          >
            Qui sommes-nous ?
          </a>
        </ul>
        <div className={cn("fixed bottom-5 right-5 hidden gap-4", opened && "flex")}>
          <AgendaButton className={cn(opened && "opacity-100")} />
          <MailButton className={cn(opened && "opacity-100")} />
        </div>
      </div>
    </>
  );
}

export default CategoriesOverlay;
