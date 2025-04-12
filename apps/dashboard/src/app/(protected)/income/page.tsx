import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getPayments } from "./_actions";
import { filterByTypes } from "./_utils";
import { redirect } from "next/navigation";
import { signedIn } from "@/auth";
import { cn } from "@/lib/utils";
import { ChartPanel } from "./components/ChartPanel";

export const dynamic = "force-dynamic";

const PaymentsType = ({ value, children }: { value: string; children: string }) => (
  <TabsTrigger
    className={cn(
      "cursor-pointer px-2 text-lg text-white",
      "data-[state=active]:bg-gray-200 data-[state=active]:font-bold data-[state=active]:text-black",
    )}
    value={value}
  >
    {children}
  </TabsTrigger>
);

const Tab = ({ value, children }: { value: string; children: string }) => (
  <TabsTrigger
    className="font-bebas text-yellow bg-black py-2 text-4xl leading-tight font-bold uppercase data-[state=inactive]:opacity-30"
    value={value}
  >
    {children}
  </TabsTrigger>
);

async function Page() {
  const isSignedIn = await signedIn();
  if (!isSignedIn) redirect("/auth/signin");

  const payments = await getPayments();
  const donationsAndSubscriptions = filterByTypes(payments, ["subscription", "donation"]);
  const donations = filterByTypes(payments, ["donation"]);
  const subscriptions = filterByTypes(payments, ["subscription"]);

  return (
    <Tabs defaultValue="all" className="flex h-full w-full flex-col">
      <TabsList className="mx-auto mb-6 grid h-auto w-[600px] grid-cols-3 bg-black/90">
        <PaymentsType value="all">Tout</PaymentsType>
        <PaymentsType value="subscriptions">Abonnements</PaymentsType>
        <PaymentsType value="donations">Dons</PaymentsType>
      </TabsList>
      <TabsContent className="grow overflow-auto" value="all">
        <ChartPanel payments={donationsAndSubscriptions} />
      </TabsContent>
      <TabsContent className="grow overflow-auto" value="subscriptions">
        <ChartPanel payments={subscriptions} />
      </TabsContent>
      <TabsContent className="grow overflow-auto" value="donations">
        <ChartPanel payments={donations} />
      </TabsContent>
    </Tabs>
  );
}

export default Page;
