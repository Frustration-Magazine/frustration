import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import React from "react";

const DevelopmentBadge =
  process.env.NODE_ENV === "development" ? (
    <Badge variant="secondary" className="absolute top-3 right-3 text-lg font-bold">
      🚧 Dev mode 🚧
    </Badge>
  ) : null;

function Header() {
  return (
    <header className="flex h-fit w-full items-center justify-center bg-black py-2">
      <Link href="/">
        <h1 className="font-bebas text-yellow text-7xl uppercase">Dashboard</h1>
      </Link>
      {DevelopmentBadge}
    </header>
  );
}

export default Header;
