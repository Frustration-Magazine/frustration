"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";
import { Calendar, CreditCard, Image, LibraryBig, Pen, Users, Video } from "lucide-react";
import { SignOut } from "./SignOut";

type Link = {
  title: string;
  url: string;
  icon: React.ElementType;
};

const items: Link[] = [
  {
    title: "Revenus",
    url: "/income",
    icon: CreditCard,
  },
  {
    title: "Abonnés",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Événements",
    url: "/events",
    icon: Calendar,
  },
  {
    title: "Sorties papier",
    url: "/paper-items",
    icon: LibraryBig,
  },
  {
    title: "Auteurs",
    url: "/authors",
    icon: Pen,
  },
  {
    title: "Images",
    url: "/images",
    icon: Image,
  },
  {
    title: "Vidéos",
    url: "/videos",
    icon: Video,
  },
];

export const Sidenav = () => {
  const currentPath = usePathname();

  return (
    <Sidebar className="bg-black py-4 group-data-[side=left]:border-r-black group-data-[side=right]:border-l-black">
      <SidebarContent className="flex flex-col justify-between bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="text-yellow font-bebas mx-auto mb-8 text-2xl">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "font-poppins text-yellow gap-4 whitespace-nowrap p-6 text-lg",
                        item.url === currentPath && "bg-yellow-hover",
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SignOut className="mx-auto" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
