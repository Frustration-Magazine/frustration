import React from "react";
import { Badge } from "@/components/Badge";
import Link from "next/link";

const DevelopmentBadge =
  process.env.NODE_ENV === "development" ? (
    <Badge variant="secondary" className="absolute right-3 top-3 text-lg font-bold">
      🚧 Dev mode 🚧
    </Badge>
  ) : null;

function Header() {
  return (
    <header className="flex h-fit w-full items-center justify-center bg-black py-2">
      <Link href="/">
        <h1 className="font-bebas text-7xl uppercase text-yellow">Dashboard</h1>
      </Link>
      {DevelopmentBadge}
    </header>
  );
}

export default Header;
