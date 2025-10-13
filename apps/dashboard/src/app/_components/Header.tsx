import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DevelopmentBadge =
  process.env.NODE_ENV === "development" ? (
    <Badge
      variant="secondary"
      className="absolute right-4 my-auto text-lg font-bold"
    >
      🚧 Dev mode 🚧
    </Badge>
  ) : null;

export const Header = () => {
  return (
    <header className="relative flex h-fit w-full items-center justify-center bg-black py-2">
      <SidebarTrigger className="bg-secondary absolute left-4" />
      <Link href="/">
        <h1 className="font-bebas text-yellow -mb-1.5 text-6xl uppercase">Dashboard</h1>
      </Link>
      {DevelopmentBadge}
    </header>
  );
};
