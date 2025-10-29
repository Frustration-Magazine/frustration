import type { Metadata } from "next";
import { headers } from "next/headers";
import { Bebas_Neue, Inter, Poppins } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { Header } from "./_components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TanstackProvider } from "./_components/TanstackProvider";
import { Sidenav } from "./_components/Sidenav";

import "./globals.css";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const poppins = Poppins({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Frustration — Dashboard",
  description: "Tableau de bord pour Frustration",
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isSignedIn = !!session;

  return (
    <html
      lang="fr"
      className={`${inter.variable} ${bebasNeue.variable} ${poppins.variable} scrollbar-thumb-yellow scrollbar-track-black`}
    >
      <body
        className={cn(
          "font-inter flex h-screen flex-col antialiased",
          "bg-yellow bg-[url('/static/background.svg')] bg-cover bg-fixed",
        )}
      >
        <TanstackProvider>
          <SidebarProvider defaultOpen={isSignedIn}>
            {isSignedIn && <Sidenav />}
            <div className="flex flex-1 flex-col">
              <Header isSignedIn={isSignedIn} />
              <main className="flex grow overflow-auto">
                {isSignedIn ? (
                  <div className="flex h-full grow flex-col items-center gap-3 overflow-auto p-8">{children}</div>
                ) : (
                  children
                )}
              </main>
            </div>
            <Toaster />
          </SidebarProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
