import { useState } from "react";

import { Menu, X } from "lucide-react";

// import MailButton from "./MailButton";
// import AgendaButton from "./AgendaButton";

import { cn } from "@/lib/utils";
import { useModal } from "@/layout/BaseLayout/Header/hooks/useModal";

const CATEGORIES_TO_FILTER_OUT: string[] = [];

const Links = ({
  portalUrl,
  categories,
  className,
}: {
  portalUrl: string;
  categories: { slug: string; name: string }[];
  className: string;
}) => {
  const links: ({ label: string } & (
    | { href: string; blank?: boolean; content?: never }
    | { content: React.ReactNode; href?: never; blank?: never }
  ))[] = [
    {
      label: "🏠 Accueil",
      href: "/",
    },
    {
      label: "💳 S'abonner",
      href: "/abonnements",
    },
    {
      label: "📅 Événements",
      href: "/evenements",
    },
    {
      label: "📚 Sorties papier",
      href: "/sorties-papier",
    },
    {
      label: "📰 Articles",
      href: "/posts",
    },
    {
      label: "🎯 Catégories",
      content: (
        <details>
          <summary className="cursor-pointer list-none">🎯 Catégories</summary>
          <ul className="mt-2 flex list-disc flex-col pl-8">
            {categories.map((category: any) => (
              <li key={category.slug}>
                <a
                  className="text-[.8em]"
                  href={`/posts?category=${category.slug}`}
                >
                  {"\u00A0"}
                  {category.name.length > 24 ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: category.name
                          .replace(/(.{1,24})(\s+|$)/g, "$1<br />\u00A0")
                          .replace(/<br \/>\u00A0$/, ""),
                      }}
                    />
                  ) : (
                    category.name
                  )}
                </a>
              </li>
            ))}
          </ul>
        </details>
      ),
    },
    {
      label: "💬 Contact",
      href: "/contact",
    },
    {
      label: "🔒 Portail abonnés",
      href: portalUrl,
      blank: true,
    },
    {
      label: "👥 Qui sommes-nous ?",
      href: "/auteurs",
    },
  ];

  return (
    <>
      {links.map((link) => (
        <li
          key={link.label}
          className={className}
        >
          {link.content ? (
            link.content
          ) : (
            <a
              href={link.href}
              {...(link.blank && { target: "_blank" })}
            >
              {link.label}
            </a>
          )}
        </li>
      ))}
    </>
  );
};

type MenuOverlayProps = {
  readonly categories: any[];
  readonly portalUrl: string;
};

export const MenuOverlay = ({ categories, portalUrl }: MenuOverlayProps) => {
  const [opened, setOpened] = useState(false);

  const { handleBackdropClick } = useModal(opened, () => setOpened(false));

  const standaloneCategories = categories.filter(
    (category) => !category.parent && category.children.nodes.length === 0,
  );

  const sortedStandaloneCategories = standaloneCategories
    .filter((category) => !CATEGORIES_TO_FILTER_OUT.includes(category.slug))
    .sort((a, b) => b.count - a.count);

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
      className={cn("absolute right-4 top-2 cursor-pointer")}
      onClick={() => setOpened(false)}
      aria-label="Fermer le menu"
    >
      <X size="clamp(40px, 4vw, 64px)" />
    </button>
  );

  return (
    <>
      <OpenButton />
      <div
        className={cn(
          "absolute left-0 top-0 z-30 grid h-screen w-screen overflow-hidden",
          "duration-400 transition-all",
          "bg-black/80 backdrop-blur-lg",
          "invisible opacity-0",
          opened && "visible opacity-100",
        )}
      >
        <CloseButton />
        <ul
          className="font-bakbak scrollbar h-full w-full overflow-y-scroll py-[16dvh] uppercase"
          onClick={handleBackdropClick}
        >
          <div className={cn("mx-auto flex w-fit flex-col gap-2 text-xl", "sm:gap-3 sm:text-2xl", "md:text-3xl")}>
            <Links
              className={cn("mr-auto")}
              portalUrl={portalUrl}
              categories={sortedStandaloneCategories}
            />
          </div>
        </ul>

        {/* <div className={cn("fixed bottom-5 right-5 hidden gap-4", opened && "flex")}>
          <AgendaButton className={cn(opened && "opacity-100")} />
          <MailButton className={cn(opened && "opacity-100")} />
        </div> */}
      </div>
    </>
  );
};
