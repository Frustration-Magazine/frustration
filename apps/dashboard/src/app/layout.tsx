import type { Metadata } from "next";
import Sidenav from "./_components/Sidenav";
import Header from "./_components/Header";
import { Toaster } from "@/components/Toaster";

import { signedIn } from "@/auth";

import { cn } from "@/libs/utils";
import { Bebas_Neue, Poppins, Inter } from "next/font/google";
import "./globals.css";

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

// 💽 Data
export const metadata: Metadata = {
  title: "Frustration — Dashboard",
  description: "Tableau de bord pour Frustration",
};

const Main = ({ children }: { children: React.ReactNode }) => (
  <main className="flex flex-grow overflow-auto">{children}</main>
);

/* ======================= */
/*         🚀 UI           */
/* ======================= */

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: Props) {
  const isSignedIn = await signedIn();

  return (
    <html lang="fr" className={`${inter.variable} ${bebasNeue.variable} ${poppins.variable}`}>
      <body
        className={cn(
          "flex h-screen flex-col font-inter antialiased",
          "bg-yellow bg-[url('/static/background.svg')] bg-cover bg-fixed",
        )}
      >
        <Header />
        <Main>
          {isSignedIn ? (
            <>
              <Sidenav />
              <div className="flex h-full grow flex-col items-center gap-3 overflow-auto p-8">{children}</div>
            </>
          ) : (
            children
          )}
        </Main>
        <Toaster />
      </body>
    </html>
  );
}
