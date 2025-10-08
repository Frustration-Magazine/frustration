"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, Fragment } from "react";

import { FaCreditCard } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { IoIosPeople } from "react-icons/io";
import { MdEvent as CalendarIcon } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Link {
  label: string;
  icon: ReactNode;
  href: string;
  key: string;
}

const LINKS: Link[] = [
  {
    label: "Revenus",
    icon: <FaCreditCard />,
    href: "/income",
    key: "income",
  },
  {
    label: "Abonnés",
    icon: <IoIosPeople size={18} />,
    href: "/customers",
    key: "customers",
  },
  {
    label: "Événements",
    icon: <CalendarIcon size={18} />,
    href: "/events",
    key: "events",
  },
  {
    label: "Vidéos",
    icon: <FaYoutube />,
    href: "/videos",
    key: "videos",
  },
];

const SignOut = () => {
  const router = useRouter();
  const goToSignOut = () => router.push("/auth/signout");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="secondary"
          className="flex items-center gap-2"
        >
          <RiLogoutBoxLine />
          <span>Se déconnecter</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Voulez-vous vraiment vous déconnecter ?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={goToSignOut}>Se déconnecter</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Sidenav = () => {
  const currentPath = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col items-center justify-between bg-black pb-4">
      <ul className="text-yellow w-full space-y-2 px-3">
        {LINKS.map(({ label, icon, href, key }) => {
          return (
            <Fragment key={key}>
              <li>
                <Link
                  href={href}
                  className={cn(
                    "font-poppins flex items-center gap-4 whitespace-nowrap rounded-md px-5 py-2 text-lg transition duration-500",
                    href === currentPath && "bg-yellow-hover",
                  )}
                >
                  {icon} {label}
                </Link>
              </li>
              <Separator className="bg-yellow-hover" />
            </Fragment>
          );
        })}
      </ul>
      <SignOut />
    </aside>
  );
};

export default Sidenav;
