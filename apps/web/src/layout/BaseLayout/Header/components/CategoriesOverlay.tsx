import React from "react";

import { IoCloseSharp } from "react-icons/io5";
import { Menu } from "lucide-react";

// import MailButton from "./MailButton";
// import AgendaButton from "./AgendaButton";

import { cn } from "@/lib/utils";

const CATEGORIES_TO_FILTER_OUT: string[] = [];

type CategoriesOverlayProps = {
  readonly categories: any[];
  readonly portalUrl: string;
};

export const CategoriesOverlay = ({ categories, portalUrl }: CategoriesOverlayProps) => {
  const [opened, setOpened] = React.useState(false);
  const standaloneCategories = categories.filter(
    (category) => !category.parent && category.children.nodes.length === 0,
  );

  const sortedStandaloneCategories = standaloneCategories.filter(
    (category) => !CATEGORIES_TO_FILTER_OUT.includes(category.slug),
  );

  sortedStandaloneCategories.sort((a, b) => b.count - a.count);

  // const categoriesWithChildren = categories.filter((category) => category.children.nodes.length > 0);

  const OpenButton = () => (
    <button
      type="button"
      title="Menu"
      className={cn("w-4 cursor-pointer", "md:w-5", "xl:w-6")}
      onClick={() => setOpened(true)}
      aria-label="Menu"
    >
      <Menu size="100%" />
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
            "scrollbar-track-yellow scrollbar-thumb-yellow font-bakbak scrollbar flex h-full flex-col overflow-y-scroll py-[6dvh] text-center uppercase",
            "gap-2 text-xl",
            "sm:gap-3 sm:text-2xl",
            "md:gap-3 md:text-3xl",
          )}
        >
          <li>
            <a href="/">Accueil</a>
          </li>
          <li>
            <a href="/abonnements">S'abonner</a>
          </li>
          <li>
            <a href="/evenements">Évènements</a>
          </li>
          <li>
            <a href="/posts">Articles</a>
          </li>

          <li>
            <details open>
              <summary className="cursor-pointer">Catégories</summary>
              <ul className="mx-auto mt-2 flex flex-col gap-1">
                {sortedStandaloneCategories.map((category: any) => (
                  <a
                    style={{ fontSize: ".8em" }}
                    key={category.slug}
                    href={`/posts?category=${category.slug}`}
                  >
                    {category.name.replace(/^[^-]*-\s/, "")}
                  </a>
                ))}
              </ul>
            </details>
          </li>

          {/* {categoriesWithChildren.map((category) => (
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
          ))} */}

          <li>
            <a href="/contact">Contact</a>
          </li>
          <li>
            <a
              href={portalUrl}
              target="_blank"
            >
              Portail abonnés
            </a>
          </li>
          <li>
            <a href={`/auteurs`}>Qui sommes-nous ?</a>
          </li>
        </ul>

        {/* <div className={cn("fixed bottom-5 right-5 hidden gap-4", opened && "flex")}>
          <AgendaButton className={cn(opened && "opacity-100")} />
          <MailButton className={cn(opened && "opacity-100")} />
        </div> */}
      </div>
    </>
  );
};
