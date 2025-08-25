import { useState, useRef, useEffect } from "react";

import { Search } from "lucide-react";
import { IoCloseSharp } from "react-icons/io5";

import { cn } from "@/lib/utils";

function SearchOverlay() {
  const [search, setSearch] = useState("");
  const [opened, setOpened] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const redirectPageResults = () => {
    window.location.href = `/posts?term=${encodeURIComponent(search)}`;
    setSearch("");
  };

  // Focus l'input quand l'overlay s'ouvre
  useEffect(() => {
    if (opened && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [opened]);

  const OpenButton = () => (
    <button
      type="button"
      title="Recherche"
      className={cn("w-4 cursor-pointer", "md:w-5", "xl:w-6")}
      onClick={() => setOpened(true)}
      aria-label="Rechercher sur le site de Frustration Magazine"
    >
      <Search size="100%" />
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
      aria-label="Fermer la barre de recherche"
    >
      <IoCloseSharp size="clamp(40px, 5vw, 72px)" />
    </button>
  );

  return (
    <>
      <OpenButton />
      <div
        className={cn(
          "absolute left-0 top-0 h-0 w-screen overflow-hidden bg-black transition-all duration-1000",
          opened && "h-screen",
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
              "border-primary w-[600px] max-w-[90vw] border-4 border-dashed bg-black px-4 py-2 font-bold",
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
}

export default SearchOverlay;
