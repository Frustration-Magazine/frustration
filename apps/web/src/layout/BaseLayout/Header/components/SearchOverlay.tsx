import { useState, useRef, useEffect } from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useModal } from "@/layout/BaseLayout/Header/hooks/useModal";

export const SearchOverlay = () => {
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { handleBackdropClick } = useModal(opened, () => setOpened(false));

  // Focus l'input quand l'overlay s'ouvre
  useEffect(() => {
    if (opened && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 100);
    }
  }, [opened]);

  const redirectPageResults = () => {
    window.location.href = `/posts?term=${encodeURIComponent(search)}`;
    setSearch("");
  };

  const OpenButton = () => (
    <button
      type="button"
      title="Recherche"
      className={cn("w-4 cursor-pointer", "md:w-5", "xl:w-6")}
      onClick={() => setOpened(true)}
      aria-label="Rechercher un article"
    >
      <Search size="100%" />
    </button>
  );

  const CloseButton = () => (
    <button
      type="button"
      title="Fermer"
      className={cn("absolute right-4 top-2 cursor-pointer")}
      onClick={() => setOpened(false)}
      aria-label="Fermer la barre de recherche"
    >
      <X size="clamp(40px, 4vw, 64px)" />
    </button>
  );

  return (
    <>
      <OpenButton />
      <div
        onClick={handleBackdropClick}
        className={cn(
          "absolute left-0 top-0 h-screen w-screen overflow-hidden",
          "duration-400 transition-all",
          "bg-black/80 backdrop-blur-xl",
          "invisible opacity-0",
          opened && "visible opacity-100",
        )}
      >
        <CloseButton />
        <form
          action={redirectPageResults}
          className={cn(
            "absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-8 opacity-0 transition-opacity duration-1000",
            opened && "opacity-100",
          )}
        >
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "border-primary border-3 w-[600px] max-w-[90vw] rounded-2xl border-double bg-black/50 px-4 py-2 font-bold focus:outline-none",
              "text-xl",
              "md:text-2xl",
              "xl:text-3xl",
            )}
            aria-label="Rechercher"
          />
          <button
            className={cn(
              "bg-primary font-bakbak cursor-pointer rounded-full text-black transition-opacity duration-300 disabled:cursor-default disabled:opacity-20",
              "px-4 py-1.5 text-xl",
              "md:px-6 md:py-2 md:text-2xl",
              "xl:px-6 xl:py-2 xl:text-3xl",
            )}
            type="submit"
            disabled={!search}
          >
            Rechercher
          </button>
        </form>
      </div>
    </>
  );
};
